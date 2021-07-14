<template>
  <div style='width: 237px;' :class='"docSetting docSetting" + parentId' @contextmenu.prevent='(event) => treeColumnContextmenu(event)'>
    <div v-if="parentId === '0'" class="all-select" @click.stop="">
        <el-checkbox v-model="checked" @change="allCheckChange">全选</el-checkbox>
        <el-button @click="allDownload" v-if="allDownloadVisible">{{checked ? '全部' : ''}}下载</el-button>
    </div>
    <div class="all-select" @click.stop="" v-if="ifButtonShow() && attachments && attachments.length > 0">
        <el-checkbox v-model="attachmentChecked" @change="allAttachmentCheck">全选</el-checkbox>
        <el-button @click="invoiceCheck" v-if="allInvoiceCheckVisible">识别查验</el-button>
        <el-button @click="batchDownload" v-if="allInvoiceCheckVisible">下载</el-button>
        <el-button @click="batchDelete" v-if="allInvoiceCheckVisible">删除</el-button>
        <!-- <el-tooltip class="item" effect="dark" :content="saveInvoice ? '发票查验后保存明细' : '发票查验后不保存明细'" placement="top-start">
            <el-switch :value="saveInvoice" @change="saveInvoiceChang"> </el-switch>
        </el-tooltip> -->
    </div>
    <div v-for='(item, index) in folders' :key="item.name" class='itemWarp' @click.stop="" >
      <div
          :class='"treeItem boxSizing cursor treeItem"+item.name'
          @click='handleTreeItemClick(item, index)'
          @contextmenu.prevent='(event) => handleTreeItemContextmenu(item, index, event)'
          >
          <div class="folder-name">
              <span @click.stop="">
                  <el-checkbox v-model="item.checked" v-if="parentId === '0'" @change="checkChange"></el-checkbox>
              </span>
              <img class='folderImg' :src='$global.imgUrl.folder' alt='folderImg' />
              <span>{{ item.name }}</span>
              <span class="weight">{{ item.weight }}%</span>
          </div>
          <div class='treeItemRight'>
              <i class='triangle iconfont icontriangle' v-if="(item.attachments && item.attachments.length) || (item.subDirectories && item.subDirectories.length)"></i>
          </div>
          <ul class='dropSelect hide' @click='handleContextmenuClick(item, $event)'>
              <li val='upload' class='textCenter cursor dropSelectItem' v-if="canUpload">
                  上传
              </li>
              <li val='download' class='textCenter cursor dropSelectItem' v-if="canDownLoad">
                  下载
              </li>
              <!-- <li val='delete' class='textCenter cursor dropSelectItem'>
                  删除
              </li> -->
          </ul>
      </div>
    </div>
    <div v-for='(item, index) in attachments' :key="item.fileId" class='itemWarp' @click.stop="" >
      <div
          :class='"treeItem boxSizing cursor treeItem"+item.fileId'
          @click='handleTreeItemClick(item, index)'
          @contextmenu.prevent='(event) => handleTreeItemContextmenu(item, index, event, "file")'
          >
          <div>
            <span @click.stop="" >
                <el-checkbox  v-model="item.checked" @change="attachmentCheckChange"></el-checkbox>
            </span>
              <i v-if='item.fileName&&(item.fileName.includes(".xlsx") || item.fileName.includes(".xls"))' class='folderImg iconfont iconexcel' style='font-size: 16px; color: #04B67C;'></i>
              <i v-else class='folderImg iconfont iconpng' style='color: #FA6400; font-size: 16px;'></i>
              <el-tooltip v-if="overWidth(item.fileName)" effect="dark" :content="item.fileName" placement="top-start">
                <span>{{ item.fileName }}</span>
              </el-tooltip>
              <span v-else>{{ item.fileName }}</span>
              <span class="invoice-ocr" v-if="ifButtonShow() && canUpload && item.contentType.includes('image')" @click="invoiceOCR(item)">发票识别</span>
          </div>
          <ul class='dropSelect hide' v-if="parentId !== '0'" @click='handleContextmenuClick(item, $event)'>
              <li val='download' class='textCenter cursor dropSelectItem' v-if="canDownLoad">
                  下载
              </li>
              <li val='delete' class='textCenter cursor dropSelectItem' v-if="canUpload">
                  删除
              </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
        name: 'folder',
        props: { parentId: String, folders: Array, attachments: Array, canUpload: Boolean, saveInvoice: Boolean },
        data () {
            return {
              operType: null,
              checked: false,
              allDownloadVisible: false,
              attachmentChecked: false,
              allInvoiceCheckVisible: false
            }
        },
        computed: {
            canDownLoad () {
                console.log(this.$route.name, 'this.$route.name', this.$route)
                return (this.$route.path === '/commonAsset2/com.evisible.entity.base.common.entity.AssetEntity' || this.$route.name === 'projectManagement')
            }
        },
        watch: {
            attachments () {
                const selectedLength = this.attachments.filter(item => item.checked).length
                if (selectedLength && selectedLength === this.attachments.length) {
                    this.attachmentChecked = true
                } else {
                    this.attachmentChecked = false
                }
                this.allInvoiceCheckVisible = selectedLength
            }
        },
        created () {
          $('#app').on('click', (e) => {
            e.stopPropagation()
            if (!$(e.target).hasClass('dropSelectItem')) {
              $('.dropSelect').removeClass('show')
            }
            if (!$(e.target).hasClass('el-checkbox__original') && !$(e.target).hasClass('el-el-checkbox__inner')) {
                this.checked = false
                this.allCheckChange()
            }
          })
        },
        methods: {
            ifButtonShow () {
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
            handleTreeItemClick (item, index) {
                $('.docSetting' + this.parentId).find('.treeItem').removeClass('active')
                $('.treeItem' + (item.name || item.fileId)).addClass('active')
                if (item.fileId && item.fileName) {
                    this.$emit('fileData', item)
                    return
                }
                this.$emit('handleTreeItemClick', item, index, this.parentId)
            },
            handleTreeItemContextmenu (item, index, event, file) {
                // $('.docSetting' + this.parentId).find('.treeItem').removeClass('active')
                $('.contextMenu-active').removeClass('contextMenu-active')
                $('.treeItem' + (file ? item.fileId : item.name)).addClass('contextMenu-active')
                $('.dropSelect').removeClass('show')
                $('.docSetting' + this.parentId).find('.treeItem').eq(file ? (this.folders.length + index) : index).find('.dropSelect').addClass('show')
                this.$emit('handleTreeItemContextmenu', item, index, this.parentId)
            },
            handleContextmenuClick (item, e) {
                e.stopPropagation()
                $('.dropSelectItem').removeClass('active')
                $(e.target).addClass('active')
                this.operType = $(e.target).attr('val')
                $('.dropSelect').removeClass('show')
                this.$emit('handleContextmenuClick', this.operType, item)
            },
            checkChange () {
                const selectedLength = this.folders.filter(item => item.checked).length
                if (selectedLength && selectedLength === this.folders.length) {
                    this.checked = true
                } else {
                    this.checked = false
                }
                this.allDownloadVisible = selectedLength
            },
            allCheckChange () {
                this.folders.map(item => {
                    item.checked = this.checked
                })
                this.allDownloadVisible = this.checked
            },
            allDownload () {
                this.$emit('allDownload')
            },
            batchDownload () {
                let fileNames = []
                this.attachments.map(item => {
                    if (item.checked) {
                        fileNames.push(item.fileName)
                    }
                })
                this.$emit('filesBatchDownload', fileNames)
                // this.attachments.map(item => {
                //     if (item.checked) {
                //         window.open(`${this.$apiUrl.downUrl}/${item.fileId}`)
                //     }
                // })
            },
            batchDelete () {
                const temAttachments = this.attachments.filter(item => !item.checked)
                const delAttachments = this.attachments.filter(item => item.checked)
                this.$emit('batchDelete', temAttachments, delAttachments)
            },
            treeColumnContextmenu (e) {
                this.$emit('treeColumnContextmenu', { e, parentId: this.parentId })
            },
            /* invoiceOCR */
            allAttachmentCheck () {
                this.attachments.map(item => {
                    item.checked = this.attachmentChecked
                })
                this.allInvoiceCheckVisible = this.attachmentChecked
            },
            attachmentCheckChange () {
                const selectedLength = this.attachments.filter(item => item.checked).length
                if (selectedLength && selectedLength === this.attachments.length) {
                    this.attachmentChecked = true
                } else {
                    this.attachmentChecked = false
                }
                this.allInvoiceCheckVisible = selectedLength
            },
            invoiceOCR (file) {
                this.$emit('invoiceOCR', file)
            },
            invoiceCheck () {
                this.attachments.map(item => {
                    if (item.checked && item.contentType.includes('image')) {
                        this.$emit('invoiceOCR', item)
                    }
                })
            },
            saveInvoiceChang (val) {
                this.$emit('saveInvoiceChange', val)
            },
            /* tooltip */
            overWidth (fileName) {
              if (fileName.length > 14) {
                return true
              }
              return false
            }
        }
    }

