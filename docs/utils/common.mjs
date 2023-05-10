import { Octokit } from "octokit";

const ocktokit = new Octokit ({
  auth: process.env.GITHUB_API_TOKEN
})

const ghHeaders = {
  'X-GitHub-Api-Version': '2022-11-28'
}

const githubOrgName = "platformsh"
const templateBuildRepoName = "template-builder"
const pathToTemplatesInTB = "templates"

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

// Decodes our base64 encoded contents into utf-8 string
// @todo we should probably wrap the attempt to decode in a try catch as well
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
