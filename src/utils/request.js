import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    platform: 'H5',
    'Content-Type': 'multipart/form - data',
  },
})

export default request
