<template>
  <div>
    <!-- <el-upload
      :drag="drag"
      ref="upload"
      class="upload-demo"
      name="assetFile"
      :headers="uploadHeader"
      :multiple="multiple"
      :accept="acceptList"
      :on-change="onChange"
      :file-list="fileList"
      :show-file-list="showFileList"
      :http-request="handleSubmitUpload"
      action='/'
      >
      <el-button size="small" type="primary" class="uploadBtn">
        {{uploadTitle}}
      </el-button>
    </el-upload> -->


    <el-upload
      :drag="drag"
      ref="upload"
      class="upload-demo"
      name="assetFile"
      :action='$apiUrl.fileUpload'
      :headers="uploadHeader"
      :accept="acceptList"
      :file-list="fileList"
      :show-file-list="showFileList"
      :before-remove="remove"
      :on-success="uploadFileSuccess"
      >
      <el-button size="small" type="primary" class="uploadBtn">
        {{uploadTitle}}
      </el-button>
    </el-upload>
  </div>
</template>

<script>
/* 用于资产附件附件上传 */
import axios from 'axios'

export default {
  props: ['importOption'],
  data () {
    return {
      fileList: [],
      fileArr: [],
      timer: null,
      maxSize: 50 * 1024 * 1024, // 上传最大文件限制
      multiUploadSize: 10 * 1024 * 1024, // 大于这个大小的文件使用分块上传(后端可以支持断点续传)
      chunkSize: 1 * 1024 * 1024, // 每块文件大小
      requestCancelQueue: [], // 请求方法队列（调用取消上传
      uosUrl: this.$appConst.uosUrl, // 统一对象存储服务地址
      bucketName: this.$appConst.bucketName, // 上传对象使用的bucket
      useLocalProxy: false // 是否使用本地代理解决跨域问题（在开发时应启用）
    }
  },
  computed: {
    upload () {
      return this.uosUrl + '/api/obs/signature/upload'
    },
    uploadHeader () {
      return {
        // authorization: sessionStorage.getItem('token'),
        // tenantName: sessionStorage.getItem('currentDataSource')
        "Authorization": sessionStorage.getItem("access_token"),
				"client_id": this.$appConst.ClIENT_ID,
				"org_id": sessionStorage.getItem("orgId"),
      }
    },
    acceptList () {
      if (this.importOption && this.importOption.accept) {
        return this.importOption.accept
      } else {
        return '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PNG,.GIF,.BMP,.PDF,.xlsx'
      }
    },
    drag () {
      return (this.importOption.drag || false)
    },
    uploadTitle () {
      if (this.importOption && this.importOption.uploadTit) {
        return this.importOption.uploadTit
      } else {
        return '上传文件'
      }
    },
    showFileList () {
      return (this.importOption.showFileList || false)
    },
    toolTipContent () {
      return '只能上传 ' + this.acceptList + '文件，且不超过50M'
    },
    limit () {
      return (this.importOption.limit || 100)
    },
    autoUpload () {
      return (this.importOption.autoUpload || false)
    },
    multiple () {
      return (this.importOption.multiple || false)
    },
    type () {
      return (this.importOption.type || 'general')
    },
    uploading () {
      return (this.importOption.uploading || false)
    },
    assetInfo () {
      console.log(this.importOption.assetInfo)
      return (this.importOption.assetInfo || {})
    },
    filePath () {
      const path = this.importOption.folderPath ? (this.importOption.folderPath.join('/') + '/') : '/'
      return path
    }
  },
  methods: {
    // 上传成功
    uploadFileSuccess(res, file) {
      console.log(res, 'resfile', file)
        if (res.status === 10000 || res.status === 200) {
            let typeId = JSON.parse(sessionStorage.getItem("typeId"));
            let resData = res.data[0];
            resData["typeId"] = typeId;
            this.fileList.push(resData);
            this.$message.success('上传成功!');
            this.saveAttachment();
        } else {
            this.$message.warning('文件上传失败');
        }
    },
    //保存
    saveAttachment() {
      let saveEntityUuid = sessionStorage.getItem('saveEntityUuid')
      let params = {
        assetType: this.$appConst.tableEnNameAsset,
        attachmentList: this.fileList
      }
      this.$http.post(`${this.$apiUrl.assetStart}/${saveEntityUuid}/attachment`,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.$message.success('保存成功!');
        }).catch(err => {
            this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
    // 删除前调用钩子
    remove(file) {
        const files = file.response ? file.response.data[0] : file;
        const key = this.fileList.findIndex(val => val.fileId === files.fileId);
        if (key === -1) return;
        this.fileList.splice(key, 1);
        this.$emit('removeAgreement', file);
    },
    onChange (file, fileList) {
      if (file.status === 'ready') {
        this.$store.commit('ADD_PENDINGFILELIST', file)
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$emit('uploadStart')
          clearTimeout(this.timer)
        }, 10)
      }
    },
    triggerUpload () {
      $('.cotextItemUpload .upload-demo .uploadBtn').trigger('click')
    },
    // async handleSubmitUpload (options) {
    //   const { maxSize, multiUploadSize, getSize, splitUpload, singleUpload } = this
    //   const { file, onProgress, onSuccess, onError } = options
    //   let fileSuffixValue = file.name.split('.').pop()
    //   if (this.acceptList.indexOf(fileSuffixValue) === -1) {
    //     this.$global.errMsg(`只能上传${this.acceptList}文件！`)
    //     this.fileList = this.fileArr
    //     return false
    //   }
    //   if (file.size > maxSize) {
    //     return this.$message({
    //       message: `您选择的文件大于${getSize(maxSize)}`,
    //       type: 'error'
    //     })
    //     return false
    //   }
    //   this.$emit('beforeUpload', file)
    //   // 根据文件大小选择直接上传或分块上传
    //   if (file.size > multiUploadSize) {
    //     let uploadResult = await splitUpload(file, onProgress)
    //     this.$message({
    //       message: '上传成功',
    //       type: 'success'
    //     })
    //   } else {
    //     singleUpload(file, onProgress)
    //   }
    // },
    handleSuccess (file, fileItem, objectKey) {
      this.changeUploadStatus(objectKey)
      this.$store.commit('REDUCE_PENDINGFILELIST', file)
      const result = this.handleFileData(file, fileItem)
      const response = { data: [result] }
      this.$parent.handleFileList({ response, file })
    },
    changeUploadStatus (objectKey) {
      const url = `${this.uosUrl}/api/obs/signature/upload/status?objectKey=${encodeURIComponent(objectKey)}&bucketName=${this.bucketName}&status=SUCCESS`
      this.$http.put(url)
    },
    handleFileData (file, fileItem) {
      let json = { ...file, ...fileItem }
      json.uid = file.uid
      json.fileName = file.name
      json.contentType = file.type
      json.size = file.size
      json.id = file.objectId
      json.md5 = file.md5
      json.filePath = file.filePath
      json.fileId = fileItem.objectId
      json.updateTime = file.updateTime
      return json
    },
    // 格式化文件大小显示文字
    getSize (size) {
      return size > 1024
      ? size / 1024 > 1024
        ? size / (1024 * 1024) > 1024
        ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        : (size / (1024 * 1024)).toFixed(2) + 'MB'
        : (size / 1024).toFixed(2) + 'KB'
      : (size).toFixed(2) + 'B'
    },
    // 大文件分块上传
    splitUpload (file, onProgress) {
      return new Promise(async (resolve, reject) => {
        try {
          const { chunkSize } = this

          const chunks = Math.ceil(file.size / chunkSize)
          const fileChunks = await this.splitFile(file, chunkSize, chunks)
          // 初始化OBS分段上传任务
          let multipartTask = await this.initMultipartUploadTask(file)
          // 分段上传任务参数
          let bucketName = multipartTask.bucketName
          let objectKey = multipartTask.objectKey
          let uploadId = multipartTask.uploadId
          for (let currentChunkNum = 0; currentChunkNum < fileChunks.length; currentChunkNum++) {
            // 每段开始前获取该段上传签名
            let partNumber = currentChunkNum + 1
            let partInfo = await this.createMultipartUploadPartSignature(bucketName, objectKey, partNumber, uploadId)
            partInfo.uploadId = uploadId
            partInfo.partNumber = partNumber
            // 用于计算进度
            partInfo.currentChunkNum = currentChunkNum
            partInfo.chunkSize = chunkSize
            partInfo.file = file
            let partUploadResult = await this.uploadPart(partInfo, fileChunks[currentChunkNum], onProgress)
          }
          // 完成分段上传任务
          let completeResult = await this.completeMultipartUploadTask(bucketName, objectKey, uploadId, chunks)
          this.handleSuccess(file, multipartTask, objectKey)
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    /**
     * 完成多段上传任务
     * @param bucketName
     * @param objectKey
     * @param uploadId
     * @param partsCount
     * @returns {Promise<AxiosResponse<T> | never>}
     */
    completeMultipartUploadTask (bucketName, objectKey, uploadId, partsCount) {
      return this.$http.put(`${this.uosUrl}/api/obs/multipart-upload/task/complete`, {
      'bucketName': bucketName,
      'objectKey': objectKey,
      'uploadId': uploadId,
      'partsCount': partsCount
      }).then(res => res.data.data)
    },
    /**
     * 上传单段
     * @param partInfo 该段信息，OBS签名url、chunkSize等
     * @param fileChunk 该段chunk
     * @param onProgress ele-ui upload组件的progress回调
     */
    uploadPart (partInfo, fileChunk, onProgress) {
      const { requestCancelQueue } = this
      const config = {
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        cancelToken: new axios.CancelToken(function executor (cancel) {
          if (requestCancelQueue[partInfo.file.uid]) {
              requestCancelQueue[partInfo.file.uid]()
              delete requestCancelQueue[partInfo.file.uid]
          }
          requestCancelQueue[partInfo.file.uid] = cancel
        }),
        onUploadProgress: e => {
          e.percent = Number(((((partInfo.currentChunkNum * (partInfo.chunkSize - 1)) + (e.loaded)) / partInfo.file.size) * 100).toFixed(2))
          onProgress(e, partInfo.file)
        }
      }
      let url = partInfo.signedUrl
      if (this.useLocalProxy) {
        url = url.replace(`https://${this.bucketName}.obs.cn-south-1.myhuaweicloud.com:443`, '/upload')
      }
      return axios.put(url, fileChunk, config)
        .then(res => res).catch(e => {
          if (e.message === 'Network Error') {
            this.$store.commit('SET_PENDINGFILELIST', [])
            window.open(url)
          }
        })
    },
    /**
     * 文件分块
     * @param file 文件
     * @param eachSize 块大小
     * @param chunks 分块数
     */
    splitFile (file, eachSize, chunks) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
          const fileChunk = []
          for (let chunk = 0; chunks > 0; chunks--) {
              fileChunk.push(file.slice(chunk, chunk + eachSize))
              chunk += eachSize
          }
          resolve(fileChunk)
          }, 0)
        } catch (e) {
          reject(new Error('文件切块发生错误'))
        }
      })
    },
    /**
     * 初始化分段上传任务
     * @param file 待上传文件
     */
    async initMultipartUploadTask (file) {
      let param = {
        // 如果配置了obsObjectKey，将使用这个key作为OBS文件路径，而不是随机生成的id
        'obsObjectKey': this.assetInfo['entityUuid'] + '/' + this.filePath + file.name,
        'bucketName': this.bucketName,
        'metadata': {
            'contentType': file.type,
            'fileName': file.name,
            'size': file.size
        }
      }
      return this.$http.post(`${this.uosUrl}/api/obs/multipart-upload/task`, param).then(res => res.data.data)
    },
    /**
     * 创建分段上传签名
     */
    createMultipartUploadPartSignature (bucketName, objectKey, partNumber, uploadId) {
      return this.$http.post(`${this.uosUrl}/api/obs/signature/multipart-upload/part`, null, {
        params: {
            bucketName, objectKey, partNumber, uploadId
        }
      }).then(res => res.data.data)
    },
    // 单文件直接上传
    singleUpload (file, onProgress) {
      this.uploadFile(file, onProgress)
    },
    /**
   * 直接上传文件
   * @param file
   * @param onProgress
   * @returns {Promise<AxiosResponse<T> | never>}
   */
    async uploadFile (file, onProgress) {
      // 创建OBS上传签名
      let params = {
        obsObjectKey: this.assetInfo['entityUuid'] + '/' + this.filePath + file.name,
        bucketName: this.bucketName,
        metadata: {
          'contentType': file.type,
          'fileName': file.name,
          'size': file.size
        }
      }
      let signature = await this.$http.post(`${this.uosUrl}/api/obs/signature/upload`, params
      ).then(res => res.data.data)

      let url = signature.signedUrl
      if (this.useLocalProxy) {
        url = url.replace(`https://${this.bucketName}.obs.cn-south-1.myhuaweicloud.com:443`, '/upload')
      }

      const { requestCancelQueue } = this
      const config = {
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        onUploadProgress: e => {
          e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
          onProgress(e, file)
        }
      }
      let res = null
      try {
        res = await axios.put(url, file, config)
      } catch (e) {
        if (e.message === 'Network Error') {
          this.$store.commit('REDUCE_PENDINGFILELIST', file)
          window.open(url)
        }
      }
      let fileItem = Object.assign({}, file, { fileId: signature.objectId })

      if (res.status === this.$appConst.status) {
        this.handleSuccess(file, signature, params.obsObjectKey)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo{
  .uploadBtn{
    width: 128px;
    height: 40px;
    line-height: 40px;
    padding: 0 0 0 10px;
    font-size: 14px;
    img {
      position: relative;
      top: 2px;
      left: -5px;
    }
  }
}
</style>
