<template>
  <div class="app-container">
    <ElForm :inline="true" :model="queryParams" label-width="68px" ref="queryForm" v-show="showSearch">
      <ElFormItem label="登录地址" prop="ipAddress">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入登录地址"
          size="small"
          style="width: 240px;"
          v-model="queryParams.ipAddress" />
      </ElFormItem>
      <ElFormItem label="用户名称" prop="userName">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入用户名称"
          style="width: 240px;"
          v-model="queryParams.userName" />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect
          clearable
          placeholder="登录状态"
          size="small"
          style="width: 240px;"
          v-model="queryParams.status">
          <el-option
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            v-for="dict in statusOptions"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="登录时间">
        <ElDatePicker
          end-placeholder="结束日期"
          range-separator="-"
          size="small"
          type="datarange"
          v-model="dateRange"
          value-format="yyyy-MM-dd" />
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="handleQuery" icon="el-icon-search" size="mini">搜索</ElButton>
        <ElButton @click="resetQuery" icon="el-icon-refresh" size="mini">重置</ElButton>
      </ElFormItem>
    </ElForm>

    <ElRow :gutter="10" class="mb8">
      <ElCol :span="1.5">
        <ElButton
          :disabled="multiple"
          @click="handleDelete"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          v-has-permission="['monitor:loginInfo:remove']">
          删除
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          @click="handleDelete"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          v-has-permission="['monitor:loginInfo:remove']">
          清空
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          :loading="exportLoading"
          @click="handleExport"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          v-has-permission="['monitor:loginInfo:export']">
          导出
        </ElButton>
      </ElCol>
      <RightToolbar :show-search.sync="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable
      :data="list" :default-sort="defaultSort"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"  ref="tables" v-loading="loading">
      <ElTableColumn align="center" type="selection" width="55" />
      <ElTableColumn align="center" label="访问编号" prop="infoId" />
      <ElTableColumn :show-overflow-tooltip="true" :sort-orders="['descending', 'ascending']" align="center"
                     label="用户名称" prop="userName" />
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="登录地址" prop="ipAddress" width="130" />
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="登录地点" prop="loginLocation"  />
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="浏览器" prop="browser" />
      <ElTableColumn  align="center" label="操作系统" prop="os" />
      <ElTableColumn  :formatter="statusFormat" align="center" label="登录状态" prop="status" />
      <ElTableColumn  align="center" label="操作信息" prop="msg" />
      <ElTableColumn :sort-orders="['descending', 'ascending']" align="center" label="登录日期" prop="loginTime"
                       sortable="custom" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </ElTableColumn>
    </ElTable>

    <pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
      v-show="total>0"/>
  </div>
</template>

<script>
import { cleanLoginInfo, delLoginInfo, exportLoginInfo, list } from '@/api/monitor/loginInfo'
export default {
  name: "LoginInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: 'loginTime', order: 'descending' },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ipAddress: undefined,
        userName: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      list(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.list = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    /** 登录状态字典翻译 */
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.infoId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop
      this.queryParams.isAsc = column.order
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delLoginInfo(infoIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有登录日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return cleanLoginInfo();
      }).then(() => {
        this.getList();I
        this.msgSuccess("清空成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有操作日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportLoginInfo(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
}
</script>

<style scoped>

</style>
