const {fetchAllJobs} = require('./functions/fetchAllJobs')
const {fetchDescriptions} = require('./functions/fetchDescriptions')
const {jobFilter} = require('./functions/jobFilter')
const fs = require('fs/promises')

const jobTitle = 'graduate developer'
const location = 'Brisbane'
const searchTerm = jobTitle.toLowerCase().split(' ').join('-')
const titleFilters = ['junior', 'graduate']
const descriptionKeywords = ['react', 'javascript', 'MERN', 'figma', 'node', 'angular', 'vue', 'REST', 'typescript']


const app = async () => {
// Uncomment to use local files
  const filteredJobs = require('./filteredJobs.json')
  const allJobs = require('./jobs.json')

// Uncomment to run scraper
  // // Fetch jobs
  // const allJobs = await fetchAllJobs(searchTerm, location)
  
  // // Filter Jobs
  // const filteredJobs = jobFilter(allJobs, titleFilters)
  // console.log(`Filtered ${allJobs.length} jobs down to ${filteredJobs.length} using title filters "${titleFilters.join(', ')}"`);

  // // Fetch descriptions
  // await fetchDescriptions(filteredJobs)
  // console.log(filteredJobs);

  // Find jobs with keywords

  const jobsWithKeywords = filteredJobs.filter( job => {
    return descriptionKeywords.some(keyword => job.description[0].toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")))
  })

  descriptionKeywords.forEach( keyword => {
    jobsWithKeywords.forEach( job => {
      if (job.keywords === undefined) job.keywords = []
      const numberOfOccurrences = (job.description[0].toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || [])
      job.keywords.push({[keyword]: numberOfOccurrences.length})
    }) 
  })

  await fs.writeFile('jobsWithKeywords.json', JSON.stringify(jobsWithKeywords, null, 2))

  // Display data
  jobsWithKeywords.forEach(job => {
    console.log(`${job.title} has the following keyword matches:`);
    job.keywords.forEach(keyword => console.log(keyword))
    console.log(job.url);
  })

}

app()