"use strict";

const yaml = require('js-yaml');
const fs   = require('fs');
const request = require("request");

const fetchData = "data/fetch.yaml";
const savePath = "static/files/fetch/";

// Root urls for each class of example files requested in fetch.yaml.
const fetchRoots = {
  "examples": "https://examples.docs.platform.sh/",
  "appyaml": "https://raw.githubusercontent.com/platformsh-templates/",
  "servicesyaml": "https://raw.githubusercontent.com/platformsh/",
  "routesyaml":  "https://raw.githubusercontent.com/platformsh-templates/"
}

// URL formatting function for "examples" files.
function examples(target) {
  return fetchRoots.examples + target;
}

// URL formatting function for "appyaml" files, which only grab
//    .platform.app.yaml files from template master branch.
function appyaml(target) {
  return fetchRoots.appyaml + target + "/master/.platform.app.yaml";
}

// URL formatting function for "servicesyaml" files, which only grab
//    .platform/services.yaml files from template master branch.
function servicesyaml(target) {
  return fetchRoots.servicesyaml + target + "/master/.platform/services.yaml";
}

// URL formatting function for "routesyaml" files, which only grab
//    .platform/routes.yaml files from template master branch.
function routesyaml(target) {
  return fetchRoots.routesyaml + target + "/master/.platform/routes.yaml";
}

// If example file subdirectories don't exist already, create them.
function ensureSubDirs(item, dataRoot) {
  if (item.includes("/")) {
    var fields = item.split('/');
    if (!fs.existsSync(savePath + dataRoot + "/" +  fields[0])){
      fs.mkdirSync(savePath + dataRoot + "/" +  fields[0]);
    };
  }
}

// Creates object that contains request URL for each file in fetch.yaml.
function getTargets(data, dataRoot) {
  var result = {};
  data[dataRoot].forEach( function (item, index) {
    ensureSubDirs(item, dataRoot)
    var file = savePath + dataRoot + "/" + item;
    result[file] = eval(`${dataRoot}(item)`)
  });
  return result;
}

// Places the request and writes the file.
function writeFile(url, filename) {
  request.get(url, (error, response, body) => {
    fs.writeFileSync(filename, body, function (err) {
      if (err) throw err;
    });
  });
}

// Get fetch file, or throw exception on error.
try {
  const data = yaml.safeLoad(fs.readFileSync(fetchData, 'utf8'));
  const targets = {};
  for (var dataRoot in data) {
    if (!fs.existsSync(savePath + dataRoot)){
      fs.mkdirSync(savePath + dataRoot);
    };
    if (fetchRoots.hasOwnProperty(dataRoot)) {
      targets[dataRoot] = getTargets(data, dataRoot);
      for (var target in targets[dataRoot]) {
        writeFile(targets[dataRoot][target], target)
      }
    }
  }
} catch (e) {
  console.log(e);
}

function fetch () {
  // Get fetch file, or throw exception on error.
  try {
    // Load the data.
    const data = yaml.safeLoad(fs.readFileSync(fetchData, 'utf8'));
    const targets = {};
    for (var dataRoot in data) {
      // Create dataRoot subdirectories.
      if (!fs.existsSync(savePath + dataRoot)){
        fs.mkdirSync(savePath + dataRoot);
      };
      if (fetchRoots.hasOwnProperty(dataRoot)) {
        // Get the request targets.
        targets[dataRoot] = getTargets(data, dataRoot);
        // Request and write the files.
        for (var target in targets[dataRoot]) {
          writeFile(targets[dataRoot][target], target)
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

console.log(`
### fetch.js: Fetching example yaml files.                       
`);

fetch()
