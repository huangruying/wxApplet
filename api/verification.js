import { myAxios } from '../utils/myAxios'

export function findDotByUserId(params) {
  return myAxios({
    url: '/marketing/findDotByUserId2',
    method: 'post',
    data: params
  })
}
// 核销
export function codeWriteOff(params) {
  return myAxios({
    url: '/marketing/codeWriteOff',
    method: 'post',
    data: params
  })
}