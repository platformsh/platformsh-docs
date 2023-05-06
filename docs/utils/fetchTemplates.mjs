import * as fsPromises from 'fs/promises';
import { default as yaml } from 'js-yaml';
import { default as axios } from 'axios'
import pLimit from 'p-limit';
import * as path from "path";
import { existsSync, copyFile, copyFileSync } from 'node:fs';
import { Octokit } from "octokit";


// Limit the number of requests running at once to not run out of memory or anything
const fetchConcurrency = pLimit(10);

const githubOrgName = "platformsh"
const templateBuildRepoName = "template-builder"
const pathToTemplatesInTB = "templates"

const ghHeaders = {
  'X-GitHub-Api-Version': '2022-11-28'
}

// where our cache for the template file is located
const cachedTemplatePath = process.env.PLATFORM_CACHE_DIR
// the name of the cached template file
const cachedTemplateName = "templates.yaml"
// full path + name
const cachedTemplateFileFull = cachedTemplatePath + path.sep + cachedTemplateName
// where the template file should ultimately end up before deployment
const destinationTemplatePath = process.cwd() + path.sep + "data"
// full path + name
const destinationTemplateFull = destinationTemplatePath + path.sep + cachedTemplateName

const ocktokit = new Octokit ({
  auth: process.env.GITHUB_API_TOKEN
})


// Get all templates from the template builder repo directory structure
const getTemplateList = async () => {
  const response = await ocktokit.request("GET /repos/{owner}/{repo}/contents/{path}",{
    owner: githubOrgName,
    repo: templateBuildRepoName,
    path: pathToTemplatesInTB,
    headers: ghHeaders
  }).catch(err => console.error("The request to get the templates failed: ", err));
  //const response = await axios.get("https://api.github.com/repos/platformsh/template-builder/contents/templates")
    //.catch(err => console.error("The request to get the templates failed: ", err))

  return response.data
}

// Extend the YAML schema to include the !include tag
// But don't do anything with it, since it's not important here
const IncludeYamlType = new yaml.Type('!include', { kind: 'mapping' })
const YAML_SCHEMA = yaml.DEFAULT_SCHEMA.extend([IncludeYamlType]);

// Look for the runtime in the app configuration file in the template builder repo
const getTemplateRuntime = async (name, url, count) => {
  let configPath = `${pathToTemplatesInTB}/${name}/${url}.platform.app.yaml`

  try {
    const templateConfig = await ocktokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: githubOrgName,
      repo: templateBuildRepoName,
      path: configPath
    })

    let runtimeData = ""

    // @todo we should probably wrap the attempt to decode in a try catch as well
    let Butter = new Buffer.from(templateConfig.data.content, 'base64')
    let templateConfigDecoded = Butter.toString('utf-8')
    //console.log(`Decoded contents for template ${name}:`)
    //console.log(templateConfigDecoded)

    try {
      runtimeData = yaml.load(templateConfigDecoded, {schema: YAML_SCHEMA}).type
      const splitIndex = runtimeData.indexOf(":")
      return runtimeData.substring(0, splitIndex)
    } catch {
      console.error(`Error loading the app configuration file for the ${name} template`)
      console.log("Contents of the decoded config file:")
      console.log(templateConfigDecoded)
      return
    }

  } catch (error) {
    if (404 === error.status) {
      // Loop through different possible folders for the app file
      // Basically a problem for multi-app templates
      switch (count) {
        case 1:
          return getTemplateRuntime(name, `${url}gatsby/`, 2)
        case 2:
          return getTemplateRuntime(name, url.replace("gatsby/", "apm/"), 3)
        case 3:
          return getTemplateRuntime(name, url.replace("apm/", "strapi/"), 4)
        case 4:
          return getTemplateRuntime(name, url.replace("strapi/", "search/"), 5)
        default:
          // The Next.js templates don't currently have files in the template builder repo
          // So just do it manually
          if (name === "nextjs-drupal" || name === "nextjs-wordpress") return "nodejs"
          // The Django4 template has an .applications.yaml file with complicated includes
          if (name === "django4") return "python"
          console.error(`Could not find the app configuration file for the ${name} template`, url)
          return ""
      }
    }
  }
}

