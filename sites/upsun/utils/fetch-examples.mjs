import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { default as yaml } from 'js-yaml';
import { default as axios } from 'axios'
import pLimit from 'p-limit';
import {copySync} from 'fs-extra/esm';
import * as path from "path";
import * as ghCommon from './common.mjs'
import * as util from "util";


/**
 * Example file data location and function to use for retrieval
 */
const dataDirectories = {
    "templates": {
        dir: '../../shared/data/remote-examples/templates/',
        fetchFunc: fetchFilesTemplates,
    },
    "language-examples": {
        dir: '../../shared/data/remote-examples/language-examples/',
        fetchFunc: fetchFilesExamples
    }
}

const fetchConcurrency = pLimit(10);

const cachedBuildPath = ghCommon.cacheDir()
const fetchedFilesPath = path.join('static','files','fetch')
const cachedFilesPath = path.join(cachedBuildPath,fetchedFilesPath)
const localFetchedFiles = path.join(process.cwd(),fetchedFilesPath)


/**
 * Ensure subdirectory we're saving into exists.
 * @param {string} savePath
 */
function ensureSubdir(savePath) {
    if (!fs.existsSync(savePath)){
        // Create subdirectory if doesn't exist.
        try {
          fs.mkdirSync(savePath,{recursive:true});
        } catch (error) {
          console.error("Error encountered while trying to create: ", savePath);
          console.error(error)
        }
    }
}

/**
 * Function to place the request and write to the file
 * @param {string} target
 * @param {string} destination
 * @returns {Promise<void>}
 * @uses writeFile
 */
async function writeFileFromTarget(target, destination) {
    // Get the file.
    const res = await axios.get(target, {responseType: 'arraybuffer', timeout: 60000}) // wait 1 minute for a response
    .catch(error => {
        // If there's a response from the server, such as 404 or 502
        if (error.response) {
            console.error(`The target ${target} returned an error with the code ${error.response.status} and the text '${error.response.statusText}'.`)
        }
        // If the request times out or has some other failure
        else {
            console.error(`The request to ${target} failed for this reason: ${error.message}.`)
        }
    });

    await writeFile(res.data,destination)
}

/**
 * Writes our data to a file at <destination>
 * @param {string} data
 * @param {string} destination
 * @returns {Promise<void>}
 */
async function writeFile(data, destination) {
  if (data) {
    try {
      await fsPromises.writeFile(destination, data);
    } catch (error) {
      console.error("Writing cache file failed!",destination)
      console.log(error)
    }
  }
}

/**
 * Checks to see if we have the destination file in build cache, and if not, prepares the data needed for retrieving it
 * from the GH API.
 *
 * @param data template information as parsed from its yaml file in ./data/remote-examples/templates
 * @returns {Promise<void>}
 * @uses writeFileFromGH
 */
async function fetchFilesTemplates(data) {
    let fetches = [];

    for (let repo in data["repos"]) {
      var destination = path.join(cachedBuildPath,`${data["savePath"]}/${data["repos"][repo]}`)

      // we only want to retrieve the file if we dont already have it in cache
      if(! fs.existsSync(destination)) {
        console.log(`Retrieving ${data["repos"][repo]}/${data["file"]}...`)
        // Ensure subdirectory exists.
        ensureSubdir(path.join(cachedBuildPath,data["savePath"]))
        // Place the request and write the file.
        let branch = (data["branch"] != "master") ? data["branch"] : ""
        fetches.push(fetchConcurrency(writeFileFromGH,data["repoOrg"], data["repos"][repo], data["file"], destination,branch));
      }
    }

    await Promise.all(fetches);
}

/**
 * Retrieves a file's contents from a repository and writes those contents to <destination>
 * @param {string} repoOrg - Organization as retrieve from repoOrg property in *.yaml
 * @param {string} repoName - Name of the repo
 * @param {string} fileName - path+file of the file we need to retrieve
 * @param {string} destination - where we should save the data once retrieved
 * @param {string} branch - Branch name to use when retrieving <fileName>. Optional. Defaults to default_branch in git
 * @returns {Promise<void>}
 * @uses writeFile
 */
