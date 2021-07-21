<template>
<el-dialog :title="title" :visible.sync="statusMessageVisiable" @close="close" width="1400px">
    <div>
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="false"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true"
              :height2="height">
        </Table>
    </div>
</el-dialog>
</template>

<script>
import Table from '@/components/Table.vue';

export default {
  name: '',
  data() {
    return {
      title: '',
      proposalList: {},
      statusMessageVisiable: false,
      // 表格数据
      mainTable: {
        tableHeader: {
            projectName: '项目名称',
            orgName: '保理公司名称',
            status2: '状态',
            comments: '意见',
            lastUpdateTime: '更新时间'
        },
        tableData: [],
        tableWidth: {}
      },
      totalCount: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      height: 600
    };
  },
  components: {
    Table
  },
  created() {},
  methods: {
    show(list) {
      this.statusMessageVisiable = true
      this.title = '项目申请状态列表'
      this.proposalList = list
      this.listStatus()
    },
    //项目申请状态
    listStatus() {
      const params = {};
      this.loading = true;
      const url = `${this.$apiUrl.requestUrl}`;
      this.$http.post(url,params)
        .then(res => {
          this.loading = false;
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.status2 = this.$appConst.requestStatus[item.status];
            this.proposalList.map(v =>{
               if(v.entityUuid === item.projectEntityUuid) {
                   item.projectName = v.projectName
               }
            })
          });
          this.$refs.tableRef.doLayout();
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    close() {
      this.statusMessageVisiable = false
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.listStatus();
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.listStatus();
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
    width:100%;
    display: flex;
    justify-content: space-between;
}
.header {
    width:300px;
    padding:0 20px 0 0;
    box-sizing: border-box;
}
</style>
