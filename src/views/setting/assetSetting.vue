<template>
    <div id='assetTable'>
        <!-- <breadcrumb :breadcrumbList="breadcrumbs"/> -->
      <el-form :model="ruleForm" ref="ruleForm" size="small">
        <el-table 
          ref="multipleTable" 
          tooltip-effect="dark" 
          class="detailEntry"
          id="detailEntry"
          :data="ruleForm.tabData"
          :height="height"
          >
          <el-table-column fixed type="index" width="65" center >
            </el-table-column>
    
            <el-table-column 
              v-for="(item, key) in mainTable.tableHeader" 
              :prop="key" 
              :column-key="key" 
              :label="item" 
              :key="key" 
              :show-overflow-tooltip="true" 
              >
              <template slot="header" slot-scope="scope">
                  <!-- <div  v-if="key == 'fieldCnName'" class="table-head" style="width: 100%;">
                    <i style="color: #f56c6c;">*</i>
                    {{item}}
                  </div>
                  <div v-else>
                    {{item}}
                  </div> -->
                  <div >
                    {{item}}
                  </div>
              </template>
              <template slot-scope="scope">
                <el-form-item
                	:prop="'tabData.' + scope.$index + '.'+key"
                	:rules="rules[key]"
                >
                  <div v-if="key === 'fieldCnName' || key === 'fieldEnName'" class="tableInnerInput" @click.stop=''>
                      <!-- <el-input
                          v-model="scope.row[key]"
                          :disabled="!scope.row['editChange']"
                          :ref='"companyName" + scope.$index'>
                      </el-input> -->
                      <el-input
                        size="medium"
                        :disabled="!scope.row['editChange']"
                        v-model="scope.row[key]"
                        class="editInput"
                        :keyVal="key"
                        :index="scope.$index"
                        :val="scope.row[key]">
                      </el-input>
                  </div>
                  <!-- 类型 -->
                  <el-select
                      v-else-if="key === 'fieldType'"
                      v-model="scope.row[key]"
                      :disabled="!scope.row['editChange']"
                      placeholder="请选择类型"
                      class="tableInnerInput"
                      style="width: 100px;">
                      <el-option
                          v-for="item in typeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
                <div v-else-if="key === 'ifSort' || key === 'ifQuery' || key === 'ifEdit' || key === 'listVisible'"
                    @click.stop=''>
                        <span v-if="!scope.row['editChange']" class="el-checkbox checkBoxBtn"> {{ scope.row[key] ? '是' : '否'}} </span>
                        <el-checkbox v-else v-model="scope.row[key]" class="checkBoxBtn"></el-checkbox>
                </div>
              <div v-else-if="key === 'portalTypeVisible'" @click.stop=''>
                <!-- <div v-else-if="key === 'portals'"> -->
                  <el-checkbox-group
                      v-model="scope.row[key]"
                      :disabled="!scope.row['editChange']"
                      class="isWebViewBtn">
                      <el-checkbox-button
                          v-for="item in isWebViewOptions"
                          :key="item.value"
                          :label="item.value">
                          {{ item.label }}
                      </el-checkbox-button>
                  </el-checkbox-group>
              </div> 
              <!-- <div v-else-if="key === 'portals'">
                {{scope.row[key]}}
                  <el-checkbox-group
                      v-model="scope.row[key]"
                      :disabled="!scope.row['editChange']"
                      class="isWebViewBtn">
                      <el-checkbox-button
                          v-for="item in isWebViewOptions"
                          :key="item.value"
                          :label="item.value">
                          {{ item.label }}
                      </el-checkbox-button>
                  </el-checkbox-group>
              </div>          -->
  	    				<!-- <el-input
		    			  	size="medium"
  	    					v-else
  	    					v-model="scope.row[key]"
  	    					class="editInput"
  	    					:keyVal="key"
  	    				  :index="scope.$index"
  	    					:val="scope.row[key]"
  	    					@blur="handleDetailBlur($event, scope.row, key, scope.$index)"
  	    					>
  	    				</el-input> -->
                </el-form-item>
		    	    </template>
		        </el-table-column>
    
		         <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <i class="el-icon-edit" @click.stop="handleEditChange(scope.$index)" style="cursor:pointer;font-size:18px;margin-right: 20px;"></i>
                  <i class="el-icon-delete" @click="handleDeleteRow(scope.$index)"  style="cursor:pointer;font-size:18px"></i>
                </template>
            </el-table-column>
		    </el-table>
      </el-form>
        <div class="detailAdd">
          <span class="redColor pointer" @click="handleDetailAdd()"><i class="el-icon-plus"></i>添加</span>
        </div>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import commonSetData from '@/assets/js/commonSetData.js';
