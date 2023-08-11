const Influx = require("influx");
const config = require("platformsh-config").config();

exports.usageExample = async function () {
    const {
        username = "admin",
        password = "admin",
        host,
        port,
    } = config.credentials("influxdb");

    const influx = new Influx.InfluxDB(
        `http://${username}:${password}@${host}:${port}/deploys`
    );

    await influx.createDatabase("deploys");

    await influx.writePoints([
        {
            measurement: "deploy_time",
            tags: { host: "server01", region: "us-west" },
            fields: { value: 0.64, cpuCount: 10 },
            timestamp: new Date(2020, 10, 9, 10),
        },
        {
            measurement: "deploy_time",
            tags: { host: "server01", region: "us-west" },
            fields: { value: 0.84, cpuCount: 10 },
            timestamp: new Date(2020, 10, 9, 10, 30),
        },
    ]);

    const result = await influx.query(`select * from deploy_time`);

    await influx.dropDatabase("deploys");

    const outputRows = result
        .map(({ value, time }) => `<tr><td>${time}</td><td>${value}</td></tr>`)
        .join("\n");

    return `
    <table>
        <thead>
            <tr>
                <th>Timestamp</th><th>Value</th>
            </tr>
        </thhead>
        <tbody>
            ${outputRows}
        </tbody>
    </table>
    `;
};
