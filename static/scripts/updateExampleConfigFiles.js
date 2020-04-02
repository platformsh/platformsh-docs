const psh = require("pshregistry-parser");


const registrySource = "content/en/registry/images/registry.json";
const registry = new psh.RegistryParser(registrySource);

console.log(`
### updateExampleConfigFiles.js: Updating example Platform.sh configuration yamls.                      
`);


registry.write();
