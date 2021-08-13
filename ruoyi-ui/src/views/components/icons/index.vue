<template>
  <div class="icons-container">
    <aside>
      <a href="#" target="_blank">Add and Use</a>
    </aside>
    <ElTabs type="border-card">
      <ElTabPane label="Icons">
        <div v-for="item of svgIcons" :key="item">
          <ElTooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </ElTooltip>
        </div>
      </ElTabPane>

      <ElTabPane label="Element-UI icon">
        <div v-for="item of elementIcons" :key="item">
          <ElTooltip placement="top">
            <div slot="content">
              {{ generateElementIconCode(item) }}
            </div>
            <div class="icon-item">
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </div>
          </ElTooltip>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>
import { svgIcons } from '@/views/components/icons/svg-icons';
import elementIcons from './element-icons'
export default {
  name: "Icons",
  data() {
    return {
      svgIcons,
      elementIcons
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },

    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}"/>`
    }
  }
}
</script>

<style lang="scss" scoped>
  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;

    .icons-item {
      margin: 20px;
      height: 85px;
      text-align: center;
      width: 100px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }

</style>
