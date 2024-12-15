import request from '@/utils/request'
export const submit = (form) => {
  return request.post('/submit', form)
}
