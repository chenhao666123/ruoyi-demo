<template>
  <div class="app-container">
    <ElForm :inline="true" :model="queryParams"   label-width="68px" ref="queryForm" v-show="showSearch">
      <ElFormItem label="任务名称" prop="jobName">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入任务名称"
          size="small"
          v-model="queryParams.jobName" />
      </ElFormItem>
      <ElFormItem label="任务组名" prop="jobGroup">
        <ElSelect clearable placeholder="请选择任务组名" size="small" v-model="queryParams.jobGroup">
          <ElOption
            v-for="dict in jobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="handleQuery" icon="el-icon-search" type="primary">搜索</ElButton>
        <ElButton @click="handleQuery" icon="el-icon-refresh" size="mini">重置</ElButton>
      </ElFormItem>
    </ElForm>

     <ElRow :gutter="10" class="mb8">
       <ElCol :span="1.5">
         <ElButton
           @click="handleAdd"
           icon="el-icon-plus"
           plain
           size="mini"
           type="primary"
           v-has-permission="['monitor:job:add']">
           新增
         </ElButton>
       </ElCol>
       <ElCol :span="1.5">
         <ElButton
          :disabled="single"
          @click="handleUpdate"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          v-has-permission="['monitor:job:edit']"
         >
           修改
         </ElButton>
       </ElCol>
       <ElCol :span="1.5">
         <ElButton
           :disabled="multiple"
           @click="handleDelete"
           icon="el-icon-delete"
           plain
           size="mini"
           type="danger"
           v-has-permission="['monitor:job:remove']">
           删除
         </ElButton>
       </ElCol>
       <ElCol :span="1.5">
         <ElButton
           :loading="exportLoading"
           @click="handleExport"
           icon="el-icon-download"
           size="mini"
           type="warning"
           v-has-permission="['monitor:job:export']">
           导出
         </ElButton>
       </ElCol>
       <ElCol :span="1.5">
         <ElButton
           @click="handleJobLog"
           icon="el-icon-s-operation"
           plain
           size="mini"
           type="info"
           v-has-permission="['monitor:job:query']">
           日志
         </ElButton>
       </ElCol>
     </ElRow>

    <ElTable :data="jobList" @selection-change="handleSelectionChange" v-loading="loading">
      <ElTableColumn align="center" type="selection" width="55"/>
      <ElTableColumn align="center" label="任务编号" prop="jobId"/>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="任务名称" prop="jobName"/>
      <ElTableColumn :formatter="jobGroupFormat" align="center" label="任务组名" prop="jobGroup"/>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="调用目标字符串" prop="invokeTarget"/>
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="cron执行表达式" prop="cronExpression"/>
      <ElTableColumn align="center" label="状态">
        <template slot-scope="scope">
          <ElSwitch
            @change="handleStatusChange(scope.row)"
            active-value="0"
            inactive-value="1"
            v-model="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <ElButton
            @click="handleUpdate(scope.row)"
            icon="el-icon-edit"
            size="mini"
            type="text"
            v-has-permission="['monitor:job:edit']">
            修改
          </ElButton>
          <el-button
            @click="handleDelete(scope.row)"
            icon="el-icon-delete"
            plain
            size="mini"
            type="danger"
            v-hasPermi="['monitor:job:remove']"
          >删除
          </el-button>
          <ElDropdown
            @command="(command) => handleCommand(command, scope.row)"
            size="mini" v-has-permission="['monitor:job:changeStatus']">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <ElDropdownMenu slot="dropdown">
              <ElDropdownItem
                command="handleRun"
                icon="el-icon-cart-right"
                v-has-permission="['monitor:job:changeStatus']">
                执行一次
              </ElDropdownItem>
              <ElDropdownItem
                command="handleView"
                icon="el-icon-view"
                v-has-permission="['monitor:job:query']">
                任务详情
              </ElDropdownItem>
              <ElDropdownItem
                command="handleJobLog"
                icon="el-icon-s-operation"
                v-has-permission="['monitor:job:query']">
                调度日志
              </ElDropdownItem>
            </ElDropdownMenu>
          </ElDropdown>
        </template>
      </ElTableColumn>
    </ElTable>

    <pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
      v-show="total>0"/>

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="700px">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input placeholder="请输入任务名称" v-model="form.jobName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select placeholder="请选择" v-model="form.jobGroup">
                <el-option
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                  v-for="dict in jobGroupOptions"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('ry')
                    <br/>Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                    <br/>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input placeholder="请输入调用目标字符串" v-model="form.invokeTarget"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input placeholder="请输入cron执行表达式" v-model="form.cronExpression"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group size="small" v-model="form.concurrent">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="错误策略" prop="misfirePolicy">
              <el-radio-group size="small" v-model="form.misfirePolicy">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  v-for="dict in statusOptions"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="submitForm" type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 任务日志详细 -->
    <ElDialog :visible.sync="openView" append-to-body title="任务详细" width="700px">
      <ElForm :model="form" label-width="120px" ref="form" size="mini">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="任务编号：">{{ form.jobId }}</ElFormItem>
            <ElFormItem label="任务名称：">{{ form.jobName }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="任务分组：">{{ jobGroupFormat(form) }}</ElFormItem>
            <ElFormItem label="创建时间：">{{ form.createTime }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="cron表达式：">{{ form.cronExpression }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="下次执行时间：">{{ parseTime(form.nextValidTime) }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="调用目标方法：">{{ form.invokeTarget }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="任务状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="是否并发：">
              <div v-if="form.concurrent === 0">允许</div>
              <div v-else-if="form.concurrent === 1">禁止</div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="执行策略：">
              <div v-if="form.misfirePolicy === 0">默认策略</div>
              <div v-else-if="form.misfirePolicy === 1">立即执行</div>
              <div v-else-if="form.misfirePolicy === 2">执行一次</div>
              <div v-else-if="form.misfirePolicy === 3">放弃执行</div>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
      <div class="dialog-footer" slot="footer">
        <ElButton @click="openView = false">关 闭</ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<script>
import { addJob, changeJobStatus, delJob, exportJob, getJob,  listJob, runJob, updateJob } from '@/api/monitor/job'
export default {
  name: "Job",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 任务组名字典
      jobGroupOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        invokeTarget: [
          { required: true, message: '调用目标字符串不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: 'cron执行表达式不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_job_group").then(response => {
      this.jobGroupOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleRun":
          this.handleRun(row);
          break;
        case "handleView":
          this.handleView(row);
          break;
        case "handleJobLog":
          this.handleJobLog(row);
          break;
        default:
          break;
      }
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.jobName + '"任务吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeJobStatus(row.jobId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.$confirm('确认要立即执行一次"' + row.jobName + '"任务吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return runJob(row.jobId, row.jobGroup);
      }).then(() => {
        this.msgSuccess("执行成功");
      }).catch(() => {
      });
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.jobId).then(response => {
        this.form = response.data;
        this.openView = true;
      });
    },
    /** 任务日志列表查询 */
    handleJobLog(row) {
      const jobId = row.jobId || 0;
      this.$router.push({path: '/monitor/job-log/index', query: {jobId: jobId}})
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.jobId || this.ids;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.jobId != undefined) {
            updateJob(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJob(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobIds = row.jobId || this.ids;
      this.$confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delJob(jobIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有定时任务数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportJob(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>

</style>
