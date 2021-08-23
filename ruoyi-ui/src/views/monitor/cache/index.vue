<template>
  <div class="app-container">
    <ElRow>
      <ElCol :span="24" class="card-box">
        <ElCard>
          <div slot="header">
            <span>基本信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellpadding="0" style="width: 100%">
              <tbody>
                <tr>
                  <td><div class="cell">Redis版本</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.redisVersion }}</div></td>
                  <td><div class="cell">运行模式</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.redisMode === "standalone" ? "单机" : "集群" }}</div></td>
                  <td><div class="cell">端口</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.tcpPort }}</div></td>
                  <td><div class="cell">客户端数</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.connectedClients }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">运行时间(天)</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.uptimeInDays }}</div></td>
                  <td><div class="cell">使用内存</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.usedMemoryHuman }}</div></td>
                  <td><div class="cell">使用CPU</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.usedCpuUserChildren }}</div></td>
                  <td><div class="cell">内存配置</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.maxMemoryHuman}}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">AOF是否开启</div></td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.aofEnabled === "0" ? "否" : "是" }}</div></td>
                  <td><div class="cell"></div>RDB是否成功</td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.rdbLastBgsaveStatus }}</div></td>
                  <td><div class="cell"></div>Key的数量</td>
                  <td><div class="cell" v-if="cache.info">{{ cache.dbSize }}</div></td>
                  <td><div class="cell"></div>网络入口/出口</td>
                  <td><div class="cell" v-if="cache.info">{{ cache.info.instantaneousInputKbps }}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="12" class="cared-box">
        <ElCard>
          <div slot="header"><span>命令统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandStatus" style="height: 420px" />
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="12" class="card-box">
        <ElCard>
          <div slot="header">
            <span>内存信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedMemory" style="height: 420px" />
          </div>
        </ElCard>
      </ElCol>

    </ElRow>
  </div>
</template>

<script>
import { getCache } from "@/api/monitor/cache";
import echarts from 'echarts'
export default {
  name: 'Server',
  data() {
    return {
      // 加载层信息
      loading: [],
      // 统计命令信息
      commandStatus: null,
      // 使用内存
      usedMemory: null,
      // cache 信息
      cache: []
    }
  },
  created() {
    this.getList()
    this.openLoading()
  },
  methods: {
    getList() {
      getCache().then(response => {
        this.cache = response.data
        this.loading.close()

        this.commandStatus = echarts.init(this.$refs.commandStatus, 'macarons')
        this.commandStatus.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br />{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '命令',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: response.data.commandStatus,
              animationEasing: 'cubicInOut',
              animationDuration: 1000
            }
          ]
        })
        this.usedMemory = echarts.init(this.$refs.usedMemory)
        this.usedMemory.setOption({
          tooltip: {
            formatter: '{b} <br />{a} :' + this.cache.info.usedMemoryHuman,
          },
          series: [
            {
              name: '峰值',
              type: 'gauge',
              min: 0,
              max: 1000,
              detail: {
                formatter: this.cache.info.userMemoryHuman
              },
              data: [
                {
                  value: parseFloat(this.cache.info.usedMemoryHuman),
                  name: '内存消耗'
                }
              ]
            }
          ]
        })
      })
    },

    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命读取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  }
}
</script>

