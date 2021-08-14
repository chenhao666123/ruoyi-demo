import request from '@/utils/request'

export function getCache() {
  return request({
    url: '/monitor/cache',
    method: 'get'
  })
}
