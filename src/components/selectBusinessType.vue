<template>
  <el-dialog v-dialogDrag  title="业务模式" :close-on-click-modal="false" :append-to-body="true"
              :visible.sync="dialogVisible"
              :before-close="close" width="500px">
        <span>请选择一个业务模式：</span>
        <el-select v-model="businessTypeVal" placeholder="请选择">
            <el-option
                    v-for="item in platFormOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <div style="text-align:center;margin-top:30px;">
            <el-button
                    size="small"
                    @click="close()">
                取 消
            </el-button>
            <el-button
                    :disabled="!businessTypeVal"
                    size="small"
                    type="primary"
                    class="primaryButton"
                    @click="handleDailogConfirm()">
                确 定
            </el-button>
        </div>
  </el-dialog>
</template>
<style  lang="scss">
.el-dialog__footer{
    text-align: center;
}
</style>

<script>

export default {
  data() {
    return {
      businessTypeVal:'',
      platFormOptions:[],
      dialogVisible: false
    };
  },
  props: ['title','width','cancelButtonShow'],
  mounted() {
    let vm = this;
    this.$bus.$on('closeDialog',function() {
      vm.dialogVisible = false;
    })
  },
  methods: {
    handleDailogConfirm() {
      if (!this.businessTypeVal){
        this.$message.error('请选择业务模式');
        return;
      }
      this.close();
      this.$emit('selectBusinessTypeClose',this.businessTypeVal);
    },
    async getPlatFormOptions(){
      var vm = this;
      vm.businessTypeVal = "";
      try{
        // 获取业务模式
        vm.platFormOptions = [];
        var response = await vm.$http.get(`${this.$apiUrl.getPatternGraphInfos}/${sessionStorage.getItem('orgId')}`);
        if(response.data.status == this.$appConst.status){
            await response.data.data.forEach(item => {
              if(item.finalized === true){
                vm.platFormOptions.push({
                  label:item.name,
                  value:item.graphUuid
                });
              }
            });
            if(vm.platFormOptions.length==1){
              vm.dialogVisible = false;
              vm.businessTypeVal = vm.platFormOptions[0].value;
              this.$emit('selectBusinessTypeClose',vm.businessTypeVal);
            }else{
              vm.dialogVisible = true;
            }
        }
      }catch(error){
        vm.$message.error(error.data.message || '服务器异常');
      }
    },
    close() {
      this.dialogVisible = false;
    },
    show() {
      // this.dialogVisible = true;
      this.getPlatFormOptions();
    }
  }
};
</script>