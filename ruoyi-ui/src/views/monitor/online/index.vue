<template>
  <div class="app-container">
    <ElForm :inline="true" :model="queryParams" label-width="68px" ref="queryForm">
      <ElFormItem label="登录地址" prop="ipAddress">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          size="small"
          placeholder="请输入登录地址"
      <ElFormItem label="用户名称" prop="userName">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入用户名称"
          size="small"
          v-model="queryParams.userName" />
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="handleQuery" icon="el-icon-search" size="mini" type="primary">搜索</ElButton>
        <ElButton @click="resetQuery" icon="el-icon-refresh" size="mini">重置</ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable
      :data="list.slice((pageNum-1) * pageSize,  pageNum * pageSize)"
      style="width: 100%;"
      v-loading="loading">
      <el-table-column align="center" label="序号" type="index">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="会话编号" prop="tokenId"/>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="登录名称" prop="userName"/>
      <ElTableColumn align="center" label="部门名称" prop="deptName"/>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="主机" prop="ipaddr"/>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="登录地点" prop="loginLocation"/>
      <ElTableColumn align="center" label="浏览器" prop="browser"/>
      <ElTableColumn align="center" label="操作系统" prop="os"/>
      <ElTableColumn align="center" label="登录时间" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <ElButton
            @click="handleForceLogout(scope.row)"
            icon="el-icon-delete"
            size="mini"
            type="text"
            v-has-permission="['monitor:online:forceLogout']">
            强退
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <Pagination :limit="pageSize" :page.sync="pageNum" :total="total" v-show="total>0" />
  </div>
</template>

<script>
import { forceLogout, list } from '@/api/monitor/online'
import {resetForm} from "@/utils/ruoyi";
export default {
  name: "Online",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      queryParams: {
        ipAddress: undefined,
        userName: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      list(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    /** 搜索按钮列表 */
    handleQuery() {
      this.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 强退按钮操作 */
    handleForceLogout(row) {
      this.$confirm('是否确认强退名称为"' + row.userName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return forceLogout(row.tokenId);
      }).then(() => {
        this.getList();
        this.msgSuccess("强退成功");
      }).catch(() => {});
    }
  }
}
</script>

<style scoped>

</style>
