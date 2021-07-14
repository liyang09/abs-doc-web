<template>
    <el-tabs type="border-card" @tab-click="handleTabClick">
            <el-tab-pane label="企业授权" value="data">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <div class="baseInfo">
                    <el-col :span="4">&nbsp;</el-col>
                    <el-col class="orgInfo" :span="16" style="border: 1px solid #eef1f5; padding: 20px;margin-left:20%;">
                        <div>
                            <protle-title-component>
                                <span>授权企业信息</span>
                            </protle-title-component>
                        </div>
                        <div style="padding: 20px;">
                            <el-row
                                    v-for="item in enterprise"
                                    :key="item.key"
                                    class="enterpriseItem">
                                <el-form-item :label="item.item"  :prop="item.key">
                                <el-col :span="22">
                                    <div>
                                        <el-input
                                                :disabled="item.key !== 'orgFullName'"
                                                v-model.lazy="ruleForm[item.key]"
                                                class="elInput"
                                                :key="item.key"
                                                :placeholder="item.key === 'orgFullName'?'请输入企业全称，Enter查询':''"
                                                @keyup.enter.native="handleEnter($event)"
                                                ref= "orgFullName"
                                        >
                                        </el-input>
                                    </div>
                                </el-col>
                                </el-form-item>
                            </el-row>
                            
                            <el-row>
                                <el-form-item label="授权期限：" prop="authPeriodType">
                                <el-col :span="22">
                                    <el-select style="width: 100%" 
                                            v-model="ruleForm.authPeriodType" placeholder="请选择">
                                        <el-option
                                            v-for="item in dueTimeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                </el-form-item>
                            </el-row>
                            <el-form-item label="授权时间："  v-if="ruleForm.authPeriodType=='SHOT_TERM'" prop="dueDate">
                            <el-row style="margin-top: 10px;">
                                <!-- <el-col :span="5">授权时间：</el-col> -->
                                <el-col :span="22">
                                    <el-date-picker
                                      v-model="ruleForm.dueDate"
                                      type="daterange"
                                      value-format="yyyy-MM-dd"
                                      range-separator="至"
                                      start-placeholder="起始日期"
                                      end-placeholder="截止日期" clearable=""
                                      style="width: 100%">
                                    </el-date-picker>
                                </el-col>
                            </el-row>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col class="orgInfo" :span="24">&nbsp;</el-col>
                    <div style="clear:both;">

                    </div>
                </div>
                <el-col :span="24" class="btnCenter">
                    <el-button
                            :loading="authBtnLoading"
                            type="primary"
                            size="small"
                            class="primaryButton"
                            @click="handleAuthEnterprise">
                        授权
                    </el-button>
                </el-col>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="已授权企业" value="enterprise">
                <div class="authorization">
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
                        <el-table-column   
                                label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    class="collectBtn redBtn"
                                    size="medium"
                                    type="text"
                                    style="margin-left:0px; "
                                    @click="handleCancleAuth(scope.row)">
                                    取消授权
                                </el-button>
                            </template>
                        </el-table-column>
                    </Table>
                </div>
            </el-tab-pane>
        </el-tabs>
</template>

