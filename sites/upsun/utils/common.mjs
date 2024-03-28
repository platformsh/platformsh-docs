import { Octokit } from "octokit";
import fs from "fs";
import path from "path";

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

const cacheDir = () => {

  if (process.env.PLATFORM_CACHE_DIR) {
    console.log('PLATFORM_CACHE_DIR is available so I will use it.')
    return process.env.PLATFORM_CACHE_DIR
  }

  console.log('PLATFORM_CACHE_DIR is NOT available so I will need to create a local cache directory.')
  const localFetchedCache = path.join(process.cwd(),localFileCache)
  // we need to set up a local cache location
  if (!fs.existsSync(localFetchedCache)){
    // Create subdirectory if doesn't exist.
    try {
      fs.mkdirSync(localFetchedCache,{recursive:true});
    } catch (error) {
      console.error("Error encountered while trying to create: ", localFetchedCache);
      console.error(error)
    }
  }

  // add a .gitignore
  if(!fs.existsSync(path.join(localFetchedCache,'.gitignore'))) {
    fs.writeFile(path.join(localFetchedCache,'.gitignore'),'/', error => {
      if(error) {
        console.log(error)
      }
    })
  }

  // and a readme
  if(!fs.existsSync(path.join(localFetchedCache,'README.txt'))) {
    let cacheReadMe = `This directory contains a cache of retrieved files needed by Hugo to build the
    https://docs.platform.sh/ website. You can safely delete this directory and contents when you are finished
    with this repository.`
    fs.writeFile(path.join(localFetchedCache,'README.txt'),cacheReadMe, error => {
      if(error) {
        console.log(error)
      }
    })
  }

  return localFetchedCache
}

const continueFetch = () => {
  if (process.env.GITHUB_API_TOKEN) {
    return true
  } else {
    console.log('GITHUB_API_TOKEN is not set. Skipping retrieval of templates and examples.')
    return false
  }
}

export {
  decodeBase64Contents,
  reportOverAPILimit,
  ghHeaders,
  ocktokit,
  githubOrgName,
  templateBuildRepoName,
  pathToTemplatesInTB,
  cacheDir,
  continueFetch,
}
