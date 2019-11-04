const psh = require("pshregistry-parser");


const registrySource = "src/registry/images/registry.json";
const registry = new psh.RegistryParser(registrySource);

registry.write();
