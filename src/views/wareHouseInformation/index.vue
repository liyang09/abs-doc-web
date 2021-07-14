<template>
    <div id="target">
    <div class="portlet light bordered">
        <div class="portlet-title">
            <div class="caption">
                <i class="font-green el-icon-message"></i>
                <span  class="caption-subject font-green bold uppercase">企业信息
            <span class="step-title"></span></span>
            </div>
        </div>
        <div style="margin-bottom:5px; overflow:hidden;margin-left: 200px">
            <el-col :span="24" style="overflow:hidden; margin-bottom: 5px;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">企业角色</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.roleName}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden; margin-bottom: 5px;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">机构类型</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{$appConst.corpTypes[orgInfo.corpType]}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden; margin-bottom: 5px;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">营业执照注册号/统一社会信用代码:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.licenseId}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden; margin-bottom: 5px;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">机构信用证代码:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.creditCode}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden; margin-bottom: 5px;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">机构信用代码证有效期:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{$appConst.handleSetTime(orgInfo.creditPeriod)}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">开户许可证核准号:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.accountPermitsId}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">企业全称:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.orgFullName}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">企业住所:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.addr}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">{{orgInfo.orgCat=='法人企业'?'企业法人':'单位负责人'}}姓名:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.legalPerson}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">{{orgInfo.orgCat=='法人企业'?'企业法人':'单位负责人'}}证件类型:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{$appConst.legalPersIdTypes[orgInfo.legalPersIdType]}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">{{orgInfo.orgCat=='法人企业'?'企业法人':'单位负责人'}}证件号码:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.legalPersId}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">企业类型:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{$appConst.orgTypes[orgInfo.orgType]}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">企业固定电话:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.orgContact}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">手机号(业务通知):</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.smsPhone}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">成立日期:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{$appConst.handleSetTime(orgInfo.businessStart)}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">经营期限(截止日期):</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{$appConst.handleSetTime(orgInfo.businessEnd)}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">经营范围:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.businessScope}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; margin-bottom: 5px;">
                    <label class="col-md-4 info-label">注册资本(万元):</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.registeredCapital}}</span>
                </el-col>
            </el-col>
        </div>
    </div>
    <div class="portlet light bordered">
        <div class="portlet-title">
            <div class="caption">
                <i class="font-green el-icon-message"></i>
                <span  class="caption-subject font-green bold uppercase">邮寄信息
            <span class="step-title"></span></span>
            </div>
        </div>
        <div style="margin-bottom:5px; overflow:hidden;margin-left: 200px">
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">收件人姓名:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.mailingRealName}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">收件人电话:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.mailingPhone}}</span>
                </el-col>
            </el-col>
            <el-col :span="24" style="overflow:hidden;">
                <el-col :span="6" style="text-align:right; ">
                    <label class="col-md-4 info-label">收件地址:</label>
                </el-col>
                <el-col :span="10" class="info-content">
                    <span class="col-md-24 ng-binding">{{orgInfo.mailingAddress}}</span>
                </el-col>
            </el-col>
        </div>
    </div>
    <div class="button">
       <el-button type="primary" @click="Top()" class="primaryButton">回到顶部</el-button>
    </div>
    </div>
</template>
<script>
    import mixin from '@/assets/js/mixin.js'
    export default {
        mixins:[mixin],
        data() {
            return {
                listData: [],
                tableData:[],
                orgInfo: {},
                user:JSON.parse(sessionStorage.getItem("user")),
            };
        },
        methods: {
            Top:function () {
                target.scrollIntoView();
            },
            async init() {
                this.orgInfo = await this.getOrgInfo({orgId:this.user.orgId});
                this.orgInfo.roleName = this.$appConst.roleTypes[this.orgInfo.roles[0]];
                // 企业信息查询 以后要改成下面的这个接口
                // let url = `${this.$apiUrl.getOrgInfoByOrgId}${this.user.orgId}`
                // let response = await this.$http.get(url);
                // if(response.data.status === this.$appConst.status) {
                //     this.orgInfo = response.data.data;
                //     this.orgInfo.roleName = this.$appConst.roleTypes[this.orgInfo.roles[0]];
                // }
            },
        },
        mounted () {
            this.init();
        },
        beforeDestroy() {

        }
    }
</script>
<style scoped>
    .ng-binding{
        display: inline-block;
    }
    .info-label {
        padding-right: 10px;
        padding-left: 15px;
    }
    .info-content {
        display: inline-block;
        text-align: left;
        padding-left: 5px!important;
        margin-left: -5px!important;
        border-bottom: 1px dashed #d3d3d3;
    }
    .portlet-title {
        margin-left: 20px;
        border-bottom: 1px solid #eef1f5;
        margin-bottom: 10px;
        overflow:hidden;
    }
    .portlet-title > .caption {
        color: #666;
        padding: 10px 0;
        float: left;
        display: inline-block;
        font-size: 18px;
        line-height: 28px;
        padding: 10px 0;
        height:28px;
    }
    .portlet-title > .caption > i {
        color: #777;
        font-size: 15px;
        font-weight: 300;
        margin-top: 3px;
        float: left;
        display: inline-block;
        margin-right: 5px;
    }
    .font-green {
        color: #32c5d2 !important;
        line-height: 28px;
    }
    .portlet.light.bordered {
        font-size: 15px;
        color: #48576a;
        border: 1px solid #e7ecf1 !important;
        /* margin-top: 30px; */
    }
    .portlet.light {
        padding: 12px 20px 15px 20px;
        background-color: #fff;
    }
    .portlet {
        margin-top: 0px;
        margin-bottom: 25px;
        padding: 0px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
    .button {
        text-align: center;
    }
</style>

