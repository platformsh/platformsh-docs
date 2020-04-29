const redis = require('redis');
const config = require("platformsh-config").config();
const { promisify } = require('util');

exports.usageExample = async function() {

    const credentials = config.credentials('redis');

    var client = redis.createClient(credentials.port, credentials.host);

    // The Redis client is not Promise-aware, so make it so.
    const redisGet = promisify(client.get).bind(client);
    const redisSet = promisify(client.set).bind(client);

    let key = 'Deploy day';
    let value = 'Friday';

    // Set a value.
    await redisSet(key, value);

    // Read it back.
    let test = await redisGet(key);

    let output = `Found value <strong>${test}</strong> for key <strong>${key}</strong>.`;

    return output;
};
