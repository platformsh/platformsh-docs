const psh = require("pshregistry-parser");


let registrySource = "src/registry/images/registry.json";
let registry = new psh.RegistryParser(registrySource);
registry.write();
