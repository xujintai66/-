import request from '@/utils/request'
export const isCheck = (stuId) => {
  return request.get('/ischeck', { params: { stuId: stuId } })
}
