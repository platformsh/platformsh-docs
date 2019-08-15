const psh = require("pshconfig-generator");


var registryLocation = "src/registry/images/registry.json";

var cg = psh.configGenerator(registryLocation);
cg.write();
