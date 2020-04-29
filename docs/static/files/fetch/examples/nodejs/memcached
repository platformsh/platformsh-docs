const Memcached = require('memcached');
const config = require("platformsh-config").config();
const { promisify } = require('util');

exports.usageExample = async function() {

    const credentials = config.credentials('memcached');

    let client = new Memcached(`${credentials.host}:${credentials.port}`);

    // The MemcacheD client is not Promise-aware, so make it so.
    const memcachedGet = promisify(client.get).bind(client);
    const memcachedSet = promisify(client.set).bind(client);

    let key = 'Deploy-day';
    let value = 'Friday';

    // Set a value.
    await memcachedSet(key, value, 10);

    // Read it back.
    let test = await memcachedGet(key);

    let output = `Found value <strong>${test}</strong> for key <strong>${key}</strong>.`;

    return output;
};
