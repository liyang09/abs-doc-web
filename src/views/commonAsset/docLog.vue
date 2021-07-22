<template>
    <div class="tree-box">
        <h3 style="margin-left: 20px;">文件目录：</h3>
        <div class="contractInfo attachment" style="padding-bottom:30px;overflow:hidden;">
            <div class="tree1">
                <div  v-for='(item, index) in treeData'
                        :key='index'
                        class="treeItem1"
                        :class="{'treeItem1Active': item.open}"
                        @click="handelCatalog(item)">
                    <div style="float: left;" class="ellipsis">
                        <img class='folderImg fl' :src='$global.imgUrl.folder' alt='folderImg'>
                        <!-- <i class="el-icon-document" v-if="!item.subDirectories.length" style="font-size:16px; margin-right: 5px;"></i> -->
                        <el-tooltip placement="bottom-start" popper-class="areabox">
                          <div slot="content">{{item.name}}</div>
                          <span>{{item.name}}</span>
                        </el-tooltip>
                    </div>
                    <div style="float:right;">
                        <span class="textR" @click.stop="handelUploadDoc(item)" v-if="ifEdit">上传</span>
                        <i class="el-icon-caret-right" v-if="item.subDirectories.length"></i>
                    </div>
                </div>
            </div>
            <div class="tree1">
                <div  v-for='(item, index) in treeData2'
                        :key='index'
                        class="treeItem1"
                        :class="{'treeItem1Active': item.open}"
                        @click="handelCatalog2(item)">
                    <div style="float: left;" class="ellipsis">
                        <img class='folderImg fl' :src='$global.imgUrl.folder' alt='folderImg'>
                        <el-tooltip placement="bottom-start" popper-class="areabox">
                          <div slot="content">{{item.name}}</div>
                          <span>{{item.name}}</span>
                        </el-tooltip>
                    </div>
                    <div style="float:right;">
                        <span class="textR" @click.stop="handelUploadDoc(item)" v-if="ifEdit">上传</span>
                        <i class="el-icon-caret-right" v-if="item.subDirectories.length"></i>
                    </div>
                </div>
            </div>
            <div class="tree1">
                <div  v-for='(item, index) in treeData3'
                        :key='index'
                        class="treeItem1"
                        :class="{'treeItem1Active': item.open}"
                        @click="handelCatalog3(item)">
                    <div style="float: left;" class="ellipsis">
                        <img class='folderImg fl' :src='$global.imgUrl.folder' alt='folderImg'>
                        <el-tooltip placement="bottom-start" popper-class="areabox">
                          <div slot="content">{{item.name}}</div>
                          <span>{{item.name}}</span>
                        </el-tooltip>
                    </div>
                    <div style="float:right;">
                        <!-- <i class="el-icon-caret-right" v-if="item.name"></i> -->
                        <span class="textR" @click.stop="handelUploadDoc(item)" v-if="ifEdit">上传</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="fujianShow" style="padding-left:15px;margin-bottom:20px;">
            <h4>您要上传的文件如下：</h4>
            <p v-for="(item,index) in attachmentss" :key="index">
                <span>目录 <b>{{item.type}}</b> 下的文件：</span>
                <a style="cursor:pointer; color: blue;" @click="showFileDetail(item)" :title="item.fileName" target="_blank"> <i class="el-icon-document"></i>{{item.fileName}}</a>
                <i class="el-icon-delete" style="cursor: pointer; margin-left: 20px;" @click="deleteDoc(item)" v-if="ifEdit"></i>
            </p>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent3" title="目录上传附件" width="50%">
            <uploadFileComponent ref="uploadFileComponent3" title="上传" titleShow="false" :acceptNew="acceptNew" :limit="limit" :assetType="assetType"></uploadFileComponent>
            <div style="text-align:center;margin-top:20px;">
               <el-button type="primary" size="small" @click="fujianSure()" class="primaryButton" style="width:70px;height:40px;">确定</el-button>
            </div>
        </dialogCommonComponent>
        <show-file-detail ref="showFileDetail"></show-file-detail>
      
    </div>
