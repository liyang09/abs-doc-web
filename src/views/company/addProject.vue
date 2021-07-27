<template>
<el-dialog :title="title" :visible.sync="addMessageVisiable" @close="close" width="700px">
    <el-form :model="form" ref="form" label-width="130px" style="width: 580px; ">
        <el-form-item prop="projectCompany" label="公司名称:">
             <el-input
                v-model="form.projectCompany"
                placeholder="请输入项目合作公司全称,回车查询"
                @keyup.enter.native="obtainList">
            </el-input>
        </el-form-item>
        <el-form-item label="意见:" prop="comment">
            <el-input type="textarea" v-model="form.comment" class="comments"></el-input>
        </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:30px;">
        <el-button size="small" @click="close()">
            取 消
        </el-button>
        <el-button  size="small" type="primary"
                @click="addMessageSure()" class="primaryButton">
            确 定
        </el-button>
    </div>
</el-dialog>
</template>

<script>
export default {
props: ['title'],
data () {
    return {
        addMessageVisiable: false,
        companyList: [],
        inputPlaceholder: '请输入项目合作公司',
        id: '',
        projectEntityUuid: '',
        projectName: '',
        addr:'',
        orgId:'',
        assetType:'',
        form: {
            projectCompany: '',
            comment: ''
        },
    }
},
components: {
    
},
mounted() {
    
},
methods: {
    show(row) {
        console.log(row)
        this.addMessageVisiable = true
        this.id = row.id
        this.projectEntityUuid = row.entityUuid
        this.projectName = row.projectName
        this.assetType = row.assetType
    },
    // 确定
    addMessageSure() {
        if(!this.form.projectCompany){
            this.addMessageVisiable = true
            this.$message.warning('请选择合作公司!');
        } else {
            if(this.title != '修改项目公司'){
                if(this.companyList.length == 0) {
                    this.addMessageVisiable = true
                    this.$message.warning('请输入正确的公司全称')
                } else {
                    this.add()
                }
            }else{
                if(this.companyList.length == 0) {
                    this.addMessageVisiable = true
                    this.$message.warning('请输入正确的公司全称')
                } else{
                    this.edit()
                }
            }
        }
    },
    add() {
        const params = {
             addr: this.addr,
             attachments: [],
             comments: this.form.comment,
             orgId: this.orgId,
             id: this.id,
             orgName: this.form.projectCompany,
             projectEntityUuid: this.projectEntityUuid,
             projectName: this.projectName
        };
        this.loading = true;
        const url = `${this.$apiUrl.factoringAddOrg}`;
        this.$http.post(url,params)
            .then(res => {
                this.loading = false;
                if (res.data.status !== 200) return;
                this.$emit('search');
                this.close()
            }).catch(err => {
                this.$message.warning(err.message);
                this.loading = false;
            });
    },
    edit() {
        const params = {};
        this.loading = true;
        const url = `${this.$apiUrl.editCompany}/${this.projectEntityUuid}/${this.assetType}/updateAsset`;
        this.$http.post(url,params)
            .then(res => {
            this.loading = false;
            if (res.data.status !== 200) return;
            this.$message.success('修改成功');
            this.close()
            this.$emit('search');
            }).catch(err => {
            this.loading = false;
            this.$message.warning(err.message || '服务器错误，请稍后再试!');
            });
    },
    close() {
      this.addMessageVisiable = false
      this.form.projectCompany = ''
      this.form.comment = ''
      this.reset()
    },
    reset() {
        this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        });
    },
    obtainList() {
        this.addMessageVisiable = true
        let url = `${this.$apiUrl.orguserList}`;
        this.$http.get(url, { params: {orgName:this.form.projectCompany} })
        .then(res => {
            console.log(res.data.data)
            if(res.data.data.length == 0) {
                this.$message.warning('请输入正确的公司全称')
            }
            this.companyList = res.data.data;
            this.companyList.map(item => {
                this.addr = item.addr
                this.orgId = item.orgId
            })
        }).catch(err => {
            this.$message.warning(err.message || '服务器错误，请稍后再试!')
        })
    },
}
}
</script>
<style lang="less" scoped>

</style>
