<template>
    <div>
         <breadcrumb :breadcrumbList="breadcrumbs"/>
        <div  v-show="firstShow">
        <!-- 表格 -->
         <el-button style="margin-bottom:15px;"
                type="primary"
                class="addButton"
                icon="el-icon-plus"
                v-if="addButtonIsShow()"
                @click="handleAddAsset()">
            添加
        </el-button>
        <el-button style="margin-bottom:15px;"
                type="primary"
                class="addButton"
                icon="el-icon-share"
                @click="download()">
            导出
        </el-button>
        <selectForm ref="selectForm" :invoiceCheckStatusList='invoiceCheckStatusList' :invoiceTypesList="invoiceTypesList" :type='assetTypeList' :invoiceStatusList='invoiceStatusList' @search="reSearch" class="selectForm"></selectForm>
        <div v-if="assetType === 'TRADESETTLEMENT'" class="allTotalClass">结算单总金额:<span style="margin-left:10px;margin-right:6px;">{{totalAmount | MoneyFormat}}</span>元</div>
        <div v-if="assetType === 'TRADEPONDERATION'" class="allTotalClass">总净重:<span style="margin-left:10px;margin-right:6px;">{{totalAmount | MoneyFormat}}</span></div>
        <Table
              ref="tableRef"
              :assetType="assetType"
              :mainTable="mainTable"
              :selected="selected()"
              :selectable="selectable"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true" :height2="height2()">
              <!-- 操作 -->
              <el-table-column 
                      fixed="right"
                        label="操作" width="200"
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
                    <el-button
                        icon="el-icon-edit"
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="edit(scope.row)">
                        编辑
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
                                style="margin-left:0px;"
                                @click="deleteAsset(scope.row)">
                                删除
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.graphUuid&&scope.row.graphUuid!='00000000-0000-0000-0000-000000000000'">
                            <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;"
                                @click="handleCreateRelation(scope.row)">
                                创建关联
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.graphUuid&&scope.row.graphUuid!='00000000-0000-0000-0000-000000000000'">
                            <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;"
                                @click="handleCancelRelation(scope.row)">
                                取消关联
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.top === true">
                            <el-button
                                icon="el-icon-share"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;display:block;"
                                @click="handlePushClick(scope.row)"
                               >
                                推送
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px; "
                                v-if="scope.row.graphUuid&&scope.row.graphUuid!='00000000-0000-0000-0000-000000000000'"
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
                                  icon="el-icon-goods"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px;display:block; "
                                  @click="receiveGoods(scope.row)"
                                  v-if="hasRecvg && scope.row.graphUuid!='00000000-0000-0000-0000-000000000000' && (scope.row.recvgStatus == 'FALSE' || scope.row.recvgStatus == 'false' || scope.row.recvgStatus == false) && assetType == 'TRADEDLVRGOODS'"
                                >
                                  收货
                              </el-button>
                          </el-dropdown-item>
                          <!-- <el-dropdown-item>
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
                            </el-dropdown-item> -->
                            <el-dropdown-item>
                              <el-button
                                  icon="el-icon-edit"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px; "
                                  @click="handleCheckPass(scope.row, 'MANUAL_CHECK_PASS')"
                                  v-if="assetType === 'TRADEINVOICE' &&　scope.row.checkStatus != 'MANUAL_CHECK_PASS'"
                                >
                                  核验通过
                              </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                              <el-button
                                  icon="el-icon-edit"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px; "
                                  @click="handleCheckPass(scope.row, 'CANCEL')"
                                  v-if="assetType === 'TRADEINVOICE' && scope.row.checkStatus != 'CANCEL'"
                                >
                                  废弃
                              </el-button>
                          </el-dropdown-item>
                           <el-dropdown-item>
                              <el-button
                                  icon="el-icon-edit"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px; "
                                  @click="handleSearchImg(scope.row, 'fileId')"
                                  v-if="assetType === 'TRADEINVOICE'"
                                >
                                  原始图
                              </el-button>
                          </el-dropdown-item>
                      </el-dropdown-menu>
                      </el-dropdown>
                  </template>
              </el-table-column>
        </Table>
        <el-button 
                :loading="confirmLoading"
                size="small"
                type="primary"
                class="primaryButton"
                style="margin-left:0px;margin-top:-20px;"
                v-show="assetType === 'TRADEDLVRGOODS' && hasRecvg"
                @click="handleConfrim()">
            批量确认
        </el-button>
        </div>
        <!-- 添加 -->
        <el-drawer
          :wrapperClosable="wrapperClosable"
          style="overflow:auto;"
          class="drawer"
          :title="addFormTitle"
          size="40%"
          :visible.sync="drawer"
          >
          <addDelv ref="addDelv"   @search="search" :directoriesList="directoriesList"  :copyFormItem="formItem" :isRoot="isRoot" :type="assetTypeList" :receiveTypeList="receiveTypeList" :deliveryTypeList="deliveryTypeList" :financeStatusList = "financeStatusList"  :invoiceStatusList='invoiceStatusList' :invoiceCheckStatusList='invoiceCheckStatusList' :invoiceTypesList="invoiceTypesList"></addDelv>
        </el-drawer>
        <dialogCommonComponent ref="dialogCommonComponent" :title="title" width="80%">
            <goodsDetailComponent  ref="goodsDetailComponent" @search="search"></goodsDetailComponent>
        </dialogCommonComponent>
        <!-- 推送时展示table -->
        <div v-show="settlementShow" style="background:white;">
            <settlement ref="settlement"></settlement>
        </div>
        <!-- 查看资产图 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="资产视图" width="90%">
            <assetView ref="assetView"></assetView>
        </dialogCommonComponent>
        <assetViewDialog ref="assetViewDialog"></assetViewDialog>
        <!-- 附件 -->
        <dialogCommonComponent ref="dialogCommonComponent3" title="附件" width="60%">
            <uploadFileComponent ref="uploadFileComponent" title="附件"></uploadFileComponent>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="close()">取消</el-button>
              <el-button type="primary" size="small" @click="sure" class="primaryButton">确定</el-button>
            </div>  
        </dialogCommonComponent>
        <!-- 山鹰币查询 -->
        <dialogCommonComponent ref="dialogCommonComponent4" title="山鹰币查询" width="60%">
            <eagleCoinListBySettlement ref="eagleCoinListBySettlement"></eagleCoinListBySettlement>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="close()">取消</el-button>
            </div>  
        </dialogCommonComponent>
        <!-- 创建关联 -->
        <relation-dialog  ref="relationDialog" @openTabs="openTabs"></relation-dialog>
        <showFileDetail ref="showFileDetail"></showFileDetail>
        <selectBusinessType  ref="selectBusinessType" @selectBusinessTypeClose='selectBusinessTypeClose'></selectBusinessType>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import goodsDetailComponent from './goodsDetailComponent';
