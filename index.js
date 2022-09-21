const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const {fetchAllJobs} = require('./functions/fetchAllJobs')

const jobTitle = 'Graduate Developer'
const location = 'Brisbane'
const searchTerm = jobTitle.toLowerCase().split(' ').join('-')
const filters = ['Graduate', 'Junior']


const app = async () => {

  // const allJobs = await fetchAllJobs(searchTerm, location)
  const allJobs = require('./jobs.json')


  // Filter jobs
  const jobFilter = (allJobs, filters) => {
    return allJobs.filter(job => {
      return filters.some(filter => job.title.toLowerCase().includes(filter.toLowerCase())) 
    })
  }

  const filteredJobs = jobFilter(allJobs, filters)

  // Fetch descriptions
  const fetchDescriptions = async (filteredJobs) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const totalJobs = filteredJobs.length
    console.log(`${totalJobs} descriptions to scrape`);

    let counter = 0
    let data = []
    while (counter < totalJobs){
      let currentJob = filteredJobs[counter]
      await page.goto(currentJob.url)

      const description = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('._1v38w810')).map(x => x.textContent)
      })

      currentJob.description = description
      counter++ 
      console.log(`Added description to ${currentJob.title}, ${totalJobs - counter} to go.`)
    }
    await browser.close()
    console.log(filteredJobs);
  }

  fetchDescriptions(filteredJobs)

  // Find keywords

  // Display data

}

app()