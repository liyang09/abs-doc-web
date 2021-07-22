<template>
    <div>
        <h2>项目列表</h2>
        <div>
            <el-button style="margin-bottom:20px;" v-show="factor"
                    type="primary"
                    icon="el-icon-plus"
                    class="addButton"
                    @click="add()">
                新增项目
            </el-button>
            <el-button style="margin-bottom:20px;" v-show="nonFactor"
                    type="primary"
                    class="addButton"
                    @click="proposal()">
                项目申请
            </el-button>
            <el-button style="margin-bottom:20px;" v-show="nonFactor"
                    type="primary"
                    class="addButton"
                    @click="proposalStatus()">
                项目申请状态
            </el-button>
            <el-input
                v-model="searchTableInfo"
                placeholder="请输入想要搜索的项目名称" 
                style="width:260px;margin: 0 0 10px 10px"
                clearable @clear="refresh()"
            >
            <i class="el-icon-search el-input__icon" slot="suffix" @click="search"></i>
            </el-input>   
        </div>
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
              <el-table-column fixed="right" width="240"
                        label="操作" v-if="operationShow"
                        >
                  <template slot-scope="scope">
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="edit(scope.row)">
                        编辑
                    </el-button>
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        v-if="scope.row.status == 'RELEASE'"
                        @click="examine(scope.row)">
                        查看
                    </el-button>
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="release(scope.row)">
                        发布
                    </el-button>
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="approval(scope.row)">
                        审批
                    </el-button>
                    <el-button
                        class="collectBtn redBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="deletes(scope.row)">
                        删除
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        <add-project ref="addOrEditProject" :title = title @search='query'></add-project>
        <apply ref="apply"></apply>
        <project-application ref="projectApplication"></project-application>
        <listStatus ref="listStatus"></listStatus>
    </div>
</template>

<script>
import Table from '@/components/Table.vue'
import addProject from './addProject.vue'
import apply from './apply.vue';
import projectApplication from './projectApplication.vue'
import listStatus from './listStatus.vue'

export default {
  name: '',
  data() {
    return {
      title: '',
      searchTableInfo: '',
      factor:false,
      nonFactor:false,
      operationShow:false,
      showList:'',
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
    addProject,
    apply,
    projectApplication,
    listStatus
  },
  created() {
    this.query();
    const authorities = sessionStorage.getItem('authorities');
    console.log(authorities)
    if(!authorities.includes('FIN_INSTITUTION')){
      // this.factor = false
      // this.nonFactor = true
      // this.operationShow = false
      // 添加数据(保理)
      this.factor = true
      this.nonFactor = false
      this.operationShow = true
    } else {
      this.factor = true
      this.nonFactor = false
      this.operationShow = true
    }
  },
  methods: {
      query() {
        this.mainTable.tableData = [];
        const params = {
            page: this.page,
            pageSize: this.pageSize,
            projectName: this.searchTableInfo
        };
        this.loading = true;
        const url = `${this.$apiUrl.projectUrl}`;
        this.$http.post(url,params)
            .then(res => {
            this.loading = false;
            if (res.data.status !== 200) return;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData = res.data.data.content;
            this.mainTable.tableData.map(item => {
                item.status2 = this.$appConst.projecType[item.status];
            });
            }).catch(err => {
            this.loading = false;
            });
      },
      // 新增
      add() {
        this.$nextTick(() =>{
            this.title = '新增项目'
            this.$refs.addOrEditProject.addShow()
        });
      },
      // 编辑
      edit(row) {
        this.$nextTick(() =>{
            this.title = '修改项目'
            this.$refs.addOrEditProject.editShow(row)
        });
      },
      // 删除
      deletes(row){
        this.$confirm('是否要删除该数据?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then((async) => {
            this.delete(row);
        }).catch(() => {
        })
      },
      async delete(row){
        this.loading = true;
        const url = `${this.$apiUrl.deleatUrl}/${row.id}`;
        this.$http.post(url)
            .then(res => {
            this.loading = false;
            if (res.data.status !== 200) return;
            this.query()
            }).catch(err => {
            this.loading = false;
            this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
            });
      },
      // 发布
      release(row) {
        this.loading = true;
        const url = `${this.$apiUrl.releaseUrl}?id=${row.id}`;
        this.$http.post(url)
          .then(res => {
            if (res.data.status !== 200) return;
            this.query();
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            this.$message.warning(err.message || '服务器错误，请稍后再试!');
          });
      },
      // 申请审批
      approval(row) {
        this.$refs.apply.show(row)
        this.$refs.apply.search()
      },
      // 查看
      examine(row) {
        sessionStorage.setItem('isShowNewMenu', JSON.stringify(true));
        sessionStorage.setItem('projectConfigEnName', row.projectConfigEnName);
        sessionStorage.setItem('rowProjectObj', JSON.stringify(row));
        window.location.reload();
      },
      // 搜索
      search() {
        this.query()
      },
      refresh() {
        this.query()
      },
      // 项目申请
      proposal() {
        this.$refs.projectApplication.show()
      },
      // 项目申请状态
      proposalStatus() {
        this.$refs.listStatus.show(this.mainTable.tableData)
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
