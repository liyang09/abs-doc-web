<template>
    <div >
        <!-- 表格 -->
        <el-button style="margin-bottom:20px;"
                type="primary"
                icon="el-icon-plus"
                 class="addButton"
                @click="add()">
            添加
        </el-button>
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
              :height2="height2()">
              <!-- 操作 -->
              <el-table-column fixed="right"
                        label="操作"
                        >
                  <template slot-scope="scope">
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="orgSearch(scope.row)">
                        企业查询
                    </el-button>
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="updates(scope.row)">
                        <i class="el-icon-edit"></i>更新
                    </el-button>
                    <el-button
                        class="collectBtn redBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="deletes(scope.row)">
                        <i class="el-icon-delete"></i>删除
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        <div>
          <dialogCommonComponent ref="dialogCommonComponent" :title="title" width="600px">
              <div class="contractDetail">
                  <div class="baseInfo" style="padding: 10px 15px;">
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" @submit.native.prevent>
                          <el-form-item label="公司名称" prop="orgName">
                              <el-input v-model="ruleForm.orgName" placeholder="" size="small" clearable=""></el-input>
                              <!-- <el-input type="orgName"
                                        v-model.number="ruleForm.orgName"
                                        autocomplete="off"
                                        placeholder="请输入企业全称，Enter查询"
                                        @keyup.enter.native="handleEnter">
                              </el-input> -->
                          </el-form-item>
                          <el-form-item label="公司地址" prop="address">
                            <el-input v-model="ruleForm.address" placeholder="" size="small" clearable=""></el-input>
                          </el-form-item>
                          <el-form-item label="所在城市" prop="city">
                            <el-input v-model="ruleForm.city" placeholder="" size="small" clearable=""></el-input>
                          </el-form-item>
                      </el-form>
                  </div>
                  <div style="text-align:center;margin-top:30px;">
                      <el-button size="small" @click="close()">
                          取 消
                      </el-button>
                      <el-button  size="small" type="primary" :loading="buttonLoading"
                              @click="handleDailogConfirm()" class="primaryButton">
                          确 定
                      </el-button>
                  </div>
              </div>
          </dialogCommonComponent>
        </div>

        <!-- 企业信息 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="企业信息查询" width="1000px">
            <div class="org-info">
                <el-row>
                    <el-col :span="12">
                        <el-form :model="orgInfoData" label-width="150px">
                            <el-form-item label="企业名称">
                                <span>{{ orgInfoData.entname }}</span>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码">
                                <span>{{ orgInfoData.creditcode }}</span>
                            </el-form-item>
                            <el-form-item label="公司类型">
                                <span>{{ orgInfoData.enttype }}</span>
                            </el-form-item>
                            <el-form-item label="营业期限">
                                <span>{{ orgInfoData.esdate }} 至 {{ orgInfoData.opto }}</span>
                            </el-form-item>
                            <el-form-item label="注册地址">
                                <span>{{ orgInfoData.dom }}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12">
                        <el-form :model="orgInfoData" label-width="150px">
                            <el-form-item label="法人">
                                <span>{{ orgInfoData.frname }}</span>
                            </el-form-item>
                            <el-form-item label="经营状态">
                                <span>{{ orgInfoData.entstatus }}</span>
                            </el-form-item>
                            <el-form-item label="工商注册号">
                                <span>{{ orgInfoData.regno }}</span>
                            </el-form-item>
                            <el-form-item label="行业">
                                <span>{{ orgInfoData.industryphyname }}</span>
                            </el-form-item>
                            <el-form-item label="登记机关">
                                <span>{{ orgInfoData.regorg }}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form :model="orgInfoData" label-width="150px">
                        <el-form-item label="经营范围">
                            <span>{{ orgInfoData.zsopscope }}</span>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <br>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import protleTitleComponent from '@/components/protleTitleComponent';
import mixin from '@/assets/js/mixin';
import { mapGetters } from 'vuex'

