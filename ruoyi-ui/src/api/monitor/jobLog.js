import request from '@/utils/request'

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url: '/monitor/jobLog/list',
    param: query
  })
}

// 删除调度认证
export const delJobLog = () => {
  return request({
    url: '/monitor/jobLog/clean',
    method: 'delete'
  })
}

// 清空调度日志
export const exportJobLog = (query) => {
  return request({
    url: '/monitor/jobLog/export',
    params: query
  })
}