import{mapState,mapMutations} from 'vuex';
import axios from 'axios'


export default {
  name: '',
  data() {
    return {
      ruleForm: {
        tabData:[]
      },
      rules: {
        fieldCnName:[
          { required: true, message: '此项必填项', trigger: 'change' },
        ],
        fieldEnName:[
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { pattern:/^[a-zA-Z_]*$/,message:"只能输入英文字母",trigger:"blur" },
        ],
        // quotePrice:[
        // 	{ required: true, message: '单价为必填项', trigger: 'blur' },
        // 	// { pattern:/^\d{1,3}||(\,)+(\.\d{1,2})?$/,message:"只能输入数字和最多两位小数",trigger:"blur" },
        // 	{ pattern:/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/,message:"输入总和最多两位小数",trigger:"blur" }, // 可输入逗号
        // 	{ validator: validateQuotePrice, trigger: 'blur' }
        // ],
      },
      typeOptions: [
        {
          // value: 'STRING',
          value: 98,
          label: '文本'
        },
        {
          // value: 'INTEGER',
          value: 96,
          label: '数字'
        },
        {
          // value: 'DATE',
          value: 99,
          label: '日期'
        },
        {
          // value: 'BOOLEAN',
          value: 95,
          label: '布尔值'
        }
      ],
      isWebViewOptions: [
        {
          value: 'FACTOR',
          label: '保理'
        },
        {
          value: 'BROKER',
          label: '券商'
        }
      ],
      ifTableHeaderProperties: false,
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
      tabData: [],
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
    Table
  },
  created() {
    // 首次用到该组件的时候执行这个。
    var assetType = this.$route.params.assetType;
    this.mainTable.tableHeader = commonSetData.tableHeader.setting;
    this.search();
    // this.getDictionary(assetType);
    // this.initExecute(assetType);
  },
  computed: {
    ...mapState(['ASSETSPARAMS', 'DICTIONARY']),
    height() {
      var height2 = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height2 - 300 + 'px';
    },
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
      console.log(vm.assetsUidList, '88888', vm.selectedAssetsList)
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

    handleEditChange(index) {
      // this.handleSetInputDisabled(index)
      if (!this.handleTableValidate()) {
        this.handleSetInputDisabled(index)
      }
    },
    handleTableValidate () {
        let n = 0
        console.log(this.ruleForm.tabData, '888888888888')
        this.ruleForm.tabData.map((v, index) => {
            if(!v.fieldEnName.length) {
              v['editChange'] = true
              n++
              return n;
            }
            if (!v.fieldCnName.length) {
                v['editChange'] = true
                n++
            } else {
                v['editChange'] = false
            }
        })
        if (n) {
            this.$message.error('请录入字段名称！')
            this.$nextTick(() => {
                let leng = this.ruleForm.tabData.length - 1
                $('#assetTable .el-table__body .el-table__row').eq(leng).find('.tableInnerInput .el-input__inner').eq(0).trigger('focus')
            })
        }
        console.log(n);
        return n
    },
    handleSetInputDisabled (index) {
      console.log(index, 'index', this.ruleForm.tabData)
        this.ruleForm.tabData.map(v => {
            v['editChange'] = false
        })
        // this.ruleForm.tabData[index]['editChange'] = !this.ruleForm.tabData[index]['editChange']
        this.ruleForm.tabData[index]['editChange'] = true;
        this.$nextTick(() => {
            // $('.el-table__body').find('.el-table__row').eq(index).find('.el-input .el-input__inner').eq(0).focus()
            $('#assetTable .el-table__body .el-table__row').eq(index).find('.el-input .el-input__inner').eq(0).focus()
        })
    },
    // 添加行
    handleDetailAdd() {
      let obj = {
        id: Math.ceil(Math.random(0, 1000) * 10000) + new Date().getTime(),
        fieldCnName: '',
        fieldType: 'STRING',
        ifSort: false,
        ifQuery: false,
        ifEdit: false,
        portalTypeVisible: ['FACTOR', 'BROKER'],
        // portals: ["FACTOR", "BROKER"],
        editChange: true
      }
        for(var key in this.mainTable.tableHeader){
          if(key === 'portalTypeVisible') {
            obj[key] = [];
          } else {
            obj[key] = '';
          }
        }
        // this.tabData.map(v=> {
        //   v['editChange'] = false;
        // })
        if (!this.handleTableValidate()) {
          this.ruleForm.tabData.push(obj);
        }
		},
    // 删除 行
		handleDeleteRow(index) {
			this.ruleForm.tabData.splice(index,1);
		},
    saveSubmit() {
      const vm = this;
      let flag = false;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          flag = true;
          console.log(flag, 'arr')
        } else {
          alert('必填项')

        }
      })
      console.log(flag, '44444')
      return flag;
    },
    handleGetColumns () {
        let arr = this.ruleForm.tabData
        arr.map((v, index) => {
            // v.orderNo = index + 1
            // v.value = ''
            delete v.editChange
            delete v.portals
            if (String(v.id).length >= 13) {
                delete v.id
            }
        })
        return arr
    },
    handleDetailBlur(event, row, key, index) {
      console.log('7777', event)
			// this.refEle = $(event.target);
			// this.handleValidate(event.target.value, this.refEle, index,true)
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
      let response = await this.$http.post(`${this.$apiUrl.assetGraphStart}/${this.assetType}/delete/${row.entityUuid}`, {})
        if(response.data.status === this.$appConst.status) {
          this.$message.success('删除成功！');
          this.reSearch(this.searchForm);
        }
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
        await vm.$http.get(`${this.$apiUrl.tableConfigName2}?typeName=${assetType}`)
        .then((res)=>{
          if(res.data.status == 200){
            // if(res.data.data.udf) {
            //   // datas = JSON.parse(res.data.data.udf);
            //   datas = res.data.data.udf;
            // } else {
            //   datas = [];
            // }
            console.log(res, 'res')
            datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
            console.log(res.data.data.udf, 'datas111111')
            // console.log(JSON.parse(datas), 'datas2222222')
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
          vm.mainTable.tableWidth[item['fieldEnName']] = item['fieldCnName'].length > 6 ? 230 : item['fieldCnName'].length * 30
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
      vm.search();
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
    // 判断是否有勾选框。发货的时候存在。
    selected() {
        return true;
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
    reSearch(searchForm) {
      this.page = 1;
      this.searchForm = searchForm;
      this.$refs.tableRef.resetCurrentPage();
      this.search(searchForm);
    }, 
    search() {
      var vm = this;
      const params = {
        tableEnName: this.$appConst.tableEnNameAsset,
        projectName: this.$appConst.setProjectName
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http.get(`${this.$apiUrl.tableAssetName}`, { params })
      // this.$http.get(`${this.$apiUrl.tablefile}`, { params })
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          let content = res.data.data;
          // content.forEach(item => {
          //   console.log('数据类型', typeof item.portalTypeVisible);
          //   item['portals'] = item.portalTypeVisible
          //   if(item.portalTypeVisible) {
          //     // var arr = JSON.parse(item.portalTypeVisible);
          //     // item['portals'] = arr;
          //   //   var arr = [];
          //   //   var arr2 = [];
          //   //   arr = item.portalTypeVisible.split(',')
          //   //   item['portals'] = ["FACTOR", "BROKER"];
          //   // } else {
          //   //   item['portals'] = [];
          //   }
          // })
          this.ruleForm.tabData = content;
          loading.close()
        }).catch(err => {
          loading.close()
          this.totalCount = 0;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
    // 搜索
    search2(searchForm) {
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
          this.ruleForm.tabData = content;
          vm.ifTableHeaderProperties = false;
          this.$refs.tableRef.doLayout();
          if(vm.assetType === '') {

          }
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
.detailEntry {
  overflow-y:scroll!important;
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
  .isWebViewBtn {
      /deep/ .el-checkbox-button {
          margin-right: 10px;
          // width: 44px;
          // height: 24px;
          line-height: 24px;
          text-align: center;
          background: transparent;
          border: 0;
          border-radius: 4px;
          color: #333;
          /deep/ .el-checkbox-button__inner {
              padding: 5px 8px;
              box-sizing: border-box;
              border-radius: 4px;
              border: 1px solid #DCDFE6;
          }
      }
      /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
          color: #E59D28;
          background-color: transparent;
          border-color: #E59D28;
          box-shadow: unset;
      }
      /deep/ .el-checkbox-button__inner:hover {
          color: #E59D28;
      }
  }
</style>
