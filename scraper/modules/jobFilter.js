const jobFilter = (allJobs, titleFilters) => {
  uniqueJobs = Array.from(new Set(allJobs))

  return uniqueJobs.filter(job => {
    return titleFilters.some(filter => job.title.toLowerCase().includes(filter.toLowerCase())) 
  })
}

module.exports = {jobFilter}