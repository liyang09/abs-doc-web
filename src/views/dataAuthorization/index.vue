<template>
    <div>
         <breadcrumb :breadcrumbList="breadcrumbs"/>
        <div  v-show="firstShow">
        <!-- 表格 -->
        <selectForm ref="selectForm" :buzType='buzType' :invoiceCheckStatusList='invoiceCheckStatusList' :invoiceTypesList="invoiceTypesList" :type='assetTypeList' :invoiceStatusList='invoiceStatusList' @search="reSearch" class="selectForm"></selectForm>
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :assetType='assetType'
              :selected="selected()"
              :selectable="selectable"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true">
              <!-- 操作 -->
              <el-table-column 
                      fixed="right"
                        label="操作" width="120"
                        v-if="operationButtionIsShow()"
                        >
                  <template slot-scope="scope">
                    <el-button
                        icon="el-icon-view"
                        class="collectBtn redBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        v-if="detailButtonIsShow()"
                        @click="details(scope.row)">
                        详情
                    </el-button>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more iconMore"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                             <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px; "
                                v-if="scope.row.graphUuid"
                                @click="previewAssets(scope.row)"
                               >
                                查看资产图
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                              <el-button
                                  icon="el-icon-tickets"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px;display:block; "
                                  @click="getAttachments(scope.row)"
                                >
                                  附件
                              </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                             <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px; "
                                @click="handleSearchEaglecointransaction(scope.row)"
                                v-if="assetType === 'TRADESETTLEMENT' && $appConst.nowBusinessScenarios === 'rlhk'"
                               >
                                山鹰币查询
                            </el-button>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
              </el-table-column>
        </Table>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent" :title="title" width="80%">
            <goodsDetailComponent  ref="goodsDetailComponent" @search="search"></goodsDetailComponent>
        </dialogCommonComponent>
        <!-- 查看合同详情 -->
        <dialogCommonComponent ref="dialogCommonComponent1" title="合同详情" width="80%">
            <contractInfoDetailComponent  ref="contractInfoDetailComponent" :showCancel="showCancel"></contractInfoDetailComponent>
        </dialogCommonComponent>
        <!-- 查看资产图 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="资产视图" width="90%">
            <assetView ref="assetView"></assetView>
        </dialogCommonComponent>
        <assetViewDialog ref="assetViewDialog"></assetViewDialog>
        <!-- 附件 -->
        <dialogCommonComponent ref="dialogCommonComponent3" title="附件" width="60%">
            <uploadFileComponent ref="uploadFileComponent" title="附件"></uploadFileComponent>
            <!-- <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="close()">取消</el-button>
              <el-button type="primary" size="small" @click="sure" class="primaryButton">确定</el-button>
            </div> -->
        </dialogCommonComponent>
        <!-- 山鹰币查询 -->
        <dialogCommonComponent ref="dialogCommonComponent4" title="山鹰币查询" width="60%">
            <eagleCoinListBySettlement ref="eagleCoinListBySettlement"></eagleCoinListBySettlement>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="close()">取消</el-button>
            </div>
        </dialogCommonComponent>
        <!-- 创建关联 -->
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import contractInfoDetailComponent from '@/components/contractInfoDetailComponent';
import uploadFileComponent from '@/components/uploadFileComponent';
import goodsDetailComponent from '../commonAsset/goodsDetailComponent';
import assetView from '@/components/assetView';
import eagleCoinListBySettlement from '@/components/eagleCoinListBySettlement';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';
import commonSetData from '@/assets/js/commonSetData.js';
import allList from '@/assets/js/test/allList.js';
import{mapState,mapMutations} from 'vuex';
import assetViewDialog from '@/components/assetViewDialog'

