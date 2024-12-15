import request from '@/utils/request'
export const query = (username, password) => {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  return request.post('/post/login', formData)
}
