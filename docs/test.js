const config = require("platformsh-config").config();

const credentials = config.credentials('search');
console.log(credentials)

console.log(config.getRoute("search")["url"])