<script>
import protleTitleComponent from "@/components/protleTitleComponent";
import Table from '@/components/Table.vue';
import mixin from '@/assets/js/mixin.js';
export default {
    mixins: [mixin],
    data() {
        var validateOrgName = async(rule, value, callback) => {
            if (!value) {
                return callback(new Error('不能为空'));
            }
            if (value.length) {
                if (value == this.user.orgName) {
                    return callback(new Error('禁止授权给自己'));
                    this.ruleForm.orgId = "";
                    this.ruleForm.addr = "";
                    this.ruleForm.legalPerson = "";
                    this.ruleForm.creditCode = ""
                } else {
                    var result = await this.getOrgInfo({orgName:value});
                    if (Object.keys(result).length === 0) {
                        this.ruleForm.orgId = "";
                        this.ruleForm.addr = "";
                        this.ruleForm.legalPerson = "";
                        this.ruleForm.creditCode = ""
                        return callback(new Error('企业不存在，请重新输入！'));
                    }else{
                        this.ruleForm.orgId = result.orgId;
                        this.ruleForm.orgFullName = result.orgFullName;
                        this.ruleForm.addr = result.addr;
                        this.ruleForm.legalPerson = result.legalPerson;
                        this.ruleForm.creditCode = result.creditCode;
                        callback();
                    }
                }
            }
        };
        return{
            shortShow: false,
            ruleForm:{
                authPeriodType: '',
                dueDate: '',
                orgId:"",
                orgFullName: "",
                addr: "", 
                legalPerson: "", 
                creditCode: ""
            },
            dueTimeOptions: [
                { label: "临时授权", value: "SHOT_TERM" },
                { label: "永久授权", value: "PERMANENT" }
            ],
            authBtnLoading:false,
            // 表格数据
            mainTable: {
                tableHeader: {
                    fromOrgName: "所属企业",
                    toOrgName: "授权企业",
                    detailed_orgNameRoleType: "授权企业角色",
                    authDate:"授权期限",
                    createTime: "创建时间",
                },
                tableData: [],
                tableWidth: {
                }
            },
            totalCount: 0, // 数据总数
            page: 1,
            pageSize: 10,
            loading: false,
            enterprise: [
                {
                    item: "企业全称",
                    key: "orgFullName",
                    val: ""
                },
                {
                    item: "企业地址",
                    key: "addr",
                    val: ""
                },
                {
                    item: "单位负责人",
                    key: "legalPerson",
                    val: ""
                },
                {
                    item: "统一社会信用码",
                    key: "creditCode",
                    val: ""
                },
            ],
            rules:{
                authPeriodType: [
                    { required: true, message: '请选择授权期限', trigger: 'change' }
                ],
                orgFullName:[
                    { required: true, message: '企业名称不能为空', trigger: 'blur' },
                     { validator: validateOrgName, trigger: 'blur' }
                ],
                dueDate:[
                    { required: true, message: '授权时间不能为空', trigger: 'change' }
                ],
            },
            user: JSON.parse(sessionStorage.getItem('user')),
            otherEnterprise: {orgFullName: "", addr: "", legalPerson: "", creditCode: ""},
        }
    },
    components:{
        protleTitleComponent,
        Table
    },
    created(){
        // this.getAuthPeriodType();
    },
    methods: {
        height2() {
          var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          return height - 240;
        },
        reset() {
            this.$refs['ruleForm'].resetFields();
            this.shortShow = false;
        },
        // 获取授权期限枚举
        async getAuthPeriodType() {
            let url = `${this.$apiUrl.dictionary.allList}`;
            const vm = this;
            let response = {};
            response = await this.$http.get(url);
            if (response.data.status === this.$appConst.status) {
                let list = response.data.data;
                vm.dueTimeOptions = [];
                list.forEach(item => {
                    if(item.code === 'SC-AUTH-TYPE') {
                        vm.dueTimeOptions.push({ value: item.value, label: item.label })
                    }
                })
            }
        },
        handleCancleAuth(row) {
            const params = {
                toOrgIds: [row.toOrgId]
            };
            const vm = this;
            this.$confirm('确定取消授权?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                const url = `${this.$apiUrl.cancelAuth}`;
                vm.$http.post(url,params)
                    .then(res => {
                      vm.$message.success("企业取消授权成功！");
                      this.handleGetTabData();
                      this.loading = false;
                    }).catch(err => {
                    this.loading = false;
                    this.$message.warning(err.message || '服务器错误，请稍后再试!');
                });
            }).catch(() => {        
            });
        },
        handleTabClick (tab) {
            if (tab.label === "已授权企业") {
              this.handleGetTabData();
            }
        },
        handleGetTabData() {
            this.mainTable.tableData = [];
            const params = {
                page: this.page,
                pageSize: this.pageSize
            };
            this.loading = true;
            const url = `${this.$apiUrl.tradeAuthQuery}`;
            this.$http.get(url,{params})
                .then(res => {
                    if (res.data.status !== 200) return;
                    this.totalCount = res.data.data.totalElements;
                    this.mainTable.tableData = res.data.data.content;
                    this.mainTable.tableData.map(item => {
                        item.detailed_orgNameRoleType = this.$appConst.businessRoleTypes[item.authType];
                        if(item.authPeriodType == 'PERMANENT'){
                            item.authDate = "永久";
                        }
                        else{
                            item.authDate = item.effectiveDate +　'至' + item.expirationDate;
                        }
                    });
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    this.$message.warning(err.message || '服务器错误，请稍后再试!');
                });
        },
        handleEnter(event){
            this.$refs.ruleForm.validateField("orgFullName")
        },
        handleAuthEnterprise () {
            let orgName = this.ruleForm.orgFullName;
            let orgId = this.ruleForm.orgId;
            var vm = this;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let json = {};
                    if (vm.ruleForm.authPeriodType === 'SHOT_TERM') {
                        json = {
                            authPeriodType: this.ruleForm.authPeriodType,
                            effectiveDate: this.ruleForm.dueDate[0],
                            expirationDate: this.ruleForm.dueDate[1],
                            toOrgName: this.ruleForm.orgFullName
                        }
                    } else {
                        json = {
                            authPeriodType: this.ruleForm.authPeriodType,
                            toOrgName: this.ruleForm.orgFullName
                        }
                    }
                    this.handleSaveAuthorization(json);
                } else {
                    return false;
                }
            });
            
        },
        // 保存授权企业
        async handleSaveAuthorization (data) {
            let orgId = this.user.orgId;
            let url = `${this.$apiUrl.assetAuth}${this.ruleForm.orgId}`; // 4.0的新接口,以后用
            let response = {};
            let params = data;
            this.authBtnLoading = true;
            try{
                response = await this.$http.post(url, params);
                if (response.data.status === this.$appConst.status) {
                    this.$message.success("企业授权成功！");
                    this.authBtnLoading = false;
                    this.reset();
                } else {
                    this.$message.error("企业授权失败，请稍后重试！");
                    this.authBtnLoading = false;
                }
            }catch(error){
                this.$message.error("企业授权失败，请稍后重试！");
                this.authBtnLoading = false;
            }
        },
        // 分页
        handleCurrentChange(currentPage) {
            this.page = currentPage;
            this.handleGetTabData();
        },
        handleSizeChange(size){
            this.pageSize = size;
            this.page = 1;
            this.$refs.tableRef.resetCurrentPage();
            this.handleGetTabData();
        }
    }
}
</script>

<style scoped>
.el-form-item__label{
    width:150px;
    text-align:left !important;
}
</style>
