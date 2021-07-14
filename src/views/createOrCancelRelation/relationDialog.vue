<template>
    <div style="background: #FFF; width: 100%; overflow:hidden;">
        <div v-if="dialogVisible" class="f-l">
              <div  class="relationlist"
                      v-for="group in assetTypeOptions"
                      :key="group.label"
                      >
                  <p class="titLabel">{{ group.label }}</p>
                  <p class="texItem"
                          v-for="item in group.options"
                          :key="item.value"
                          :value="item.value"
                          :class="{'liColor': item.active}"
                          @click="sureRelation(item.value)">
                          {{ item.label }}
                  </p>
              </div>
        </div>
        <!-- 创建关联之后的tabs -->
        <div v-if="assetRelationTabsShow" class="f-r" style="margin-top: 20px; position: relative;">
          <div v-show="selectAssetType==='TRADECONTRACT*up'|| isCreateOrCancelRelation === 'cancelRelation'" style="width: 100%;height: 40px;"></div>
            <div class="querySelect" v-show="!noData">
              <selectForm ref="selectForm" @search="reSearch"></selectForm>
            </div>
          <Table
                v-if="selectAssetType==='TRADECONTRACT*up'|| isCreateOrCancelRelation === 'cancelRelation'"
                ref="tableRef3"
                :mainTable="mainTable"
                :selected="true"
                :selectable="selectable"
                :loading="loading"
                :currentPage="page3"
                :pageSize="pageSize3"
                :totalCount="totalCount"
                @handleSizeChange="handleSizeChange3"
                @handleCurrentChange="handleCurrentChange3"
                :showPagination="true"
                :height2="height2()">
          </Table>
          <div v-else-if="noData" style="margin: 15% 0 20% 0">
              <img :src="$global.imgUrl.empty"
                alt="无显示数据"
                style="display:block;height: 136px;width: 160px;margin:0 auto;"
                >
              <p style="color:#999;line-height: 14px;text-align: center;">
                暂无资产信息
              </p>
          </div>
          <el-tabs v-model="activeName"
              v-else
              class="m-t-50 m-b-102"
              @tab-click="handleClick">
              <!-- <el-tab-pane style="display:inline-block;width;50px;"></el-tab-pane> -->
              <el-tab-pane label="不属于当前合同（待关联）" name="first">
                <Table
                      ref="tableRef"
                      :mainTable="mainTable"
                      :selected="true"
                      :selectable="selectable"
                      :loading="loading"
                      :currentPage="page"
                      :pageSize="pageSize"
                      :totalCount="totalCount"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :showPagination="true"
                      :height2="height2()">
                </Table>
              </el-tab-pane>
              <el-tab-pane label="属于当前合同（待关联）" name="second">
                  <Table
                        ref="tableRef2"
                        :mainTable="mainTable"
                        :selected="true"
                        :selectable="selectable"
                        :loading="loading"
                        :pageSize="pageSize2"
                        :currentPage="page2"
                        :totalCount="totalCount"
                        @handleSizeChange="handleSizeChange2"
                        @handleCurrentChange="handleCurrentChange2"
                        :showPagination="true"
                        :height2="height2()">
                  </Table>
              </el-tab-pane>
          </el-tabs>
          <div style="position: absolute; bottom: 84px; font-size: 14px; left: 10px;" v-if="nowSelectInvoice.length>0">
              <span>合计：共 <b class="redColor">{{nowSelectInvoice.length}}</b> 条</span>
              <span  style="margin-right: 10px; margin-left: 10px;">共 <b class="redColor">{{$appConst.fmoney(totalAmount, 2)}}</b> 元</span>
          </div>
            <div style="text-align: center;margin: 20px 0">
                <el-button type="warning" @click="handlePrev()">上一步</el-button>
                <el-button type="primary" @click="handleRelateSure('confirm')"  v-show="!noData" class="primaryButton" style="width: 84px;">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Table from '@/components/Table.vue';
