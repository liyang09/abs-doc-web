<template>
<el-dialog title="申请审批" :visible.sync="addMessageVisiable" @close="close" width="700px">
    <el-form :model="form" ref="form">
        <el-form-item label="是否通过:" prop="requestStatus">
            <el-radio v-model="form.requestStatus" label="CONFIRM">通过</el-radio>
            <el-radio v-model="form.requestStatus" label="REJECT">不通过</el-radio>
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
                @click="sure()" class="primaryButton">
            确 定
        </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            addMessageVisiable:false,
            id: '',
            form: {
                requestStatus: 'CONFIRM',
                comment: ''
            },
        }
    },
    methods: {
        show(row) {
            this.addMessageVisiable = true
            this.id = row.id
        },
        close() {
            this.addMessageVisiable = false
            this.form.comment = ''
        },
        sure() {
            const params = {
                id: this.id,
                requestStatus:this.form.requestStatus,
                comment:this.form.comment
            };
            this.loading = true;
            const url = `${this.$apiUrl.applyUrl}`;
            this.$http.post(url,params)
              .then(res => {
                this.loading = false;
                if (res.data.status !== 200) return;
                this.$message.success('审批成功');
                this.close()
              }).catch(err => {
                this.loading = false;
                this.$message.warning(err.message || '服务器错误，请稍后再试!');
              });
        }  
    }
}
</script>
<style lang="less" scoped>

</style>