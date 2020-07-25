import { myAxios } from '../utils/myAxios'

export function findDotByUserId(params) {
  return myAxios({
    url: '/marketing/findDotByUserId2',
    method: 'post',
    data: params
  })
}
// 列表
export function findServiceOrder(params) {
  return myAxios({
    url: '/marketing/findServiceOrder',
    method: 'post',
    data: params
  })
}