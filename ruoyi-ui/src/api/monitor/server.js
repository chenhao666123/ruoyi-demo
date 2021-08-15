import request from '@/utils/request'

// 查询服务器详情

export const getServer = () => {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}
