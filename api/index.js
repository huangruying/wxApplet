import { myAxios } from '../utils/myAxios'
// 首页查询网点列表
export function findDotInfos(params) {
  return myAxios({
    url: '/marketing/findDotInfos',
    method: 'post',
    data: params
  })
}
// 省数据
export function findYuyueProvinces(params) {
  return myAxios({
    url: '/marketing/findYuyueProvinces',
    method: 'get',
    data: params
  })
}
// 市数据
export function findYuyueCityByProvinceid(params) {
  return myAxios({
    url: '/marketing/findYuyueCityByProvinceid',
    method: 'get',
    data: params
  })
}
// 区数据
export function findYuyueAreasByCityid(params) {
  return myAxios({
    url: '/marketing/findYuyueAreasByCityid',
    method: 'get',
    data: params
  })
}
// 服务项数据
export function getCarwashInfo(params) {
  return myAxios({
    url: '/marketing/getCarwashInfo',
    method: 'post',
    data: params
  })
}