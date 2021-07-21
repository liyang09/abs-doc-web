<template>
<el-dialog :title="title" :visible.sync="addMessageVisiable" @close="close" width="700px">
    <el-form :rules="rules" :model="form" ref="form" label-width="130px" style="width: 580px; ">
        <el-form-item prop="projectName" label="项目名称">
            <el-input
                v-model="form.projectName"
                :placeholder="inputPlaceholder"
            ></el-input>
        </el-form-item>
        <el-form-item prop="department" label="部门名称" v-show="this.title !== '修改项目'">
            <el-select style="width: 100%" 
                v-model="form.department" placeholder="请选择">
            <el-option
                v-for="item in departmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
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
        value: '',
        projectId: '',
        addMessageVisiable: false,
        inputPlaceholder: '请输入项目名称',
        form: {
            projectName: '',
            department: ''
        },
        departmentList: [
            { label: "FIN_INSTITUTION", value: "FIN_INSTITUTION" }
        ],
        rules: {
            'projectName': [
                { required: true, message: '请输入项目名称！', trigger: 'blur', type: 'string' }
            ],
            'department': [
                { required: true, message: '请选择部门名称！', trigger: 'blur' }
            ]
        }
    }
},
methods: {
    // 确定
    addMessageSure() {
        this.addMessageVisiable = false
        if (this.title === '修改项目') {
            this.edit()
        } else {
            if(!this.form.projectName){
                this.addMessageVisiable = true
                this.$message.error('请填写数据');
                return;
            } else{
                this.add()
            }
        }
    },
    add() {
        const params = {
            projectName: this.form.projectName,
            department: this.form.department
        };
        this.loading = true;
        const url = `${this.$apiUrl.createdUrl}`;
        this.$http.post(url,params)
            .then(res => {
            this.loading = false;
            if (res.data.status !== 200) return;
            this.close();
            this.$emit('search');
            }).catch(err => {
            this.loading = false;
            this.$message.warning(err.message || '服务器错误，请稍后再试!');
            });
    },
    edit() {
        const params = {
            id: this.projectId,
            projectName: this.form.projectName
        };
        this.loading = true;
        const url = `${this.$apiUrl.editUrl}`;
        this.$http.post(url,params)
            .then(res => {
            if (res.data.status !== 200) return;
            this.loading = false;
            this.form.projectName = ''
            this.$emit('search');
            }).catch(err => {
            this.loading = false;
            this.$message.warning(err.message || '服务器错误，请稍后再试!');
            });
    },
    close() {
      this.addMessageVisiable = false
      this.form.projectName = ''
       this.form.department = '' 
      this.reset()
    },
    addShow() {
        this.addMessageVisiable = true
    },
    editShow(list) {
        this.projectId = list.id
        this.form.projectName = list.projectName
        this.addMessageVisiable = true
    },
    reset() {
        this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        });
    },
}
}
</script>
<style lang="less" scoped>

</style>
