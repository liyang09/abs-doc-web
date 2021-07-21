<template>
<el-dialog :title="title" :visible.sync="addMessageVisiable" @close="close" width="1400px">
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
              <!-- 操作 -->
              <el-table-column fixed="right"
                        label="操作"
                        width="150px"
                        >
                  <template slot-scope="scope">
                    <el-button
                        :disabled = "scope.row.status !== 'REQUEST'"
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="approval(scope.row)">
                        审批
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        <apply-info ref="applyInfo"></apply-info>
    </div>
</el-dialog>
</template>

<script>
import Table from '@/components/Table.vue';
import ApplyInfo from './applyInfo.vue';

export default {
  name: '',
  data() {
    return {
      loading:false,
      addMessageVisiable:false,
      title: '',
      id: '',
      isTrue:false,
      showButton:false,
      // 表格数据
      mainTable: {
        tableHeader: {
            orgName: '申请公司名称',
            addr: '地址',
            status2: '状态',
            lastUpdateTime: '更新时间',
            comments: '意见'
        },
        tableData: [],
        tableWidth: {
            status2:100
        }
      },
      totalCount: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      height: 600
    };
  },
  components: {
    Table,
    ApplyInfo
  },
  created() {},
  methods: {
    show(row) {
      console.log(row)
      this.addMessageVisiable = true
      this.title = row.projectName
      this.id = row.id
    },
    close() {
      this.addMessageVisiable = false
    },
    search() {
      const params = {
        id: this.id
      };
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
          });
          this.$refs.tableRef.doLayout();
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    // 申请审批
    approval(row) {
      this.$refs.applyInfo.show(row)
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.search();
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.search();
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
