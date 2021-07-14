<template>
    <div>
        <!-- 表格 -->
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="true"
              :assetType="entityType"
              :selectable="selectable"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true"
              :height2="height2()">
        </Table>
        <div style="text-align:right;margin-top:15px;margin-right:30px;font-size:16px;">
            <label style="margin-right:20px;font-weight:bold;color: #666666">已选中单数:<span style="color: #0068BD">{{assetsUidList.length}}</span></label>
            <label style="font-weight:bold;color: #666666">已选中金额：<span
                    style="color: #0068BD">{{amount|MoneyFormat}}</span></label>
        </div>
         <div style="text-align:center;margin-top:40px;padding-bottom:20px;">
            <el-button type="warning" @click="back">上一步</el-button>
            <el-button :disabled="isDisabled" type="primary" icon="el-icon-share" @click="handlePush" class="primaryButton">
                推送
            </el-button>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent" title="请选择推送平台" width="500px">
            <span>我同意数据授权至：</span>
            <el-select v-model="sendUrl" placeholder="请选择">
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
                        :disabled="!sendUrl"
                        size="small"
                        type="primary"
                        @click="handleDailogConfirm()" class="primaryButton">
                    确 定
                </el-button>
            </div>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import mixin from '@/assets/js/mixin.js';
import{mapState,mapMutations} from 'vuex';

export default {
  name: '',
  mixins:[mixin],
  data() {
    return {
      entityType: '',
      counts:0,
      // 表格数据
      mainTable: {
        tableHeader: {
            // entityUuid:"uid",
            // entityNo: "结算单单号",
            // name: "结算单名称",
            // buyer: "买方",
            // seller: "卖方",
            // settlePrice: "结算单价",
            // totalAmount: "结算单总金额",
            // settleDate: "结算日期",
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      selectedAssetsList:[],
      assetsUidList:[],
      isDisabled:true,
      amount:0,
      platFormOptions: [
        {
          value: 'financing',
          label: '易见区块（易见融资平台）'
        },
      ],
      sendUrl:'',
      entityUuids:[],
      entityUuid:'',
      financeStatusList:[],
      assetTypeList:[]
    };
  },
  components: {
    Table,
    dialogCommonComponent
  },
  created() {
  },
  mounted() {
    const vm = this;
    // 获取应该展示的资产类型对应的字段
    this.$bus.$on('getAssetsUidList',function(value1,value2) {
      // assetsUidList 为选中的id数组
      // selectedAssetsList为选中的行的所有数据。
      vm.assetsUidList = value1;
      vm.selectedAssetsList = value2;
      if(vm.assetsUidList.length>0){
        vm.isDisabled = false;
      }else{
        vm.isDisabled = true;
      }
      vm.amount = 0;
      vm.selectedAssetsList.forEach(item=>{
        vm.amount+=Number(item.totalAmount);
      });
    })
  },
  beforeDestroy() {
    this.$bus.$off('getAssetsUidList');
  },
  computed:{
    ...mapState(['ASSETSPARAMS','DICTIONARY'])
  },
  methods: {
    ...mapMutations(['SET_DATALIST','SET_DICTIONARY']),
    height2() {
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height - 370;
    },
    selectable (row, index) {
      // if (row.locked) {
      //   return false
      // } else {
      //   return true
      // }
      if (row.active) {
        return true
      } else {
        return false
      }
    },
    close() {
      this.$bus.$emit('closeDialog');
    },
    handlePush() {
      this.$refs.dialogCommonComponent.show();
      this.sendUrl = "";
    },
    handleDailogConfirm() {
      const vm = this;
      vm.entityUuids = this.selectedAssetsList.map(item => item.entityUuid);
      vm.close();
      vm.$bus.$emit('showProgress',0);
      this.common(0,vm.entityUuids,this.$appConst.everySendNum);
    },
    async common(i,allIds,everyNumber) {
      var vm = this;
      var allNumber = Math.ceil(allIds.length/everyNumber); 
      var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
      try{
        let paramsArr = [{entityUuids:everyIds, assetType: this.entityType}]
        let response = await this.$http.post(`${this.$apiUrl.pushFullAssetPackage}`, paramsArr);
        if(response.data.status == 200) {
          i = i+1;
          vm.$bus.$emit('showProgress',(i/allNumber)*100);
          if (i==allNumber){
            setTimeout(()=> {
              vm.$bus.$emit('hideProgress');
              vm.$message.success('推送成功!');
              vm.search();
              vm.$refs.tableRef.clearSelection();
            },1000);
            return;
          }
          vm.common(i,allIds,everyNumber);
        }
      }catch(err){
        vm.$message.error(err.data.message);
        vm.$bus.$emit('hideProgress');
      }
    },
    back() {
        this.$bus.$emit('back');
    },
    // 详情
    async init(row, entityType) {
      this.entityType = entityType;
      this.getTableHeader(entityType);
      this.assetGraphUuid = row.graphUuid;
      this.entityUuid = row.entityUuid;
      this.$refs.tableRef.clearSelection();
      this.page = 1;
      this.selectedAssetsList = [];
      this.assetsUidList = [];
      this.amount = 0;
      this.$refs.tableRef.resetCurrentPage();
      this.search();
      // 结算单
      if (entityType === 'TRADESETTLEMENT') {
        // 是否已融资
         if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.financeStatus)) {
          this.financeStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.financeStatus]);
        }else{
          this.getDictionaryApi(this.financeStatusList, this.$appConst.dictionaryType.financeStatus);
        }
        // 结算单类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.settlementType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.settlementType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.settlementType);
        }
      }
    },
    // 字典请求数据
    getDictionaryApi(list, val) {
      this.$http.get(this.$apiUrl.dictionary.codeList + '?code=' + val)
        .then(res => {
          if (res.data.status !== 200) return;
          res.data.data.forEach(item=>{
            this.$set(list, item.value, item.label);
          })
          this.SET_DICTIONARY({value1:list,value2:val});
        }).catch(err => {
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
    async getTableHeader(assetType){
      const vm = this;
      var datas = [];
      vm.mainTable.tableHeader = {};
      if(vm.ASSETSPARAMS[assetType]) {
        datas = vm.ASSETSPARAMS[assetType];
        datas.forEach(item=>{
          // 表格中需要展示的字段
          if(item.listVisible){
            this.mainTable.tableHeader[item['fieldEnName']] = item['fieldCnName'];
          }
        });
      }else{
        // 从接口获取列表展示字段
        // await vm.$http.get(`${this.$apiUrl.tableConfigName}?tableName=${assetType}`)
        await vm.$http.get(`${this.$apiUrl.tableConfigName2}?typeName=${assetType}`)
        .then((res)=>{
          if(res.data.status == vm.$appConst.status){
            datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
            // datas = res.data.data;
            if(!datas || datas.length === 0) {
              this.loading = false;
              return;
            }
            datas.forEach(item=>{
              // 表格中需要展示的字段
              if(item.listVisible){
                vm.mainTable.tableHeader[item['fieldEnName']] = item['fieldCnName'];
              }
            });
            vm.SET_DATALIST({value1:datas,value2:assetType});
          }
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
      }
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        "condition": {
          "entityType": this.entityType,
        },
        "page": this.page-1,
        "size": this.pageSize
      }
      var entityUuid = [this.entityUuid];
      this.loading = true;
      const url = `${this.$apiUrl.queryPushAssetList}${this.assetGraphUuid}?entityUuids=${entityUuid}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
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
