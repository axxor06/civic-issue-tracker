import axiosInstance from './axiosInstance'

// every API call in the app goes through this one function
const apiServices = async (httpMethod, url, reqBody) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
  }
  // errors are handled by the interceptor and by the page that called this
  return await axiosInstance(reqConfig)
}

export default apiServices
