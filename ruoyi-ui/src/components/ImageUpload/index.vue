<template>
  <div class="component-upload-component">
    <ElUpload
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      name="file"
      :limit="limit"
      :before-upload="handleBeforeUpload"
      :headers="headers"
      :show-file-list="true"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: this.fileList.length >= this.limit }"
    >
      <i class="el-icon-plus"></i>
    </ElUpload>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  props: {
    value: [ String, Object, Array ],
    // 图片数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: []
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          const list = Array.isArray(val) ? val : this.value.split(',')
          this.fileList = list.map(item => {
            if (typeof item === 'string') {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item }
              } else {
                item = { name: item, url: item }
              }
            }
            return item
          })
        } else {
          this.fileList = []
          return []
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    }
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      const fIndex = this.fileList.map(f => f.name).indexOf(file.name)
      this.fileList.splice(fIndex, 1)
      this.$emit('input', this.listToString(this.fileList))
      this.loading.close()
    },
    // 上传成功回调
    handleUploadSuccess(res) {
      this.fileList.push({ name: res.fileName, url: res.fileName })
      this.$emit('input', this.listToString(this.fileList))
      this.loading.close()
    },
    // 上传前loading 加载
    handleBeforeUpload(file) {
      let isImg = false
      if (this.fileType.length) {
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        isImg = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) {
            return true
          }

          if (fileExtension && fileExtension.indexOf(type) > -1) {
            return true
          }

          return false

        })
      } else {
        isImg = file.type.indexOf('image') > -1
      }

      if (!isImg) {
        this.$message.error( `文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`)
        return false
      }

      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      this.loading = this.$loading({
        lock: true,
        text: '加载中...',
        background: "rgba(0, 0, 0, 0.7)"
      })
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传失败
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败"
      })
      this.loading.close
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url.replace(this.baseUrl, "") + separator;
      }
      return strs !== '' ? strs.substr(0, strs.length - 1) : '';
    }


  }
}
</script>

<style scoped>

</style>
