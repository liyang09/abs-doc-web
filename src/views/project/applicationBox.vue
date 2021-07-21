<template>
<el-dialog title="申请审批" :visible.sync="addMessageVisiable" @close="close" width="700px">
    <el-form :model="form" ref="form">
        <el-form-item label="地址" prop="city">
            <el-input v-model="form.city" placeholder="请输入地址"></el-input>
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
        entityUuid: '',
        form: {
           city: '',
           comment: ''
        },
    }
},
components: {
    
},
methods: {
    show(id) {
        this.addMessageVisiable = true
        this.entityUuid = id
    },
    close() {
        this.addMessageVisiable = false
        this.form.city = ''
        this.form.comment = ''
    },
    sure() {
        const params = {
            projectEntityUuid: this.entityUuid,
            addr: this.form.city,
            commit:this.form.commit,
        };
        this.loading = true;
        const url = `${this.$apiUrl.projectRequest}`;
        this.$http.post(url,params)
            .then(res => {
                this.loading = false;
                if (res.data.status !== 200) return;
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