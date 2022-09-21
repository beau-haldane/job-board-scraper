const puppeteer = require('puppeteer')
const {fetchAllJobs} = require('./functions/fetchAllJobs')
const {fetchDescriptions} = require('./functions/fetchDescriptions')
const {jobFilter} = require('./functions/jobFilter')

const jobTitle = 'senior Product Manager'
const location = 'Brisbane'
const searchTerm = jobTitle.toLowerCase().split(' ').join('-')
const titleFilters = ['product', 'senior']
const descriptionKeywords = ['user-facing', 'agile']


const app = async () => {
  // Fetch jobs
  const allJobs = await fetchAllJobs(searchTerm, location)
  // const allJobs = require('./jobs.json')

  // Filter Jobs
  const filteredJobs = jobFilter(allJobs, titleFilters)
  console.log(`Filtered ${allJobs.length} jobs down to ${filteredJobs.length} using title filters "${titleFilters.join(', ')}"`);

  // Fetch descriptions
  await fetchDescriptions(filteredJobs)
  console.log(filteredJobs);

  // Find keywords
  filteredJobs.filter( job => {
    if (descriptionKeywords.some(keyword => job.description[0].toLowerCase().includes(keyword.toLowerCase()))){
      console.log(`${job.title} includes a keyword`);
      console.log(job.url);
    }
  })

  // Display data

}

app()