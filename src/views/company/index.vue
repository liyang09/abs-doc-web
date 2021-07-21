<template>
    <div>
        <h2>公司列表</h2>
        <div>
            <el-button style="margin-bottom:20px;"
                    type="primary"
                    icon="el-icon-plus"
                    class="addButton"
                    @click="add()">
                新增项目公司
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
        <!-- 表格 -->
        <div id="touchmove" style="width: 100%;margin-top:5px;margin-bottom:5px;height: 2px;background: #ababab;cursor: s-resize">
        <!-- 表格 -->
        <Table
              class="TextareaWrap"
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
                        width="260"
                        >
                  <template slot-scope="scope">
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="enterpriseInquiry(scope.row)">
                        企业查询
                    </el-button>
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="zhongdeng(scope.row)">
                        中登查询
                    </el-button>
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="edit(scope.row)">
                        修改
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
        </div>
        <div class="asset-attachment borderRadiu12" v-if="mainTable.tableData.length">
            <folderTree :folderOption="folderOption" ref="folderTree"></folderTree>
        </div>
        <add-project ref="addOrEditProject" :title = title @search='query'></add-project>
        <enterpriseInformation ref="information"></enterpriseInformation>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import addProject from './addProject.vue';
import enterpriseInformation from './enterpriseInformation.vue';
import folderTree from '@/components/folderTree.vue'

export default {
  name: '',
  data() {
    return {
      title: '',
      searchTableInfo: '',
      loading:false,
      dataList:{},
      rowList:{},
      folderOption: {
        assetInfo: {},
        type: 'asset',
        canUpload: true
      },
      // 表格数据
      mainTable: {
        tableHeader: {
            orgName: '公司名称',
            addr: '地址',
            city: '所在城市',
            qualifiedAmount: '应收账款金额/合格资产（元）',
            unqualifiedAmount: '应收账款金额/不合格资产（元）'
        },
        tableData: [],
        tableWidth: {
            weight:150,
            unqualifiedAmount: 230
        }
      },
      totalCount: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      height: 600,
      minHeght: 200,
      innerHeight: window.innerHeight, // 获取窗口高度
    };
  },
  components: {
    Table,
    addProject,
    enterpriseInformation,
    folderTree
  },
  created() {
    this.id = sessionStorage.getItem("projectEntityUuid");
    this.rowList = JSON.parse(sessionStorage.getItem("rowList"));
    console.log(this.rowList)
    this.query();
  },
  mounted() {
    document.getElementById("touchmove").onmousedown = this.textWidthChange;
  },
  methods: {
    // 新增
    add(){
      this.$nextTick(() =>{
        this.title = '新增项目公司'
        this.$refs.addOrEditProject.show(this.rowList)
      });
    },
    // 修改
    edit(row) {
      this.$nextTick(() =>{
          this.title = '修改项目公司'
          this.$refs.addOrEditProject.editShow(row)
      });
    },
    // 删除
    deletes(row){
      this.$confirm('该操作将一同删除所有已关联的资产数据，确定要继续吗?', '', {
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
      const params = {
        entityUuid: row.entityUuid
      }
      const url = this.$apiUrl.edocUrl + '/biz/v1.0/asset-type/company/assets/' + row.entityUuid + '?association=true'
      this.$http.delete(url,{ data: params })
        .then(res => {
        this.loading = false;
        if (res.data.status !== 200) return;
        this.query()
        }).catch(err => {
        this.loading = false;
        this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    // 查看
    zhongdeng(scope) {
      const url = `${this.$apiUrl.zhongdeng}/query/bySubject?confirm=true&debtorNameOrIdCard=${scope.companyName}&debtorType=1000`
        this.$http.get(url)
        .then(res => {
            if (res.data.status === 200) {
                const fileId = res.data.data.fileId
                const totalRows = res.data.data.totalRows
                const fileUrl = `${this.$apiUrl.zhongdengUploadUrl}/file/download/${fileId}`
                this.$http({
                method: 'GET',
                url: fileUrl,
                responseType: 'blob'
                }).then(response => {
                let blob = new Blob([response.data], { type: 'application/pdf' })
                let url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = totalRows > 0 ? `${scope.companyName}-共${totalRows}条记录` : `${scope.companyName}-无记录`
                link.click()
                URL.revokeObjectURL(url)
                }).catch(error => this.$message.error(error))
            }
        })
    },
    // 初始化查询
    query() {
      const params = {
        "page":this.page-1,
        "size":this.pageSize,
        "condition":{"entityType":`${this.rowList.projectConfigEnName}CompanyEntity`},
        "sortDirection":"DESC"
      }
      this.loading = true;
      const url = `${this.$apiUrl.queryCompany}`;
      this.$http.post(url,params)
        .then(res => {
          this.loading = false;
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.$refs.tableRef.doLayout();
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    getAssetAmountBycompany (company) {
      const url = `${this.$apiUrl.edocUrl}/statistic/v1.0/company/amount`
      let arr = []
      arr = company.map((item, i) => {
          const params = {
              companyName: item.companyName,
              companyUid: item.entityUuid
          }
          return this.$http.post(url, params)
      })
      Promise.allSettled(arr)
          .then(res => {
              res.map(item => {
                  if (item.status === 'fulfilled') {
                      const { status, data } = item.value.data
                      if (status === 200) {
                          company.filter(companyItem => companyItem.entityUuid === data.companyUid)[0].qualifiedAmount = data.qualifiedAmount
                          company.filter(companyItem => companyItem.entityUuid === data.companyUid)[0].unqualifiedAmount = data.unqualifiedAmount
                      }
                  }
              })
          })
    },
    // 查询
    search() {
      this.query()
    },
    refresh() {
      this.query()
    },
    // 企业查询
    enterpriseInquiry(scope) {
      console.log(scope)
      const params = {
          entName: scope.companyName
      }
      const url = `${this.$apiUrl.crediturl}/saas/query?forceQuery=true`
      this.$http.post(url, params, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
          .then(res => {
              if (res.data.status === 200) {
                  console.log(123)
                  this.$refs.information.show()
              } else {
                  this.$message.error('企业信息查询失败，请稍后再试')
              }
          }).catch(err => {
              this.$message.error(err.response.data.message)
          })
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
    },
    textWidthChange(e) {
      let that = this
      let dy = e.clientY;//当你第一次单击的时候，存储Y轴的坐标。
      document.onmousemove = e => {
          if (e.clientY > that.innerHeight) {
              return
          }
          if (e.clientY < dy) {
              that.height -= (dy - e.clientY)
          } else {
              that.height += (e.clientY - dy)
          }
          dy = e.clientY
          if (dy < this.minHeght) {
              that.height = this.minHeght
              return
          }
      };
      document.onmouseup = e => {
          document.onmousemove = null;
          document.onmouseup = null;
      };
      e.stopPropagation();
      e.preventDefault();
      return false;
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
.asset-attachment{
  margin-top: 20px;
  background: #fff;
  //margin: 20px 0 0;
  border: 1px solid #6666661f;
  height: calc(50vh - 121px);
  min-height: 200px;
  overflow: auto;
  /deep/.doc{
    .docSetting{
      height: auto;
      overflow: auto;
    }
  }
}
</style>
