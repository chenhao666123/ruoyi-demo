<template>
  <template v-for="(item, index) in options">
    <template v-if="values.includes(item.dictValue)">
      <span
        v-if="item.listClass === 'default' || item.listClass === ''"
        :key="item.dictValue"
        :index="index"
        :class="item.cssClass"
        >{{ item.dictLabel }}</span>
      <ElTag
        v-else
        :key="item.dictValue"
        :index="index"
        :type="item.listClass === 'primary' ? '' : item.listClass"
        :class="item.cssClass">
        {{ item.dictLabel }}
      </ElTag>
    </template>
  </template>
</template>

<script>
export default {
  name: "DictTag",
  props: {
    options: {
      type: Array,
      default: null
    },
    value: [String, Array]
  },
  computed: {
    values() {
      if (this.value) {
        return Array.isArray(this.value) ? this.value : [this.value]
      } else {
        return []
      }
    }
  }
}
</script>

<style scoped>
 .el-tag + .el-tag {
   margin-left: 10px;
 }
</style>
