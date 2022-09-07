import * as axios from "axios"
import config from "~/config"

const api = config.apiCenter;
console.log(api)
const PREFIX = ""
const SERVER_URL = `${api.host}${api.port ? ':' + api.port : ''}${PREFIX}`

let request = axios.create({
  baseURL: SERVER_URL
})


request.interceptors.request.use(
  config => {
    if (config.headers == undefined) {
      config.headers = {}
    }
    config.headers.Authorization = window.sessionStorage.getItem('TOKEN')
    config.headers.userId = window.sessionStorage.getItem('userId')
    config.headers.enterpriseManagerId = window.sessionStorage.getItem('enterpriseManagerId')
    config.headers.lang = window.sessionStorage.getItem('language') || 'en_US'
    return config
  },
  error => {
    // return Promise.reject(error)
    return error
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // return Promise.reject(error)
    if (error.response && error.response.data) {
      return error.response.data
    } else {
      return error
    }
  }
)

export {
  axios,
  SERVER_URL
}

export default request
