<template>
    <div>
        <!-- <breadcrumb :breadcrumbList="breadcrumbs"/> -->
        <div  v-show="firstShow">
          <!-- 表格 -->
          <el-button style="margin-bottom:10px;"
                type="primary"
                class="primaryButton2"
                :disabled="!assetsUidList.length"
                @click="batchSubmit">
              提交审核
          </el-button>
          <el-button style="margin-bottom:10px;"
                type="primary"
                class="addButton"
                icon="el-icon-plus"
                v-if="addButtonIsShow()"
                @click="handleAddAsset()">
              添加
          </el-button>
          <selectForm ref="selectForm" :invoiceCheckStatusList='invoiceCheckStatusList' :invoiceTypesList="invoiceTypesList" :type='assetTypeList' :invoiceStatusList='invoiceStatusList' @search="reSearch" class="selectForm2"></selectForm>
          <div  class="asset-list borderRadiu12">
            <div>
            <Table
                class="asset-table"
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
                @rowClick="rowClick"
                :showPagination="true" :height2="height2()">
                <!-- 操作 -->
                <el-table-column 
                        fixed="right"
                          label="操作" width="160"
                          v-if="operationButtionIsShow()"
                          >
                    <template slot-scope="scope">
                      <!-- <el-button
                          icon="el-icon-view"
                          class="collectBtn redBtn"
                          size="medium"
                          type="text"
                          style="margin-left:0px; "
                          v-if="detailButtonIsShow()"
                          @click="details(scope.row)">
                          详情
                      </el-button> -->
                      <el-button
                          :class="{'notSubmit': hasNoEditable(scope)}"
                          size="medium"
                          type="text"
                          style="margin-left: 0px;"
                          @click="edit(scope.row)">
                          编辑
                      </el-button>
                      <!-- v-if="scope.row.auditSubmitted" -->
                      <el-button
                          size="medium"
                          type="text"
                          style="margin-left: 5px;"
                          @click="deleteAsset(scope.row)">
                          删除
                      </el-button>
                      <!-- <el-dropdown trigger="click">
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
                        </el-dropdown> -->
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
          </div>

          <!-- 树形文件夹 -->
          <!-- <div class="stretch" @mousedown="stretchMousedown" @mouseup="stretchMouseup"></div> -->
          <div class="asset-attachment borderRadiu12" v-if="mainTable.tableData.length">
            <folderTree :folderOption="folderOption" ref="folderTree"></folderTree>
          </div>
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
import addDelv from './addDelv';
import settlement from '../assetContract/settlement';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';
import showFileDetail from '@/components/showFileDetail.vue';
import commonSetData from '@/assets/js/commonSetData.js';
import{mapState,mapMutations} from 'vuex';
import selectBusinessType from '@/components/selectBusinessType';
import assetViewDialog from '@/components/assetViewDialog'
import axios from 'axios'
import folderTree from '@/components/folderTree.vue'

