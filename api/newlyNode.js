import { myAxios } from '../utils/myAxios'
// 查询所属机构列表
export function findMechanismName(params) {
  return myAxios({
    url: '/marketing/findMechanismName',
    method: 'post',
    data: params
  })
}
// 服务项数据
export function findCarwashTypesInfos(params) {
  return myAxios({
    url: '/marketing/findCarwashTypesInfos',
    method: 'post',
    data: params
  })
}
// 新增提交
export function saveDot(params) {
  return myAxios({
    url: '/marketing/saveDot',
    method: 'post',
    data: params
  })
}
// 以下是编辑
export function getDotById(params) {
  return myAxios({
    url: '/marketing/getDotById',
    method: 'post',
    data: params
  })
}
// 编辑提交
export function updateDot(params) {
  return myAxios({
    url: '/marketing/updateDot',
    method: 'post',
    data: params
  })
}