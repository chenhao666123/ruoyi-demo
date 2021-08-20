<template>
  <div class="top-right-btn">
    <ElRow>
      <ElTooltip
        :content="showSearch ? '隐藏列表' : '显示列表'" class="item"
        effect="dark"
        placement="top">
        <ElButton @click="toggleSearch" circle icon="el-icon-search" size="mini"/>
      </ElTooltip>

      <ElTooltip
        class="item" content="刷新"
        effect="dark"
        placement="top">
        <ElButton @click="refresh" circle icon="el-icon-refresh" size="mini"/>
      </ElTooltip>

      <ElTooltip
        class="item" content="显隐列"
        effect="dark"
        placement="top"
        v-if="columns">
        <ElButton @click="showColumn" circle icon="el-icon-menu" size="mini"/>
      </ElTooltip>
    </ElRow>

    <ElDialog :title="title" :visible.sync="open" append-to-body>
      <ElTransfer
        :data="columns"
        :titles="['显示', '隐藏']"
        @change="dataChange"
        v-model="value"/>
    </ElDialog>
  </div>
</template>

<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "显示/隐藏",
      // 是否显示弹出层
      open: false
    }
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item))
      }
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit('update:showSearch', !this.showSearch)
    },
    // 刷新
    refresh() {
      this.$emit('queryTable')
    },
    dataChange(data) {
      for (let item in this.columns) {
        const key = this.columns[item].key
        this.columns[item].visibie = !data.includes(key)
      }
    },
    showColumn() {
      this.open = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}

::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
