import { Octokit } from "octokit";

/**
 * Creates an authenticated instance of Octokit for us to communicate with the GH API
 */
const ocktokit = new Octokit ({
  auth: process.env.GITHUB_API_TOKEN
})

/**
 * Common headers that we need to send to the GH API when requesting data
 * @type {{"X-GitHub-Api-Version": string}}
 */
const ghHeaders = {
  'X-GitHub-Api-Version': '2022-11-28'
}

/**
 * GitHub organization name where <templateBuildRepoName> is located
 * @type {string}
*/
const githubOrgName = "platformsh"
/**
 * Name of repository that contains the psh configuration files for all our templates
 * @type {string}
 */
const templateBuildRepoName = "template-builder"
/**
 * location in template-builder where our templates' information is located
 * @type {string}
 */
const pathToTemplatesInTB = "templates"

/**
 * location where we should store our retrieved files when building the site locally
 * @todo see if we can automatically add this directory into .git/info/exclude vs relying on it being included in the
 * root .gitignore
 * @type {string}
 */
const localFileCache = 'fetchedFilesCache'

/**
 * Checks our current rate limit with GH and warns if we have exceeded
 * @returns {Promise<boolean>}
 */
const reportOverAPILimit = async () => {
  const apiLimit = await ocktokit.request('GET /rate_limit', {
    headers: ghHeaders
  })

  let overLimit = (apiLimit.data.rate.remaining < 1)

  if (overLimit) {
    let resetTime = new Date(apiLimit.data.rate.reset).toUTCString()

    console.error(`OVER GitHub Rate Limit! ${apiLimit.data.rate.remaining} / ${apiLimit.data.rate.limit} - Limit will reset at ${resetTime}` )
  }

  return overLimit
}

/**
 * Decodes our base64 encoded contents into utf-8 string
 * @param {string} data - file contents as returned from the GH API. Base64 encoded
 * @returns {string}
 * @todo we should probably wrap the attempt to decode in a try catch as well
 */
const decodeBase64Contents = (data) => {
  let butter = new Buffer.from(data,'base64')
  return butter.toString('utf-8')
}

export {
  decodeBase64Contents,
  reportOverAPILimit,
  ghHeaders,
  ocktokit,
  githubOrgName,
  templateBuildRepoName,
  pathToTemplatesInTB,
}
