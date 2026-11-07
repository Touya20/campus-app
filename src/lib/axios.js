import axios from 'axios'
let accessToken = null
let timeZone = ''
export class ApiError extends Error {
  constructor(message, status, requestId) { super(message); this.name = 'ApiError'; this.status = status; this.requestId = requestId }
}
export const setAccessToken = (value) => { accessToken = value }
export const getCampusTimeZone = () => timeZone || 'Asia/Manila'
const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1').replace(/\/+$/, '')
const client = axios.create({ baseURL, timeout: 12000, headers: { Accept: 'application/json' } })
client.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = 'Bearer ' + accessToken
  else delete config.headers.Authorization
  return config
})
client.interceptors.response.use((response) => response, (error) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== 'undefined') window.dispatchEvent(new Event('campus:unauthorized'))
  return Promise.reject(error)
})
export async function request(path, init = {}) {
  const headers = {}
  new Headers(init.headers).forEach((value, key) => { headers[key] = value })
  try {
    const response = await client.request({ url: path, method: init.method || 'GET', headers, data: init.body ? JSON.parse(String(init.body)) : undefined, signal: init.signal || undefined })
    const body = response.data
    const envelope = body && typeof body === 'object' ? body : {}
    if (envelope.meta && typeof envelope.meta === 'object' && typeof envelope.meta.timeZone === 'string') timeZone = envelope.meta.timeZone
    if (envelope.success === false) throw new ApiError(typeof envelope.message === 'string' ? envelope.message : 'Campus could not complete that request.', response.status, response.headers['x-request-id'])
    return envelope.success === true && 'data' in envelope ? envelope.data : body
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (axios.isAxiosError(error)) {
      const body = error.response?.data
      const envelope = body && typeof body === 'object' ? body : {}
      throw new ApiError(typeof envelope.message === 'string' ? envelope.message : error.response ? 'Campus could not complete that request.' : 'Campus services could not be reached. Check that the API is running.', error.response?.status || 0, error.response?.headers['x-request-id'])
    }
    throw new ApiError('Campus services could not be reached. Check that the API is running.', 0)
  }
}

