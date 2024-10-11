const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');
const problems = new Map()

/**
 * @todo should we verify that the URL is valid before we set it?
 * @type {string}
 */
axios.defaults.baseURL = core.getInput('environment-url')

try {
  /**
   * Can we get the full workspace path to this file?
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

  const validateRedirects = new Promise((resolve, reject) => {
    RedirectKeys.forEach(async (path, index, array) => {
      //console.log(`I'm going to test ${path} to see if it goes to ${anchors[path].to}`)
      await axios.head(path)
        .then((response)=>{
          core.info(`Response for our check of ${path} is ${response.status}`)
        })
        .catch((err)=>{
          core.warning(`issue encountered with path ${path}!!! Returned status is ${err.request.status}`)
          problems.set(path,anchors[path].to)
          //console.log(err)
        })
      if (index === array.length -1) resolve();
    });
  });

  validateRedirects.then(() => {
    if(problems.size > 0) {
      /**
       * @todo swap this out with core.summary.addTable()
       */
      core.error('There was an error with one or more redirects.')
      core.startGroup('Redirections that failed')
      core.info(Object.fromEntries((problems)).toString())
      core.endGroup()
      core.setFailed('There was an error with one or more contracted redirects.')
    } else  {
      core.notice('All contracted redirections are valid.')
    }
  });

} catch (error) {
  core.setFailed(`Action failed with error ${error}`)
}


