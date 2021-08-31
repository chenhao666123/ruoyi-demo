<template>
  <div class="app-container">
    <ElForm :inline="true" :model="queryParams" label-width="68px" ref="queryForm" v-show="showSearch">
      <ElFormItem label="参数名称" prop="configName">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入参数名称"
          size="small"
          style="width: 240px;"
          v-model="queryParams.configName" />
      </ElFormItem>
      <ElFormItem label="参数键名" prop="configKey">
        <ElInput
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入参数键名"
          size="small"
          style="width: 240px"
          v-model="queryParams.configKey" />
      </ElFormItem>
      <ElFormItem label="系统内置" prop="configType">
        <ElSelect clearable placeholder="系统内置" size="small" v-model="queryParams.configType">
          <ElOption
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            v-for="dict in typeOptions"
          />
        </ElSelect>
    </ElFormItem>
      <ElFormItem label="创建时间">
        <ElDatePicker
          end-placeholder="结束日期"
          range-separator="-"
          size="small"
          start-placeholder="开始日期"
          style="width: 240px"
          type="daterange"
          v-model="dataRange"/>
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="handleQuery" icon="el-icon-search" size="mini" type="primary">搜索</ElButton>
        <ElButton @click="resetQuery" icon="el-icon-refresh" size="mini" type="primary">重置</ElButton>
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
          v-has-permission="['system:config:add']">
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
          v-has-permission="['system:config:edit']">
          编辑
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
          v-hasPermi="['system:config:remove']"
        >删除
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
          v-hasPermi="['system:config:export']">
          导出
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
          @click="handleRefreshCache"
          icon="el-icon-refresh"
          plain
          size="mini"
          type="danger"
          v-hasPermi="['system:config:remove']">
          刷新缓存
        </ElButton>
      </ElCol>
      <RightToolbar :show-search.sync="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable :data="configList" @selection-change="handleSelectionChange" v-loading="loading">
      <ElTableColumn align="center" type="selection" width="55" />
      <ElTableColumn align="center" label="参数主键" prop="configId" />
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="参数主键" prop="configName" />
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="参数键名" prop="configKey" />
      <ElTableColumn align="center" label="参数键值" prop="configValue" />
      <ElTableColumn :formatter="typeFormat" align="center" label="系统内置" prop="configType" />
      <ElTableColumn :show-overflow-tooltip="true" align="center" label="备注" prop="remark" />
      <ElTableColumn  align="center" label="创建时间" prop="createTime" width="180" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <ElButton
            @click="handleUpdate(scope.row)"
            icon="el-icon-edit"
            size="mini"
            type="text"
            v-hasPermi="['system:config:edit']">
            修改
          </ElButton>
          <ElButton
            :disabled="multiple"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete"
            plain
            size="mini"
            type="danger"
            v-hasPermi="['system:config:remove']">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <Pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
      v-show="total > 0" />

    <ElDialog :title="title" :visible.sync="open" append-to-body width="500px">
      <ElForm :model="form" :rules="rules" label-width="80px" ref="form">
        <ElFormItem label="参数名称" prop="configName">
          <ElInput placeholder="请输入参数名称" v-model="form.configName" />
        </ElFormItem>
        <ElFormItem label="参数键名" prop="configKey">
          <ElInput placeholder="请输入参数键名" v-model="form.configKey" />
        </ElFormItem>
        <ElFormItem label="参数键值" prop="configValue">
          <ElInput placeholder="请输入参数键值" v-model="form.configValue"/>
        </ElFormItem>
        <ElFormItem label="系统内置" prop="configType">
          <ElRadioButton v-model="form.configType">
            <ElRadio
              :key="dict.dictValue"
              :label="dict.dictValue"
              v-for="dict in typeOptions"
            >{{ dict.dictLabel }}</ElRadio>
          </ElRadioButton>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput placeholder="请输入内容" type="textarea" v-model="form.remark"/>
        </ElFormItem>
      </ElForm>
      <div class="dialog-footer" slot="footer">
        <ElButton @click="submitForm" type="primary">确 定</ElButton>
        <ElButton @click="cancel">取 消</ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<script>
import { addConfig, delConfig, exportConfig, getConfig, listConfig, refreshCache, updateConfig } from '@/api/system/config'
export default {
  name: "Config",
  data() {
    return {
      loading: true,
      exportLoading: false,
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      total: 0,
      // 参数表格数据
      configList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 日期范围
      dataRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configName: undefined,
        configKey: undefined,
        configType: undefined
      },
      //form param
      form: {},
      rules: {
        configName: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        configKey: [
          { required: true, message: '参数键名不能为空', trigger: 'blur' }
        ],
        configValue: [
          { require: true, message: '参数键名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listConfig(this.addDateRange(this.queryParams, this.dataRange)).then(res => {
        this.configList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    /** 参数系统内置字典翻译 */
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.configType)
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        configId: undefined,
        configName: undefined,
        configKey: undefined,
        configValue: undefined,
        configType: "Y",
        remark: undefined
      }
      this.resetForm('form')
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加参数'
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.configId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const configId = row.configId || this.ids
      getConfig(configId).then(res => {
        this.form = res.data
        this.open = true
        this.title = '修改参数'
      })
    },
    /** 提交按钮 */
    submitForm: () => {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.configId !== undefined) {
            updateConfig(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addConfig(this.form).then(res => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const configIds = row.configId || this.ids;
      this.$confirm('是否确认删除参数编号为"' + configIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return delConfig(configIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有参数数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportConfig(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {
      });
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.msgSuccess("刷新成功");
      });
    }
  }
}
</script>

<style scoped>

</style>
