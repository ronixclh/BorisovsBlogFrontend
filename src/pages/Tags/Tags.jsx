import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../redux/slices/posts'

const Tags = () => {
  const dispatch = useDispatch()
  const { posts } = useSelector((state) => state.posts)
  const { tag } = useParams()
  console.log(posts)

  React.useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  return (
    <div>
      {tag} {posts.items}
    </div>
  )
}

export default Tags
