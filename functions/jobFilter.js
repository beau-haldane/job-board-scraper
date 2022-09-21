const jobFilter = (allJobs, titleFilters) => {
  return allJobs.filter(job => {
    return titleFilters.some(filter => job.title.toLowerCase().includes(filter.toLowerCase())) 
  })
}

module.exports = {jobFilter}