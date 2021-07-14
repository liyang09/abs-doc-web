<template>
    <div class="doc" style='display: flex; height: 100%; border-right: 1px solid #EBEEF5;' @mouseup="mouseUp" @mousemove="mouseMove" @mousedown="mouseDown" >
        <template v-if="folderTreeVisible">
            <folderAndAttachment
                ref="firstColum"
                v-if="folders.length"
                :parentId='"0"'
                :folders='folders'
                :canUpload="canUpload"
                @allDownload='allDownload'
                @handleTreeItemClick='handleTreeItemClick'
                @handleTreeItemContextmenu='handleTreeItemContextmenu'
                @handleContextmenuClick='handleContextmenuClick' />
            <folderAndAttachment
                v-for='(item,i) in foldesAndAttachments'
                :key='i+1'
                :parentId='String(i+1)'
                :folders='item.subDirectories'
                :canUpload="canUpload"
                :attachments="item.attachments"
                :saveInvoice="saveInvoice"
                @filesBatchDownload="filesBatchDownload"
                @batchDelete="batchDelete"
                @saveInvoiceChange="(val)=>{saveInvoice = val}"
                @invoiceOCR="invoiceOCR"
                @treeColumnContextmenu="treeColumnContextmenu"
                @handleTreeItemClick='handleTreeItemClick'
                @handleTreeItemContextmenu='handleTreeItemContextmenu'
                @handleContextmenuClick='handleContextmenuClick'
                @fileData="handleUseFileData" />
            <div :class="['imgWrap',{'pdfimgWrap':fileData.contentType === 'application/pdf'}]" v-if="fileData.previewSrc">
                <div class='imgCont' :style="canUpload && fileData.contentType.includes('image') && 'margin-top:10px'">
                    <el-button v-if="ifIconsShow() && canUpload && fileData.contentType.includes('image')" class="invoice-ocr-inimg" @click.stop="invoiceOCR(fileData)">发票识别</el-button>
                    <!-- <iframe v-if="fileData.contentType === 'application/pdf'" width="80%" :src="fileData.previewSrc" frameborder="0"></iframe> -->
                    <pdfViewer v-if="fileData.contentType === 'application/pdf'" :pdfurl="fileData.previewSrc" ></pdfViewer>
                    <el-image v-else-if="fileData.contentType.indexOf('image')>-1" :src="fileData.previewSrc"  :preview-src-list="[fileData.previewSrc]" fit="scale-down">
                        <div slot="placeholder" class="image-slot">
                            <span class="dot" v-loading="true"></span>
                        </div>
                    </el-image>
                    <el-image v-else style="width: 200px; height: 200px" :src="fileData.previewSrc" title="暂不可预览"></el-image>
                </div>
                <p class='textCenter'>{{fileData.fileName}}</p>
                <template v-if="ifIconsShow()">
                  <div class='info' v-if="canUpload && fileData.contentType.includes('image')">
                      <ul>
                          <li>
                              <i>{{$appConst.invoiceConstant.issueDate}}</i>
                              <i>
                                  <el-input v-model="invoiceData.issueDate" size="mini"> </el-input>
                              </i>
                          </li>
                          <li>
                              <i>{{$appConst.invoiceConstant.code}}</i>
                              <i>
                                  <el-input v-model="invoiceData.code" size="mini"> </el-input>
                              </i>
                          </li>
                          <li>
                              <i>{{$appConst.invoiceConstant.number}}</i>
                              <i>
                                  <el-input v-model="invoiceData.number" size="mini"> </el-input>
                              </i>
                          </li>
                          <li>
                              <i>{{$appConst.invoiceConstant.checkCode}}</i>
                              <i>
                                  <el-input v-model="invoiceData.checkCode" size="mini"> </el-input>
                              </i>
                          </li>
                          <li>
                              <i>{{$appConst.invoiceConstant.total}}</i>
                              <i>
                                  <el-input v-model="invoiceData.total" size="mini"> </el-input>
                              </i>
                          </li>
                          <li>
                              <i>{{$appConst.invoiceConstant.totalAmount}}</i>
                              <i>
                                  <el-input v-model="invoiceData.totalAmount" size="mini"> </el-input>
                              </i>
                          </li>
                      </ul>
                  </div>
                  <div class="invoice-ocr" v-if="canUpload && fileData.contentType.includes('image')">
                      <el-button @click="manualInput('check')">验证</el-button>
                      <el-button @click="manualInput('pass')" v-show="false">强制通过</el-button>
                  </div>
                </template>
            </div>
            <div class='imgWrap nofile' v-else-if="folderPath.length && canUpload && !(currentFolder.attachments && currentFolder.attachments.length) && !(currentFolder.subDirectories && currentFolder.subDirectories.length)">
                <div class='imgCont'>
                    <!-- <img class='img' src='../../assets/imgs/nofile.png' alt=''/> -->
                    <uploadComponent ref="uploadComponent" class="upload" :importOption="uploadOption" @beforeUpload="beforeUpload" @handleFileList="handleFileList" @uploadStart="uploadStart"></uploadComponent>
                    <div class="tips">
                        <div> 或将文件拖拽到此处，大小不得超过50M</div>
                        <div> (仅支持图片、PDF、excel文件)</div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="ifIconsShow()">
          <div class="noFolder" v-if="folders.length === 0">
              <div>
                  <img style="width:130px" :src="$global.imgUrl.empty">
                  <p>
                      请选择资产查看相应附件
                  </p>
              </div>
          </div>
        </template>
        <div class="top-right-corner-upload">
            <el-tooltip effect="dark" content="导出资产" placement="top-end" v-if="ifIconsShow()">
                <span class="iconfont icondownload1 export-asset" @click="exportAsset"></span>
            </el-tooltip>
            <el-popover
                popper-class="folder-popover"
                placement="bottom"
                title="上传中心"
                width="540"
                trigger="hover"
                :visible-arrow="false"
                >
                <div class="popover-content">
                    <template v-if="pendingFileList.length">
                        <p v-for="file in pendingFileList" :key="file.uid">
                            <span :class='[handleSetFileIcon(file.raw) + " iconfont fileIcon", "iconimg"]'></span>
                            <span>
                                {{file.name}}
                                <el-progress :percentage="Number(file.percentage.toFixed(0))" :show-text="true" color="#67c23a"></el-progress>
                            </span>
                        </p>
                    </template>
                    <div v-else style="text-align:center">
                        <img style='width: 130px; height: auto;right:0' :src="$global.imgUrl.empty" />
                        <p class='textCenter' style='margin: 30px 0; color: #999;'>暂无任务</p>
                    </div>
                </div>
                <el-badge class="upload-badge" slot="reference" :value="pendingFileList.length" :max="99" >
                    <img :src='$global.imgUrl.upload' alt='upload' style="display:inline-block" />
                </el-badge>
            </el-popover>
            <!-- <uploadComponent style="display:inline-block" v-if="folderPath.length && topRightCornerUploadVisible && (foldesAndAttachments[(foldesAndAttachments.length-1)].attachments.length)" ref=""  :importOption="uploadOption" @handleFileList="handleFileList"></uploadComponent> -->
        </div>
        <uploadComponent ref="contextUpload" style="display:none" class="cotextItemUpload" :importOption="uploadOption" @handleFileList="handleFileList" @beforeUpload="beforeUpload" @uploadStart="uploadStart"></uploadComponent>
        <ul class='dropSelect hide blank-upload' @click="blankUpload">
            <li val='upload' class='textCenter cursor dropSelectItem'>
                上传
            </li>
        </ul>
    </div>
