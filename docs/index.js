const express = require('express')
const path = require('path')
const mysql = require("mysql2");
const config = require("platformsh-config").config();

const app = express()

app.use(express.json())

/* Listen for feedback posts */
app.post("/feedback/submit", (req, res) => {
  const credentials = config.credentials("database");

  const connection = mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.path,
  });

  const feedback = req.body

  // Create a feedback table if it doesn't exist
  connection.query(
    `CREATE TABLE IF NOT EXISTS Feedback (
      id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      url VARCHAR(100) NOT NULL,
      feedback VARCHAR(10) NOT NULL
    )`,
    (err) => res.status(500).send("Error creating a table for feedback")
  );

  // Insert feedback record
  connection.query(
    `INSERT INTO Feedback (date, url, feedback)
    VALUES
      ('${feedback.date}', '${feedback.url}', '${feedback.feedback}');`,
      (err) => res.status(500).send("Error entering feedback into database")
  );

  res.status(200).send("Feedback recorded");

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