</script>

<style scoped lang='less'>
    .docSetting {
        height: calc(100vh - 200px);
        border-right: 2px solid #EBEEF5;
        .all-select {
          padding: 5px 11px;
          background: #FAFAFA;
          .el-checkbox{
              margin-right: 15px;
          }
          .el-button{
              font-size: 12px;
              padding: 3px;
              background: #0091FF;
              color: #fff;
              border-color: #0091FF;
              border-radius: 2px;
              outline: none;
          }
        }
        .addFolder {
            margin-top: 10px;
            height: 28px;
            line-height: 26px;
            border: 1px solid #E59D28;
            color: #E59D28;
        }
        .itemWarp {
            position: relative;
            //width: 237px;
            // height: 100%;
            // border-right: 1px solid #EBEEF5;

            .treeItem {
                position: relative;
                // display: flex;
                // justify-content: space-between;
                padding: 0 6px 0 11px;
                height: 25px;
                line-height: 25px;
                color: #333;
                margin: 3px 0;
                >div{
                    height: 25px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .folderImg {
                    margin-right: 5px;
                    width: 14px;
                    height: 14px;
                    position: relative;
                    top: 2px;
                }

                .triangle {
                    font-size: 12px;
                    color: #7F7F7F;
                }

                .treeItemEdit {
                    width: 90px;
                    height: 20px;

                    /deep/ .el-input__inner {
                        padding: 0 3px;
                        height: 20px !important;
                        line-height: 20px !important;
                        border-radius: 0;
                        background: #B1D8FF;
                    }

                }

                .treeItemRight {
                    position: absolute;
                    right: 6px;
                    top: 0;
                }

                /deep/ .dropSelect {
                    position: absolute;
                    right: 15px;
                    top: 12px;
                    width: 80px;
                    background: #fff;
                    box-shadow: 0px 0px 8px 0px rgba(52,57,87,0.1);
                    z-index: 3;

                    .dropSelectItem {
                        height: 24px;
                        line-height: 24px;
                        font-size: 12px;
                        color: #343957;
                    }

                    .dropSelectItem:nth-child(2) {
                        border-top: 1px solid #EDEDED;
                        border-bottom: 1px solid #EDEDED;
                    }

                    .dropSelectItem.active {
                        background: #318EFA;
                        color: #fff;
                    }
                }

                &:hover .invoice-ocr{
                    display: inline;
                }
            }

            .treeItem.active {
                color: #fff;
                background: #0069D9;

                .triangle {
                    color: #fff !important;
                }
            }
            .el-checkbox {
                width: 20px;
                margin: 0;
            }
            .folder-name{
                .weight{
                    float: right;
                    margin-right: 13px;
                }
            }
        }
        .contextMenu-active{
            border: 1px solid #5dacfd61;
        }
        .invoice-ocr{
            display: none;
            color: #1F8CFB;
            background: #fff;
            position: absolute;
            right: 0px;
            padding: 0 10px;
        }
    }
</style>
