import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../redux/slices/posts'
import Grid from '@mui/material/Grid'
import { Post } from '../../components/Post'

const Tags = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.data)
  const { posts } = useSelector((state) => state.posts)
  const { tag } = useParams()

  const isPostsLoading = posts.status === 'loading'

  const filteredPosts = posts.items.filter((obj) => obj.tags.includes(tag))

  React.useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : filteredPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post isLoading={true} key={index} />
            ) : (
              <Post
                _id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                    : ''
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id} //prava na redaktirovanije statej
              />
            )
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default Tags
