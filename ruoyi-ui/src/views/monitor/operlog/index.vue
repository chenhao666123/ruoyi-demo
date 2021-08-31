<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" label-width="68px" ref="queryForm" v-show="showSearch">
      <el-form-item label="系统模块" prop="title">
        <el-input
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入系统模块"
          size="small"
          style="width: 240px;"
          v-model="queryParams.title"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          @keyup.enter.native="handleQuery"
          clearable
          placeholder="请输入操作人员"
          size="small"
          style="width: 240px;"
          v-model="queryParams.operName"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          clearable
          placeholder="操作类型"
          size="small"
          style="width: 240px"
          v-model="queryParams.businessType"
        >
          <el-option
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            v-for="dict in typeOptions"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          clearable
          placeholder="操作状态"
          size="small"
          style="width: 240px"
          v-model="queryParams.status"
        >
          <el-option
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            v-for="dict in statusOptions"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          end-placeholder="结束日期"
          range-separator="-"
          size="small"
          start-placeholder="开始日期"
          style="width: 240px"
          type="daterange"
          v-model="dateRange"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" icon="el-icon-search" size="mini" type="primary">搜索</el-button>
        <el-button @click="resetQuery" icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          :disabled="multiple"
          @click="handleDelete"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          v-hasPermi="['monitor:operlog:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          @click="handleClean"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          v-hasPermi="['monitor:operlog:remove']"
        >清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :loading="exportLoading"
          @click="handleExport"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          v-hasPermi="['monitor:operlog:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="list" :default-sort="defaultSort" @selection-change="handleSelectionChange" @sort-change="handleSortChange"
              ref="tables" v-loading="loading">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="日志编号" prop="operId"/>
      <el-table-column align="center" label="系统模块" prop="title"/>
      <el-table-column :formatter="typeFormat" align="center" label="操作类型" prop="businessType"/>
      <el-table-column align="center" label="请求方式" prop="requestMethod"/>
      <el-table-column :show-overflow-tooltip="true" :sort-orders="['descending', 'ascending']" align="center" label="操作人员" prop="operName"
                       sortable="custom" width="100"/>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作地址" prop="operIp" width="130"/>
      <el-table-column :show-overflow-tooltip="true" align="center" label="操作地点" prop="operLocation"/>
      <el-table-column :formatter="statusFormat" align="center" label="操作状态" prop="status"/>
      <el-table-column :sort-orders="['descending', 'ascending']" align="center" label="操作日期" prop="operTime"
                       sortable="custom" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleView(scope.row,scope.index)"
            icon="el-icon-view"
            size="mini"
            type="text"
            v-hasPermi="['monitor:operlog:query']"
          >详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
      v-show="total>0"
    />

    <!-- 操作日志详细 -->
    <el-dialog :visible.sync="open" append-to-body title="操作日志详细" width="700px">
      <el-form :model="form" label-width="100px" ref="form" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { cleanOperlog, delOperlog, exportOperlog, list } from '@/api/monitor/operlog'
export default {
  name: "Operlog",
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
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: {prop: 'operTime', order: 'descending'},
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_oper_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 操作日志状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delOperlog(operIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return cleanOperlog();
      }).then(() => {
        this.getList();
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
        return exportOperlog(queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};

</script>

<style scoped>

</style>
