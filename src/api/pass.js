import request from '@/utils/request'
export const pass = (stuId, isCheck, reason) => {
  let formData = new FormData()
  formData.append('stuId', stuId)
  formData.append('isCheck', isCheck)
  formData.append('reason', reason)
  return request.post('/pass', formData)
}
