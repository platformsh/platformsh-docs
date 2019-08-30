const psh = require("pshregistry-parser");


let registrySource = "_book/registry/images/registry.json";
let registry = new psh.RegistryParser(registrySource);
registry.write();
