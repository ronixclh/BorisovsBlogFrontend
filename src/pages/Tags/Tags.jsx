import React from 'react'
import { useParams } from 'react-router-dom'

const Tags = () => {
  const { tag } = useParams()
  return <div>{tag}</div>
}

export default Tags
