const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');
const tableData = [
  [
    {data: 'From', header: true},
    {data: 'To', header: true}
  ]
]

function linkify(path,url) {
  let link = ""

  /**
   * We only want to append the URL if the path doesnt already start with https
   */
  if (!path.startsWith('https:')) {
    if(url.endsWith('/')) {
      url = url.slice(0,-1);
    }

    link = url+path;

  } else {
    link = path;
  }

  return `<a href="${link}">${path}</a>`
}

/**
 * @todo should we verify that the URL is valid before we set it?
 * @type {string}
 */
axios.defaults.baseURL = core.getInput('environment-url')
//axios.defaults.baseURL = 'https://httpstat.us/random/200,500-504,500-504,500-504'
const retries = Number(core.getInput('number_retries'))
const retrySleep = Number(core.getInput('retry_sleep'))
//const retries = Number('100')
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const retryTargetResponse = async (url='/',count=0) => {
  try {
    const axiosResponse = await axios.head(url);
    return axiosResponse;
  } catch (error) {
    if(error || error.status != 200) {
      core.debug(`At attempt ${count}, target url ${url} responded with status ${error.status}, retrying...`)
      if (count++ < retries) {
        await sleep(retrySleep)
        return retryTargetResponse(url,count)
      } else {
        core.warning(`Max number of retries ${retries} for end point ${url} reached. Aborting.`)
        throw new Error(error)
      }
    } else {
      core.warning(`Action failed with error ${error}`)
      throw new Error(error)
    }
  }
}

// const verifyTargetResponse = async(count = 0) => {
//   try {
//     const axiosResponse = await axios.get('/');
//     core.notice('Target URL finally responded with a 200. Proceeding.')
//     return axiosResponse;
//   } catch (error) {
//     if (error || error.status != 200) {
//       core.info(`At attempt ${count}, target url responded with status ${error.status}, retrying...`)
//       if (count++ < retries) {
//         await sleep(1000);
//         return verifyTargetResponse(count);
//       } else {
//         core.setFailed(`Max number of retries (${retries}) reached. Aborting.`)
//       };
//     } else {
//       core.setFailed(`Action failed with error ${error}`)
//     };
//   };
// };

const verify = async () => {
  // let targetReady = await verifyTargetResponse();
  let targetReady = await retryTargetResponse('/');
  core.info('Target URL ready. Beginning verification.')
  try {
    /**
     * @todo Can we get the full workspace path to this file?
     * @type {*}
     */
    const yamlData = yaml.load(fs.readFileSync('./.platform/routes.yaml', 'utf8'));
    /**
     * @todo the key (docs.upsun.com) here should be a variable that is set somewhere else
     * @type {Record<string, string[]> | _.LodashAt | ((request: string) => (string[] | null)) | string[]}
     */
    const anchors = yamlData['https://docs.upsun.com/'].redirects.paths

    const RedirectKeys = Object.keys(anchors).filter((path)=>{
      /**
       * @todo the piece we're using to identify our contracts (/anchors/) should be a variable
       */
      return path.startsWith('/anchors/')
    })

    const validateRedirects = RedirectKeys.map(async (path, index, array) => {
      core.debug(`I'm going to test ${path} to see if it goes to ${anchors[path].to}`)

      try {
        const response = await retryTargetResponse(path);
        //const response = await axios.head(path);
        core.debug(`Response for our check of ${path} is ${response.status}`)
        return response
      } catch (reqerr) {
        // core.debug(`issue encountered with path ${path}!!! Returned status is ${reqerr.status}. More info: `)
        core.debug(`issue encountered with path ${path}!!! Returned status is ${reqerr.status}. More info: `)
        core.debug(JSON.stringify(reqerr))
        if(axios.isAxiosError(reqerr)) {
          // core.debug(reqerr.toJSON())
          core.debug('Axios error.')
        } else {
          console.log(reqerr)
          core.debug('Non-Axios error? ')
        }

        let row = [{data: linkify(path, axios.defaults.baseURL)},{data: linkify( anchors[path].to, axios.defaults.baseURL) }]
        tableData.push(row)
      }
    });


    Promise.all(validateRedirects).then(() => {
      if(tableData.length > 1) {
        core.error('There was an error with one or more redirects.')
        core.summary.addTable(tableData)
        core.summary.write()
        core.setFailed('There was an error with one or more contracted redirects.')
      } else  {
        core.notice('All contracted redirections are valid.')
      }
    });

  } catch (error) {
    core.setFailed(`Action failed with error ${error}`)
  }
}

verify();
