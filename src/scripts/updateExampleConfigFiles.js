const psh = require("pshregistry-parser");


const registrySource = "_book/registry/images/registry.json";
const registry = new psh.RegistryParser(registrySource);

registry.write();
