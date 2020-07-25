import { myAxios } from '../utils/myAxios'

export function editYyUser(params) {
  return myAxios({
    url: '/marketing/editYyUser',
    method: 'post',
    data: params
  })
}
export function marketingLogOut(params) {
  return myAxios({
    url: '/marketing/marketingLogOut',
    method: 'post',
    data: params
  })
}
