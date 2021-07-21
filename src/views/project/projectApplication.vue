<template>
    <el-dialog title="项目列表" :visible.sync="visiable" @close="close" width="1400px">
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
                        label="操作">
                  <template slot-scope="scope">
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="apply(scope.row)">
                        申请
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        <applicationBox ref="applicationBox"></applicationBox>
    </div>
</el-dialog>
</template>

<script>
import Table from '@/components/Table.vue';
import applicationBox from './applicationBox.vue'

export default {
  name: '',
  data() {
    return {
      visiable: false,
      // 表格数据
      mainTable: {
        tableHeader: {
            projectName: '项目名称',
            orgName: '保理公司名称',
            department: '部门',
            status2: '状态',
            lastUpdateTime: '更新时间'
        },
        tableData: [],
        tableWidth: {
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
    applicationBox
  },
  methods: {
    show() {
      this.visiable = true
      this.query()
    },
    // 查询
    query() {
      this.mainTable.tableData = [];
      const params = {};
      this.loading = true;
      const url = `${this.$apiUrl.queryProject}`;
      this.$http.post(url, params)
        .then(res => {
          this.loading = false;
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.status2 = this.$appConst.projecType[item.status];
          });
          this.$refs.tableRef.doLayout();
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    apply(row) {
      this.$refs.applicationBox.show(row.entityUuid)
    },
    close() {
      this.visiable = false
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.query();
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.query();
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
