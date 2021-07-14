<template>
    <div class="addFormClass">
        <br>
        <!-- 合同基本信息 -->
        <el-form :rules="rules" :model="form" ref="form" class="contractInfo" label-width="230px" style="float:left;">
            <div class="portlet-title">
                <div class="caption">
                    <i class="el-icon-edit"></i>
                    <span id="wizard-top" class="caption-subject font-purple bold uppercase">
                        合同基本信息
                        <span class="step-title"></span></span>
                </div>
            </div>
            <br>
            <div style="margin-left:13%;">
                <el-col :span="24" class="elCol" v-for="(value,key) in formItem" :key="key">
                    <el-col class="elLable" :span="4">
                        &nbsp;
                    </el-col>
                    <el-col :span="14">
                        <el-form-item :label="value+':'" :prop="key" v-if="key.indexOf('Date')!=-1">
                            <el-date-picker style="width:100%;" value-format="yyyy-MM-dd" class="elPiker expTime"
                                            v-model="form[key]" type="date"  :disabled="!editIsDisabled[key]"
                                            @change="handelValidEndDate"
                                        ></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="type" label="合同类型:" v-else-if="key==='type'">
                            <el-select class="elSelect" style="width:100%;" @change="handleContractType()"
                                    v-model="form.type" placeholder="请选择" clearable="" :disabled="!editIsDisabled[key]">
                                <el-option
                                    v-for="(item, key) in type"
                                    :key="key"
                                    :label="item"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="myRoles" label="我方角色:" v-else-if="key==='myRoles'">
                            <el-select class="elSelect" style="width:100%;" @change="handleContractType()"
                                    v-model="form.myRoles" placeholder="请选择" clearable="" :disabled="!editIsDisabled[key]">
                                <el-option
                                    v-for="item in rolesOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="业务类型:" prop="buzType" v-else-if="key==='buzType'">
                            <el-select class="elSelect" style="width:100%;" v-model="form.buzType" placeholder="请选择" clearable="" :disabled="!editIsDisabled[key]">
                                <el-option
                                    v-for="(item, key) in buzType"
                                    :key="key"
                                    :label="item"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="value+':'" :prop="key" v-else-if="key==='amount'" >
                            <el-input type="text" class="elInput" v-model="form[key]"  @blur="handleAmount($event)"  :disabled="!editIsDisabled[key]"></el-input>
                        </el-form-item>
                        <el-form-item :label="value+':'" :prop="key" v-else-if="key!='attachments' && key!='goods'">
                            <el-input type="text" class="elInput" v-model="form[key]"  :disabled="!editIsDisabled[key]"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            <div style="clear:both;"></div>
            </div>
        </el-form>
        <!-- 我方合同 -->
        <div class="contractInfo entryInfo" style="width: 48%; float:left;">
            <el-col :span="24" style="margin-bottom:15px;">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="el-icon-edit"></i>
                        <span id="wizard-top" class="caption-subject font-purple bold uppercase">
                        我方企业信息
                        <span class="step-title"></span></span>
                </div>
                </div>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    企业全名：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.orgFullName" disabled></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    企业住所：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.addr" disabled></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    单位负责人：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.legalPerson" disabled></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    统一社会信用码：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.creditCode" disabled></el-input>
                </el-col>
            </el-col>


            <div style="clear:both;"></div>
        </div>
        <!-- 对方信息 -->
        <div class="contractInfo entryInfo" style="width:48%; float:right;">
            <el-col :span="24" style="margin-bottom: 15px;">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="el-icon-edit"></i>
                        <span id="wizard-top" class="caption-subject font-purple bold uppercase">
                        对方企业信息
                        <span class="step-title"></span></span>
                    </div>
                </div>
            </el-col>
            <div>
                <el-col :span="24" class="elCol" v-if="!entryInfoEdit">
                    <el-col class="elLable" :span="7">
                        <i style="color:#ff4949">&nbsp;</i>
                        合同参与方：
                    </el-col>
                    <el-col :span="10" style="position:relative;">
                        <el-input
                            class="elInput otherInfo"
                            v-model="otherEnterpriseInfo.orgFullName"
                            prop="fullName"
                            @keyup.enter.native="handleOtherInfo()">
                        </el-input>
                    </el-col>
                </el-col>

                <el-col :span="24" class="elCol" v-if="entryInfoEdit">
                    <el-col class="elLable" :span="7">
                        <i style="color:#ff4949">*</i>
                        合同参与方：
                    </el-col>
                    <el-col :span="10" style="position:relative;">
                        <el-input
                            class="elInput otherInfo"
                            v-model="otherEnterpriseInfo.orgFullName"
                            prop="fullName"
                            placeholder="请输入企业全称，Enter查询"
                            @keyup.enter.native="handleOtherInfo()">
                        </el-input>
                    </el-col>
                </el-col>
            </div>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    企业住所：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="otherEnterpriseInfo.addr"
                              :disabled="sellInfo==false?true:false"></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    单位负责人：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="otherEnterpriseInfo.legalPerson"
                              :disabled="sellInfo==false?true:false"></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    统一社会信用码：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="otherEnterpriseInfo.creditCode"
                              :disabled="sellInfo==false?true:false"></el-input>
                </el-col>
            </el-col>

            <div style="clear:both;"></div>
        </div>
        <div style="clear:both;"></div>
        <div style="text-align:center;padding-bottom:20px;">
            <el-button plain size="small" @click="back()" style="height:40px;">返回</el-button>
            <el-button type="primary" size="small" @click="handleNext('form')" class="primaryButton" style="width:236px;height:40px;">下一步</el-button>
        </div>
    </div>
