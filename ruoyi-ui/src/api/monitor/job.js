import request from '@/utils/request'

// 查询定时任务调度列表
export const listJob = query => {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详细
export const getJob = jobId => {
  return request({
    url: '/monitor/job/' + jobId,
    method: 'get'
  })
}

// 新增定时任务调度
export const addJob = data => {
  return request({
    url: '/monitor/job',
    method: 'post',
    data
  })
}

// 修改定时任务调度
export const updateJob = data => {
  return request({
    url: '/monitor/job',
    method: 'delete'
  })
}
// 删除定时任务调度
export const delJob = jobId => {
  return request({
    url: '/monitor/job' + jobId,
    method: 'delete'
  })
}

// 导出定时任务调度
export const exportJob = query => {
  return request({
    url: '/monitor/job/export',
    method: 'get',
    params: query
  })
}

// 任务状态修改
export const  changeJobStatus = (jobId, status) => {
  const data = {
    jobId, status
  }
  return request({
    url: '/monitor/job/changeStatus',
    method: 'put',
    data
  })
}

// 定时任务立即执行一次
export const runJob = (jobId, jobGroup) => {
  const data = {
    jobId, jobGroup
  }
  return request({
    url: '/monitor/job/run',
    data
  })
}


