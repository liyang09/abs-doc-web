<template>
    <div>
        <breadcrumb :breadcrumbList="breadcrumbs"/>
        <!-- 表格 -->
        <div  v-show="firstShow">
        <el-button style="margin-bottom:20px;"
                type="primary"
                class="addButton"
                icon="el-icon-plus"
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
        <selectForm ref="selectForm" :type='contractType' :buzType='buzType' @search="reSearch" class="selectForm"></selectForm>
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :assetType="assetType"
              :selected="false"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true">
              <!-- 操作 -->
              <el-table-column 
                        label="操作" width="200"
                       
                        >
                  <template slot-scope="scope">
                    <el-button
                        icon="el-icon-view"
                        class="collectBtn redBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
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
                                style="margin-left:0px;display:block; "
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
                                style="margin-left:0px;display:block; "
                                v-if="scope.row.graphUuid&&scope.row.graphUuid!='00000000-0000-0000-0000-000000000000'"
                                @click="previewAssets(scope.row)"
                               >
                                查看资产图
                            </el-button>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
              </el-table-column>
        </Table>
        </div>
        <!-- 添加编辑合同 -->
        <div v-show="secondShow" style="background:white;">
            <contractInfoComponentNew :type='contractType' :buzType='buzType' ref="contractInfoComponentNew" @contractStep="contractStep" :formItem="formItem"></contractInfoComponentNew>
        </div>
        <!-- 附件 -->
        <div v-show="thirdShow" style="background:white;padding-bottom:30px;">
          <div v-if="!directoriesList.length || !directoriesList">
            <uploadFileComponent ref="uploadFileComponent" title="附件" :acceptNew="acceptNew"></uploadFileComponent>
          </div>
            <!-- 文件夹目录中 上传 -->
            <div v-if="directoriesList.length && directoriesList">
                <docLog ref="docLog" :assetType="assetType"></docLog>
            </div>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="prev()" style="height:40px;">上一步</el-button>
              <el-button type="primary" size="small" @click="sure" class="primaryButton" :loading="sureLoading" style="width:236px;height:40px;">确定</el-button>
            </div>  
        </div>
        <!-- 推送时展示结算单 -->
         <div v-show="settlementShow" style="background:white;">
            <settlement ref="settlement"></settlement>
        </div>
        <!-- 查看合同详情 -->
        <dialogCommonComponent ref="dialogCommonComponent" title="合同详情" width="80%">
            <contractInfoDetailComponent  ref="contractInfoDetailComponent" :showCancel="showCancel"></contractInfoDetailComponent>
        </dialogCommonComponent>
        <assetViewDialog ref="assetViewDialog"></assetViewDialog>
        <!-- 查看资产图 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="资产视图" width="90%">
            <assetView ref="assetView"></assetView>
        </dialogCommonComponent>
        <!-- 创建关联 -->
        <relation-dialog  ref="relationDialog" @openTabs="openTabs"></relation-dialog>
        <!-- 添加时选择业务模式 -->
        <selectBusinessType  ref="selectBusinessType" @selectBusinessTypeClose='selectBusinessTypeClose'></selectBusinessType>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import contractInfoDetailComponent from '@/components/contractInfoDetailComponent';
import contractInfoComponentNew from './contractInfoComponentNew';
import settlement from './settlement';
import assetView from '@/components/assetView';
import relationDialog from '../createOrCancelRelation/relationDialog.vue';
import uploadFileComponent from '@/components/uploadFileComponent';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';
import allList from '@/assets/js/test/allList.js';
import{mapState,mapMutations} from 'vuex';
import selectBusinessType from '@/components/selectBusinessType';
import docLog from '../commonAsset/docLog.vue';
import assetViewDialog from '@/components/assetViewDialog';
import axios from 'axios'

