import request from '@/utils/request'
export const ReturnIsCheck = () => {
  return request.get('/return/ischeck')
}
