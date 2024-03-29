import React from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setLoading] = React.useState(false)
  const [text, setText] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const inputFileRef = React.useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData
      )

      setImageUrl(data.url)
    } catch (err) {
      console.log.warn(err)
      alert('Ошибка загрузки файла')
    }
  }

  const onClickRemoveImage = () => {
    setImageUrl('')
  }

  const onChange = React.useCallback((value) => {
    setText(value)
  }, [])

  const onSubmit = async () => {
    try {
      setLoading(true)

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      }

      const { data } = isEditing
        ? await axios.patch(
            `${process.env.REACT_APP_API_URL}/posts/${id}`,
            fields
          ) //awaitom peredajetsja zapros na redaktirovanije posta
        : await axios.post(`${process.env.REACT_APP_API_URL}/posts`, fields) //awaitom peredajetsja zapros na publikaciju posta

      const _id = isEditing ? id : data._id

      navigate(`${process.env.REACT_APP_API_URL}/posts/${_id}`)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при создании статьи')
    }
  }

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title)
          setText(data.text)
          setImageUrl(data.imageUrl)
          setTags(data.tags.join(','))
        })
        .catch((err) => {
          console.warn(err)
          alert('Ошибка при получении статьи')
        })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  )

  if (window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  } //perekidivanije na glavnuju esli ne vtorizovan, mozhno proveritj v rezhime incognito

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => {
          inputFileRef.current.click()
        }}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
        //zagruzka fajlov
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      {/*redaktor vzjat iz biblioteki*/}
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  )
}
