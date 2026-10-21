import axios from 'axios'

const axiosInstance = axios.create({
  // json-server (civic-server folder) runs on port 3000
  // baseURL: 'https://your-civic-server.onrender.com/',
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 5000,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        console.log('Unauthorised access - redirect to login page')
      } else if (status === 404) {
        console.log('API not found')
      } else if (status === 500) {
        console.log('Something went wrong... try again later')
      }
    } else if (error.request) {
      console.log('No response from server - is json-server running?')
    } else {
      console.log('Error ' + error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
