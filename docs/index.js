const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())

/* Listen for feedback posts */
app.post("/feedback", (req,res) => {

  console.log(req.body)

  res.status(200).send("Feedback recorded");

})

/* Handle 404 requests */
app.get('/*', (req, res) => {
  res.status(404).sendFile('/404.html', {
    root: path.join(__dirname, 'public'),
  })
})

app.listen(8888, () => {
  console.info(`ExpressJS listening on 8888.`)
})