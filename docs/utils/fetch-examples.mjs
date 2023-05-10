import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { default as yaml } from 'js-yaml';
import { default as axios } from 'axios'
import pLimit from 'p-limit';
import {copySync} from 'fs-extra/esm';
import * as path from "path";
import * as ghCommon from './common.mjs'
import * as util from "util";


// Example file data.
const dataDirectories = {
    "templates": {
        dir: 'data/remote-examples/templates/',
        fetchFunc: fetchFilesTemplates,
    },
    "language-examples": {
        dir: 'data/remote-examples/language-examples/',
        fetchFunc: fetchFilesExamples
    }
}

const fetchConcurrency = pLimit(10);

const cachedBuildPath = process.env.PLATFORM_CACHE_DIR
const fetchedFilesPath = path.join('static','files','fetch')
const cachedFilesPath = path.join(cachedBuildPath,fetchedFilesPath)
const localFetchedFiles = path.join(process.cwd(),fetchedFilesPath)



// Ensure subdirectory we're saving to exists.
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

// Function to place the request and write to the file.
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

// Function to parse out an example file's target and destination before request is made.
async function fetchFilesTemplates(data) {
    let fetches = [];

    for (let repo in data["repos"]) {
      var destination = path.join(cachedBuildPath,`${data["savePath"]}/${data["repos"][repo]}`)

      // we only want to retrieve the file if we dont already have it in cache
      if(! fs.existsSync(destination)) {
        console.log(`I do not have the file ${data["repos"][repo]}/${data["file"]} in cache so I will retrieve it.`)
        // Format target and destination.

        //var target = `${data["root"]}/${data["repos"][repo]}/${data["branch"]}/${data["file"]}`;

        // Ensure subdirectory exists.
        ensureSubdir(path.join(cachedBuildPath,data["savePath"]))
        // Place the request and write the file.
        let branch = (data["branch"] != "master") ? data["branch"] : ""
        fetches.push(fetchConcurrency(writeFileFromGH,data["repoOrg"], data["repos"][repo], data["file"], destination,branch));
      } else {
        //console.log(`${data["repos"][repo]}/${data["file"]} is already in cache.`)
      }
    }

    await Promise.all(fetches);
}

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

  //console.log("Requesting",repoOrg,repoName,requestPath)

  const ghResponse = await ghCommon.ocktokit.request(`GET ${requestPath}`,{
    owner: ghCommon.githubOrgName,
    repo: ghCommon.templateBuildRepoName,
    path: requestPath,
    headers: ghCommon.ghHeaders,
  }).catch(err => console.error(`The request to GH for template ${repoName} failed`)).then(ghResponse => {
    if(ghResponse && 200 === ghResponse.status  && ghResponse.data.content) {
      const templateContents = ghCommon.decodeBase64Contents(ghResponse.data.content)
      writeFile(templateContents,destination)
    } //else if(404 === ghResponse.status) {
    //    console.error(`Request to GH for template ${repoName} returned a 404.`, ghResponse)
    // }
  })
}

// Function to parse out an example file's target and destination before request is made.
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
              console.log(`The example file ${language}/${data["paths"][language][service]} is not cached. Retrieving.`)
              fetches.push(fetchConcurrency(writeFileFromTarget, target, destination));
            } else {
              //console.log(`The example file ${language}/${data["paths"][language][service]} is already cached. Skipping.`)
            }
        }

        await Promise.all(fetches);
    }
}

// Main fetch function.
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

// Main run function.
async function run(){
    for (let exampleGroup in dataDirectories) {
        await fetch(exampleGroup)
    }
}

async function buildAndCopy() {

  if(!fs.existsSync(cachedFilesPath)) {
    //console.log(`Cache directory ${cachedFilesPath} doesn't exist. Creating.`)
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