import assetView from '@/components/assetView';
import uploadFileComponent from '@/components/uploadFileComponent';
import eagleCoinListBySettlement from '@/components/eagleCoinListBySettlement';
import relationDialog from '../createOrCancelRelation/relationDialog.vue';
import addDelv from './addDelv';
import settlement from '../assetContract/settlement';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';
import showFileDetail from '@/components/showFileDetail.vue';
import commonSetData from '@/assets/js/commonSetData.js';
import allList from '@/assets/js/test/allList.js';
import{mapState,mapMutations} from 'vuex';
import selectBusinessType from '@/components/selectBusinessType';
import assetViewDialog from '@/components/assetViewDialog'
import axios from 'axios'

export default {
  name: '',
  data() {
    return {
      ifTableHeaderProperties: false,
      roleType: '',
      directoriesList: [],
      addFormTitle:"",
      wrapperClosable:false,
      necessaryItem: {},//表单里必填项；
      assetTypeList: {}, // 字典取资产类型
      invoiceStatusList: {}, // 发票状态
      invoiceTypesList:{},//发票类型
      financeStatusList:{},//是否已融资
      invoiceCheckStatusList: {}, // 发票核验状态
      deliveryTypeList: {},//发货类型
      receiveTypeList: {},//收货类型
      settlementShow: false, // 推送展示
      businessTypeVal:"",
      platFormOptions:[],
      formItem:{},//添加表单字段
      editIsDisabled:{},//编辑时字段是否为可编辑的对象
      copyEditIsDisabled:{},//复制的编辑时字段是否为可编辑的对象
      totalAmount:0,
      drawer:false,
      breadcrumbs: [],
      queryTerms:{},
      sortTerms:{},
      confirmLoading:false,
      // selected:true,
      title:'',
      firstShow:true,
      secondShow:false,
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
      user:JSON.parse(sessionStorage.getItem('user')),
      isRoot:true,
      assetType:'',
      hasRecvg : false
    };
  },
  components: {
    assetViewDialog,
    Table,
    dialogCommonComponent,
    goodsDetailComponent,
    assetView,
    addDelv,
    relationDialog,
    uploadFileComponent,
    selectForm,
    breadcrumb,
    eagleCoinListBySettlement,
    showFileDetail,
    selectBusinessType,
    settlement
  },
  created() {
    // 首次用到该组件的时候执行这个。
    var assetType = this.$route.params.assetType;
    this.getDictionary(assetType);
    this.initExecute(assetType);
    // this.roleType = JSON.parse(sessionStorage.getItem("authorizationRoleType"));
  },
  computed: {
    ...mapState(['ASSETSPARAMS', 'DICTIONARY'])
  },
  mounted() {
    var vm = this;
    this.$bus.$on('back',function() {
      vm.firstShow = true;
      vm.secondShow = false;
      vm.settlementShow = false;
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
    // this.getAssetRecvg();
  },
  beforeDestroy() {
    this.$bus.$off('back');
    this.$bus.$off('addClose');
    this.$bus.$off('getAssetsUidList');
  },
  methods: {
    ...mapMutations(['SET_DATALIST', 'SET_DICTIONARY']),
    //查询发货单是否可以收货
    async getAssetRecvg(){
      try{
        let response = await this.$http.get(`${this.$apiUrl.getAssetRecvg}`)
        if(response.data.status === this.$appConst.status && response.data.data == true && this.roleType.indexOf('CORE_ENT') != -1) {
          this.hasRecvg = true;
        }else{
          this.hasRecvg = false;
        }
      }catch(error){
        this.$message.error(error.data.message);
      }
    },
    // 导出获取数据
    download(){
        axios({
          method: 'post',
          url:`${this.$apiUrl.exportDataToExcel}/${this.assetType}`,
          data:{
            "entityType": this.assetType
          },
          responseType: 'arraybuffer'
        })
        .then(res => {
            // res.data 是一个 blob 流格式
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
            this.$global.downFile(blob,"资产.xlsx");
          })
          .catch(err =>{})
      },
    // 推送
    handlePushClick(row) {
      this.firstShow = false;
      this.settlementShow = true;
      this.$refs.settlement.init(row, this.assetType);
    },
    // 获取字典值
    getDictionary(assetType) {
      this.assetTypeList = {};
      // 订单
      if (assetType === 'TRADEORDER') {
        // 订单类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.orderType)) {
          this.assetTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.orderType]);
        }else{
          this.getDictionaryApi(this.assetTypeList, this.$appConst.dictionaryType.orderType);
        }
        // 是否已融资
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.financeStatus)) {
          this.financeStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.financeStatus]);
        }else{
          this.getDictionaryApi(this.financeStatusList, this.$appConst.dictionaryType.financeStatus);
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
      // 收、发货单
      if (assetType === 'TRADEDLVRGOODS') {
        // //收货类型'TRADERECVGGOODS'
        // if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.receiveType)) {
        //   this.receiveTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.receiveType]);
        // }else{
        //   this.getDictionaryApi(this.receiveTypeList, this.$appConst.dictionaryType.receiveType);
        // }
        //发货类型
        if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.deliveryType)) {
          this.deliveryTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.deliveryType]);
        }else{
          this.getDictionaryApi(this.deliveryTypeList, this.$appConst.dictionaryType.deliveryType);
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
    height2() {
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      if(this.assetType == 'TRADESETTLEMENT' ||　this.assetType == 'TRADEPONDERATION'){
        return height - 330;
      }else{
        return height - 300;
      }
    },
    deleteAsset(row){
      this.$confirm('是否要删除该数据?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((async) => {
        this.deletes(row);
      }).catch(() => {
      })
    },
    async deletes(row){
      let response = await this.$http.post(`${this.$apiUrl.assetGraphStart}/${this.assetType}/delete/${row.entityUuid}`, {})
        if(response.data.status === this.$appConst.status) {
          this.$message.success('删除成功！');
          this.reSearch(this.searchForm);
        }
    },
    // 查看发票
    handleSearchImg (item) {
      this.$refs.showFileDetail.showFile(item);
    },
    // 发票校验通过或废弃。
    handleCheckPass (row, type) {
      let message = "";
      var url = "";
      if (type === "MANUAL_CHECK_PASS") {
        message = "此操作将该数据设置为核验通过！"
        url = `${this.$apiUrl.invoiceArtificial}/TRADEINVOICE/${row.entityUuid}`;
      } else {
        message = "此操作将该数据设置为废弃！"
        url = `${this.$apiUrl.invoiceCancel}/TRADEINVOICE/${row.entityUuid}`;
      }
      
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.invoiceUpdate(url);
      }).catch(() => {
      })
    },
    async invoiceUpdate(url) {
      try{
        let response = await this.$http.post(`${url}`)
        if(response.data.status === this.$appConst.status) {
          this.$message.success('操作成功！');
          this.search();
        }
      }catch(error){
        this.$message.error(error.data.message);
      }
    },
    // 获取结算单总金额或者总净重的接口
    async getTotalAmount(assetType){
      var vm = this;
      var target = assetType == 'TRADESETTLEMENT' ?　"totalAmount"　: "suttleWeight";
      var params = {
          "aggregationExpressionDTO": {
            "@class":"com.evisible.assetmanagement.common.api.rest.dto.assetquery.AggregationExpressionDTO",
            "op": "SUM",
            "target": target
          },
          "entityType": assetType,
      }
      var response = await this.$http.post(`${this.$apiUrl.queryAggregation}`,params);
      if (response.data.status == this.$appConst.status) {
        vm.totalAmount = response.data.data;
      }
    },
    async initExecute(assetType) {
      const vm = this;
      this.loading = true;
      this.assetType = assetType;
      if(assetType === 'com.evisible.entity.base.common.entity.AssetEntity') {
         this.assetType = this.$appConst.tableEnNameAsset
      }
      this.breadcrumbs = commonSetData.tradeManagementBreadcrumbs[this.assetType];
      this.queryTerms = {};
      this.sortTerms = {};
      this.mainTable.tableHeader = {};
      this.formItem = {};
      var datas = [];
      this.necessaryItem = {};
      // 如果store中存储有该显示哪些字段，则从store中获取，否则重新发送请求获取。
      if(vm.ASSETSPARAMS[assetType]) {
        datas = vm.ASSETSPARAMS[assetType];
      }else{
        // 从接口获取列表展示字段
        // await vm.$http.get(`${this.$apiUrl.tableConfigName}?tableName=${assetType}`)
        let url = url = `${this.$apiUrl.tableConfigName2}?typeName=${this.assetType}`;
        console.log(vm.assetType, '9999999')
        if(vm.assetType === vm.$appConst.tableEnNameAsset) {
          console.log('7778899000')
          url = `${this.$apiUrl.tableConfigName3}/${this.assetType}`;
        }
        await vm.$http.get(url)
        .then((res)=>{
          if(res.data.status == this.$appConst.status){
            datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
            console.log(datas, 'datas')
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
      datas = datas.sort((a, b) => a.sortNo - b.sortNo);
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
        // 判断表单里字段是必填项
        if(item.ifNecessary) {
          vm.necessaryItem[item['fieldEnName']] = item['fieldCnName'];
        }

        // 先把字段是否是可编辑的放在一个对象中，因为添加和编辑时需要重新对这个对象拷贝处理。
        vm.copyEditIsDisabled[item['fieldEnName']] = item['ifEdit'];

        if(item.fieldEnName === "directories") {
          vm.directoriesList = item.defaultValue;
        }
      });
      this.$nextTick(() => {
        this.$refs.selectForm.changeValue({...vm.queryTerms, type: '类型'}, vm.sortTerms);
      });
      vm.search({});
    },
    // 添加按钮是否显示
    addButtonIsShow() {
      if(this.assetType=='TRADESUPPLIER'){
        return false;
      }
      if(this.assetType == 'TRADEAVIATIONSERVICEFEE' || this.assetType == 'TRADEAVIATIONOILDATA' || this.assetType == 'TRADEEAGLECOINTRANSACTION' ||  this.assetType == 'TRADETICKETSALES'){
        return false;
      }
      if(this.assetType == 'TRADEWAREHOUSE'){
        return false;
      }
      return true;
    },
    // 操作栏是否显示
    operationButtionIsShow() {
      // if(this.assetType == 'TRADEPONDERATION' ||this.assetType == 'TRADEQUALITY' || this.assetType == 'TRADESUPPLIER'){
      //   return false;
      // }
      // if(this.assetType == 'TRADEAVIATIONSERVICEFEE' || this.assetType == 'TRADEAVIATIONOILDATA' ||this.assetType == 'TRADEEAGLECOINTRANSACTION' || this.assetType == 'TRADETICKETSALES'){
      //   return false;
      // }
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
      if(this.assetType === 'TRADEDLVRGOODS' && this.roleType.indexOf('CORE_ENT') != -1){
        return true;
      }else{
        return false;
      }
    },
    // 添加时标题。
    // addFormTitle() {
    //   return '添加'+ this.$appConst.dataType[this.assetType];
    // },
    // 判断什么情况下可以勾选。
    selectable (row) {
      // 发货单有这个功能。
      if(this.assetType != 'TRADEDLVRGOODS') return true;
      if (row.recvgStatus === 'FALSE' ||　row.recvgStatus === 'false'||　row.recvgStatus === false) {
        return true
      } else {
        return false
      }
    },
    // 发货单管理中的批量确认
    async handleConfrim() {
      const vm = this;
      if(this.assetsUidList.length==0){
        this.$message.error('请至少选择一条数据');
        return;
      } 
      vm.confirmLoading = true;
      this.common(0,vm.entityUuids,this.$appConst.everySendNum);
    },
    async common(i,allIds,everyNumber) {
      var vm = this;
      var allNumber = Math.ceil(allIds.length/everyNumber); 
      var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
      try{
        let response = await this.$http.post(`${this.$apiUrl.confirmRecvgGoodsByBatch}/${this.assetType}`,everyIds);
        if(response.data.status == 200) {
          i = i+1;
          vm.$bus.$emit('showProgress',(i/allNumber)*100);
          if (i==allNumber){
            setTimeout(()=> {
              vm.$bus.$emit('hideProgress');
              vm.$message.success('批量确认成功！!');
              vm.search(this.searchForm);
              vm.$refs.tableRef.clearSelection();
              vm.confirmLoading = false;
            },1000);
            return;
          }
          vm.common(i,allIds,everyNumber);
        }
      }catch(err){
        vm.confirmLoading = false;
        vm.$message.error(err.data.message);
        vm.$bus.$emit('hideProgress');
      }
    },
    getAttachments(row){
      this.entityUuid = row.entityUuid;
      this.$refs.dialogCommonComponent3.show();
      this.$nextTick(() => {
        this.$refs.uploadFileComponent.init(row.attachments || [], this.copyEditIsDisabled.attachments);
      });
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
    selectBusinessTypeClose(businessTypeVal) {
      this.businessTypeVal = businessTypeVal;
      this.judgeIsRoot();
      this.drawer = true;
      this.$nextTick(() => {
        var disabledArray = Object.assign({},this.copyEditIsDisabled);
        for(var key in disabledArray){
          disabledArray[key] = true;
        }
        // 添加时字段都是可以编辑的。
        this.$refs.addDelv.setDisabled(disabledArray);
        this.$refs.addDelv.init(this.assetType,this.businessTypeVal,true,this.formItem, this.necessaryItem);
      });
    },
    // 判断是不是根节点
    async judgeIsRoot() {
      var vm = this;
      var response = await vm.$http.post(`${this.$apiUrl.queryRootAssetTypeByGraphUuid}${this.businessTypeVal}`)
      if(response.data.status == this.$appConst.status){
        var assetType = response.data.data;
        // 返回的assetType 和当前资产类型是否相同
        if(assetType === this.assetType) {this.isRoot = true;}
        else{this.isRoot = false;}
      }
    },
    async edit(row) { 
      this.drawer = true;
      this.addFormTitle = '编辑'+ this.$appConst.dataType[this.assetType]
      this.$nextTick(()=>{
        this.$refs.addDelv.setDisabled(this.copyEditIsDisabled);
        this.$refs.addDelv.init(this.assetType,this.businessTypeVal,false,this.formItem, this.necessaryItem);
        this.$refs.addDelv.editInit(Object.assign({},row));
      });
    },
    async sure() {
      var vm = this;
      var attachements = this.$refs.uploadFileComponent.getFile();
      var response = await vm.$http.post(`${vm.$apiUrl.addAttach}${this.assetType}/assetuuid/${this.entityUuid}/addAttach`,attachements)
      if (response.data.status == this.$appConst.status) {
        this.$bus.$emit('closeDialog');
        this.$message.success('附件修改成功');
        this.search(this.searchForm);
      }
    },
    handleAddAsset() {
      this.$refs.selectBusinessType.show();
      this.addFormTitle = '添加'+ this.$appConst.dataType[this.assetType]
    },
    openTabs(isTrue) {
      if (isTrue) {
        this.firstShow = true;
        this.secondShow = false;
      } else {
        this.firstShow = false;
        this.secondShow = false;
      }
      this.$refs.tableRef.doLayout();
    },
    // 创建关联
    handleCreateRelation(row) {
      this.$refs.relationDialog.show(row, 'createRelation', this.assetType);
    },
    // 取消关联
    handleCancelRelation(row) {
      this.$refs.relationDialog.show(row, 'cancelRelation', this.assetType);
    },
    // 查看资产图
    previewAssets(row) {
      // this.$refs.dialogCommonComponent2.show();
      // this.$nextTick(() => {
      //   this.$refs.assetView.init(row);
      // });
      this.$refs.assetViewDialog.init(row);
    },
    // 详情
    details(row) {
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.goodsDetailComponent.init(row,this.assetType);
        this.$refs.goodsDetailComponent.setSelected(false);
      }); 
      this.title= this.$appConst.dataType[this.assetType] + '详情';
    },
    // 收货
    receiveGoods(row){
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.goodsDetailComponent.init(row,this.assetType);
        this.$refs.goodsDetailComponent.setSelected(true);
      }); 
      this.title = '收货详情';
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
      const origionParams = {
        page: this.page - 1,
        size: this.pageSize,
        condition:{
          entityType:this.assetType
        }
      };
      if(vm.assetType === vm.$appConst.tableEnNameAsset) {
        origionParams.condition.entityType = vm.$appConst.auditTypeSet;
        searchForm['auditSubmitted'] = false;
        // searchForm['auditSubmit'] = false;
      }
      if(this.assetType === 'TRADEPONDERATION' || this.assetType === 'TRADEQUALITY' || this.assetType === "TRADESETTLEMENT") {
        vm.ifTableHeaderProperties = true;
      }
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
            var operator = "";
            if(key == 'entityNo'||key == 'name'){
              operator = "LIKE";
            }else{
              operator = key.indexOf('Name')!=-1 ? 'LIKE' : 'EQ';
            }
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
      const url = `${this.$apiUrl.assetQuery}`;
      // 结算单模块时需要获取结算单总金额。
      if(this.assetType == 'TRADESETTLEMENT' ||　this.assetType == 'TRADEPONDERATION'){
        this.getTotalAmount(this.assetType);
      }
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          let content = res.data.data.content;
          //遍历对象属性key 属性值obj[key]
          for( let key in vm.mainTable.tableHeader ){
            if(key === 'properties' || vm.ifTableHeaderProperties) {
              delete vm.mainTable.tableHeader.properties;
              let obj = {};
              content.forEach(item => {
                obj = item.properties;
                if(obj) {
                  if(Object.keys(obj).length) {
                    for( let key2 in obj ){
                      if(key2 != '$$typesMapKey$$') {
                        vm.mainTable.tableHeader[key2] = key2;
                        item[key2] = obj[key2];
                      }
                    }
                  }
                }
              })
            }
          }
          this.mainTable.tableData = content;
          vm.ifTableHeaderProperties = false;
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
.allTotalClass{
  text-align:right;
  line-height:40px;
  font-size:16px;
  color:#000;
}
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