export default {
  name: '',
  data() {
    return {
      directoriesList: [],
      sureLoading:false,
      formItem:{},//添加表单字段
      editIsDisabled:{},//编辑时字段是否为可编辑的对象
      copyEditIsDisabled:{},//复制的编辑时字段是否为可编辑的对象
      dialogVisible:false,
      breadcrumbs: ['贸易管理', '合同管理'],
      contractType:{}, // 合同类型
      buzType: {}, // 业务类型
      queryTerms:{
        // "orgName":" 买方或卖方企业名称",
        // "entityNo":"合同编号",
        // "name":"合同名称",
        // "TradeContract_amount":"合同金额区间",
        // "TradeContract_signingDate":"合同签署时间区间"
      },
      sortTerms: {},
      platFormOptions:[],
      businessTypeVal:'',
      showCancel:true,
      firstShow:true,
      secondShow:false,
      settlementShow:false,
      // 表格数据
      mainTable: {
        tableHeader: {
          // name: "合同名称",
          // entityNo: "合同编号",
          // contractContent: "合同内容",
          // businessType: "业务类型",
          // cType: "合同类型",
          // buyer: "买方",
          // seller: "卖方",
          // contractMoney: "合同金额(元)",
          // signingDate: "合同签署时间",
          // startDate: "合同生效日期",
          // endDate: "合同到期日期"
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      form:{},
      thirdShow:false,
      user:JSON.parse(sessionStorage.getItem('user')),
      operation:'',//代表是添加还是编辑。
      newForm: {},
      searchForm:{},
      isRoot:true,//判断当前选择的业务模式对应的根节点是不是当前模块。
      assetType:"TRADECONTRACT",
      origionParams:{}
    };
  },
  components: {
    assetViewDialog,
    docLog,
    Table,
    dialogCommonComponent,
    contractInfoDetailComponent,
    contractInfoComponentNew,
    settlement,
    assetView,
    relationDialog,
    uploadFileComponent,
    selectForm,
    breadcrumb,
    selectBusinessType
  },
  created() {
    this.getDictionary();
    this.initExecute();
  },
  computed:{
    ...mapState(['ASSETSPARAMS', 'DICTIONARY']),
    acceptNew(){
        return 'PDF,pdf'
    },
  },
  async mounted() {
    var vm = this;
    this.$bus.$on('back',function() {
      vm.firstShow = true;
      vm.secondShow = false;
      vm.settlementShow = false;
    });
  },
  beforeDestroy() {
    this.$bus.$off('back');
  },
  methods: {
    ...mapMutations(['SET_DATALIST', 'SET_DICTIONARY']),
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
    async initExecute() {
      var vm = this;
      var datas = [];
      vm.loading = true;
      var assetType = this.assetType;
      vm.queryTerms = {};
      vm.sortTerms = {};
      vm.mainTable.tableHeader = {};
      vm.formItem = {};
      // 如果store中存储有该显示哪些字段，则从store中获取，否则重新发送请求获取。
      if(vm.ASSETSPARAMS[assetType]) {
        datas = vm.ASSETSPARAMS[assetType];
      }else{
        // 如果store中没有，则发送请求获取。
        // datas = allList[assetType];
        // vm.SET_DATALIST({value1:datas,value2:assetType})
        // 从接口获取列表展示字段
        // await vm.$http.get(`${this.$apiUrl.tableConfigName}?tableName=${assetType}`)
        await vm.$http.get(`${this.$apiUrl.tableConfigName2}?typeName=${assetType}`)
        .then((res)=>{
          if(res.data.status == this.$appConst.status){
            // datas = res.data.data;
            datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
            console.log(datas, '合同表头')
            vm.SET_DATALIST({value1:datas,value2:assetType});
          }
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
      }
      if(!datas  || datas.length === 0) {
        this.loading = false;
        return;
      }
      datas = datas.sort((a, b) => a.sortNo - b.sortNo);
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
        // 添加表单需要展示的字段
        if(item.detailsVisible){
          vm.formItem[item['fieldEnName']] = item['fieldCnName'];
        }
        // 先把字段是否是可编辑的放在一个对象中，因为添加和编辑时需要重新对这个对象拷贝处理。
        vm.copyEditIsDisabled[item['fieldEnName']] = item['ifEdit'];

        if(item.fieldEnName === "directories") {
          vm.directoriesList = item.defaultValue;
        }
      });
      this.$nextTick(() => {
        this.$refs.selectForm.changeValue(vm.queryTerms, vm.sortTerms);
      });
      vm.search();
    },
    // 字典取值
    getDictionary() {
      let assetType = this.assetType;
      this.contractType = {};
      this.buzType = {};
      // 合同类型
      if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.contractType)) {
        this.contractType = this.DICTIONARY[this.$appConst.dictionaryType.contractType];
      }else{
      this.$http.get(this.$apiUrl.dictionary.codeList + '?code=' + this.$appConst.dictionaryType.contractType)
        .then(res => {
          if (res.data.status !== 200) return;
          res.data.data.forEach(item=>{
            this.contractType[item.value] = item.label;
          })
          this.SET_DICTIONARY({value1:this.contractType,value2:this.$appConst.dictionaryType.contractType});
        }).catch(err => {
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
      }
      // 业务类型
      if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.buzType)) {
        this.buzType = this.DICTIONARY[this.$appConst.dictionaryType.buzType];
      }else{
      this.$http.get(this.$apiUrl.dictionary.codeList + '?code=' + this.$appConst.dictionaryType.buzType)
        .then(res => {
          if (res.data.status !== 200) return;
          res.data.data.forEach(item=>{
            this.buzType[item.value] = item.label;
          })
          this.SET_DICTIONARY({value1:this.buzType,value2:this.$appConst.dictionaryType.buzType});
        }).catch(err => {
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
      }
    },
    close() {
      this.$bus.$emit('closeDialog');
    },
    selectBusinessTypeClose(businessTypeVal) {
      this.businessTypeVal = businessTypeVal;
      this.firstShow = false;
      this.secondShow = true;
      this.judgeIsRoot();
      this.$refs.contractInfoComponentNew.init('add',{},this.editIsDisabled);
    },
    // 判断是不是根节点
    async judgeIsRoot() {
      var vm = this;
      var response = await vm.$http.post(`${this.$apiUrl.queryRootAssetTypeByGraphUuid}${this.businessTypeVal}`)
      if(response.data.status == this.$appConst.status){
        var assetType = response.data.data;
        if(assetType == this.assetType) {this.isRoot = true;}
        else{this.isRoot = false;}
      }
    },
    contractStep(form) {
      const vm = this;
      this.form = form;
      this.thirdShow = true;
      this.secondShow = false;
      if(vm.directoriesList && vm.directoriesList.length) {
        vm.$refs.docLog.init(vm.directoriesList);
        if(vm.operation != 'add'){
          vm.$refs.docLog.setAttachments(vm.newForm.attachments);
          vm.$refs.docLog.setIfEdit(vm.copyEditIsDisabled.attachments);
        }else{
          vm.$refs.docLog.setIfEdit(true);
        }
      }
    },
    prev() {
      this.thirdShow = false;
      this.secondShow = true;
    },
    async createAssetGraph() {
      var vm = this;
      var assetGraphName = this.form.entityNo + '-' + new Date().getTime();
      var params = {
        graphName:assetGraphName,
        patternGraphUuid:this.businessTypeVal,
        orgId:this.user.orgId
      };
      var response = await vm.$http.post(`${this.$apiUrl.createAssetGraph}`,params)
      if(response.data.status == this.$appConst.status){
        var graphUuid = response.data.data.graphUuid;
        return Promise.resolve(graphUuid);
      }
    },
    async save(graphUuid) {
      var vm = this;
      var params = Object.assign({},this.form);
      params.assetType = this.assetType;
      for(var key in params){
        if(params[key] == ''){
          delete params[key];
        }
      }
      if(!this.formItem.hasOwnProperty('otherRole')){
        delete params.otherRole;
      }
      params.top = true
      try{
        var response = await this.$http.post(`${this.$apiUrl.queryAssetsById}graph/${graphUuid}/saveAsset`,params)
        if(response.data.status == this.$appConst.status){
          vm.$message.success("添加成功");
          vm.firstShow = true;
          vm.secondShow = false;
          vm.thirdShow = false;
          vm.$refs.contractInfoComponentNew.reset();
          if(vm.directoriesList.length && vm.directoriesList){
            vm.$refs.docLog.resetFileList();
          }else{
            vm.$refs.uploadFileComponent.resetFileList();
          }
          vm.page = 1;
          vm.$refs.tableRef.resetCurrentPage();
          vm.search(this.searchForm);
          vm.sureLoading = false;
        }
      }catch(error){
        vm.sureLoading = false;
        vm.$message.warning(error.data.message);
      }
    },
    async updateAsset() {
      var vm = this;
      var entityUuid = this.origionParams.entityUuid;
      var params = Object.assign({},this.newForm);
      var newParams = {};
      delete params['@class'];
      delete this.origionParams['@class'];
      delete params['_id'];
      delete this.origionParams['_id'];
      for(var key in params){
          if(this.origionParams[key]!=params[key]){
              newParams[key] = params[key];
          }
      }
      for(var key in newParams){
          if(newParams[key] == ''){
                delete newParams[key];
          }
          if(key.indexOf('Date')!=-1 || key.indexOf('Time')!=-1){
              newParams[key] = this.$appConst.handleSetTime(newParams[key]);
          }
          delete newParams['@class'];
          delete newParams['_id'];
      }
      for(var key in newParams){
        if(!this.formItem.hasOwnProperty(key)){
          delete newParams[key];
        }
      }
      try{
        var response = await this.$http.post(`${this.$apiUrl.assetStart}/${entityUuid}/${this.assetType}/updateAsset`,newParams);
        if(response.data.status == this.$appConst.status){
          vm.firstShow = true;
          vm.secondShow = false;
          vm.thirdShow = false;
          vm.$refs.contractInfoComponentNew.reset();
          if(vm.directoriesList.length && vm.directoriesList){
            vm.$refs.docLog.resetFileList();
          }else{
            vm.$refs.uploadFileComponent.resetFileList();
          }
          vm.sureLoading = false;
          vm.search(this.searchForm);
        }
      }catch(error){
        vm.sureLoading = false;
        vm.$message.error(error.data.message);
      }
    },
    async sure() {
      var attachments = [];
      if (this.directoriesList.length && this.directoriesList) {
        attachments = this.$refs.docLog.getFile();
      } else {
        attachments = this.$refs.uploadFileComponent.getFile();
      }
      this.form.attachments = attachments;
      if(attachments.length==0){
        this.$message.error('请上传附件');
        return;
      }
      this.sureLoading = true;
      if(this.operation == 'add'){
        if(this.isRoot) {
          var graphUuid = await this.createAssetGraph();
          this.save(graphUuid); 
        }else{
          this.saveAsset2();
        }
      }else{
        // 编辑合同 不编辑附件时不传attachments
        if (this.editIsDisabled.hasOwnProperty('attachments') && this.editIsDisabled.attachments === false) {
          delete this.newForm.attachments
        } else {
          this.newForm.attachments = attachments;
        }
        this.updateAsset();
      }
    },
    // 如果不是根节点，则不需要入图。
    async saveAsset2(){
      const vm = this;
      var params = Object.assign({},vm.form);
      var assetType = this.assetType;
      var asset = this.$global.toLowerCase(assetType);
      params.assetType = assetType;
      if (params.hasOwnProperty('otherRole')) {
        delete params.otherRole
      }
      params.top = false
      var response = await vm.$http.post(`${vm.$apiUrl.saveAsset2}`,params);
      try{
        if(response.data.status === vm.$appConst.status) {
            vm.$message.success("添加成功");
            vm.firstShow = true;
            vm.secondShow = false;
            vm.thirdShow = false;
            vm.$refs.contractInfoComponentNew.reset();
            if(vm.directoriesList.length && vm.directoriesList){
              vm.$refs.docLog.resetFileList();
            }else{
              vm.$refs.uploadFileComponent.resetFileList();
            }
            vm.page = 1;
            vm.$refs.tableRef.resetCurrentPage();
            vm.sureLoading = false;
            vm.search(this.searchForm);
        }
      }catch(error){
        vm.sureLoading = false;
        vm.$message.warning(err.data.message);
      }
    },
    async getPlatFormOptions(){
      var vm = this;
      try{
        // 获取业务模式
        vm.platFormOptions = [];
        var response = await vm.$http.get(`${this.$apiUrl.getPatternGraphInfos}/${sessionStorage.getItem('orgId')}`);
        if(response.data.status == this.$appConst.status){
            response.data.data.forEach(item => {
              vm.platFormOptions.push({
                label:item.name,
                value:item.graphUuid
              });
            });
            // vm.businessTypeVal = vm.platFormOptions[0].value;
        }
      }catch(error){
        vm.$message.error(error.data.message);
      }
    },
    // 添加合同
    async handleAddAsset() {
      var vm = this;
      vm.operation = 'add';
      vm.$refs.selectBusinessType.show();
      vm.businessTypeVal = "";
      if(vm.directoriesList.length && vm.directoriesList) {
        vm.$refs.docLog.init(vm.directoriesList);
      } else {
        vm.$refs.uploadFileComponent.resetFileList();
      }
      var disabledArray = Object.assign({},vm.copyEditIsDisabled);
      for(var key in disabledArray){
        disabledArray[key] = true;
      }
      // 添加时字段都是可以编辑的。
      vm.editIsDisabled = disabledArray;
    },
    // 详情
    details(row) {
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.contractInfoDetailComponent.handleGetOrgInfo(row, this.formItem);
      }); 
    },
    // 编辑合同
    edit(row){
      this.firstShow = false;
      this.secondShow = true;
      this.operation = 'edit';
      this.origionParams = row;
      this.newForm = Object.assign({},row);
      // 编辑时就把对象设置为一开始获取的是否可以编辑的对象。
      this.editIsDisabled = this.copyEditIsDisabled;
      this.$refs.contractInfoComponentNew.init('edit',this.newForm, this.editIsDisabled);
      if(this.directoriesList.length && this.directoriesList){
        this.$refs.docLog.setAttachments(this.newForm.attachments||[]);
      }else{
         this.$refs.uploadFileComponent.init(this.newForm.attachments || [], this.editIsDisabled.attachments);
      }
    },
    // 推送
    handlePushClick(row) {
      this.firstShow = false;
      this.settlementShow = true;
      const url = `${this.$apiUrl.getAssetGraphUuid}${row.graphUuid}/getAnchor`;
      this.$http.post(url)
      .then(res=>{
        var assetType = res.data.data;
        this.$refs.settlement.init(row, assetType);
      });
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
    reSearch(searchForm) {
      this.page = 1;
      this.searchForm = searchForm;
      this.$refs.tableRef.resetCurrentPage();
      this.search(searchForm);
    }, 
    // 搜索
    search(searchForm) {
      this.mainTable.tableData = [];
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