</template>

<script>
    import { cursorResize } from '../assets/js/cursorResize.js'
    import folderAndAttachment from './folderAndAttachment.vue'
    import uploadComponent from './upLoadComponent.vue'
    import pdfViewer from './pdfViewer.vue'
    import { mapGetters } from 'vuex'

    export default {
        props: ['folderOption'],
        name: 'folderTree',
        data () {
            return {
                folders: [],
                foldesAndAttachments: [],
                folderPath: [],
                firstOpenFolder: {},
                contextItem: {},
                fileData: {
                    previewSrc: ''
                },
                invoiceData: {
                    code: '', // 发票代码
                    number: '', // 发票号码
                    checkCode: '', // 校验码
                    issueDate: '', // 开票日期
                    buyerName: '', // 购买方名称
                    sellerName: '', // 销售方名称
                    totalAmount: '', // 合计金额
                    totalTax: '', // 合计税额
                    total: '', // 价税合计
                    serviceName: '' // 服务名称
                },
                uploadOption: {
                    drag: true,
                    accept: '.jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PNG,.PDF,.xlsx,.xls',
                    uploadTit: '上传文件',
                    limit: 200,
                    autoUpload: true,
                    showFileList: false,
                    multiple: true,
                    assetInfo: {},
                    folderPath: []
                },
                currentFolder: {},
                blackUploadParentId: '',
                timer: null,
                uploadTimer: null,
                folderTreeVisible: false,
                tipsTimer: null,
                saveInvoice: false
            }
        },
        watch: {
            // folders () {
            //     console.log(this.folderOption.assetInfo.directories, '9998888777777')
            //     return (this.folderOption.assetInfo.directories || [])
            // },
            folderPath () {
                this.uploadOption.folderPath = this.folderPath
            },
            // 'folderOption.assetInfo.id' () {
            //     this.uploadOption.assetInfo = this.folderOption.assetInfo
            // }
        },
        computed: {
            // folders () {
            //     console.log(this.folderOption.assetInfo.directories, '9998888777777')
            //     return (this.folderOption.assetInfo.directories || [])
            // },
            canUpload () {
                // return false
                return (this.folderOption.canUpload || false)
            },
            topRightCornerUploadVisible () {
                if (this.$route.name === 'assetsquery') {
                    return false
                }
                return true
            },
            ...mapGetters([
                'pendingFileList'
            ])
        },
        created () {
          $('#app').on('click', (e) => {
            e.stopPropagation()
            $('.contextMenu-active').removeClass('contextMenu-active')
            if ($(e.target).hasClass('docSetting')) {
                const curtentColumnClass = e.target.classList[e.target.classList.length - 1]
                const temParentId = Number(e.target.classList[e.target.classList.length - 1].slice(-1))
                const foldesAndAttachmentsLength = this.foldesAndAttachments.length
                this.foldesAndAttachments.splice(temParentId)
                this.folderPath.splice(temParentId)
                $(`.${curtentColumnClass} .treeItem`).removeClass('active')
                this.fileData = {
                    previewSrc: ''
                }
                if (temParentId === 0) {
                    this.initialize()
                }
            }
          })
            // this.$store.commit('SET_PENDINGFILELIST', [])
            // if (this.folderOption.assetInfo.directories && this.folderOption.assetInfo.directories.length) return
            // this.queryDirectories()
            this.folderTreeVisible = true
            this.$bus.$off('updateFolderPage')
            this.$bus.$on('updateFolderPage', (asset) => {
                const { entityUuid, path, directories } = asset
                const lastAttachments = this.foldesAndAttachments && this.foldesAndAttachments.length ? this.foldesAndAttachments[this.foldesAndAttachments.length - 1] : { attachments: [] }
                if (this.folderOption.assetInfo.entityUuid === entityUuid && lastAttachments.attachments.length === 0) {
                    let tem = []
                    for (let i = 0; i < path.length; i++) {
                        if (i > 0) {
                            for (let j = 0; j < tem.subDirectories.length; j++) {
                                if (tem.subDirectories[j].name === path[i]) {
                                    tem = tem.subDirectories[j]
                                }
                            }
                        } else {
                            for (let k = 0; k < directories.length; k++) {
                                if (directories[k].name === path[i]) {
                                    tem = directories[k]
                                }
                            }
                        }
                    }
                    this.foldesAndAttachments.push(tem)
                }
            })
        },
        methods: {
            init () {
                this.folderTreeVisible = false
                console.log('5555')
                this.initialize()
                 console.log('6666')
                // this.$store.commit('SET_PENDINGFILELIST', [])
                this.$nextTick(() => {
                    this.folderTreeVisible = true
                })
                this.uploadOption.assetInfo = this.folderOption.assetInfo
                console.log(this.folderOption.assetInfo, 'this.folderOption.assetInfo')
                // if (this.folderOption.assetInfo && this.folderOption.assetInfo.directories) return
                if (this.folderOption.assetInfo && this.folderOption.assetInfo.directories && this.folderOption.assetInfo.directories.length) return
                this.queryDirectories()
            },
            ifIconsShow () {
                const rotePath = this.$route.fullPath
                let ifShow = true
                switch (rotePath) {
                  case '/projectManagement':
                    ifShow = false
                    break
                  default:
                    ifShow = true
                    break
                }
                return ifShow
            },
            // queryDirectories () {
            //     let dirType = 'asset'
            //     if (this.folderOption.type !== 'asset') return
            //     const url = this.$apiUrl.assetUrl + `/config/asset-type/${dirType}/dir`
            //     this.$http.get(url)
            //         .then(res => {
            //             if (res.data.status === 200) {
            //                 this.folderOption.assetInfo.directories = res.data.data.directories
            //             }
            //         }).catch(err => {
            //             this.$message.error(err.data.message || '目录查询失败，请稍后再试')
            //         })
            // },
            queryDirectories () {
                let url = this.$apiUrl.tablefile
                let params = {
                    tableEnName: this.$appConst.tableEnNameAsset,
                    projectName: this.$appConst.setProjectName
                }
                // const loading = this.$loading({
                //     lock: true,
                //     text: 'Loading',
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(0, 0, 0, 0.7)'
                // });
                this.$http.get(url, { params }).then(res => {
                    if (res.data.status === 200) {
                        let arr = [];
                        let defaultValue = {};
                        if(res.data.data && res.data.data.length) {
                            console.log('走000000000')
                            defaultValue = res.data.data[0].defaultValue ? res.data.data[0].defaultValue : {};
                            arr = defaultValue.directories;
                        } else {
                            this.folderOption.assetInfo.directories = [];
                        }
                        this.folderOption.assetInfo.directories = arr;
                        this.folders = arr;
                        this.uploadOption.assetInfo = this.folderOption.assetInfo;
                        console.log(this.folderOption.assetInfo.directories, 'this.folderOption.assetInfo.directories', this.folderOption)
                    }
                    // loading.close();
                }).catch(err => {
                    // loading.close();
                    this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                });
            },
            handleTreeItemClick (item, index, parentId) {
                if (parentId === '0') {
                    this.firstOpenFolder = item
                }

                this.contextItem = {
                    parentId,
                    item
                }
                this.contextItem.item.attachments && this.contextItem.item.attachments.map(item => {
                    item.checked = false
                })
                this.currentFolder = item
                this.fileData.previewSrc = ''
                this.foldesAndAttachments.length = Number(parentId)
                this.folderPath.length = Number(parentId)
                if (!item.subDirectories) {
                    item.subDirectories = []
                }
                if (!item.attachments) {
                    item.attachments = []
                }
                this.foldesAndAttachments.push(item)
                this.folderPath.push(item.name)
                if (!(item.attachments.length || item.subDirectories.length)) {
                    this.foldesAndAttachments.length = this.foldesAndAttachments.length - 1
                }
            },
            handleTreeItemContextmenu (item, index, parentId) {
                if (parentId === '0') {
                    this.firstOpenFolder = item
                }
                this.contextItem = {
                    parentId,
                    item
                }
            },
            handleContextmenuClick (type, item) {
                $('.dropSelectItem').removeClass('active')
                $('.dropSelect').removeClass('show')
                if (type === 'download') {
                    this.downloadFile(item)
                } else if (type === 'upload') {
                    this.currentFolder = item
                    this.$refs['contextUpload'].triggerUpload()
                } else if (type === 'delete') {
                    this.deleteAttachment()
                }
            },
            downloadFile (folder) {
                if (this.contextItem.item.fileId) {
                    const url = `${this.$appConst.uosUrl}/file/download/${this.contextItem.item.fileId}`
                    // window.open(url)
                    let type = ''
                    if (this.contextItem.item.contentType.includes('pdf')) {
                        type = 'application/pdf'
                    }
                    if (this.contextItem.item.contentType.includes('png')) {
                        type = 'image/png'
                    }
                    if (this.contextItem.item.contentType.includes('jpeg')) {
                        type = 'image/jpeg'
                    }
                    this.$http({
                        method: 'GET',
                        url: url,
                        responseType: 'blob'
                    }).then(response => {
                        let blob = new Blob([response.data], { type: type })
                        let url = window.URL.createObjectURL(blob)
                        const link = document.createElement('a') // 创建a标签
                        link.href = url
                        link.download = (this.contextItem.item.fileName) || '附件'
                        link.click()
                        URL.revokeObjectURL(url)
                    }).catch(error => {
                        let blob = new Blob([error.data], { type: 'application/json;charset=utf-8' })
                        const reader = new FileReader()
                        reader.readAsText(blob, 'utf-8')
                        let errMessage = ''
                        reader.onload = () => {
                            errMessage = JSON.parse(reader.result).message
                            this.$message.error(errMessage || '文件下载失败，请稍后再试')
                        }
                    })
                    // this.filesBatchDownload([this.contextItem.item.fileName])
                    return
                }
                let arrStr = []
                if (this.contextItem.parentId === '0') {
                    arrStr.push(this.firstOpenFolder.name)
                } else {
                    const temPath = JSON.parse(JSON.stringify(this.folderPath))
                    temPath.length = this.contextItem.parentId - 0
                    temPath.push(this.contextItem.item.name)
                    // arrStr = `['${temPath.join().replace(/,/g, '/')}']`
                    arrStr.push(`${temPath.join().replace(/,/g, '/')}`)
                }
                // console.log(arrStr)
                // const directories = this.base64Encode(arrStr)
                this.downloadZip(arrStr, folder)
            },
            handleUseFileData (file) {
                this.fileData.previewSrc = ''
                this.$nextTick(() => {
                    for (const key in this.invoiceData) {
                        this.invoiceData[key] = ''
                    }
                    this.fileData = Object.assign(this.fileData, file)
                    this.fileData.previewSrc = `${this.$appConst.uosUrl}/file/query/${file.fileId}`
                    if (file.contentType === 'application/pdf') {
                        this.fileData.fileType = 'PDF'
                    } else if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
                        this.fileData.fileType = '图片'
                    } else {
                        this.fileData.previewSrc = require('../../public/static/images/document.png')
                        this.fileData.fileType = '文件'
                    }
                })
            },
            allDownload () {
                const temarr = this.folders.filter(item => item.checked)
                if (temarr.length) {
                    let arrstr = []
                    temarr.map(item => {
                        arrstr.push(item.name)
                    })
                    // const directories = this.base64Encode(`[${arrstr.join()}]`)
                    this.downloadZip(arrstr)
                } else {
                    this.$message.error('请勾选要下载文件夹')
                }
            },
            uploadStart () {
                $('.upload-badge .el-badge__content.is-fixed').css({ 'transition': 'transform 1.6s', 'transform': 'scale(2.5) rotate(360deg)', 'background-color': '#98bf21' })
                this.uploadTimer = setTimeout(() => {
                    $('.upload-badge .el-badge__content.is-fixed').css({ 'transition': '1.6s', 'transform': 'scale(1) translateY(-50%) translateX(100%)', 'background-color': '#F56C6C' })
                    clearTimeout(this.uploadTimer)
                }, 1200)
            },
            // 保存对应文件路径
            beforeUpload (file) {
                const temParams = {
                    savePath: JSON.parse(JSON.stringify(this.folderPath)),
                    assetInfo: JSON.parse(JSON.stringify(this.folderOption.assetInfo)),
                    type: this.folderOption.type
                }
                let params = {}
                params[file.uid] = temParams
                this.$store.commit('ADD_FILETOPATH', params)
            },
            // uploadsuccess
            handleFileList (result) {
                this.$store.dispatch('updateAssetInfo', result)
                /* let arrPath = []
                if (this.contextItem.parentId === '0') {
                    arrPath = [this.firstOpenFolder.name]
                    this.folders.map(item => {
                        if (item.name === this.firstOpenFolder.name) {
                            item.attachments ? item.attachments.push(result.response.data[0]) : item.attachments = [result.response.data[0]]
                            !this.foldesAndAttachments.length && this.foldesAndAttachments.push(item)
                        }
                    })
                } else {
                    const temPath = JSON.parse(JSON.stringify(this.folderPath))
                    temPath.length = this.contextItem.parentId - 0
                    temPath.push(this.contextItem.item.name)
                    arrPath = temPath
                    if (this.currentFolder.name && (this.currentFolder.name !== this.folderPath[this.folderPath.length - 1])) {
                        this.foldesAndAttachments[arrPath.length - 2].subDirectories.map(item => {
                            if (item.name === this.currentFolder.name) {
                                item.attachments.push(result.response.data[0])
                            }
                        })
                    } else {
                        if (this.foldesAndAttachments.length < arrPath.length) {
                            this.foldesAndAttachments[this.foldesAndAttachments.length - 1].subDirectories.map(item => {
                                if (item.name === arrPath[arrPath.length - 1]) {
                                    item.attachments
                                    ? item.attachments.push(result.response.data[0])
                                    : item.attachments = [result.response.data[0]]
                                    this.$nextTick(() => { this.foldesAndAttachments.push(item) })
                                }
                            })
                        } else {
                            this.foldesAndAttachments[arrPath.length - 1].attachments
                                ? this.foldesAndAttachments[arrPath.length - 1].attachments.push(result.response.data[0])
                                : this.foldesAndAttachments[arrPath.length - 1].attachments = [result.response.data[0]]
                        }
                    }
                }
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.updateAsset()
                    clearTimeout(this.timer)
                }, 1000) */
            },
            // delete
            deleteAttachment () {
                const temPath = JSON.parse(JSON.stringify(this.folderPath))
                const uosDelUrl = `${this.$appConst.uosUrl}/uos?objectKey=${encodeURIComponent(this.folderOption.assetInfo['entityUuid'] + '/' + temPath.join('/') + '/' + this.contextItem.item.fileName)}`
                this.$http.delete(uosDelUrl)
                temPath.length = this.contextItem.parentId - 0
                for (let i = 0; i < this.foldesAndAttachments[temPath.length - 1].attachments.length; i++) {
                    if (this.foldesAndAttachments[temPath.length - 1].attachments[i].fileId === this.contextItem.item.fileId) {
                        if (this.foldesAndAttachments[temPath.length - 1].attachments[i].fileId === this.fileData.fileId) {
                            this.fileData.previewSrc = ''
                        }
                        this.foldesAndAttachments[temPath.length - 1].attachments.splice(i, 1)
                        i--
                    }
                }
                if (this.foldesAndAttachments[temPath.length - 1].attachments.length === 0) {
                    this.contextItem.item = this.foldesAndAttachments[temPath.length - 1]
                    this.contextItem.parentId = String(this.contextItem.parentId - 1)
                    if (this.foldesAndAttachments[temPath.length - 1].subDirectories.length === 0) {
                        this.foldesAndAttachments.pop()
                    }
                }
                this.updateAsset()
            },
            batchDelete (currentAttachments, delAttachments) {
                const temPath = JSON.parse(JSON.stringify(this.folderPath))
                const basePath = `${this.folderOption.assetInfo['entityUuid']}/${temPath.join('/')}`
                let delPaths = []
                delAttachments.map(item => {
                    delPaths.push(basePath + '/' + item.fileName)
                    const uosDelUrl = `${this.$appConst.uosUrl}/uos?objectKey=${encodeURIComponent(basePath + '/' + item.fileName)}`
                    this.$http.delete(uosDelUrl)
                })
                const path = this.folderPath
                const directories = this.folderOption.assetInfo.directories
                let tem = []
                for (let i = 0; i < path.length; i++) {
                    if (i > 0) {
                        for (let j = 0; j < tem.subDirectories.length; j++) {
                            if (tem.subDirectories[j].name === path[i]) {
                                tem = tem.subDirectories[j]
                            }
                        }
                    } else {
                        for (let k = 0; k < directories.length; k++) {
                            if (directories[k].name === path[i]) {
                                tem = directories[k]
                            }
                        }
                    }
                }
                tem.attachments = currentAttachments
                this.updateAsset()
            },
            filesBatchDownload (fileNames) {
                const temPath = JSON.parse(JSON.stringify(this.folderPath))
                let tem = fileNames.map(item => {
                    item = temPath.join('/') + '/' + item
                    return item
                })
                this.$store.dispatch('packingFile', { asset: this.folderOption.assetInfo, directories: tem })
            },
            updateAsset () {
                const url = `${this.$appConst.edocUrl}/biz/v1.0/asset-type/${this.folderOption.type}/assets/${this.folderOption.assetInfo.entityUuid}`
                const params = {
                    directories: this.folders
                }
                this.$store.commit('DIRECTORIES_REMOVEFILE', { assetInfo: this.folderOption.assetInfo, directories: this.folders })
                this.$http.put(url, params)
                    .then(res => {
                        const newAsset = res.data.data
                        this.$bus.$emit('updateAssetDirectoriesSuccess', { entityUuid: this.folderOption.assetInfo.entityUuid, directories: this.folders, newAsset })
                        // if (res.data.status === 200) {
                            // this.$message.success('附件信息更新成功')
                        // }
                    }).catch(err => {
                        this.$message.error(err.error || '资产附件更新失败，请稍后再试')
                    })
            },
            base64Encode (arrStr) {
                let rv
                rv = encodeURIComponent(arrStr)
                rv = unescape(rv)
                rv = window.btoa(rv)
                return rv
            },
            downloadZip (directories, folder) {
                this.$store.dispatch('packingFile', { asset: this.folderOption.assetInfo, directories })
                // const url = `${this.$apiUrl.edocUrl}/biz/v1.0/asset-type/asset/assets/${this.folderOption.assetInfo.entityUuid}/download-directory-encode/${directories}`
                // const url = `${this.$apiUrl.edocUrl}/biz/v1.0/asset-type/asset/assets/${this.folderOption.assetInfo.entityUuid}/package-download`
                // this.$http({
                //     method: 'POST',
                //     url: url,
                //     data: directories,
                //     responseType: 'blob'
                // }).then(response => {
                //     let blob = new Blob([response.data], { type: 'application/zip' })
                //     let url = window.URL.createObjectURL(blob)
                //     const link = document.createElement('a') // 创建a标签
                //     link.href = url
                //     link.download = (folder && folder.name) || '附件'
                //     link.click()
                //     URL.revokeObjectURL(url)
                // }).catch(error => this.$message.error(error))
            },
            handleSetFileIcon (file) {
                let type = file.type
                if (type.includes('pdf')) {
                    return 'iconpdf iconpdfColor'
                } else if (type.includes('excel') ||
                    type.includes('xlsx') ||
                    type.includes('xls')) {
                    return 'iconexcel iconexcelColor'
                } else if (type.includes('png') ||
                    type.includes('jpeg') ||
                    type.includes('jpg')) {
                    return 'iconpng iconpngColor'
                } else {
                    return 'el-icon-document'
                }
            },
            initialize () {
                this.foldesAndAttachments = []
                this.folderPath = []
                this.firstOpenFolder = {}
                this.contextItem = {}
                this.currentFolder = {}
                this.fileData = {
                    previewSrc: ''
                }
            },
            treeColumnContextmenu (params) { // e  parentId
                if (!this.canUpload) return
                if (!$(params.e.target).hasClass('docSetting')) {
                    $('.blank-upload').removeClass('show')
                    return
                } else {
                    $('.dropSelect').removeClass('show')
                }
                const x = params.e.x
                const y = params.e.y
                $('.blank-upload').addClass('show')
                $('.blank-upload').css({
                    'left': x + 'px',
                    'top': y + 'px'
                })
                this.blackUploadParentId = params.parentId
            },
            blankUpload () {
                this.currentFolder = this.foldesAndAttachments[Number(this.blackUploadParentId - 1)]
                this.$refs['contextUpload'].triggerUpload()
                $('.blank-upload').removeClass('show')
            },
            /* invoiceOCR */
            invoiceOCR (file) {
                this.$http.post(`${this.$appConst.ocrUrl}/image/file`, file)
                    .then(res => {
                        if (res.data.status === 200) {
                            this.invoiceData = res.data.data
                            this.invoiceData['invoiceTotalAmount'] = res.data.data.total
                            this.checkInvoice('zbj', res.data.data)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
            },
            checkInvoice (urltype, invoice) { // zbj/htjs
                const params = {
                    checkCode: this.invoiceData.checkCode && this.invoiceData.checkCode.slice(-6),
                    fpdm: this.invoiceData.code,
                    fphm: this.invoiceData.number,
                    kprq: this.invoiceData.issueDate.replace(/年|月|日|-|\//g, ''),
                    noTaxAmount: this.invoiceData.totalAmount
                }
                const url = `${this.$appConst.invoiceCheck}/validation/${urltype}/base` + (urltype === 'zbj' ? '/screenshot' : '')
                this.$http.post(url, params)
                    .then(res => {
                        if (res.data.status === 200) {
                            if (this.saveInvoice) {
                                this.saveInvoiceDetail(invoice, res.data.data)
                            } else {
                                this.$http.get(res.data.data.screenshotURI)
                                    .then(res => {
                                        this.downloadScreenshot(res.data, '验证截图')
                                    })
                            }
                            // this.updateAssetInfos(true)
                        } else {
                            if (this.saveInvoice) {
                                this.saveInvoiceDetail(invoice)
                            } else {
                                this.$message.error('发票查验失败，请稍后再试')
                            }
                        }
                    }).catch(err => {
                        urltype === 'zbj' && this.checkInvoice('htjs', invoice)
                        urltype === 'htjs' && this.saveInvoiceDetail(invoice)
                        console.log(err)
                    })
            },
            saveInvoiceDetail (invoice, checkResult) {
                if (!this.saveInvoice) return
                const url = `${this.$appConst.edocUrl}/biz/v1.0/abs-invoice/adds`
                const params = [{
                    'date': invoice.issueDate.replace(/年|月|日|-|\//g, ''),
                    'invoiceCode': invoice.code,
                    'invoiceNo': invoice.number,
                    'checkCode': invoice.checkCode,
                    'taxAmount': invoice.totalTax,
                    'noTaxAmount': invoice.totalAmount,
                    'vdtImageUrl': (checkResult && checkResult.screenshotURI) || '',
                    'status': checkResult && checkResult.screenshotURI ? Boolean(true) : Boolean(false),
                    'assetEntityUuid': this.folderOption.assetInfo.entityUuid,
                    'assetSign': '',
                    'invoiceDetailInfo': ''
                }]
                this.$http.post(url, params)
                    .then(res => {
                        if (res.data.status === 200) {
                            clearTimeout(this.tipsTimer)
                            this.tipsTimer = setTimeout(() => {
                                this.$message.success(checkResult ? '发票查验成功并添加至明细' : '发票查验失败但已添加至明细')
                                clearTimeout(this.tipsTimer)
                            }, 500)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
            },
            /* updateAssetInfos (text) {
                const assetInfos = this.folderOption.assetInfo.assetInfos
                const invoiceConstantName = Object.values(this.$appConst.invoiceConstant)
                const invoiceConstantKeys = Object.keys(this.$appConst.invoiceConstant)
                let index = null
                assetInfos.map(item => {
                    if (invoiceConstantName.includes(item.name)) {
                        index = invoiceConstantName.indexOf(item.name)
                        if (item.name === this.$appConst.invoiceConstant.checkStatus) {
                            item.value = text
                        } else {
                            item.value = this.invoiceData[invoiceConstantKeys[index]]
                        }
                    }
                })
                const url = `${this.$appConst.edocUrl}/biz/v1.0/asset-type/asset/assets/${this.folderOption.assetInfo.entityUuid}`
                const params = {
                    assetInfos: assetInfos
                }
                this.$http.put(url, params)
                    .then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('发票信息更新成功')
                        }
                    }).catch(err => {
                        this.$message.error(err.error || '发票信息更新失败，请稍后再试')
                    })
            }, */
            manualInput (text) {
                const { issueDate, code, number, total } = this.$appConst.invoiceConstant
                const invoiceConstant = Object.assign({}, { issueDate, code, number, total })
                const invoiceConstantKeys = Object.keys(invoiceConstant)
                const invoiceConstantName = Object.values(invoiceConstant)
                let count = 0
                for (let i = 0; i < invoiceConstantKeys.length; i++) {
                    if (this.invoiceData[invoiceConstantKeys[i]] && this.invoiceData[invoiceConstantKeys[i]].trim().length) {
                    } else {
                        this.$message.error(`请输入${invoiceConstantName[i]}`)
                        invoiceConstantKeys[i] === 'total' ? $(`.info input:eq(${i + 1})`).focus() : $(`.info input:eq(${i})`).focus()
                        count += 1
                        break
                    }
                }
                if (!count) {
                    if ((this.invoiceData['checkCode'] && this.invoiceData['checkCode'].trim().length) || (this.invoiceData['totalAmount'] && this.invoiceData['totalAmount'].trim().length)) {
                            if (text === 'check') {
                                this.checkInvoice('zbj')
                            } else if (text === 'pass') {
                                // this.updateAssetInfos(false)
                            }
                    } else {
                        this.$message.error('发票验证码或者不含税金额不能为空')
                        this.invoiceData['checkCode'] && this.invoiceData['checkCode'].trim().length ? $(`.info input:eq(5)`).focus() : $(`.info input:eq(3)`).focus()
                    }
                }
            },
            downloadScreenshot (content, fileName) { // 下载base64图片
                var base64ToBlob = (code) => {
                    let raw = window.atob(code)
                    let rawLength = raw.length
                    let uInt8Array = new Uint8Array(rawLength)
                    for (let i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i)
                    }
                    return new Blob([uInt8Array], {
                        type: 'image/png'
                    })
                }
                let aLink = document.createElement('a')
                let blob = base64ToBlob(content) // new Blob([content]);
                let evt = document.createEvent('HTMLEvents')
                evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                aLink.download = fileName
                aLink.href = URL.createObjectURL(blob)
                aLink.click()
            },
            exportAsset () {
                this.$parent.exportAsset()
            },
            mouseUp () {
              cursorResize.doUp()
            },
            mouseMove () {
              cursorResize.doMove()
            },
            mouseDown () {
              cursorResize.doDown()
            }
        },
        components: {
            folderAndAttachment,
            uploadComponent,
            pdfViewer
        }
    }
</script>
<style lang="less" scoped>
    .doc {
        .imgWrap {
            // position: relative;
            display: flex;
            flex-direction: column;
            flex: 1;
            // height: 100%;
            // max-width: 400px;
            margin: 0 auto;
            overflow-y: auto;
            padding: 10px 0;
            box-sizing: border-box;
            .imgCont {
                margin-top: 30px;
                margin-bottom: 14px;
                display: flex;
                justify-content: center;
                width: 100%;
                height: 350px;
                position: relative;
                .invoice-ocr-inimg{
                    display: none;
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    background: #0069D9;
                    color: #fff;
                    border: none;
                    font-size: 14px;
                    padding: 5px 8px;
                    height: 30px;
                    z-index: 555;
                }
                &:hover .invoice-ocr-inimg{
                    display: block;
                }
                /deep/.el-image{
                    min-width: 40px;
                    min-height: 40px;
                    padding-top: 18px;
                    .el-image-viewer__close{
                        background: #808080;
                        opacity: 1;
                    }
                }
            }
            .img {
                width: 80%;
                height: auto;
            }
            p {
                font-size: 18px;
                font-weight: 550;
                color: #333333;
            }

            .info {
                display: flex;
                justify-content: center;
                width: 100%;
                ul {
                    margin-top: 30px;
                    // width: 195px;

                    li {
                        display: flex;
                        justify-content: space-between;
                        height: 34px;
                        line-height: 34px;
                        font-size: 12px;

                        i:nth-child(1) {
                            color: #999;
                            width: 152px;
                            text-align: right;
                        }

                        i:nth-child(2) {
                            margin-left: 18px;
                            display: inline-block;
                            color: #333;
                        }
                        /deep/.el-input--mini .el-input__inner{
                            border-color: #fff;
                            border-radius: 0;
                            &:focus, &:hover{
                                border-color:#999999
                            }
                        }
                    }
                }
            }
            .invoice-ocr{
                margin-top: 20px;
                text-align: center;
                .el-button{
                    background: none;
                    color: #333333;
                    border-radius: 0;
                    border-color: rgba(237,237,237,1);
                    &:first-child{
                        background: rgba(248,252,255,1);
                        border:1px solid rgba(0,145,255,1);
                        color: #0091ff;
                    }
                }
            }
            /deep/.el-image{
                .el-icon-circle-close{
                    color: #fff;
                }
            }
        }
        .pdfimgWrap{
            max-width: 80%;
            .imgCont{
                min-height: 200px;
                height: 85%;
                overflow: auto;
            }
            .pdf-viewer{
                cursor: pointer;
            }
        }
        .nofile{
            position: relative;
            .imgCont{
                display: block;
                text-align: center;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                margin: 0;
                height: 230px;
                // .img{
                //     width: 300px;
                //     height: 300px;
                // }
                .tips{
                    width: 262px;
                    color: #999999;
                    font-size: 12px;
                    position: absolute;
                    top: 109px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            .upload {
                width: 350px;
                margin: 30px auto 0;
                /deep/.uploadBtn{
                    position: relative;
                    // top: 50px;
                }
            }
        }
        .noFolder{
            text-align: center;
            margin: 0 auto;
            p{
                color: #666666;
                margin-top: 20px;
            }
        }
        .popover-content{
            max-height: 300px;
            overflow: auto;
        }
        .blank-upload{
            position: fixed;
            width: 80px;
            height: 24px;
            line-height: 24px;
            // border: 1px solid #999;
            box-shadow: 0px 0px 8px 0px rgba(52, 57, 87, 0.1);

        }
        .export-asset{
            font-size: 29px;
            position: absolute;
            right: 75px;
            top: -8px;
            cursor: pointer;
            color: #666;
        }
    }
</style>
