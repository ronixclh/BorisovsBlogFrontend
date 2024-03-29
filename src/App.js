import Container from '@mui/material/Container'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Header } from './components'
import { Home, FullPost, Registration, AddPost, Login } from './pages'
import Tags from '../src/pages/Tags/Tags'
import { Routes, Route } from 'react-router-dom'
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth'

function App() {
  //pri pervom rendere proverjaem avtorizovani mi ili net
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  React.useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/tags/:tag" element={<Tags />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