export default {
  name: '',
  mixins:[mixin],
  data() {
    return {
      orgInfoData: {

      },
      loading:false,
      buttonLoading:false,
      workDate: '',
      // 表格数据
      mainTable: {
        tableHeader: {
            orgName: "公司名称",
            orgRole2: "地址",
            createTime: "所在城市",
            lastUpdateTime: "应收账款金额/合格资产（元）",
            lastUpdateTime: "应收账款金额/不合格资产（元）",
            lastUpdateTime: "附件完整度",
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      assetsList: [],
      ruleForm:{
        orgName:"",
        address:"",
        city:"",
      },
      rules:{
        orgName: { required: true, message: '企业全称不能为空', trigger: 'blur'},
        address: { required: true, message: '地址不能为空', trigger: 'blur'},
        city: { required: true, message: '所在城市不能为空', trigger: 'blur'},
      },
      orgId:'',
      isAdd:true,
      title:''
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    protleTitleComponent
  },
  computed: {
    
  },
  watch: {
    
  },
  created() {
    this.search();
  },
  methods: {
    //git push origin HEAD:refs/for/master
    orgSearch() {
      this.$refs.dialogCommonComponent2.show();
    },
    height2() {
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height - 210;
    },
    add(){
      this.$nextTick(() =>{
        this.$refs.dialogCommonComponent.show();
        this.isAdd = true;
        this.title = '新建项目公司';
      });
    },
    updates(row) {
      this.$nextTick(() =>{
        this.$refs.dialogCommonComponent.show();
        this.ruleForm = Object.assign({},row);
        this.isAdd = false;
        this.orgId = this.ruleForm.orgId;
        this.title = '更新企业';
      });
    },
    close() {
      this.ruleForm = {
        orgName:'',
        address:'',
        city:''
      };
      this.$refs.ruleForm.resetFields();
      this.orgId = '';
      this.$bus.$emit('closeDialog');
    },
    async handleEnter() {
      var orgInfo = await this.getOrgInfo({orgName:this.ruleForm.orgName});
      this.orgId = orgInfo && orgInfo.orgId ? orgInfo.orgId : '';
      if(!this.orgId){
        this.$message.error('企业不存在');
        this.orgId = '';
      }else{
        this.$message.success('获取企业信息成功');
      }
    },
    async handleDailogConfirm() {
      const vm = this;
      this.$refs.ruleForm.validate(async(validate) => {
        if (validate) {
          try {
            if (!vm.orgId){
              vm.$message.warning('请先输入正确的企业名称并且按enter键进行查询');
              return;
            }
            var params = {
              orgName:vm.ruleForm.orgName,
              orgRole:vm.ruleForm.orgRole,
              orgId:vm.orgId
            };
            vm.buttonLoading = true;
            var url = "";
            if(this.isAdd){
              url = vm.$apiUrl.saveBusiness;
            }else{
              url = vm.$apiUrl.updateBusiness;
              params['id'] = vm.ruleForm.id;
              params.createTime = vm.ruleForm.createTime;
            }
            var response = await vm.$http.post(`${url}`,params);
            if(response.data.status == vm.$appConst.status){
              vm.$message.success('添加成功');
              vm.search();
              vm.buttonLoading = false;
              vm.close();
            }
          }
          catch(error){
            vm.buttonLoading = false;
            vm.$message.error(error.data.data);
          }
        }
      })
    },
    // 删除
    async deletes(row) {
        var vm = this;
        try {
          var response = await vm.$http.get(`${vm.$apiUrl.deleteBusiness}/${row.id}`);
          if(response.data.status == vm.$appConst.status){
            vm.$message.success('删除成功');
            vm.search();
          }
        }
        catch(error){
          vm.$message.error(error.data.message);
        }
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize
      };
      this.loading = true;
      const url = `${this.$apiUrl.queryBusiness}`;
      this.$http.get(url,{params})
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.orgRole2 = this.$appConst.businessRoleTypes[item.orgRole];
          });
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.search();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.approval__box{
  .search{
    height: 120px;
    margin-top: 50px;
  }
  .btn__search{
    bottom: -46px;
    right: 0;
  }
  .table_btn{
    margin: 5px;
  }
}
</style>