export default {
  name: '',
  data() {
    return {
      folderOption: {
        assetInfo: {},
        type: 'asset',
        canUpload: true
      },
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
    folderTree,
    assetViewDialog,
    Table,
    dialogCommonComponent,
    goodsDetailComponent,
    assetView,
    addDelv,
    uploadFileComponent,
    selectForm,
    breadcrumb,
    showFileDetail,
    selectBusinessType,
    settlement
  },
  created() {
    // 首次用到该组件的时候执行这个。
    // var assetType = this.$route.params.assetType;
    // this.getDictionary(assetType);
    this.initExecute(this.$appConst.tableEnNameAsset);
    // this.initExecute(this.$appConst.assetTypeSet);
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
  },
  beforeDestroy() {
    this.$bus.$off('back');
    this.$bus.$off('addClose');
    this.$bus.$off('getAssetsUidList');
  },
  methods: {
    ...mapMutations(['SET_DATALIST', 'SET_DICTIONARY']),
    hasNoEditable (scope) {
      // return true
      // return !scope.row.assetInfos.filter(item => item.editable).length
    },
    rowClick (row) {
      // row.assetInfos.map(item => {
      //   if (item.name === this.$appConst.assetIdentification) {
      //     this.identifier = item.value
      //   }
      // })
      const vm = this;
      this.folderOption.assetInfo = row
      // this.$store.commit('ADD_DIRECTORIESTOASSET', { id: row.id, assetInfo: row })
      this.$nextTick(() => {
        vm.$refs.folderTree.init()
      })
    },
    batchSubmit () {
      let temSubmitUuids = []
      this.selectedAssetsList.map(item => {
        // if (item.allowSubmit) {
          temSubmitUuids.push(item.entityUuid)
        // }
      })
      if (temSubmitUuids && temSubmitUuids.length) {
        const url = `${this.$apiUrl.auditSubmit}/${this.$appConst.tableEnNameAsset}/submit`
        const params =  temSubmitUuids
        
        this.$http.post(url, params)
          .then(res => {
            if (res.data.status === 200) {
              this.$message.success('提交审核成功')
              this.search()
              this.selectedAssetsList = []
              this.assetsUidList = []
              // this.$refs.assetTable.clearSelection()
            }
          }).catch(err => {
            this.$message.error(err.data.message || '提交审核失败，请稍后再试')
          })
      } else {
        this.$message.info('请勾选可提交审核的资产')
      }
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
      // var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // if(this.assetType == 'TRADESETTLEMENT' ||　this.assetType == 'TRADEPONDERATION'){
      //   return height - 330;
      // }else{
      //   return height - 300;
      // }
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
      let response = await this.$http.post(`${this.$apiUrl.assetGraphStart2}/${this.assetType}/delete/${row.entityUuid}`, {})
        if(response.data.status === this.$appConst.status) {
          this.$message.success('删除成功！');
          this.reSearch(this.searchForm);
        }
    },
    // 查看发票
    handleSearchImg (item) {
      this.$refs.showFileDetail.showFile(item);
    },
    async initExecute(assetType) {
      const vm = this;
      this.loading = true;
      this.assetType = assetType;
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
        // await vm.$http.get(`${this.$apiUrl.tableConfigName2}?typeName=${assetType}`)
        await vm.$http.get(`${this.$apiUrl.tableConfigName3}/${assetType}`)
        .then((res)=>{
          if(res.data.status == 200){
            // if(res.data.data.udf) {
            //   // datas = JSON.parse(res.data.data.udf);
            //   datas = res.data.data.udf;
            // } else {
            //   datas = [];
            // }
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
      // datas = datas.sort((a, b) => a.sortNo - b.sortNo);
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
          // vm.mainTable.tableWidth[item['fieldEnName']] = item['fieldCnName'].length > 6 ? 230 : item['fieldCnName'].length * 30
        }
        // 添加表单需要展示的字段
        if(item.ifEdit){
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
      console.log(vm.mainTable, 'vm.mainTable')
      vm.search();
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
      // if(this.assetType === 'com.evisible.entity.base.common.entity.AssetEntity'){
      return true
      if(this.assetType === this.$appConst.tableEnNameAsset){
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
      // if(this.assetType != 'TRADEDLVRGOODS') return true;
      return true
      if (row.recvgStatus === 'FALSE' ||　row.recvgStatus === 'false'||　row.recvgStatus === false || row.auditSubmit) {
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
    close() {
      this.$bus.$emit('closeDialog');
    },
    selectBusinessTypeClose(businessTypeVal) {
      this.businessTypeVal = businessTypeVal;
      // this.judgeIsRoot();
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
      this.selectBusinessTypeClose('');
      // this.$refs.selectBusinessType.show();
      // this.addFormTitle = '添加'+ this.$appConst.dataType[this.assetType]
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
          if(vm.assetType === vm.$appConst.tableEnNameAsset) {
            vm.rowClick(this.mainTable.tableData[0])
          }
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.totalCount = 0;
          // this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
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
// .asset-list {
//     height: calc(50vh - 14px);
//     // background: #fff;
//     overflow: auto;
//     // border: 1px solid #6666661f;
//     min-height: 242px;
// }
.asset-list{
  width: 100%;
  height: calc(50vh - 69px);
  background: #fff;
  overflow: auto;
  border: 1px solid #6666661f;
  min-height: 242px;
  /deep/ .asset-table{
    // .el-table{
    //   height: calc(50vh - 65px);
    //   min-height: 200px;
    // }
    .el-table__fixed-right{
      right: 0;
      height: calc(50vh - 72px);
      min-height: 190px;
      &::before{
        height: 0;
      }
      .el-table__fixed-body-wrapper{
        height: calc(50vh - 132px);
        min-height: 129px;
      }
    }
  }
  .asset-query-pagenav{
    float: right;
    position: relative;
    right: 10px;
    top: 10px;
  }
}
.notSubmit, .notSubmit:hover{
  color: #999999;
  cursor: not-allowed;
}
.primaryButton2:disabled{
  background: rgba(153, 153, 153, 0.377);
  color: #fff;
  border-color: #fff;
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
