const psh = require("pshregistry-parser");


let registrySource = "src/registry/images/registry.json";
let saveDirectory = "src/registry/images/examples/";
let registry = new psh.RegistryParser(registrySource, saveDirectory);
registry.write();
