const puppeteer = require('puppeteer')


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
    currentJob.id = counter
    counter++ 
    console.log(`Added description to ${currentJob.title}, ${totalJobs - counter} to go.`)
  }

  await browser.close()

  return filteredJobs
}

module.exports = {fetchDescriptions}