</template>
<script>
import mixin from '@/assets/js/mixin';
import commonSetData from '@/assets/js/commonSetData.js';
import Vue from 'vue';
    export default {
        mixins:[mixin],
        props:['formItem', 'type', 'buzType'],
        data () {
            return {
                editIsDisabled: {},
                submissionTime: "",
                serialList: [],
                // formItem:{},
                form: {
                    remarks: "", //备注
                    // contractOrgId: sessionStorage.getItem("orgId"),
                },
                rules: {
                    "type": [
                        {required: true, message: '请输入合同类型！', trigger: 'change'}
                    ],
                    "entityNo": [
                        {required: true, message: '请输入合同编号！', trigger: 'blur'}
                    ],
                    "buzType": [
                        {required: true, message: '请输入业务类型！', trigger: 'change'}
                    ],
                    "name": [
                        {required: true, message: '请输入合同名称！', trigger: 'blur'}
                    ],
                    "amount": [
                        {required: true, message: '请输入合同金额！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "dataEffectiveParticipant": [
                        {required: true, message: '请输入合同有效方！', trigger: 'change'}
                    ],
                    "signingDate": [
                        {required: true, message: '请输入合同签署时间！', trigger: 'blur'},
                    ],
                    "startDate": [
                        {required: true, message: '请输入合同约定生效时间！', trigger: 'blur'},
                    ],
                    "endDate": [
                        {required: true, message: '请输入合同约定到期时间！', trigger: 'blur'}
                    ],
                    "contractContent": [
                        {required: true, message: '请输入合同内容！', trigger: 'blur'}
                    ],
                    "fullName": [
                        {required: true, message: '请输入合同参与方！', trigger: 'blur'}
                    ],
                    "myRoles": [
                        {required: true, message: '请输入我方角色！', trigger: 'change'}
                    ]
                },
                myEnterpriseInfo: {
                    id: "",
                    addr: "",
                    orgId: "",
                    orgFullName: "",
                    legalPerson: "",
                    creditCode: "",
                },
                otherEnterpriseInfo: {
                    id: "",
                    orgId: "",
                    orgFullName: "",
                    addr: "",
                    legalPerson: "",
                    creditCode: ""
                },
                // options: [
                //     {
                //         value: 'SALE',
                //         label: '销售合同'
                //     },
                //     {
                //         value: 'PURCHASE',
                //         label: '采购合同'
                //     },
                //     {
                //         value: 'SALE_SINGLE_PARTY',
                //         label: '单方提交销售合同'
                //     }, {
                //         value: 'PURCHASE_SINGLE_PARTY',
                //         label: '单方提交采购合同'
                //     }
                // ],
                // businessType: [
                //     {
                //         value: 'FIRST_GOODS_AFTER_MONEY',
                //         label: '先货后款'
                //     },
                //     {
                //         value: 'FIRST_MONEY_AFTER_GOODS',
                //         label: '先款后货'
                //     },
                //     {
                //         value: 'FIRST_GOODS_AFTER_MONEY_PLEDGE_PURCHASE',
                //         label: '先货后款质押采购'
                //     }, {
                //         value: 'FIRST_MONEY_AFTER_GOODS_PLEDGE_PURCHASE',
                //         label: '先款后或质押销售'
                //     }
                // ],
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
                contractParticipant: [],
                sellInfo: false,
                entryInfoEdit: true,
                orgName: sessionStorage.getItem("orgName"),
                orgId: sessionStorage.getItem("orgId"),
                user: JSON.parse(sessionStorage.getItem('user')),
                flag:'add',//代表添加还是编辑
            }
        },
        computed: {

        },
        methods: {
            back() {
                this.$bus.$emit('back');
                this.entryInfoEdit = true;
            },
            reset() {
                this.$nextTick(()=>{
                    this.$refs.form.resetFields();
                });
                for(var key in this.otherEnterpriseInfo){
                    this.otherEnterpriseInfo[key] = "";
                }
            },
            change() {
                this.$forceUpdate();
            },
            async init(flag,row, editIsDisabled) {
                // props 传editIsDisabled 打印为空对象
                for(var key in this.formItem){
                    if(key!='attachments' && key!='goods'){
                        Vue.set(this.form,key,"");
                    }else{
                        Vue.set(this.form,key,"");
                    }
                }
                this.editIsDisabled = Object.assign({},editIsDisabled);
                this.flag = flag;
                await this.reset();
                if (flag == 'edit') {
                    this.form = row;
                    if(this.form.sellerId === this.user.orgId) {
                        this.form.myRoles = 'SELLER';
                    }
                    this.handleContractType();
                    this.otherEnterpriseInfo = await this.getOrgInfo({orgId:this.form.buyerId});
                }
                // 获取我方企业信息
                this.myEnterpriseInfo = await this.getOrgInfo({orgId:this.user.orgId});
            },
            // 合同类型变化时会关系到是否需要对方企业信息
            handleContractType () {
                let type = this.form.type;
                if (type === "SALE" || type === "SALE_SINGLE_PARTY") {
                    this.form.otherRole = "BUYER";
                    if (type === "SALE") {
                        this.sellInfo = false;
                        this.entryInfoEdit = true;
                    } else {
                        this.sellInfo = true;
                        this.entryInfoEdit = false;
                    }
                } else if (type === "PURCHASE" || type === "PURCHASE_SINGLE_PARTY") {
                    this.form.otherRole = "SELLER";
                    if (type === "PURCHASE_SINGLE_PARTY" || type === "PURCHASE_SINGLE_PARTY") {
                        this.sellInfo = true;
                        this.entryInfoEdit = false;
                    } else {
                        this.sellInfo = false;
                        this.entryInfoEdit = true;
                    }
                }
                this.handleEmptyOtherInfo()
            },
            // 清空对方企业信息
            handleEmptyOtherInfo () {
                Object.keys(this.otherEnterpriseInfo).forEach(key => {
                    this.otherEnterpriseInfo[key] = ""
                })
            },
            async handleOtherInfo () {
                let fullName = this.otherEnterpriseInfo.orgFullName;
                let myFullName = this.myEnterpriseInfo.orgFullName;
                if (fullName !== myFullName) {
                    this.otherEnterpriseInfo = await this.getOrgInfo({orgName:fullName});
                } else {
                    this.$message.error("与我方信息相同，请重新填写！");
                }
            },
            handelValidEndDate() {
                const vm = this;
                var flag = true;
                if(vm.form.signingDate && vm.form.startDate) {
                    var sign = Date.parse(vm.form.signingDate);
                    var start = Date.parse(vm.form.startDate);
                    if(start < sign) {
                        this.$message.error(`${vm.formItem.startDate}必须大于等于${vm.formItem.signingDate}！`);
                        flag = false;
                    }
                }
                if(vm.form.endDate && vm.form.startDate) {
                    var end = Date.parse(vm.form.endDate);
                    var start = Date.parse(vm.form.startDate);
                    if(end <= start) {
                        this.$message.error(`${vm.formItem.endDate}必须大于${vm.formItem.startDate}！`);
                        flag = false;
                    }
                }
                return flag
            },
            async handleNext () {
                // 保存买卖双方名称 id
                const vm= this;
                this.$refs.form.validate(async (valid) => {
                    if (!valid) {
                        this.$message.error("您有必填项未填或填写有误！")
                    }else{
                        if(!vm.handelValidEndDate()) return;
                        if(this.entryInfoEdit && !this.otherEnterpriseInfo.orgId){
                            this.$message.error('对方企业信息合同参与方不能为空');
                            return;
                        }
                        await this.handleSellBuyOrgName();
                        this.$emit("contractStep", this.form);
                    }
                })
            },
            handleSellBuyOrgName () {
                // 对方为卖方
                if (this.form.otherRole === "SELLER") {
                    this.form.buyerSignedTime = this.form.signingDate;
                } else {
                    this.form.sellerId = this.myEnterpriseInfo.orgId;
                }
                if (this.form.myRoles === "BUYER") {
                    this.form.buyer = this.myEnterpriseInfo.orgFullName;
                    this.form.buyerId = this.myEnterpriseInfo.orgId;
                    this.form.seller = this.otherEnterpriseInfo.orgFullName;
                    this.form.sellerId = this.otherEnterpriseInfo.orgId;
                } else {
                    this.form.buyer = this.otherEnterpriseInfo.orgFullName;
                    this.form.buyerId = this.otherEnterpriseInfo.orgId;
                    this.form.seller = this.myEnterpriseInfo.orgFullName;
                    this.form.sellerId = this.myEnterpriseInfo.orgId;
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
        //    this.formItem = commonSetData.addFormItem['TRADECONTRACT'];
        },
        destroy () {
           
        },
    }
</script>
<style scoped>
</style>
