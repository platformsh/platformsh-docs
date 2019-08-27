const psh = require("pshconfig-generator");


let registrySource = "src/registry/images/registry.json";
let cg = psh.configGenerator(registrySource);
cg.write();
