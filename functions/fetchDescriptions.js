const puppeteer = require('puppeteer')
const fs = require('fs/promises')

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
  await fs.writeFile('filteredJobs.json', JSON.stringify(filteredJobs, null, 2))
  await browser.close()
}

module.exports = {fetchDescriptions}