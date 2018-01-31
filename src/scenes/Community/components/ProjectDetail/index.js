import React from 'react'

import DisplayMap from './components/DisplayMap'
import ProjectDetails from './components/ProjectDetails'
import ButtonJoin from './components/ButtonJoin'
import ParticipantList from './components/ParticipantList'

const ProjectDetail = (props) => {
  console.log(props)
  const project = props.projects[props.match.params.id]

  return (
    <div>
      <h2>{project.name}</h2>
      <div>
        <DisplayMap location={project.coordinates} />
        {/* TODO the hourly award needs to be calculated */}
        <ProjectDetails startTime={project.start} duration={project.duration} hourlyAward={15} />
      </div>
      <ButtonJoin />
      <ParticipantList participants={project.participants} users={props.users} />
    </div>
  )
}

export default ProjectDetail
