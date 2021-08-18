<template>
  <div class="icon-body">
    <ElInput
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图片名称"
      @clear="filterIcons"
      @input.native="filterIcons">
      <i slot="suffix" class="el-input-search el-input__icon" />
    </ElInput>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList" :key="index"
        @click="selectedIcon(item)">
        <SvgIcon :icon-class="item" style="height: 30px; width: 16px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { icons } from './requireIcon'
export default {
  name: "IconSelect",
  data() {
    return {
      name: '',
      iconList: icons
    }
  },
  methods: {
    filterIcons() {
      this.iconList = icons
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
