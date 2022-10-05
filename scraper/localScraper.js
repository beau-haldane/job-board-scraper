const {fetchAllJobs} = require('./modules/fetchAllJobs')
const {fetchDescriptions} = require('./modules/fetchDescriptions')
const {jobFilter} = require('./modules/jobFilter')

const fs = require('fs')

const scraper = async () => {
  const jobTitle = 'graduate developer'
  const jobLocation = 'Brisbane'
  const jobFilters = ['junior', 'graduate']
  const searchTerm = jobTitle.toLowerCase().split(' ').join('-')
  const descriptionKeywords = ['react', 'javascript', 'MERN', 'figma', 'node', 'angular', 'vue', 'REST', 'typescript']

  // Fetch jobs
  const allJobs = await fetchAllJobs(searchTerm, jobLocation)
  
  // Filter Jobs
  const filteredJobs = jobFilter(allJobs, jobFilters)
  console.log(`Filtered ${allJobs.length} jobs down to ${filteredJobs.length} using title filters "${jobFilters.join(', ')}"`);

  // Fetch descriptions
  jobsWithDescriptions = await fetchDescriptions(filteredJobs)

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
  let data = JSON.stringify(jobsWithKeywords, null, 2);

  fs.writeFile('jobsWithKeywords.json', data, (err) => {
      if (err) throw err;
      console.log('Data written to file');
  });
}

scraper()

module.exports = {scraper}