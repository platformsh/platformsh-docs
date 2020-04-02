
const config = require("platformsh-config").config();

const credentials = config.credentials('postgresdatabase');

let settings = {
  client: "postgres",
  host: credentials.ip,
  port: credentials.port,
  database: credentials.path,
  username: credentials.username,
  password: credentials.password
};
