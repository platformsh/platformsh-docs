const pg = require('pg');
const config = require("platformsh-config").config();

exports.usageExample = async function() {

    const credentials = config.credentials('postgresql');

    const client = new pg.Client({
        host: credentials.host,
        port: credentials.port,
        user: credentials.username,
        password: credentials.password,
        database: credentials.path,
    });

    client.connect();

    let sql = '';

    // Creating a table.
    sql = `CREATE TABLE IF NOT EXISTS People (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      city VARCHAR(30) NOT NULL
      )`;
    await client.query(sql);

    // Insert data.
    sql = `INSERT INTO People (name, city) VALUES 
        ('Neil Armstrong', 'Moon'), 
        ('Buzz Aldrin', 'Glen Ridge'), 
        ('Sally Ride', 'La Jolla');`;
    await client.query(sql);

    // Show table.
    sql = `SELECT * FROM People`;
    let result = await client.query(sql);

    let output = '';

    if (result.rows.length > 0) {
        output +=`<table>
            <thead>
            <tr><th>Name</th><th>City</th></tr>
            </thead>
            <tbody>`;

        result.rows.forEach((row) => {
            output += `<tr><td>${row.name}</td><td>${row.city}</td></tr>\n`;
        });

        output += `</tbody>\n</table>\n`;
    }

    // Drop table.
    sql = `DROP TABLE People`;
    await client.query(sql);

    return output;
};
