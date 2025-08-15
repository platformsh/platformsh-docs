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
axios.defaults.baseURL = core.getInput('environment_url')
//axios.defaults.baseURL = 'https://httpstat.us/random/200,500-504,500-504,500-504'
const retries = Number(core.getInput('number_retries'))
const retrySleep = Number(core.getInput('retry_sleep'))
const defaultRoute = core.getInput('base_environment_url')
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
        //throw new Error(error)
        throw error
      }
    } else {
      core.warning(`Action failed with error ${error}`)
      throw new Error(error)
    }
  }
}

const verify = async () => {
  // let targetReady = await verifyTargetResponse();
  let targetReady = await retryTargetResponse('/');
  core.info('Target URL ready. Beginning verification.')
  try {

    //we need the domain from the default PR URL
    const defaultRouteObject = new URL(defaultRoute)
    const defaultRouteDomain = defaultRouteObject.hostname
    const redirectionApiToken = core.getInput('redirection_token')
    const redirectionProjectID = core.getInput('redirection_project_id')
    // @todo move this to an Environment Variable?
    const redirectionApiURL = 'https://api.redirection.io'
    const redirectionInstance = axios.create({
      baseURL: redirectionApiURL,
      timeout: 1000,
      headers: {'Authorization': `Bearer ${redirectionApiToken}`}
    });

    const redirectionrules = async ()=>{
      try {
        let allRules = []
        let searchAfter = null
        let hasMoreResults = true

        while (hasMoreResults) {
          let url = `/rules?projectId=${redirectionProjectID}`
          if (searchAfter) {
            url += `&searchAfterId=${searchAfter}`
          }

          const response = await redirectionInstance.get(url)
          const rules = response.data

          if (rules && rules.length > 0 ) {
            allRules = allRules.concat(rules)
            // get the last rule id for the next page of results
            searchAfter = rules[rules.length - 1].id
          } else {
            // no more results
            hasMoreResults = false
          }
        }
        core.debug(`Total rules retrieved: ${allRules.length} rules`)
        return allRules

      } catch (error) {
        core.setFailed(`Action failed calling redirection Api with error ${error}`)
      }
    }

    const rules = await redirectionrules();
    const anchors = rules.filter((object)=>{
      return object.trigger.source.startsWith('/anchors/')
    })

    const validateRedirects =anchors.map(async (object, index, array) => {
      let path = object.trigger.source
      let location = object.actions.find((element) => element.type == 'redirection').location

      core.debug(`I'm going to test ${path} to see if it goes to ${location}`)

      try {
        const response = await retryTargetResponse(path);
        //const response = await axios.head(path);
        core.debug(`Response for our check of ${path} is ${response.status}`)
        if (location.includes("docs.platform.sh")) {
          const verificationLocation = location.replace('docs.platform.sh',defaultRouteDomain)
          core.debug(`The location ${location} goes to docs.platform.sh so we need to see if the location also exists on the PR environment...` )
          core.debug(`Now checking ${verificationLocation} to make sure it exists in the PR environment...`)

          try {
            const verify = await retryTargetResponse(verificationLocation)
            return verify
          } catch (verifyError) {
            core.debug(`Error when verifying ${verificationLocation} exists on PR environment!`)
            let row = [{data: linkify(path, axios.defaults.baseURL)},{data: linkify( verificationLocation, axios.defaults.baseURL) }]
            tableData.push(row)
          }

        }
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

        let row = [{data: linkify(path, axios.defaults.baseURL)},{data: linkify( location, axios.defaults.baseURL) }]
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
