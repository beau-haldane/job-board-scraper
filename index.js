const puppeteer = require('puppeteer')
const fs = require('fs/promises')

const fetchAllJobs = async () => {
  const URL = 'https://www.seek.com.au/graduate-developer-jobs/in-All-Brisbane-QLD'
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(URL)

  const totalJobs = await page.evaluate(() => {
    return Number(Array.from(document.querySelectorAll(("#SearchSummary > h1 > span")))
      .map(x => x.textContent)[0])
  })
  const numberOfPages = Math.ceil(totalJobs / 22) + 1
  console.log(`${totalJobs} jobs, ${numberOfPages} pages of results`)

  let currentPage = 1
  let data = []
  while (currentPage <= numberOfPages) {
    let newResults = await page.evaluate(() => {
      let results =[]
      let jobListings = document.querySelectorAll('._1tmgvwc')
      jobListings.forEach( job => {
        results.push({
          'title': job.textContent,
          'url': job.href
        })
      })
      return results
    })

    data = data.concat(newResults)

    nextPage = currentPage + 1
    if (currentPage < numberOfPages) {
      await page.goto('https://www.seek.com.au/graduate-developer-jobs/in-All-Brisbane-QLD?page='+nextPage)
      await page.waitForSelector('._1tmgvwc')
    }
    console.log(`Page ${currentPage} scraped, ${newResults.length} jobs added`);
    currentPage++;
  }

  await fs.writeFile('jobs.json', JSON.stringify(data, null, 2))
  await browser.close()
  return data
}

fetchAllJobs()