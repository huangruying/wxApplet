import { myAxios } from '../utils/myAxios'

export function findMonthlyListByUserId(params) {
  return myAxios({
    url: '/marketing/findMonthlyListByUserId',
    method: 'post',
    data: params
  })
}