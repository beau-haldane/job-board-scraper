const Job = ({description, title, url, id, keywords}) => {

  // console.log(keywords);
  return (
    <div>
      <li>
        <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
      </li>
      <div className="flex">
        {keywords.map(keyword => {
          return <p key={Object.keys(keyword)[0]}>
            {Object.keys(keyword)[0]} {Object.values(keyword)[0]}
          </p>
        })}
      </div>
    </div>
  )
}

export default Job