// Get info on each template based on the information file inside the templace builder repo
const getTemplatesFullInfo = async (templateInfo) => {
  let continueTemplateCall = await reportAPILimit()

  // for now we're going to make sure we have api calls remaining before making another call
  if(!continueTemplateCall) {
    return {shortname: name, runtime: "over-api-limits" }
  }

  const templateData = await ocktokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: githubOrgName,
    repo: templateBuildRepoName,
    path: `${pathToTemplatesInTB}/${templateInfo.name}/.platform.template.yaml`,
    headers: ghHeaders
  })

  if(200 === templateData.status) {
    let Butter = new Buffer.from(templateData.data.content,'base64')
    let templateContentDecoded = Butter.toString('utf-8')

    let info = {}
    try {
      info = yaml.load(templateContentDecoded).info
    } catch {
      console.error(`Error loading the YAML file with info on the ${templateInfo.name} template`)
      return
    }

    const runtime = await getTemplateRuntime(templateInfo.name, `files/`, 1);

    return {
      shortname: templateInfo.name,
      name: info.name,
      repo: `https://github.com/platformsh-templates/${templateInfo.name}`,
      description: info.description,
      image: info.image,
      deploy: `https://console.platform.sh/projects/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/${templateInfo.name}/.platform.template.yaml`,
      content: info.notes[0].content,
      runtime: runtime
    };
  } else {
    console.log(`Issue encountered retrieving template info for ${templateInfo.name}. Status returned was ${templateData.status}`)
  }
}


  // console.log(`Did I get something back for ${templateInfo.name}?`)
  // console.log(templateResponse.data.content)

  //   .then(templateResponse => {
  //   console.log(`Did I get something back for ${templateInfo.name}?`)
  //   console.log(templateResponse.data.content)
  //   let buff = new Buffer.from(templateResponse.data.content,'base64')
  //   let templateContents = buff.toString('utf-8');
  //   return templateContents
  // }).then(async templateResponse => {
  //     let info = {}
  //     try {
  //       info = yaml.load(templateResponse).info
  //     } catch {
  //       console.error(`Error loading the YAML file with info on the ${templateInfo.name} template`)
  //       return
  //     }
  //
  //     // Get runtime data from a different file
  //     const runtime = await getTemplateRuntime(templateInfo.name, `${templateInfo.url}/files/`, 1);
  //
  //     return {
  //       shortname: templateInfo.name,
  //       name: info.name,
  //       repo: `https://github.com/platformsh-templates/${templateInfo.name}`,
  //       description: info.description,
  //       image: info.image,
  //       deploy: `https://console.platform.sh/projects/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/${templateInfo.name}/.platform.template.yaml`,
  //       content: info.notes[0].content,
  //       runtime: runtime
  //     };
  //   })
  //   .catch(err => console.error(`Error fetching template URL for the ${templateInfo.name} template: ${err}`))
  //
  //   return templateData
//}

// Get a list of templates from GitHub and return a YAML string with info on all
const fetchTemplates = async () => {
  const templates = await getTemplateList()

  const templateList = templates
    // Skip initializing file
    .filter(template => template.name !== "__init__.py")
    .map(template => {
      // @todo we should check current api limits and skip if we've exceeded
      const name = template.name
      // @todo url can be removed as we're no longer using it
      const url = `https://raw.githubusercontent.com/platformsh/template-builder/master/templates/${name}`
      return fetchConcurrency(getTemplatesFullInfo, { name, url })
    })

  const allInfo = await Promise.all(templateList)


  const finalInfo = allInfo
    // Filter out any objects that didn't return data
    // So the resulting YAML file is valid
    .filter(info => info !== undefined)
    // Group the results by runtime
    .reduce((group, template) => {
      const { runtime } = template;
      group[runtime] = group[runtime] ?? [];
      group[runtime].push(template);
      return group;
    }, {});

  return yaml.dump(finalInfo)
}


// retrieves all the template data we need and writes it the build cache
const writeTemplateInfo = async () => {
  await fsPromises.writeFile(cachedTemplateFileFull, await fetchTemplates())
}

// copies the cached version of the templates file from build cache to where hugo expects it
const getTemplateInfo = async () => {
  await reportAPILimit()
  try {
    // if the file doesn't exist. we need to create it and copy it into the build cache
    if (!existsSync(cachedTemplateFileFull)) {
      await writeTemplateInfo()
    } else {
      console.log(cachedTemplateName + " already exists.")
    }
  } catch (err) {
    console.error(err)
  }


  // now that we know we have the file, let's copy it into the correct location
  try {
    copyFileSync(cachedTemplateFileFull,destinationTemplateFull)
  } catch (err) {
    console.log(`Errors were encountered attempting to copy the cached ${cachedTemplateName} file`)
    console.log(`Attempted to copy from ${cachedTemplateFileFull} to ${destinationTemplateFull}`)
  }
  await reportAPILimit()
}

const reportAPILimit = async () => {
  const apiLimit = await ocktokit.request('GET /rate_limit', {
    headers: ghHeaders
  })

  console.log(`Number of requests remaining: ${apiLimit.data.rate.remaining} out of ${apiLimit.data.rate.limit}`)

  return (apiLimit.data.rate.remaining > 0)
}

console.log(`
### Getting info on Platform.sh templates
`);

getTemplateInfo()
