const express = require('express')
const {scraper} = require('../scraper/scraper')
const app = express()
const fs = require('fs')

app.get('/api', (req, res) => {
  var jobList = JSON.parse(fs.readFileSync('../scraper/jobsWithKeywords.json', 'utf8'))
  res.json({jobList})
})

app.get('/scrape', async (req, res) => {
  console.log(req.query.jobTitle);
  let jobTitle = req.query.jobTitle
  let jobLocation = req.query.jobLocation
  let jobFilters = req.query.jobFilters
  let newJobList = await scraper({jobTitle, jobLocation, jobFilters})
  res.json({newJobList})
})

app.listen(5001, () => {console.log('Server started on port 5001');})