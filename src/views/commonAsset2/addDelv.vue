<template>
    <div class="addFormClass">
        <br>
        <div class="tabsTitle" v-show="assetType=='TRADEINVOICE'">
            <span @click="currentTab='single'" :class="{active:currentTab=='single'}" v-show="isAdd">单条添加</span>
            <span @click="currentTab='batch'" :class="{active:currentTab=='batch'}" v-show="isAdd">批量添加</span>
        </div>
        <div v-show="currentTab=='single'">
            <!-- 合同基本信息 -->
            <el-form :rules="rules" :model="form" ref="form" class="contractInfo" label-width="160px" style="float:left;">
                <div>
                    <el-col :span="24" class="elCol" v-for="(value,key) in formItem" :key="key">
                        <el-col :span="20">
                            <el-form-item :label="value + ':'" :prop="key" v-if="key.indexOf('Date')!=-1 || key=='kprq' || dateList.includes(key)">
                                <el-date-picker style="width:100%;" value-format="yyyy-MM-dd" class="elPiker expTime"
                                                v-model="form[key]" type="date"  :disabled="!editIsDisabled[key]"
                                                @change="handelValidEndDate"
                                            ></el-date-picker>
                            </el-form-item>
                            <el-form-item prop="myRoles" label="我方角色 :" v-else-if="key==='myRoles'">
                                <el-select class="elSelect" style="width:100%;" @change="handleContractType()"
                                        v-model="form.myRoles" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <el-option
                                        v-for="item in rolesOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='amount'" >
                                <el-input type="text" class="elInput" v-model="form[key]"  @blur="handleAmount($event)"  :disabled="!editIsDisabled[key]"></el-input>
                            </el-form-item>
                            <el-form-item :label="value+ ':'" v-else-if="key=='goods' || key=='invoiceGoods'">
                                <!-- <el-tag v-show="(form[key].length>0)">已录</el-tag> -->
                                <el-tag v-show="tagShow">已录</el-tag>
                                <el-button type="warning" size="mini"  @click="handleDetailEntry(key)">
                                    详情
                                </el-button>
                            </el-form-item>
                            <!-- 检验项目 -->
                            <el-form-item :label="value+ ':'" v-else-if="key=='inspectionItem'">
                                <el-tag v-show="inspectionShow">已录</el-tag>
                                <el-button type="warning" size="mini"  @click="inspectionItemDetail(key)">
                                    详情
                                </el-button>
                            </el-form-item>
                            <!-- 资产类型 -->
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='type' || key==='fplx'" >
                                <el-select class="elSelect" style="width:100%;"
                                        v-model="form[key]" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <el-option
                                        v-for="(item, keyValue) in type"
                                        :key="keyValue"
                                        :label="item"
                                        :value="keyValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 发货类型 -->
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='deliveryType'" >
                                <el-select class="elSelect" style="width:100%;"
                                        v-model="form[key]" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <el-option
                                        v-for="(item, keyValue) in deliveryTypeList"
                                        :key="keyValue"
                                        :label="item"
                                        :value="keyValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 发票状态 -->
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='invoiceStatus'" >
                                <el-select class="elSelect" style="width:100%;"
                                        v-model="form[key]" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <el-option
                                        v-for="(item, keyValue) in invoiceStatusList"
                                        :key="keyValue"
                                        :label="item"
                                        :value="keyValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 是否已融资 -->
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='financed'|| booleanList.includes(key)" >
                                <el-select class="elSelect" style="width:100%;"
                                        v-model="form[key]" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <!-- <el-option
                                        v-for="(item, keyValue) in financeStatusList"
                                        :key="keyValue"
                                        :label="item"
                                        :value="keyValue">
                                    </el-option> -->
                                    <el-option :key="true" label="是" :value="true"></el-option>
                                    <el-option :key="false" label="否" :value="false"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 发票类型 -->
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='invoiceType'" >
                                <el-select class="elSelect" style="width:100%;"
                                        v-model="form[key]" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <el-option
                                        v-for="(item, keyValue) in invoiceTypesList"
                                        :key="keyValue"
                                        :label="item"
                                        :value="keyValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 发票核验状态 -->
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key==='checkStatus'" >
                                <el-select class="elSelect" style="width:100%;"
                                        v-model="form[key]" placeholder="请选择" :disabled="!editIsDisabled[key]">
                                    <el-option
                                        v-for="(item, keyValue) in invoiceCheckStatusList"
                                        :key="keyValue"
                                        :label="item"
                                        :value="keyValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="value+ ':'" :prop="key" v-else-if="key!='attachments'">
                                <el-input type="text" class="elInput" v-model="form[key]"  :disabled="!editIsDisabled[key]"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <div style="clear:both;"></div>
                </div>
            </el-form>
            <div style="clear:both;"></div>
            <!-- <div class="contractInfo attachment" style="padding-bottom:30px;" v-show="!directoriesList.length || !directoriesList">
                <uploadFileComponent ref="uploadFileComponent" title="添加附件" titleShow="false" :acceptNew="acceptNew" :limit="limit" :assetType="assetType"></uploadFileComponent>
            </div> -->
            <!-- 文件夹目录中 上传 -->
            <!-- <div v-if="directoriesList.length && directoriesList">
                <docLog ref="docLog" :assetType="assetType"></docLog>
            </div> -->

            <div style="text-align:center;padding-bottom:30px;">
                <!-- <el-button plain size="small" @click="back()">返回</el-button> -->
                <el-button type="primary" size="small" @click="handleNext('form')" :loading="sureLoading" class="primaryButton" style="width:300px;height:40px;">确定</el-button>
            </div>
        </div>

        <!-- <div v-show="currentTab=='batch' && isAdd">
            <div class="contractInfo attachment" style="padding-bottom:30px;">
                <uploadFileComponent ref="uploadFileComponent2" title="添加附件" titleShow="false" :acceptNew="acceptNew" :assetType="assetType"></uploadFileComponent>
            </div>
                <div style="text-align:center;padding-bottom:30px;">
                <el-button type="primary" size="small" @click="batchAddInvoice('form')" :loading="sureLoading" class="primaryButton" style="width:300px;height:40px;">确定</el-button>
            </div>
        </div> -->
        <!-- 查看合同详情 -->
        <dialogCommonComponent ref="dialogCommonComponent" title="明细录入" width="80%">
            <detailEntry ref="detailEntry" @getGoods="getGoods"></detailEntry>
        </dialogCommonComponent>
        <show-file-detail ref="showFileDetail"></show-file-detail>
        <!-- 项目录入 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="项目录入" width="500px">
            <inspectionDetail ref="inspectionDetail" @getData="getData"></inspectionDetail>
        </dialogCommonComponent>
    </div>