</template>

<script>
/* eslint-disable */
import uploadFileComponent from '@/components/uploadFileComponent';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import showFileDetail from '@/components/showFileDetail.vue'

export default {
  name: 'document',
  data() {
    return {
        attachmentss: [],
        fujianShow: false,
        typeName: '',
        treeData3: [],
        treeData2: [],
        treeData: [],
        ifEdit:false
    };
  },
  props: ['assetType'],
  components: {
    showFileDetail,
    uploadFileComponent,
    dialogCommonComponent,
  },
  computed: {
    acceptNew(){
        if(this.assetType == 'TRADEINVOICE'){
            return 'png,jpg';
        }
        else{
            return 'PDF,pdf'
        }
    },
    limit(){
        if(this.assetType == 'TRADEINVOICE'){
            return 1;
        }else{
            return 100;
        }
    },
  },
  created() {

  },
  methods: {
      setIfEdit(state){
          this.ifEdit = state;
      },
      init(directoriesList) {
        this.treeData = JSON.parse(directoriesList);
        this.treeData2 = [];
        this.treeData3  = [];
        this.attachmentss = [];
        this.fujianShow = false;
        if(this.treeData.length && this.treeData) {
          this.treeData.forEach(v => {
            v.open = false;
          });
        }
      },
      setAttachments(fileList){
          this.fujianShow = true;
          console.log(fileList,'FILELIST');
          this.attachmentss = fileList;
      },
      resetFileList(){
          this.attachmentss = [];
      },
      getFile() {
        return this.attachmentss;
      },
      showFileDetail(file) {
          this.$refs.showFileDetail.showFile(file);
      },
      deleteDoc(file) {
          this.attachmentss.map((val, index) => {
              if(val.fileId == file.fileId) {
                  this.attachmentss.splice(index,1);
              }
          })
      },
      handelCatalog3(row) {
          this.treeData3.forEach(v => {
            v.open = false;
          });
          row.open = true;
      },
      handelCatalog2(row) {
          this.treeData2.forEach(v => {
            v.open = false;
          });
          row.open = true;
          this.treeData3 = row.subDirectories;
      },
      handelCatalog (row) {
          this.treeData.forEach(v => {
            v.open = false;
          });
          row.open = true;
          this.treeData2 = row.subDirectories;
          this.treeData3 = [];
      },
      handelUploadDoc(row) {
          this.typeName = row.name;
          this.$refs.dialogCommonComponent3.show();
      },
      close() {
        this.$bus.$emit('closeDialog');
      },
      fujianSure() {
          this.fujianShow = false;
          var attachments1 = this.$refs.uploadFileComponent3.getFile();
          attachments1.map( val => {
              if (!val.type) {
                  val['type'] = this.typeName;
              }
          })
          this.attachmentss = this.attachmentss.concat(attachments1);
          this.close();
          this.fujianShow = true;
          this.$refs.uploadFileComponent3.resetFileList();
      },
  }
};
</script>

<style lang="scss" scoped>
    .tree1 {
        width: 30%;
        height: 100px;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        float: left;
        overflow: auto;
    }
    .treeItem1 {
        width: 100%;
        height: 25px;
        /* margin-right: 10px; */
        margin-top: 10px;
        margin-bottom: 5px;
        padding: 5px;
        line-height: 25px;
        cursor: pointer;
    }
    .treeItem1:hover {
        background: #caa14f!important;
        color: #fff!important;
    }
    .treeItem1:hover .textR {
        color:#fff!important;
    }
    .folderImg {
        width: 20px;
        height: 20px;
    }
    .fl {
        float: left;
    }
    .treeItem1Active {
      background: #caa14f !important;
      color: #fff !important;
    }
    .treeItem1Active .textR {
        color:#fff!important;
    }
</style>
