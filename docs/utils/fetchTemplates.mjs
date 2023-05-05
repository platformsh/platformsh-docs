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
    path: pathToTemplatesInTB
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
  return axios.get(`${url}.platform.app.yaml`)
    .then(response => {
      let runtimeData = ""
      try {
        runtimeData = yaml.load(response.data, { schema: YAML_SCHEMA }).type
      } catch {
        console.error(`Error loading the app configuration file for the ${name} template`)
        return
      }

      const splitIndex = runtimeData.indexOf(":")

      return runtimeData.substring(0, splitIndex)
    })
    .catch(err => {
      // If the app configuration file isn't found
      if (err.response.status === 404) {
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
      else {
        console.error(err)
      }
    })
}

// Get info on each template based on the information file inside the templace builder repo
const getTemplatesFullInfo = async (templateInfo) => {
  return axios.get(`${templateInfo.url}/.platform.template.yaml`)
    .then(async templateResponse => {
      let info = {}
      try {
        info = yaml.load(templateResponse.data).info
      } catch {
        console.error(`Error loading the YAML file with info on the ${templateInfo.name} template`)
        return
      }

      // Get runtime data from a different file
      const runtime = await getTemplateRuntime(templateInfo.name, `${templateInfo.url}/files/`, 1);

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
    })
    .catch(err => console.error(`Error fetching template URL for the ${templateInfo.name} template: ${err}`))


}

// Get a list of templates from GitHub and return a YAML string with info on all
const fetchTemplates = async () => {
  const templates = await getTemplateList()

  const templateList = templates
    // Skip initializing file
    .filter(template => template.name !== "__init__.py")
    .map(template => {
      const name = template.name
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
}

const reportAPILimit = async () => {
  const apiLimit = await octokit.request('GET /rate_limit', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  console.log(`Current rate limit is ${reportAPILimit.rate.limit}`)
  console.log(`Number of requests remaining: ${reportAPILimit.rate.}`)
}

console.log(`
### Getting info on Platform.sh templates
`);

getTemplateInfo()
