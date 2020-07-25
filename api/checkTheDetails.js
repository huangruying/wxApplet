import { myAxios } from '../utils/myAxios'
// 列表数据
export function findServiceOrderByMonth(params) {
  return myAxios({
    url: '/marketing/findServiceOrderByMonth',
    method: 'post',
    data: params
  })
}
// 确认对账
// export function confirmReconciliation(params) {
//   return myAxios({
//     url: '/marketing/confirmReconciliation',
//     method: 'post',
//     data: params
//   })
// }