import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { default as yaml } from 'js-yaml';
import { default as axios } from 'axios'
import pLimit from 'p-limit';

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

// Ensure subdirectory we're saving to exists.
function ensureSubdir(savePath) {
    var destinationDir = process.cwd() + savePath
    if (!fs.existsSync(destinationDir)){
        // Create subdirectory if doesn't exist.
        fs.mkdirSync(destinationDir);
    }
}

// Function to place the request and write to the file.
async function writeFileFromTarget(target, destination) {
    // Get the file.
    console.log("Fetching", target);
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
    if (res && res.data){
        await fsPromises.writeFile(destination, res.data);
    }
}

// Function to parse out an example file's target and destination before request is made.
async function fetchFilesTemplates(data) {
    let fetches = [];
    for (let repo in data["repos"]) {
        // Format target and destination.
        var target = `${data["root"]}/${data["repos"][repo]}/${data["branch"]}/${data["file"]}`;
        var destination = process.cwd() + `${data["savePath"]}/${data["repos"][repo]}`
        // Ensure subdirectory exists.
        ensureSubdir(data["savePath"])
        // Place the request and write the file.
        fetches.push(fetchConcurrency(writeFileFromTarget, target, destination));
    }

    await Promise.all(fetches);
}

// Function to parse out an example file's target and destination before request is made.
async function fetchFilesExamples(data) {
    // Ensure that the examples subdirectory exists.
    ensureSubdir(data["savePath"]);
    for (let language in data["paths"]) {
        // Format target and destination for each language.
        var languageTargetDir = `${data["root"]}/${language}`;
        var languageDestDir = `${data["savePath"]}/${language}`;
        // Ensure the language subdirectory exists.
        ensureSubdir(languageDestDir);

        let fetches = [];
        for (let service in data["paths"][language]) {
            // Format target and destination for each service.
            var target = `${languageTargetDir}/${data["paths"][language][service]}`;
            var destination = process.cwd() + `${languageDestDir}/${data["paths"][language][service]}`;
            // Place the request and write the file.
            fetches.push(fetchConcurrency(writeFileFromTarget, target, destination));
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

// Run it.
run()
