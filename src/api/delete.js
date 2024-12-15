import request from '@/utils/request'
export const deleteInfo = (stuId) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  return request.post('/delete', stuId, { headers })
}
