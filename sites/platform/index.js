const express = require('express')
const path = require('path')
const mysql = require("mysql2/promise");
const config = require("platformsh-config").config();

const app = express();

app.use(express.json());

/* Handle 404 requests */
app.get('/*', (req, res) => {
  res.status(404).sendFile('/404.html', {
    root: path.join(__dirname, 'public'),
  })
})

app.listen(config.port, () => {
  console.info(`ExpressJS listening on ${config.port}.`)
})