import { tabHeader } from './tabHeader.js';
import selectForm from '@/components/selectForm.vue';
import commonSetData from '@/assets/js/commonSetData.js';
import{mapState,mapMutations} from 'vuex';
import mixin from './mixin'

export default {
  name: '',
  mixins:[mixin],
  data() {
    return {
      noData: false,
      sortTerms: {},
      queryTerms:{},
      totalAmount: 0,
      isCreateOrCancelRelation: '',
      nowSelectInvoice: [],
      assetsUidList: [],
      isDisabled: true,
      activeName: 'first',
      assetRelationTabsShow: false,
      assetGraphUuid: '',
      nowRelationRow: '',
      dialogVisible: false,
      title: '',
      nowSelectPatternNode:{
        // patternGraphUuid:"46a255fc-a682-4726-bdf1-1b66058a3a0e",
        typename: ''
      },
      selectAssetType: '',
      assetTypeOptions: [
        {
          label: '上游资产',
          options: []
        },
        {
          label: '下游资产',
          options: []
        }
      ],
      // 表格数据
      mainTable: {
        tableHeader: {},
        tableData: [],
        // tableWidth: {}
      },
      totalCount: 0, // 数据总数
      page: 1,
      page2: 1,
      page3: 1,
      pageSize: 10,
      pageSize2: 10,
      pageSize3: 10,
      loading: false,
      text: '', // 关联或者取消关联提示文字
      multipleSectionParams: [], // 关联或取消关联选中的数据uuid
      sendUrl: '' // 关联或取消关联请求的url
    };
  },
  components: {
    selectForm,
    Table
  },
    watch: {
    'selectAssetType': function a() {
      const vm = this;
      let assetType = vm.selectAssetType.slice(0, vm.selectAssetType.indexOf('*'));
      if (assetType) {
        vm.initExecute(assetType);
      }
    },
    // 监听地址栏变化
    $route(to,from){
      this.handlePrev();
      this.activeName = 'first';
    }
  },
  computed: {
    ...mapState(['ASSETSPARAMS'])
  },
  created() {
    
  },
  mounted() {
    const vm = this;
    this.$bus.$on('getAssetsUidList',function(value1,value2) {
      // assetsUidList 为选中的id数组
      // nowSelectInvoice为选中的行的所有数据。
      vm.assetsUidList = value1;
      vm.nowSelectInvoice = value2;
      vm.totalAmount = 0;
      vm.nowSelectInvoice.forEach(val => {
        if (val && val.totalAmount) {
          vm.totalAmount += val.totalAmount;
        } else if (val && val.amount) {
          vm.totalAmount += val.amount;
        }
      });
    })
  },
  beforeDestroy() {
    this.$bus.$off('getAssetsUidList');
  },
  methods: {
    ...mapMutations(['SET_DATALIST', 'DICTIONARY' , 'SET_DICTIONARY']),
    // 动态获取字段；
    async initExecute(assetType) {
      const vm = this;
      this.loading = true;
      this.queryTerms = {};
      this.sortTerms = {};
      this.mainTable.tableHeader = {};
      var datas = [];
      // 如果store中存储有该显示哪些字段，则从store中获取，否则重新发送请求获取。
      if(vm.ASSETSPARAMS[assetType]) {
        datas = vm.ASSETSPARAMS[assetType];
      }else{
        // 如果store中没有，则发送请求获取。
        // datas = allList[assetType];
        // vm.SET_DATALIST({value1:datas,value2:assetType});
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
        // 判断哪些字段是查询中展示的。
        if(item.ifQuery){
          vm.queryTerms[item['fieldEnName']] = item['fieldCnName'];
        }
        // 排序需要的字段
        if(item.ifSort){
          vm.sortTerms[item['fieldEnName']] = item['fieldCnName'];
        }
        // 表格中需要展示的字段
        if(item.listVisible){
          vm.mainTable.tableHeader[item['fieldEnName']] = item['fieldCnName'];
        }
      });
      this.$nextTick(() => {
        this.$refs.selectForm.changeValue(vm.queryTerms, vm.sortTerms);
      });
    },
    reSearch(searchForm) {
      this.page = 1;
      this.searchForm = searchForm;
      this.handleCreateRelationGetData(this.nowRelationRow, searchForm);
    },
    height2() {
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height - 354;
    },
    selectable (row) {
      // 以前是lockState
      if (row.locked) {
        return false
      } else {
        return true
      }
    },
    handlePrev() {
      this.nowSelectInvoice = [];
      this.assetRelationTabsShow = false;
      this.dialogVisible = false;
      this.$emit('openTabs', true);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef2.clearSelection();
      this.handleCreateRelationGetData(this.nowRelationRow);
      this.$refs.selectForm.reset();
    },
    show(row, isCreateRelation, typeParam) {
      this.activeName = 'first';
      this.selectAssetType = '';
      this.nowRelationRow = row;
      this.$emit('openTabs', false); // 隐藏父组件
      this.dialogVisible = true;
      this.assetRelationTabsShow = true;
      this.isCreateOrCancelRelation = isCreateRelation;
      this.nowSelectPatternNode.typename = typeParam;
      this.init(row);
    },
    async init(row) {
      const vm = this;
      this.noData = false;
      const assetGraphUuid2 = row.graphUuid;
      this.assetGraphUuid = assetGraphUuid2;
      const url = `${this.$apiUrl.getAssetGraphUuid}${assetGraphUuid2}/get`;
      // const url = `${this.$apiUrl.getAssetGraphUuid}da52894d-1143-4c12-971b-3b4d9c8ce687/get`; // da52894d-1143-4c12-971b-3b4d9c8ce687

      // const res = await this.$http.get(url)
      // this.init2(res.data.data.graphUuid);
      // this.init2('8386babf-d48c-4f20-86c3-fd9daf6a7d23')
      vm.loading = true;
      this.$http.get(url)
        .then(res => {
          vm.loading = false;
          if (res.data.status === 200) {
            if (!res.data.data) {
              vm.noData = true;
              return;
            }
            if (res.data.data.graphInfo.graphUuid) {
              vm.init2(res.data.data.graphInfo.graphUuid);
            } else {
              vm.noData = true;
            }
          } else {
            this.noData = true;
          };
        }).catch(err => {
          this.noData = true;
          vm.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
      });
    },
    async init2 (graphUuidParam) {
      this.noData = false;
      const patternGraphUuid = graphUuidParam;
      const downUrl = `${this.$apiUrl.getDownStreamAllAssetType}${patternGraphUuid}/${this.nowSelectPatternNode.typename}`;
      const upUrl = `${this.$apiUrl.getUpStreamAllAssetType}${patternGraphUuid}/${this.nowSelectPatternNode.typename}`;
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      let response = [];
      if (this.isCreateOrCancelRelation === "cancelRelation") {
        this.title = '取消关联';
        this.assetTypeOptions = [
          {
            label: '上游资产',
            options: []
          },
          {
            label: '下游资产',
            options: []
          }
        ];
        response = await this.$axiosTools.all([this.$http.get(upUrl).catch(err => {
          loading.close();
          this.noData = true;
          this.$message.warning(err.data.message);
        }), this.$http.get(downUrl).catch(err => {
          loading.close();
          this.noData = true;
          this.$message.warning(err.data.message);
        })]);
        loading.close();
      } else {
        this.title = '创建关联';
        response = await this.$axiosTools.all([this.$http.get(downUrl).catch(err => {
          loading.close();
          this.noData = true;
          this.$message.warning(err.data.message);
        })]);

        loading.close();
        this.assetTypeOptions = [
          //  {
          //   label: '上游资产',
          //   options: []
          // },
          {
            label: '下游资产',
            options: []
          }
        ];
      }

      if (response) {
        if (response && response.length) {
          if (response.length === 1 && response[0].data.data.length === 0) {
            this.noData = true; //下拉列表没有数据时才显示
            return;
          }
          if (response.length === 2 && response[0].data.data.length === 0 && response[1].data.data.length === 0) {
            this.noData = true;
            return;
          }
          this.noData = false;
          response.map((val, index) => {
            // this.assetTypeOptions[index]["options"] = [];
            if (val.data.status === this.$appConst.status) {
              if (val.data.data && val.data.data.length) {
                let data = val.data.data
                let isUpOrDown = "";
                if (this.assetTypeOptions.length == 2) {
                  index === 0 ? isUpOrDown = "up" : isUpOrDown = "down"
                } else {
                  isUpOrDown = "down";
                }
                data.map(v => {
                  this.assetTypeOptions[index]["options"].push({
                    value: v + "*" + isUpOrDown,
                    label: this.$appConst.dataType[v]
                  })
                })
                // if (this.nowSelectPatternNode.typename === 'TRADESETTLEMENT' && this.isCreateOrCancelRelation === "cancelRelation") {
                //   this.assetTypeOptions = this.assetTypeOptions.slice(0, 1);//截取第一个
                // } else if (this.nowSelectPatternNode.typename === 'TRADECONTRACT' && this.isCreateOrCancelRelation === "cancelRelation") {
                //   this.assetTypeOptions = this.assetTypeOptions.slice(1, 2);
                // }
                let defaultSelet = this.assetTypeOptions[0].options;
                if (defaultSelet.length > 0) {
                  this.sureRelation(defaultSelet[0].value);// 默认显示第一条
                }
              }
            }
          })
        }
      }
    },
    sureRelation(val) {
      if (this.isCreateOrCancelRelation === 'cancelRelation') {
        this.$refs.tableRef3.clearSelection();
      }
      if (this.assetTypeOptions.length > 0) { // 点击的那行高亮显示
        this.assetTypeOptions.forEach( group => {
          group.options.forEach(item => {
            item.active = false;
            if (val === item.value) {
              item.active = true;
            }
          })
        })
      }
      if (val) {
        this.selectAssetType = val;
        this.handleCreateRelationGetData(this.nowRelationRow);
      } else {
        this.selectAssetType = '';
      }
      this.$emit('openTabs', false); // 隐藏父组件
      this.dialogVisible = true;
      this.assetRelationTabsShow = true;
    },
    // 创建关联  获取上一节点资产数据
    async handleCreateRelationGetData (row, searchForm) {
      this.nowRelationRow = row
      let assetGraphUuid = this.assetGraphUuid
      let patternNodeUuid = this.nowRelationRow.entityUuid
      let isConnect = false
      let assetType = this.selectAssetType.split('*')[0]
      let origionParams = {
        condition: {
          entityType: assetType,
        },
        page: this.page-1,
        size: this.pageSize,
        // assetType: assetType,
        // page: this.page,
        // pageSize: this.pageSize
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

      let params = {};

      if (this.isCreateOrCancelRelation === 'cancelRelation') {
        isConnect = true
      }

      // let url = `${this.$apiUrl.assetStart}/${isConnect}/patternGraph/${assetGraphUuid}/node/${patternNodeUuid}/queryUpNoRelatedAssets`
      let url = `${this.$apiUrl.assetNodeStart}${patternNodeUuid}/${isConnect}/queryUpNoRelatedAssets`
      let autoUrl = this.$apiUrl.queryAssetNoGraph;
      if (this.selectAssetType.split("*")[1] === "down") {
        // url = `${this.$apiUrl.assetStart}/${isConnect}/patternGraph/${assetGraphUuid}/node/${patternNodeUuid}/queryDownNoRelatedAssets`
        url = `${this.$apiUrl.assetNodeStart}${patternNodeUuid}/${isConnect}/queryDownNoRelatedAssets`
      }
      this.mainTable.tableData = [];
      this.loading = true;
      await this.getDictionary(this.selectAssetType.split('*')[0]);
      if (this.isCreateOrCancelRelation === 'cancelRelation') {
        origionParams.page = this.page3-1;
        origionParams.size = this.pageSize3;

        params = Object.assign({}, origionParams);
        this.$http.post(url, params).then(res => {
          this.loading = false;
          if (res.data.status === this.$appConst.status) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData.map(item => {
              if (this.selectAssetType.includes('TRADECONTRACT')) {
                // item.businessType = this.DICTIONARY[this.$appConst.dictionaryType.buzType][item.buzType];
                // item.cType = this.DICTIONARY[this.$appConst.dictionaryType.contractType][item.type];
              } else if (this.selectAssetType.includes('TRADEDLVRGOODS')) {
                item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
              }
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        })
        return;
      }

      if (this.activeName === 'first') {
        params = Object.assign({}, origionParams);
        this.$http.post(autoUrl, params).then(res => {
          this.loading = false;
          if (res.data.status === this.$appConst.status) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData.map(item => {
              if (this.selectAssetType.includes('TRADEDLVRGOODS')) {
                item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
              }
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        })
      } else {
        origionParams.page = this.page2-1;
        origionParams.size = this.pageSize2;

        params = Object.assign({}, origionParams);
        this.$http.post(url, params).then(res => {
          this.loading = false;
          if (res.data.status === this.$appConst.status) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData.map(item => {
              if (this.selectAssetType.includes('TRADEDLVRGOODS')) {
                item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
              }
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        })
      }
    },
    // 关联
    handleRelateSure (isConfirm) {
      if (isConfirm === "confirm" && this.nowSelectInvoice.length>0) {
        this.handleSaveOrCancelRelation();
        // this.handleSetSaveData();
        return
      } else if (isConfirm === "confirm" && !this.nowSelectInvoice.length) {
        this.$message.warning('至少选择一条数据！');
        return
      } else this.selectAssetType = '';
      this.assetRelationTabsShow = false;
      this.dialogVisible = false;
      this.$emit('openTabs', true);
    },
    // 资产关联 or 取消关联
    async handleSaveOrCancelRelation () {
      let assetGraphUuid = this.assetGraphUuid;
      let assetUuid = this.nowRelationRow.entityUuid;
      let sourceAssetType = '';
      let targetAssetType = '';
      let url = '';
      let isDown = this.selectAssetType.split("*")[1];
      if (isDown === 'down') {
        targetAssetType = this.selectAssetType.replace('*down', '');
        // url = `${this.$apiUrl.assetConnectStart}/${assetGraphUuid}/from/${assetUuid}/${this.nowSelectPatternNode.typename}/to/${targetAssetType}`; // 向下关联
        url = `${this.$apiUrl.assetConnectStart}/${assetGraphUuid}/from/${assetUuid}/to/${targetAssetType}`; // 向下关联
      }
      if (isDown !== "down" && isDown) { // 向上关联
        targetAssetType = this.selectAssetType.replace('*up', '');
        // url = `${this.$apiUrl.assetGraphStart}/${assetGraphUuid}/connect/to/${assetUuid}/${this.nowSelectPatternNode.typename}/from/${targetAssetType}`;
        url = `${this.$apiUrl.assetGraphStart}/${assetGraphUuid}/connect/to/${assetUuid}/${targetAssetType}`;
      }
      this.text = "关联";
      let params = [];
      if (this.nowSelectInvoice && this.nowSelectInvoice.length) {
        this.nowSelectInvoice.map(val => {
          params.push(val.entityUuid);
        })
      } else {
        // this.dialogRelateShow = false
        return
      }
      // 取消关联
      if (this.isCreateOrCancelRelation === "cancelRelation") {
        if (this.selectAssetType.indexOf('up') > -1) {
          [params[0], assetUuid] = [assetUuid, params[0]];
        }
        // url = `http://192.168.28.99:8091/graph/asset-graph/${assetGraphUuid}/disconnect/from/${assetUuid}/to`;
        url = `${this.$apiUrl.assetGraphStart}/${assetGraphUuid}/disconnect/from/${assetUuid}/to`;
        this.text = "取消关联";
      }
      // 合同关联订单
      // if (this.relationAsset === "relationOrder") {
      //   sourceAssetType = 'TRADECONTRACT'
      //   targetAssetType = 'TRADEORDER'
      //   // let orderPatternNodeUuid = this.patternNodes.filter(v => v.nodeType.typeName === "TRADEORDER")[0]["uuid"]
      //   url = `/graph/asset-connect/${assetGraphUuid}/from/${assetUuid}/${sourceAssetType}/to/${targetAssetType}` // 向下关联
      // }
      let totalLength = params.length; // 总条数
      this.multipleSectionParams = params;
      this.sendUrl = url;
      this.handleSaveConfirmData(0);
    },
    // 关联 处理数据
    handleSaveConfirmData (n) {
      if (this.multipleSectionParams.length) {
        this.$bus.$emit('showProgress',0); 
        this.common(0, this.multipleSectionParams, this.$appConst.everySendNum);
      } else {
        this.$message.warning("至少选择一条，请选择！");
      }
    },
    async common(i,allIds,everyNumber) {
      var vm = this;
      var allNumber = Math.ceil(allIds.length/everyNumber); 
      var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
      try{
        let response = await this.$http.post(this.sendUrl,everyIds);
        if(response.data.status == 200) {
          i = i+1;
          vm.$bus.$emit('showProgress',(i/allNumber)*100);
          if (i==allNumber){
            setTimeout(()=> {
              vm.$bus.$emit('hideProgress');
              vm.assetRelationTabsShow = false;
              vm.dialogVisible = false;
              vm.handlRestData();
              vm.$message.success(vm.text + "成功！");
              vm.$emit('openTabs', true);
              // vm.$refs.tableRef.clearSelection();
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
    handlRestData () {
      this.multipleSectionParams = [];
      this.sendUrl = '';
      this.nowSelectInvoice = [];
      this.selectAssetType = '';
      // this.$store.commit("SET_BATCH_STATUS", false)
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    // 分页
    handleCurrentChange2(currentPage) {
      this.page2 = currentPage;
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleSizeChange2(size) {
      this.pageSize2 = size;
      this.page2 = 1;
      this.$refs.tableRef2.resetCurrentPage();
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleCurrentChange3(currentPage) {
      this.page3 = currentPage;
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleSizeChange3(size) {
      this.pageSize3 = size;
      this.page3 = 1;
      this.$refs.tableRef3.resetCurrentPage();
      this.handleCreateRelationGetData(this.nowRelationRow);
    }
  }
};
/* eslint-enable */
</script>

<style lang="scss" scoped>
.f-l {
  float: left;
  width: 15%;
  max-height: calc(100vh - 166px);
  height: calc(100vh - 166px);
  border-right: 1px solid rgba(225,229,239,1);
    .relationlist {
      .titLabel {
        padding-left: 10px;
        height:27px;
        // width: 48px;
        font-size:12px;
        color:rgba(102,102,102,1);
        line-height:27px;
      }

      .texItem{
        padding-left: 20px;
        color:rgba(51,51,51,1);
        height: 36px;
        line-height:36px;
        cursor: pointer;
      }
    }
}
.f-r {
  float: left;
  margin-left: 0.5%;
  width: 84%;
}
.liColor {
  background:rgba(241,244,245,1);
  box-shadow:0px 1px 0px 0px rgba(0,0,0,0.05);
}
.querySelect {
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 999;
}

.clearfix:after{
  content: "";
  display: block;
  height: 0;
  clear:both;
  visibility: hidden;
  overflow: hidden;
}
// .clearfix{
//   *zoom: 1;
// }
</style>
