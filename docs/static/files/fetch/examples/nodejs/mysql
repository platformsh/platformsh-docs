const mysql = require('mysql2/promise');
const config = require("platformsh-config").config();

exports.usageExample = async function() {

    const credentials = config.credentials('database');

    const connection = await mysql.createConnection({
        host: credentials.host,
        port: credentials.port,
        user: credentials.username,
        password: credentials.password,
        database: credentials.path,
    });

    let sql = '';

    // Creating a table.
    sql = `CREATE TABLE IF NOT EXISTS People (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30) NOT NULL,
            city VARCHAR(30) NOT NULL
        )`;
    await connection.query(sql);

    // Insert data.
    sql = `INSERT INTO People (name, city) VALUES
    ('Neil Armstrong', 'Moon'),
        ('Buzz Aldrin', 'Glen Ridge'),
        ('Sally Ride', 'La Jolla');`;
    await connection.query(sql);

    // Show table.
    sql = `SELECT * FROM People`;
    let [rows] = await connection.query(sql);

    let output = '';

    if (rows.length > 0) {
        output +=`<table>
            <thead>
            <tr><th>Name</th><th>City</th></tr>
            </thead>
            <tbody>`;

        rows.forEach((row) => {
            output += `<tr><td>${row.name}</td><td>${row.city}</td></tr>\n`;
        });

        output += `</tbody>\n</table>\n`;
    }

    // Drop table.
    sql = `DROP TABLE People`;
    await connection.query(sql);

    return output;
};