export default {
  name: '',
  data() {
    return {
      drawer:false,
      assetTypeList: {}, // 字典取资产类型
      invoiceStatusList: {}, // 发票状态
      invoiceCheckStatusList: {}, // 发票核验状态
      financeStatusList:{},//是否已融资
      invoiceTypesList:{},//发票类型
      buzType: {}, // 业务类型
      breadcrumbs: [],
      formItem:{},//添加表单字段
      queryTerms:{},
      sortTerms:{},
      confirmLoading:false,
      title:'',
      firstShow:true,
      secondShow:false,
      showCancel: true, // 查看合同详情
      // 表格数据
      mainTable: {
        tableHeader: {},
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      assetsUidList:[],
      selectedAssetsList:[],
      searchForm:{},
    };
  },
  components: {
    assetViewDialog,
    Table,
    dialogCommonComponent,
    contractInfoDetailComponent,
    goodsDetailComponent,
    uploadFileComponent,
    assetView,
    selectForm,
    breadcrumb,
    eagleCoinListBySettlement
  },
  created() {
    // 首次用到该组件的时候执行这个。
    var assetType = this.$route.params.assetType;
    this.getDictionary(assetType);
    this.initExecute(assetType);
  },
  // beforeRouteUpdate(to,from,next){
  //   // 上一次用到该组件，路由变化之后还是用到该组件，则执行这个。
  //   this.initExecute(to.params.assetType);
  //   next();
  // },
  computed: {
    ...mapState(['ASSETSPARAMS', 'DICTIONARY'])
  },
  mounted() {
    var vm = this;
    this.$bus.$on('back',function() {
      vm.firstShow = true;
      vm.secondShow = false;
    });
    this.$bus.$on('addClose',function() {
      vm.drawer = false;
    });
    this.$bus.$on('getAssetsUidList',function(value1,value2) {
      // assetsUidList 为选中的id数组
      // selectedAssetsList为选中的行的所有数据。
      vm.assetsUidList = value1;
      vm.selectedAssetsList = value2;
      vm.entityUuids = [];
      vm.selectedAssetsList.forEach(item => {
        vm.entityUuids.push(item.entityUuid);
      });
    })
  },
  beforeDestroy() {
    this.$bus.$off('back');
    this.$bus.$off('addClose');
    this.$bus.$off('getAssetsUidList');
  },
  methods: {
    ...mapMutations(['SET_DATALIST', 'SET_DICTIONARY']),
    // 获取字典值
    getDictionary(assetType) {
      this.assetTypeList = {};
      // 合同
      if (assetType === 'TRADECONTRACT') {
        // 合同类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.contractType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.contractType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.contractType);
        }
        // 业务类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.buzType)) {
          this.buzType = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.buzType]);
        }else{
          this.getDictionaryApi(this.buzType, this.$appConst.dictionaryType.buzType);
        }
      }
      // 订单
      if (assetType === 'TRADEORDER') {
        // 订单类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.orderType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.orderType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.orderType);
        }
      }
      // 发票
      if (assetType === 'TRADEINVOICE') {
        // 发票类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.invoiceType);
        }
        // 发票状态
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceStatus)) {
          this.invoiceStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceStatus]);
        }else{
          this.getDictionaryApi(this.invoiceStatusList, this.$appConst.dictionaryType.invoiceStatus);
        }
        // 发票类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceType)) {
          this.invoiceTypesList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceType]);
        }else{
          this.getDictionaryApi(this.invoiceTypesList, this.$appConst.dictionaryType.invoiceType);
        }
        // 是否已融资
         if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.financeStatus)) {
          this.financeStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.financeStatus]);
        }else{
          this.getDictionaryApi(this.financeStatusList, this.$appConst.dictionaryType.financeStatus);
        }
        // 发票核验状态
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceCheckStatus)) {
          this.invoiceCheckStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceCheckStatus]);
        }else{
          this.getDictionaryApi(this.invoiceCheckStatusList, this.$appConst.dictionaryType.invoiceCheckStatus);
        }
      }
      // 结算单
      if (assetType === 'TRADESETTLEMENT') {
        // 是否已融资
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.financeStatus)) {
          this.financeStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.financeStatus]);
        }else{
          this.getDictionaryApi(this.financeStatusList, this.$appConst.dictionaryType.financeStatus);
        }
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceStatus)) {
          this.invoiceStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceStatus]);
        }else{
          this.getDictionaryApi(this.invoiceStatusList, this.$appConst.dictionaryType.invoiceStatus);
        }
        // 发票核验状态
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceCheckStatus)) {
          this.invoiceCheckStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceCheckStatus]);
        }else{
          this.getDictionaryApi(this.invoiceCheckStatusList, this.$appConst.dictionaryType.invoiceCheckStatus);
        }
        // 结算单类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.settlementType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.settlementType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.settlementType);
        }
      }
      // 过磅单
      if (assetType === 'TRADEPONDERATION') {
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.pounderationType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.pounderationType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.pounderationType);
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
    // 附件
    getAttachments(row){
      this.entityUuid = row.entityUuid;
      this.$refs.dialogCommonComponent3.show();
      this.$nextTick(() => {
        this.$refs.uploadFileComponent.init(row.attachments || [], false);
      });
    },
    async initExecute(assetType) {
      const vm = this;
      this.loading = true;
      this.assetType = assetType;
      this.breadcrumbs = commonSetData.dataAuthorizeBreadcrumbs[this.assetType];
      this.queryTerms = {};
      this.sortTerms = {};
      this.mainTable.tableHeader = {};
      var datas = [];
      // 如果store中存储有该显示哪些字段，则从store中获取，否则重新发送请求获取。
      if(vm.ASSETSPARAMS[assetType]) {
        datas = vm.ASSETSPARAMS[assetType];
      }else{
        // 如果store中没有，则发送请求获取。
        datas = allList[assetType];
        vm.SET_DATALIST({value1:datas,value2:assetType});
        // 从接口获取列表展示字段
        // await vm.$http.get(`${this.$apiUrl.tableConfigName}?tableName=${assetType}`)
        await vm.$http.get(`${this.$apiUrl.tableConfigName2}?typeName=${assetType}`)
        .then((res)=>{
          if(res.data.status == this.$appConst.status){
            // datas = res.data.data;
            datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
            vm.SET_DATALIST({value1:datas,value2:assetType});
          }
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
      }
      if(!datas || datas.length === 0) {
        this.loading = false;
        return;
      }
      datas.forEach(item=>{
        // 质检单管理中检验项目是一个数组，所以不在其中展示。
        if([item['fieldEnName']]=='inspectionItem') return;
        // 判断哪些字段是查询中展示的。
        if(item.ifQuery){
          vm.queryTerms[item['fieldEnName']] = item['fieldCnName'];
          vm.selectFormShow = true;
        }
        // 排序需要的字段
        if(item.ifSort){
          vm.sortTerms[item['fieldEnName']] = item['fieldCnName'];
        }
        // 表格中需要展示的字段
        if(item.listVisible){
          vm.mainTable.tableHeader[item['fieldEnName']] = item['fieldCnName'];
        }
        // 添加表单需要展示的字段
        if(item.detailsVisible){
          vm.formItem[item['fieldEnName']] = item['fieldCnName'];
        }
      });
      this.$nextTick(() => {
        this.$refs.selectForm.changeValue(vm.queryTerms, vm.sortTerms);
      });
      vm.search();
    },
    // 操作栏是否显示
    operationButtionIsShow() {
      if(this.assetType == 'TRADEINVOICE' || this.assetType == 'TRADEPONDERATION' ||this.assetType == 'TRADEQUALITY' || this.assetType == 'TRADESUPPLIER'){
        return false;
      }
      if(this.assetType == 'TRADEAVIATIONSERVICEFEE' || this.assetType == 'TRADEAVIATIONOILDATA' ||this.assetType == 'TRADEEAGLECOINTRANSACTION' || this.assetType == 'TRADETICKETSALES'){
        return false;
      }
      if(this.assetType == 'TRADEWAREHOUSE'){
        return false;
      }
      return true;
    },
    // 详情按钮是否显示
    detailButtonIsShow() {
      if(this.assetType == 'TRADEINVOICE' || this.assetType == 'TRADELOGISTICS'){
        return false;
      }
      return true;
    },
    // 判断是否有勾选框。发货的时候存在。
    selected() {
      if(this.assetType === 'TRADEDLVRGOODS'){
        return true;
      }else{
        return false;
      }
    },
    // 添加时标题。
    addFormTitle() {
      return '添加'+ this.$appConst.dataType[this.assetType];
    },
    // 判断什么情况下可以勾选。
    selectable (row) {
      // 发货单有这个功能。
      if(this.assetType != 'TRADEDLVRGOODS') return true;
      if (row.recvgStatusFlag === '未收货') {
        return true
      } else {
        return false
      }
    },
    // 山鹰币查询
    handleSearchEaglecointransaction(row) {
      this.$refs.dialogCommonComponent4.show();
      this.$nextTick(() =>{
        this.$refs.eagleCoinListBySettlement.init(row.entityUuid);
      });
    },
    close() {
      this.$bus.$emit('closeDialog');
    },
    openTabs(isTrue) {
      if (isTrue) {
        this.firstShow = true;
        this.secondShow = false;
      } else {
        this.firstShow = false;
        this.secondShow = false;
      }
    },
    // 查看资产图
    previewAssets(row) {
      // this.$refs.dialogCommonComponent2.show();
      this.$nextTick(() => {
        // this.$refs.assetView.init(row);
        this.$refs.assetViewDialog.init(row);
      });
    },
    // 详情
    details(row) {
      if (this.assetType === 'TRADECONTRACT') {
        this.$refs.dialogCommonComponent1.show();
        this.$nextTick(() => {
          this.$refs.contractInfoDetailComponent.handleGetOrgInfo(row, this.formItem);
        }); 
      } else {
        this.$refs.dialogCommonComponent.show();
        this.$nextTick(() => {
          this.$refs.goodsDetailComponent.init(row,this.assetType);
          this.$refs.goodsDetailComponent.setSelected(false);
        }); 
        this.title= this.$appConst.dataType[this.assetType] + '详情';
      }
    },
    reSearch(searchForm) {
      this.page = 1;
      this.searchForm = searchForm;
      this.$refs.tableRef.resetCurrentPage();
      this.search(searchForm);
    }, 
    // 搜索
    search(searchForm) {
      var vm = this;
      vm.mainTable.tableData = [];
      const origionParams = {
        page: this.page - 1,
        size: this.pageSize,
        condition:{
          entityType:this.assetType
        }
      };
      var copySearchForm = Object.assign({},searchForm);
      if(copySearchForm.hasOwnProperty('sortField')){
        origionParams['sortFields'] = [searchForm['sortField']];
        delete  copySearchForm.sortField;
      }
      if(copySearchForm.hasOwnProperty('sortDirection')){
        origionParams['sortDirection'] = searchForm['sortDirection'];
        delete  copySearchForm.sortDirection;
      }
      if(copySearchForm &&　Object.keys(copySearchForm).length > 0){
        origionParams.condition.queryExpressionDTO = {
          "@class": "com.evisible.assetmanagement.common.api.rest.dto.assetquery.SingularQueryExpressionDTO",
          queryConditionDTOS:[]
        };
        for(var key in copySearchForm){
          if (key === 'timeInterval' && Object.keys(copySearchForm[key]).length > 0) {
            let value = copySearchForm[key];
            for(var dataKey in value){
              origionParams.condition.queryExpressionDTO.queryConditionDTOS.push({
                "name": dataKey,
                "operator": 'GE',
                "values":[value[dataKey].startDate]
              },
              {
                "name": dataKey,
                "operator": 'LE',
                "values":[value[dataKey].endDate]
              });
            }
          } else {
            // 某些字段采用模糊查询为LIKE,其中EQ为准确查询。
            var operator = key.indexOf('Name')!=-1 ? 'LIKE' : 'EQ';
            origionParams.condition.queryExpressionDTO.queryConditionDTOS.push({
              "name": key,
              "operator": operator,
              "values":[copySearchForm[key]]
            });
          }
        };
      }
      if (copySearchForm &&　Object.keys(copySearchForm).length === 0 && origionParams.condition.hasOwnProperty('queryExpressionDTO')) {
        delete origionParams.condition.queryExpressionDTO;
      }
      if (!(searchForm && searchForm.hasOwnProperty('sortDirection'))) {
        origionParams.sortDirection = 'DESC'
      }
      const params = Object.assign({},origionParams);
      this.loading = true;
      const url = `${this.$apiUrl.queryAuthAsset}`; // 查询无数据
      // const url = `${this.$apiUrl.queryContract}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.$refs.tableRef.doLayout();
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.totalCount = 0;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.search(this.searchForm);
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.search(this.searchForm);
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
