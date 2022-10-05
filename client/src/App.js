import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Job from './components/Job'

function App() {
  const [jobTitle, setJobTitle] = useState(null)
  const [jobLocation, setJobLocation] = useState(null)
  const [jobFilters, setJobFilters] = useState(null)
  const [filteredJobs, setfilteredJobs] = useState([])
  const [scraping, setScraping] = useState(false)

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => {
        sortJobs(data.jobList)
        setfilteredJobs(data.jobList)
      })
  }, [])

  const getNewJobs = async () => {
    setScraping(true)
    await fetch('/scrape?' + new URLSearchParams({
      jobTitle: jobTitle,
      jobLocation: jobLocation,
      jobFilters: jobFilters
    }))
    .then(res => res.json())
    .then(data => {
      // console.log(data.newJobList)
      sortJobs(data.newJobList)
      setfilteredJobs(data.newJobList)
      setScraping(false)
    })
  }

  const sortJobs = (jobs) => {
    jobs.sort(( a, b ) => {
      return b.keywords.reduce((acc, obj) => {
        return (acc + Number(Object.values(obj)[0]))
      }, 0)
      - 
      a.keywords.reduce((acc, obj) => {
        return (acc + Number(Object.values(obj)[0]))
      }, 0)
    })
  }

  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value)
  }

  const handleJobLocationChange = (event) => {
    setJobLocation(event.target.value)
  }

  const handleJobFiltersChange = (event) => {
    setJobFilters(event.target.value)
  }

  return (
    <div>
      <input 
        placeholder="Job Title..."
        onChange={handleJobTitleChange}
      />
      <input
        placeholder="Location..."
        onChange={handleJobLocationChange}
      />
      <input
        placeholder="Job Title Must Include..."
        onChange={handleJobFiltersChange}
      />
      <button onClick={() => getNewJobs()}>Run New Search</button>
      {scraping ? 
        <p>Scraping jobs - this may take a while</p> :
        <ul>
          {filteredJobs.map(job =>
            <Job
              key = {job.id}
              description = {job.description}
              title = {job.title}
              url = {job.url}
              keywords = {job.keywords}
            />
          )}
        </ul>
      }
    </div>
  )
}

export default App