const express = require('express')
const path = require('path')
const mysql = require("mysql2/promise");
const config = require("platformsh-config").config();

const app = express();

app.use(express.json());

/* Listen for feedback posts */
app.post("/feedback/submit", async (req, res) => {
  const credentials = config.credentials("database");

  const connection = await mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.path,
  })
    .catch(connectionError => {
      console.log(connectionError)
      return res.status(500).send("Error connecting to database")
    });

  const feedback = req.body;
  const today = new Date().toISOString().slice(0, 19);

  // Validate URL in feedback
  if ((typeof feedback.url !== 'string') || /[<>\s]/.test(feedback.url) || !feedback.url.startsWith(config.getPrimaryRoute().url)) {
    return res.status(400).send("The submitted URL isn't valid")
  };

  // Encode URL
  const urlForFeedback = encodeURI(feedback.url)

  // Validate feedback itself
  if ((typeof feedback.feedback !== 'string') || !['positive', 'negative'].includes(feedback.feedback)) {
    return res.status(400).send("The submitted feedback isn't valid")
  }

  // Create a feedback table if it doesn't exist
  await connection.query(
    `SELECT count(*) FROM information_schema.TABLES
    WHERE (TABLE_SCHEMA = '${credentials.path}')
    AND (TABLE_NAME = 'Feedback')`)
    .then(async (result) => {
      if (result.length === 0) {
        await connection.query(
          `CREATE TABLE Feedback (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            date DATETIME NOT NULL,
            url VARCHAR(300) NOT NULL,
            feedback VARCHAR(10) NOT NULL
          )`
        )
          .catch(createTableError => {
            console.log(createTableError)
            return res.status(500).send("Error creating a table for feedback")
          })
      }
    })
    .catch(selectTableError => {
      if (selectTableError) {
        console.log(error)
        return res.status(500).send("Error looking for feedback table")
      }
    }
    );

  // Insert feedback record
  await connection.query(
    'INSERT INTO Feedback (date, url, feedback) VALUES (?,?,?)', [today, urlForFeedback, feedback.feedback])
    .then(result => { return res.status(200).send("Feedback recorded") })
    .catch(insertFeedbackError => {
      console.log(insertFeedbackError)
      return res.status(500).send("Error entering feedback into database")
    });
})

/* Return a simple table of feedback submissions */
app.get('/feedback/data', async (req, res) => {
  const credentials = config.credentials("database");

  const connection = await mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.path,
  })
    .catch(connectionError => {
      console.log(connectionError)
      return res.status(500).send("Error connecting to database")
    });

  // Get all feedback submissions
  const [rows] = await connection.query("SELECT * FROM Feedback");

  // Combine all feedback on a given page into one row
  const rowsWithCountedFeedback = rows.reduce((result, item) => {
    // Check if the accumulator already has the URL for a given date
    const existing = result.find(x => x.url === item.url && new Date(x.date).toDateString() === new Date(item.date).toDateString());

    // If so, add the current vote to the running total
    if (existing) {
      if (item.feedback === "positive") {
        existing.positiveFeedback += 1
      } else if (item.feedback === "negative") {
        existing.negativeFeedback += 1
      }
    } else { // Otherwise, add a new item to the list
      if (item.feedback === "positive") {
        item.positiveFeedback = 1
        item.negativeFeedback = 0
      } else if (item.feedback === "negative") {
        item.positiveFeedback = 0
        item.negativeFeedback = 1
      }
      delete item.id
      result.push(item);
    }
    return result
  }, [])


  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rowsWithCountedFeedback));

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
