import axios from 'axios'

const instance = axios.create({
  baseUrl: 'http://localhost:4444',
})

//middleware na token
instance.interceptors.request.use((config) => {
  //pri kazhdom zaprose proveraj estj li v local storage chto-to ili net i vwivaj v etu infu, eto dlja togo chtobi posle perezagruzki stranici ostavatsja zaloginennim
  //kazdij raz kogda delaetsja zapros v network/fetch/posts/headers vwivaetsja Authorization
  config.headers.Authorization = window.localStorage.getItem('token')

  return config
})

export default instance