async function writeFileFromGH(repoOrg,repoName,fileName,destination,branch=""){
  // @todo move this into common
  // /repos/{owner}/{repo}/contents/{path}
  var ghApiRequestStruct = "/repos/%s/%s/contents/%s"
  //@todo this should be moved into common as well
  // templates/<template-name>/files/<path-to-file-plus-file>
  let requestPath = util.format(ghApiRequestStruct,repoOrg,repoName,fileName)
  if(branch) {
    requestPath = `${requestPath}?ref=${branch}`
  }
  // if we're over the limit, we cant get anything anyway
  if(await ghCommon.reportOverAPILimit()) {
    return
  }

  const ghResponse = await ghCommon.ocktokit.request(`GET ${requestPath}`,{
    owner: ghCommon.githubOrgName,
    repo: ghCommon.templateBuildRepoName,
    path: requestPath,
    headers: ghCommon.ghHeaders,
  }).catch(err => console.error(`The request to GH for template ${repoName} failed`)).then(ghResponse => {
    if(ghResponse && 200 === ghResponse.status  && ghResponse.data.content) {
      const templateContents = ghCommon.decodeBase64Contents(ghResponse.data.content)
      writeFile(templateContents,destination)
    }
  })
}

/**
 * Function to parse out an example file's target and destination before request is made.
 * @param data
 * @returns {Promise<void>}
 */
async function fetchFilesExamples(data) {
    // Ensure that the examples subdirectory exists.
    ensureSubdir(path.join(cachedBuildPath,data["savePath"]));
    for (let language in data["paths"]) {
        // Format target and destination for each language.
        var languageTargetDir = `${data["root"]}/${language}`;
        var languageDestDir = path.join(cachedBuildPath,`${data["savePath"]}/${language}`)

        // Ensure the language subdirectory exists.
        ensureSubdir(languageDestDir);

        let fetches = [];
        for (let service in data["paths"][language]) {
            // Format target and destination for each service.
            var target = `${languageTargetDir}/${data["paths"][language][service]}`;
            var destination = path.join(languageDestDir,data["paths"][language][service])
            // Place the request and write the file.
            if(!fs.existsSync(destination)) {
              console.log(`Retrieving ${language}/${data["paths"][language][service]}...`)
              fetches.push(fetchConcurrency(writeFileFromTarget, target, destination));
            }
        }

        await Promise.all(fetches);
    }
}

/**
 * Fetches itesm as defined in <dataDirectories>
 * @param exampleGroup
 * @returns {Promise<void>}
 */
async function fetch(exampleGroup) {
    // Get data for the current group of examples.
    var dir = dataDirectories[exampleGroup]["dir"];
    var fetchFunc = dataDirectories[exampleGroup]["fetchFunc"];
    // list all files in the directory
    let files = await fsPromises.readdir(dir);

    for (let file of files) {
      // Load the data.
      const data = yaml.load(fs.readFileSync(dir + file, 'utf8'));
      // Get the files.
      await fetchFunc(data);
    }
}

/**
 * Triggers the retrieval of all files not already in cache
 * @returns {Promise<void>}
 */
async function run(){
    for (let exampleGroup in dataDirectories) {
        await fetch(exampleGroup)
    }
}

/**
 * Ensures our storage directory exists in the cache directory, triggers run() to retrieve any missing files that do
 * not exist in the cache, then copies all files from the cache directory into our application container
 * @returns {Promise<void>}
 */
async function buildAndCopy() {
  if(!ghCommon.continueFetch()) {
    return;
  }

  if(!fs.existsSync(cachedFilesPath)) {
    fs.mkdirSync(cachedFilesPath, {recursive: true})
  }

  await run();

  try {
    copySync(cachedFilesPath,localFetchedFiles,)
  } catch (error) {
    console.log(error)
  }
}

// Run it.
buildAndCopy()
