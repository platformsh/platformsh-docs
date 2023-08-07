var fs = require('fs');

const psh = require("pshregistry-parser");


const registrySource = "../../shared/data/registry.json";
const save_dir = "src/registry/images/"

const registry = new psh.RegistryParser(registrySource, saveDir=save_dir);

console.log(`
### updateExampleConfigFiles.js: Updating example Platform.sh configuration yamls.
`);


registry.write();

// New source location in data requires a copy to registry/images to continue to serve
//  at same location
fs.createReadStream(registrySource).pipe(fs.createWriteStream(`${save_dir}registry.json`));
fs.createReadStream(`${registrySource.split(".")[0]}.yaml`).pipe(fs.createWriteStream(`${save_dir}registry.yaml`));
