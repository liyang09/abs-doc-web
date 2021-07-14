<template>
  <el-dialog v-dialogDrag  :title="title" :close-on-click-modal="false" :append-to-body="true" v-if="dialogVisible"
              :visible.sync="dialogVisible"
              :before-close="close" :width="width">
      <slot></slot>
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
  beforeDestroy () {
    this.$bus.$off('closeDialog');
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    show() {
      this.dialogVisible = true;
    }
  }
};
</script>
