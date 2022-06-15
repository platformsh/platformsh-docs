const express = require('express')
const path = require('path')
const mysql = require("mysql2/promise");
const config = require("platformsh-config").config();

const app = express()

app.use(express.json())

/* Listen for feedback posts */
app.post("/feedback/submit", async (req, res) => {
  const credentials = config.credentials("database");

  const connection = await mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.path,
  });

  const feedback = req.body

  // Create a feedback table if it doesn't exist
  try {
    await connection.query(
      `CREATE TABLE IF NOT EXISTS Feedback (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        date DATETIME NOT NULL,
        url VARCHAR(100) NOT NULL,
        feedback VARCHAR(10) NOT NULL
      )`
    );
  } catch (err) { res.status(500).send("Error creating a table for feedback") }

  // Insert feedback record
  try {
    await connection.query(
      `INSERT INTO Feedback (date, url, feedback)
      VALUES
        ('${feedback.date}', '${feedback.url}', '${feedback.feedback}');`
    );
  } catch (err) { res.status(500).send("Error entering feedback into database") }

  res.status(200).send("Feedback recorded");

})

/* Return a simple table of feedback submissions */
app.get('/feedback/report.html', async (req, res) => {
  const credentials = config.credentials("database");

  const connection = await mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.path,
  });

  // Get all feedback submissions
  const [rows] = await connection.query("SELECT * FROM Feedback");
  
  const outputRows = rows
    .map(({ date, url, feedback }) => `<tr><td>${new Date(date).toDateString()}</td><td>${url}</td><td>${feedback}</td></tr>\n`)
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Docs feedback</title>
        <style>
          table {
            border-collapse: collapse;
          }
          
          th, td {
            border: 1px solid black;
            padding: 0.25rem 0.5rem;
          }
        </style>
      </head>
      <body>
        <h1>Feedback on specific docs pages</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>URL</th>
              <th>Feedback</th>
            </tr>
          </thhead>
          <tbody>
            ${outputRows}
          </tbody>
        </table>
      </body>
    </html>
    `;

  res.send(html)
})

/* Handle 404 requests */
app.get('/*', (req, res) => {
  res.status(404).sendFile('/404.html', {
    root: path.join(__dirname, 'public'),
  })
})

app.listen(config.port, () => {
  console.info(`ExpressJS listening on ${config.port}.`)
})