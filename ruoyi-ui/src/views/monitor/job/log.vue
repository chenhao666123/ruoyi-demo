<template>
  <div class="app-container">
    <ElForm
      :model="queryParams" ref="queryForm"
      :inline="true" v-show="showSearch" label-width="68px">
      <ElFormItem label="任务名称" prop="jobName">
        <ElInput
          v-model="queryParams.jobName"
          placeholder="请输入任务内容"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </ElFormItem>
      <ElFormItem label="任务组名" prop="jobGroup">
        <ElSelect
          v-model="queryParams.jobGroup"
          placeholder="请选择任务组名"
          clearable
          size="small"
          style="width: 240px">
          <ElOption
            v-for="dict in jobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="执行时间">
        <ElDatePicker
          v-model="dateRange"
          size="small"
          style="width: 240px;"
          value-format="yyyy-MM-dd"
          type="dataRange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</ElButton>
        <ElButton icon="el-icon-refresh" size="mini" @click="resetQuery">搜索</ElButton>
      </ElFormItem>
    </ElForm>

    <ElRow :gutter="10" class="mb8">
      <ElCol :span="1.5">
        <ElButton
          type="button"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          :disabled="multiple">
          删除
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          type="danger"
          plain
          icon="el-icon-delete"
          @click="handleClean"
          v-has-permission="['monitor:job:remove']"
        >
          清空
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          type="warning"
          plain
          icon="el-icon-close"
          size="mini">
          关闭
        </ElButton>
      </ElCol>
      <RightToolbar :show-search.sync="showSearch" @querySearch="getList" />
    </ElRow>

    <ElTable v-loading="loading" :data="jobLogList" @selection-change="handleSelectionChange">
      <ElTableColumn type="selection" width="55" align="center"/>
      <ElTableColumn label="日志编号" width="88" align="center" prop="jobLogId"/>
      <ElTableColumn label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true"/>
      <ElTableColumn label="任务组名" align="center" prop="jobGroup" :formatter="jobGroupFormat" :show-overflow-tooltip="true"/>
      <ElTableColumn label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
      <ElTableColumn label="日志信息" align="center" prop="jobMessage" :show-overflow-tooltip="true" />
      <ElTableColumn label="执行状态" align="center" prop="status" :formatter="statusFormat" />
      <ElTableColumn label="执行时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
           <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <ElButton
            size="mini"
            type="text"
            icon="el-icon-vue"
            @click="handleView"
            v-has-permission="['monitor:job:query']"
          >
            详情
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!--调度日志详情-->
    <ElDialog title="调度日志详情" :visible.sync="open" width="700px" append-to-body>
      <ElForm ref="form" :model="form" label-width="100px" size="mini">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="日志序号: ">{{ form.jobLogId }}</ElFormItem>
            <ElFormItem label="任务名称: ">{{ form.jobName }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="任务分组:">{{ form.jobGroup }}</ElFormItem>
            <ElFormItem label="执行时间:">{{ form.createTime }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="调用方法: ">{{ form.invokeTarget }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="日志信息:">{{ form.jobMessage }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="执行状态: ">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="异常信息: " v-if="form.status === 1">{{ form.exceptionInfo }}</ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
      <div class="dialog-footer" @click="open=false">关 闭</div>
    </ElDialog>
  </div>
</template>

<script>
import { getJob } from '@/api/monitor/job'
import { listJobLog, delJobLog, exportJobLog, cleanJobLog } from '@/api/monitor/jobLog'
import {titleCase} from "@/utils";
import RightToolbar from "@/components/RightToolbar/index";

export default {
  name: "JobLog",
  components: {RightToolbar},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条件
      total: 0,
      // 调度日志表格数据
      jobLogList: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 执行状态字典
      statusOptions: [],
      // 任务组名字典
      jobGroupOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      }
    }
  },
  created() {
    const jobId = this.$route.query.jobId
    if (jobId !== undefined && jobId !== 0) {
      getJob(jobId).then(res => {
        this.queryParams.jobName = res.data.jobName
        this.queryParams.jobGroup = res.data.jobGroup
        this.getList()
      })
    } else {
      this.getList()
    }
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_job_group").then(response => {
      this.jobGroupOptions = response.data;
    });
  },
  methods: {
    // 查询调度日志列表
    getList() {
      this.loading = true
      listJobLog(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.jobLogList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    // 执行状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.status)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dataRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobLogId)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds = this.ids
      this.$confirm('是否确认删除调度日志编号为"' + jobLogIds + '"的数据项', "警告", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { return delJobLog(jobLogIds) })
      .then(() => { this.getList(), this.msgSuccess('删除成功') })
      .catch((e) => {console.log(e)})
    },
    /**  清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有调度日志数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { return cleanobLog(jobLogIds) })
        .then(() => { this.getList(), this.msgSuccess('清空成功') })
        .catch((e) => {console.log(e)})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$confirm('是否确认导出所有调度日志数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportLoading = true, this.exportJobLog(queryParams)
      })
        .then(res => {
          this.download(res.msg), this.exportLoading = false
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

