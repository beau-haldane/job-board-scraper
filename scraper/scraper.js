const {fetchAllJobs} = require('./modules/fetchAllJobs')
const {fetchDescriptions} = require('./modules/fetchDescriptions')
const {jobFilter} = require('./modules/jobFilter')

// const fs = require('fs/promises')

const scraper = async ({jobTitle, jobLocation, jobFilters}) => {
  // const jobTitle = 'graduate developer'
  // const jobLocation = 'Brisbane'
  const jobFiltersSplit = jobFilters.split(',') || [ jobFilters ]
  const searchTerm = jobTitle.toLowerCase().split(' ').join('-')
  const descriptionKeywords = ['react', 'javascript', 'mongo', 'MERN', 'node', 'typescript']

  // Fetch jobs
  const allJobs = await fetchAllJobs(searchTerm, jobLocation)
  
  // Filter Jobs
  const filteredJobs = jobFilter(allJobs, jobFiltersSplit)
  console.log(`Filtered ${allJobs.length} jobs down to ${filteredJobs.length} using title filters "${jobFiltersSplit.join(', ')}"`);

  // Fetch descriptions
  jobsWithDescriptions = await fetchDescriptions(filteredJobs)
  console.log(jobsWithDescriptions);

  // Find jobs with keywords
  const jobsWithKeywords = jobsWithDescriptions.filter( job => {
    return descriptionKeywords.some(keyword => job.description[0].toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")))
  })

  descriptionKeywords.forEach( keyword => {
    jobsWithKeywords.forEach( job => {
      if (job.keywords === undefined) job.keywords = []
      const numberOfOccurrences = (job.description[0].toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || [])
      job.keywords.push({[keyword]: numberOfOccurrences.length})
    }) 
  })

  // // Display data
  // jobsWithKeywords.forEach(job => {
  //   console.log(`${job.title} has the following keyword matches:`);
  //   job.keywords.forEach(keyword => console.log(keyword))
  //   console.log(job.url);
  // })

  // console.log(jobsWithKeywords)
  return jobsWithKeywords
}

// scraper()

module.exports = {scraper}