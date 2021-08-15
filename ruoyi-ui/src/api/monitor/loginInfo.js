import request from '@/utils/request'

// 查询登录日志列表
export const list = (query) => {
  return request({
    url: '/monitor/loginInfo/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export const delLoginInfo = infoId => {
  return request({
    url: '/monitor/loginInfo/' + infoId,
    method: 'delete'
  })
}

// 清空登录日志
export const cleanLoginInfo = () => {
  return request({
    url: '/monitor/loginInfo/clean',
    method: 'delete'
  })
}

// 导入登录日志
export const exportLoginInfo = (query) => {
  return request({
    url: '/monitor/loginInfo/export',
    params: query
  })
}
