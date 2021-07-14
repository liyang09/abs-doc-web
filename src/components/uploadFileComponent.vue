<template>
	<div>
        <div style="margin-bottom:20px;" v-show="titleShow!='false'">
            <protle-title-component>
                <span class="el-dialog__title">{{title}}</span>
            </protle-title-component>
        </div>
		<el-upload
		    class="upload-demo"
		    :action="upload"
		    :before-upload="handleBeforeUpload"
		    :on-preview="handlePreview"
		    :on-remove="handleRemove"
		    :headers="headers"
			:disabled='disabled'
			:on-exceed="handleExceed"
		    :multiple="multiple"
		    :limit="limit"
		    :on-success="handleSuccess"
		    :file-list="fileList"
		   
		    drag
		    :show-file-list="showFileList"
		    >
			<span class="uploadButton">点击上传</span>
		    <div class="el-upload__text" style="color:#999999;">或将文件拖到此处，大小不得超过30MB<span class="redColor">（仅支持{{acceptNew}}文件）</span></div>
		    <slot>
		    </slot>
		</el-upload>
		<show-file-detail ref="showFileDetail"></show-file-detail>
	</div>
</template>
<script>
  import protleTitleComponent from "@/components/protleTitleComponent";
	import showFileDetail from './showFileDetail.vue'
	export default {
		props: ["title", "titleShow",'acceptNew','limit','assetType'],
		data() {
			return {
				disabled: false,
		    fileList: [],
		    fileArr: [],
				fileListData: [], // 详情回显
				uuid:"",
				// acceptNew:'PDF,pdf',
				// limit:100,
				multiple:true
			}
		},
		computed: {
			headers(){
		  	return{
					"Authorization": sessionStorage.getItem("access_token"),
					// "client_id":"pGCXRYBmkbDS88Yls6CNBaD8YkHK7QPzFHFlG1m8IPIgD6T3L98ZnO82q67kj8R1",
					"client_id": this.$appConst.ClIENT_ID,
					"org_id": sessionStorage.getItem("orgId"),
        }
		  },
			upload(){
				if(this.assetType == 'TRADEINVOICE'){
					return this.$apiUrl.invoiceUpload;
				}else{
					return this.$apiUrl.uploadFileApi + '/'+ this.uuid;
				}
			},
			showFileList: function() {
				return true;
			}
		},
		methods: {
			handleExceed(files, fileList) {
				if(this.limit==1){
					this.$message.warning(`当前限制上传一个文件`);	
					return;
				}
			},
			handleBeforeUpload(file) {		
				var type = file.type.split('/')[1];		
				if(type == 'jpeg'){
					type = 'jpg';
				}
				if(!this.acceptNew.includes(type)){
					this.$message.warning('上传格式不正确');
					return false;
				}
		    	const isLt30M = file.size / 1024 / 1024 < 30    
                if(!isLt30M) {  
                    this.$message.warning("上传文件大小不能超过 30MB!")
                    return
                }
               	return isLt30M
		    },
			handlePreview(file) {
				let IEPDF = this.$global.isAcrobatPDFPluginInstalled();
				var vm = this;
	        	if(IEPDF) {
					if(this.assetType == 'TRADEINVOICE'){
						window.open(`${this.$apiUrl.fileQuery}${file.fileId}`);
					}else{
						vm.$refs.showFileDetail.showFile(file);
					}
	        	}else{
	        		this.$message.error("对不起,您还没有安装PDF阅读器软件呢,为了方便预览PDF文档,请选择安装！");
	        		location = 'http://ardownload.adobe.com/pub/adobe/reader/win/9.x/9.3/chs/AdbeRdr930_zh_CN.exe';
	        	}
			},
			handleRemove(file, fileList) {
                fileList.map((val, index) => {
                    if(val.fileId == file.fileId) {
                        fileList.splice(index,1);
                    }
                })
                this.fileList = fileList;
		    },
			handleSuccess(response, fileList, data) {
				if(data.length) {
					let arr = [];
					arr.push(fileList);
					this.handleFileData(arr);
				}
				this.uuid = this.$global.uuid(13,10);
			},
			handleFileData(file) {
				if(this.assetType == 'TRADEINVOICE'){
					 file.map((val, index) => {
						let json = {};
						json.uid = val.uid;
						json.size=val.size;
						json.fileId = val.response.data.fileId;
						json.fileName = val.name;
						json.name = val.name;
						json.filePath = val.response.data.fileId;
						json.contentType = val.raw.type;
						json.dataPoolURL = this.$appConst.fileQuery + val.response.data.fileId;
						this.fileList.push(json);
					})
				}else{
					file.map((val, index) => {
							let json = {};
							json.uid = val.uid;
							json.size=val.size;
							json.fileId = val.response.data.uuid;
							json.fileName = val.name;
							json.name = val.name;
							json.filePath = val.response.data.filepath;
							json.contentType = val.raw.type;
							json.dataPoolURL = this.$appConst.fileQuery + val.response.data.filepath;
							this.fileList.push(json);
					})
				}
		  },
			resetFileList() {
				this.fileList = [];
			},
			getFile() {
					return this.fileList;
			},
			init(attachments, isEdit) { // isEdit attachment 字段查询是否可编辑
				this.fileList = [];
				if (isEdit === false) {
					this.disabled = true;
					$('.el-upload-dragger').css('cursor', 'not-allowed');
					$('.upload-demo input').attr('disabled',true);
				} else {
					this.disabled = false;
					$('.el-upload-dragger').css('cursor', 'pointer');
					$('.upload-demo input').removeAttr('disabled');
				}
				this.fileList = JSON.parse(JSON.stringify(attachments));
				if (this.fileList && this.fileList.length > 0) {
					this.fileList.map(item=>{
							item.name = item.fileName;
					});
				}
			}
		},
		created() {
			
		
		},
        mounted() {
            this.uuid = this.$global.uuid(13,10);
        },
		components:{
			showFileDetail,
            protleTitleComponent
		},
	}
</script>
<style>
	.el-upload,el-upload--text,.el-upload-dragger {
		width: 100%;
	}
</style>