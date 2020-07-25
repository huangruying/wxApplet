import { myAxios } from '../utils/myAxios'

// export function codoYzm(params) {
//   return myAxios({
//     url: '/businessApplets/codoYzm',
//     method: 'get',
//     data: params
//   })
// }
// 登录
export function marketingLogin(params) {
  return myAxios({
    url: '/marketing/login/marketingLogin',
    method: 'post',
    data: params
  })
}