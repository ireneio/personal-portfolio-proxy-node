import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

const config: AxiosRequestConfig = {
  // baseURL: process.env.NODE_APP_API_URL || '',
  timeout: Number(process.env.NODE_APP_TIMEOUT_LIMIT) || 15000,
  headers: {}
}

const axiosInstance: AxiosInstance = axios.create({
  ...config
})

export default axiosInstance