</template>
<script>
import mixin from '@/assets/js/mixin';
// import uploadFileComponent from '@/components/uploadFileComponent';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import detailEntry from '@/components/detailEntry2';
import showFileDetail from '@/components/showFileDetail.vue'
import inspectionDetail  from './inspectionDetail.vue';
import docLog from './docLog.vue';
import Vue from 'vue';
    export default {
        mixins:[mixin],
        props:['directoriesList', 'copyFormItem', 'isRoot', 'type', 'receiveTypeList', 'deliveryTypeList', 'invoiceStatusList', 'invoiceCheckStatusList','invoiceTypesList','financeStatusList'],
        data () {
            return {
                booleanList: [],
                dateList: [],
                integerList: [],
                inspectionShow:false,
                tagShow:false,
                goodsKey: '', // 记录明细录入的字段key值
                necessaryItem: {},//表单里必填项
                currentTab:'single',
                show:true,
                activeName:'first',
                sureLoading:false,
                submissionTime: "",
                serialList: [],
                // 为表单里面要展示的字段
                formItem:{},
                form: {
                    buyer:"",
                    seller:""
                },
                editIsDisabled:{},
                rules: {
                    // "entityNo": [
                    //     {required: true, message: '请输入单号！', trigger: 'blur'}
                    // ],
                    // "name": [
                    //     {required: true, message: '请输入名称！', trigger: 'blur'}
                    // ],
                    // "buyer": [
                    //     {required: true, message: '请输入买方名称！', trigger: 'blur'}
                    // ],
                    // "orderAddress": [
                    //     {required: true, message: '请输入地址！', trigger: 'blur'}
                    // ],
                    // "seller": [
                    //     {required: true, message: '请输入卖方名称！', trigger: 'blur'}
                    // ],
                    // "amount": [
                    //     {required: true, message: '请输入金额！', trigger: 'blur'},
                    //     {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    // ],
                    // "drDate": [
                    //     {required: true, message: '请输入日期！', trigger: 'blur'},
                    // ],
                    // "signingDate": [
                    //     {required: true, message: '请输入合同签署时间！', trigger: 'blur'},
                    // ],
                    // "startDate": [
                    //     {required: true, message: '请输入发起日期！', trigger: 'blur'},
                    // ],
                    // "endDate": [
                    //     {required: true, message: '请输入结束日期！', trigger: 'blur'}
                    // ],
                    // "inputDate": [
                    //     {required: true, message: '请输入结束日期！', trigger: 'blur'}
                    // ],
                    // "settleDate": [
                    //     {required: true, message: '请输入结算日期！', trigger: 'blur'},
                    // ],
                    // "myRoles": [
                    //     {required: true, message: '请输入我方角色！', trigger: 'change', type: "string"}
                    // ],
                    // "buyerTel": [
                    //     {required: true, message: '请输入买家电话！', trigger: 'blur'},
                    //     { pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确' }
                    // ],
                    // "sellerTel": [
                    //     {required: true, message: '请输入买家电话！', trigger: 'blur'},
                    //     { pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确' }
                    // ],
                    // "settlePrice": [
                    //     {required: true, message: '请输入结算单价！', trigger: 'blur'},
                    //     {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    // ],
                    // "totalAmount": [
                    //     {required: true, message: '请输入结算单总金额！', trigger: 'blur'},
                    //     {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    // ],
                    // "paidAmount": [
                    //     {required: true, message: '请输入结算单支付金额！', trigger: 'blur'},
                    //     {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    // ],
                    // "balanceAmount": [
                    //     {required: true, message: '请输入余额！', trigger: 'blur'},
                    //     {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    // ],
                    // "quantity":  [
                    //     { required: true, message: '请输入数量！', trigger: 'change', type: "string" },
                    //     { pattern: /^\d+$/, message: '数量只能为数字，请重新输入！' }
                    // ],
                },
                rolesOptions: [
                    {
                        value: 'BUYER',
                        label: '买方'
                    },
                    {
                        value: 'SELLER',
                        label: '卖方'
                    }
                ],
                orgName: sessionStorage.getItem("orgName"),
                orgId: sessionStorage.getItem("orgId"),
                user: JSON.parse(sessionStorage.getItem('user')),
                businessTypeVal:"",
                isAdd:true,
                assetType:"",
                origionForm:{},
            }
        },
        computed: {
            acceptNew(){
                if(this.assetType == 'TRADEINVOICE'){
                    return 'png,jpg';
                }
                else{
                    return 'PDF,pdf'
                }
            },
            limit(){
                if(this.assetType == 'TRADEINVOICE'){
                    return 1;
                }else{
                    return 100;
                }
            },
        },
        components: {
            docLog,
            showFileDetail,
            // uploadFileComponent,
            dialogCommonComponent,
            detailEntry,
            inspectionDetail
        },
        methods: {
            setDisabled(editIsDisabled){
                this.editIsDisabled = editIsDisabled;
            },
            init(assetType,businessTypeVal,isAdd,formItem,necessaryItem,booleanList, dateList, integerList) {
                var vm = this;
                console.log(booleanList, 'booleanList2222')
                vm.booleanList = booleanList ? booleanList : [];
                vm.dateList = dateList ? dateList : [];
                vm.integerList = integerList ? integerList : [];
                vm.tagShow = false;
                vm.inspectionShow = false;
                vm.isAdd = isAdd;
                vm.businessTypeVal = businessTypeVal;
                this.assetType = assetType;
                // 响应式
                for(var key in formItem){
                    if(key!='attachments' && key!='goods' && key!='inspectionItem'){
                        Vue.set(this.form,key,"");
                        this.form[key] = "";
                    }else{
                        Vue.set(this.form,key,[]);
                        this.form[key] = [];
                    }
                }
                this.formItem = formItem;
                this.necessaryItem = necessaryItem;
                this.$refs.form.resetFields();
                this.handleSetRules();
                // this.$refs.uploadFileComponent.init([], this.editIsDisabled.attachments);
                // this.$refs.uploadFileComponent2.resetFileList();
                // 使得明细中的数据初始化。
                vm.$bus.$emit('initForm');
                this.form.goods = [];
                this.form.inspectionItem = [];
                for(var key in this.form){
                    if(key!='attachments' && key!='goods' && key!='inspectionItem'){
                        this.form[key] = "";
                    }else{
                        this.form[key] = [];
                    }
                }
                // if(vm.directoriesList.length && vm.directoriesList) {
                //     vm.$refs.docLog.init(vm.directoriesList);
                //     vm.$refs.docLog.setIfEdit(true);
                // } else {
                //     vm.$refs.uploadFileComponent.init([], vm.editIsDisabled.attachments);
                // }
            },
            editInit(form) {
                this.isAdd = false;
                this.origionForm = form;
                this.form = Object.assign({},form);
                // this.$refs.uploadFileComponent.init(this.form.attachments||[], this.editIsDisabled.attachments);
                if(this.form.hasOwnProperty('totalAmount')){
                    this.form['totalAmount'] = String(this.form['totalAmount']);
                }
                for(var key in this.form){
                    if(typeof(this.form[key])=='number'){
                        this.form[key] = String(this.form[key]);
                    }
                }
                if(this.form.goods &&　this.form.goods.length>0){
                    this.tagShow = true;
                }else{
                    this.tagShow = false;
                }
                if(this.form.inspectionItem &&　this.form.inspectionItem.length>0){
                    this.inspectionShow = true;
                }else{
                    this.inspectionShow = false;
                }
                if(this.directoriesList.length && this.directoriesList) {
                    this.$refs.docLog.setIfEdit(this.editIsDisabled.attachments);
                }
            },
            getGoods(value,amount) {
                this.form[this.goodsKey] = value;
                if(value.length>0){
                    this.tagShow = true;
                    if(this.assetType == 'TRADESETTLEMENT'){
                        if(this.form.totalAmount == ""){
                            this.form.totalAmount = String(amount);
                        }else{
                            if(Number(this.form.totalAmount)!=amount){
                                this.$message.warning("货品明细金额和结算单金额不一致！");
                            }
                        }
                    }
                }else{
                    this.tagShow = false;
                }
            },
            getData(data){
                this.form['inspectionItem'] = data;
                if(data.length>0){
                    this.inspectionShow = true;
                }else{
                    this.inspectionShow = false;
                }
            },
            handleSetRules() {
                for(let i in this.necessaryItem) {
                    let arr = [];
                    let json = null
                    let patternJson = null
                    if(i === 'checkApplyNumber' || i === 'inspectionNumber' || i === 'reachNumber' || i === 'roughWeight' || i === 'tareWeight' || i === 'suttleWeight' || i === 'quantity') {
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'blur',
                            type: 'string' 
                        }
                        patternJson = {
                            pattern: /^\d+(\.\d{0,2})?$/, message: this.necessaryItem[i] + '只能为数字，最多保留两位小数，请重新输入！'
                        }
                    }else if(i === 'carPlateNumber' || i === 'carCode') {
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'blur',
                            type: 'string'
                        }
                        patternJson = {
                            pattern: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/g, message: '格式不正确，请重新输入！' 
                        }
                    }else if(i === 'mobile' || i === 'buyerTel' || i === 'sellerTel') {
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'blur',
                            type: 'string'
                        }
                        patternJson = {
                            pattern: /^1[3456789]\d{9}$/, message: '电话格式不正确！'
                        }
                    }else if(i === 'amount' || i === 'settlePrice' || i === 'totalAmount' || i === 'paidAmount' || i === 'balanceAmount') {
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'blur',
                            type: 'string'
                        }
                        patternJson = {
                            pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'
                        }
                    }else if(i === 'idCard') {
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'blur',
                            type: 'string'
                        }
                        patternJson = {
                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确！'
                        }
                    }else if(i === 'myRoles'||i==='financed'){
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'change'
                        }
                    } else {
                        json = {
                            required: true,
                            message: '请输入' + this.necessaryItem[i],
                            trigger: 'blur',
                            type: 'string'
                        }
                        // arr.push(json)
                    }
                    arr.push(json);
                    if(patternJson) {
                        arr.push(patternJson)
                    }
                    this.rules[i] = arr;
                }

            },
            // 明细录入弹出框
            handleDetailEntry(key) {
                this.$refs.dialogCommonComponent.show();
                var vm = this;
                if(!vm.isAdd){
                    vm.$nextTick(()=>{
                        vm.$refs.detailEntry.setGoods(vm.form.goods|| [],this.editIsDisabled['goods']);
                    });
                }
                this.goodsKey = key;
            },
            inspectionItemDetail(){
                var vm = this;
                this.$refs.dialogCommonComponent2.show();
                if(!vm.isAdd){
                    vm.$nextTick(()=>{
                        vm.$refs.inspectionDetail.setData(vm.form.inspectionItem|| [],this.editIsDisabled['inspectionItem']);
                    });
                }else{
                    vm.$nextTick(()=>{
                        vm.$refs.inspectionDetail.setData(vm.form.inspectionItem,true);
                    });
                }
            },
            change(e) {
                this.$forceUpdate();
            },
            back() {
                this.$bus.$emit('addClose');
                this.$refs.form.resetFields();
                for(var key in this.form){
                    if(key!='attachments' && key!='goods' && key!='inspectionItem'){
                        Vue.set(this.form,key,"");
                    }else{
                        Vue.set(this.form,key,[]);
                    }
                }
                // this.$refs.uploadFileComponent.resetFileList();
                // this.$refs.uploadFileComponent2.resetFileList();
            },
            // 我方角色变化时会关系到是否需要对方企业信息
            handleContractType () {
                // this.$forceUpdate();
                let type = this.form.myRoles;
                if (type === "SELLER") {
                    this.form.seller = this.user.orgName;
                    this.form.buyer = '';
                    this.form.buyerId = '';
                    this.form.sellerId = this.user.orgId;
                }else{
                    this.form.buyer = this.user.orgName;
                    this.form.seller = '';
                    this.form.sellerId = '';
                    this.form.buyerId = this.user.orgId;
                }
            },
            handelValidEndDate() {
                const vm = this;
                var flag = true;
                if(vm.form.endDate && vm.form.startDate) {
                    var end = Date.parse(vm.form.endDate);
                    var start = Date.parse(vm.form.startDate);
                    if(end < start) {
                        this.$message.error(`${vm.formItem.endDate}必须大于等于${vm.formItem.startDate}！`);
                        flag = false;
                    }
                }
                return flag
            },
            async handleNext () {
                const vm = this;
                this.$refs.form.validate(async (valid) => {
                    if (!valid) {
                        this.$message.error("您有必填项未填或填写有误！")
                    }else{
                        if(!vm.handelValidEndDate()) return;
                        if(vm.isAdd){
                            // if(vm.isRoot){
                            //     // 如果是根节点，则需要调用资产入图的接口。
                            //     var graphUuid = await this.createAssetGraph();
                            //     if(this.assetType == 'TRADEINVOICE'){
                            //         this.saveAssetInvoice(graphUuid);
                            //     }else{
                            //         this.save(graphUuid); 
                            //     }
                            //     return;
                            // }
                            // if(this.assetType == 'TRADEINVOICE'){
                            //     this.saveAssetInvoice();
                            //     return;
                            // }
                            var params = Object.assign({},vm.form);
                            // if(vm.directoriesList.length && vm.directoriesList) {
                            //    params.attachments = vm.$refs.docLog.getFile();
                            // } else {
                            //     params.attachments = vm.$refs.uploadFileComponent.getFile();
                            // }

                            params.assetType = this.assetType;
                            params.companyEntityUuid = this.businessTypeVal;
                            for(var key in params){
                                if(params[key] == '' && params[key] !== false){
                                    delete params[key];
                                }
                                if(vm.integerList.length && vm.integerList) {
                                    if(vm.integerList.includes(key)) {
                                       params[key] = Number(params[key])
                                    }
                                }
                            }
                            delete params['@class'];
                            delete params['_id'];
                            params.top = false;
                            console.log(params, 'params')
                            vm.sureLoading = true;
                            try{
                                var response = await vm.$http.post(`${vm.$apiUrl.saveAsset2}`,params);
                                if(response.data.status === vm.$appConst.status) {
                                    vm.$message.success('添加成功');
                                    vm.back();
                                    vm.$emit('search');
                                    vm.sureLoading = false;
                                }
                            }catch(err){
                                vm.sureLoading = false;
                                vm.$message.error(err.data.message);
                            }
                        }else{
                            this.updateAsset();
                        }
                    }
                })
            },
            // 批量添加发票
            async batchAddInvoice(){
                var vm = this;
                if(vm.isAdd){
                    if(vm.isRoot){
                        // 如果是根节点，则需要调用资产入图的接口。
                        var graphUuid = await this.createAssetGraph();
                        this.batchSaveAsset(graphUuid);
                        return;
                    }
                    this.batchSaveAsset();
                }else{
                    this.updateAsset();
                }
            },
            async batchSaveAsset(graphUuid){
                var vm = this;
                var url = '';
                if(graphUuid){
                    url = `${vm.$apiUrl.batchSaveAsset}${graphUuid}`
                }
                else{
                    url = `${vm.$apiUrl.batchSaveAsset}`
                }
                var params = {};
                // params.attachments = vm.$refs.uploadFileComponent2.getFile();
                if(params.attachments.length == 0){
                    this.$message.error('请先上传附件');
                    return;
                }
                params.assetType = this.assetType;
                params.top = true;
                vm.sureLoading = true;
                try{
                    var response = await vm.$http.post(`${url}`,params);
                    if(response.data.status === vm.$appConst.status) {
                        vm.$message.success('添加成功');
                        vm.back();
                        vm.$emit('search');
                        vm.sureLoading = false;
                    }
                }catch(err){
                    vm.$message.error(err.data.message);
                    vm.sureLoading = false;
                }
            },
             async updateAsset() {
                var vm = this;
                var params = Object.assign({},this.form);
                // if(this.editIsDisabled['attachments']){
                //     params.attachments = vm.$refs.uploadFileComponent.getFile();
                // }
                var entityUuid = this.form.entityUuid;
                var newParams = {};
                for(var key in params){
                    if(this.origionForm[key]!=params[key]){
                        newParams[key] = params[key];
                    }
                }
                for(var key in newParams){
                    if(newParams[key] === '' && newParams[key] !== false){
                         delete newParams[key];
                    }
                    if(key.indexOf('Date')!=-1 || key.indexOf('Time')!=-1){
                        newParams[key] = this.$appConst.handleSetTime(newParams[key]);
                    }
                    delete newParams['@class'];
                    delete newParams['_id'];
                }
                try{
                    var response = await this.$http.post(`${this.$apiUrl.assetStart}/${entityUuid}/${this.assetType}/updateAsset`,newParams);
                    if(response.data.status == this.$appConst.status){
                        vm.$message.success('修改成功');
                        vm.back();
                        vm.$emit('search');
                        vm.sureLoading = false;
                    }
                }catch(error){
                    vm.sureLoading = false;
                    vm.$message.error(error.data.message);
                }
            },
            // 如果是根节点，需要资产入图
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
            // 发票保存
            async saveAssetInvoice(graphUuid) {
                var vm = this;
                var params = Object.assign({},this.form);
                params.attachments = vm.$refs.uploadFileComponent.getFile();
                params.assetType = this.assetType;
                delete params.fieldAttribute;
                delete params['@class'];
                delete params['_id'];
                for(var key in params){
                    if(params[key] === '' &&  params[key] !==false){
                        delete params[key];
                    }
                }
                if(graphUuid){
                    params.graphUuid = graphUuid;
                    params.top = true;
                }else{
                    params.top = false;
                }
                try{
                    var response = await this.$http.post(`${this.$apiUrl.saveAssetInvoice}`,params)
                    if(response.data.status == this.$appConst.status){
                        vm.$message.success('添加成功');
                        vm.back();
                        vm.$emit('search');
                        vm.sureLoading = false;
                    }
                }catch(error){
                    vm.sureLoading = false;
                    vm.$message.error(error.data.message);
                }
            },
            async save(graphUuid) {
                var vm = this;
                var params = Object.assign({},this.form);
                // params.attachments = vm.$refs.uploadFileComponent.getFile();
                params.assetType = this.assetType;
                params.top = true;
                try{
                    var response = await this.$http.post(`${this.$apiUrl.queryAssetsById}graph/${graphUuid}/saveAsset`,params)
                    if(response.data.status == this.$appConst.status){
                        vm.$message.success('添加成功');
                        vm.back();
                        vm.$emit('search');
                        vm.sureLoading = false;
                    }
                }catch(error){
                    vm.sureLoading = false;
                    vm.$message.error(error.data.message);
                }
            },
            // 金额格式
            handleAmount (event) {
                let val = event.target.value;
                if (val) {
                    if (val.indexOf(".") === -1) {
                        val = val + ".00"
                    }
                    this.form.amount = this.$appConst.fmoney(val, 2)
                }
            },
        },
        mounted () {
          
        }
    }
</script>
<style scoped>
    .attachment .upload-demo{
        width:60%;
        margin:0 auto;
    }
    .tabsTitle{
        padding-left:30px;
        padding-bottom:20px;
    }
.tabsTitle span{
    margin-right:30px;
    cursor: pointer;
    padding-bottom:5px;
}
.tabsTitle span.active{
    border-bottom:3px solid red;
}
    .tree1 {
        width: 30%;
        height: 100px;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        float: left;
        /* overflow: auto; */
    }
    .treeItem1 {
        width: 100%;
        height: 25px;
        /* margin-right: 10px; */
        margin-top: 10px;
        margin-bottom: 5px;
        padding: 5px;
        line-height: 25px;
        cursor: pointer;
    }
    .treeItem1:hover {
        background: #caa14f!important;
        color: #fff!important;
    }
    .treeItem1:hover .textR {
          color:#fff!important;
    }
    .folderImg {
        width: 20px;
        height: 20px;
    }
    .fl {
        float: left;
    }
    .treeItem1Active {
      background: #caa14f !important;
      color: #fff !important;
    }
    .treeItem1Active .textR {
        color:#fff!important;
    }
</style>
