<template>
    <div>
        <!-- 企业信息 -->
        <el-dialog
            title="企业信息"
            custom-class="dialog-class"
            :visible.sync="orgDialogVisible"
            width="1000px"
            :before-close="orgDialogClose">
            <div class="org-info">
                <el-row>
                    <el-col :span="12">
                        <el-form :model="orgInfoData" label-width="150px">
                            <el-form-item label="企业名称">
                                <span>{{ orgInfoData.entname }}</span>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码">
                                <span>{{ orgInfoData.creditcode }}</span>
                            </el-form-item>
                            <el-form-item label="公司类型">
                                <span>{{ orgInfoData.enttype }}</span>
                            </el-form-item>
                            <el-form-item label="营业期限">
                                <span>{{ orgInfoData.esdate }} 至 {{ orgInfoData.opto }}</span>
                            </el-form-item>
                            <el-form-item label="注册地址">
                                <span>{{ orgInfoData.dom }}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12">
                        <el-form :model="orgInfoData" label-width="150px">
                            <el-form-item label="法人">
                                <span>{{ orgInfoData.frname }}</span>
                            </el-form-item>
                            <el-form-item label="经营状态">
                                <span>{{ orgInfoData.entstatus }}</span>
                            </el-form-item>
                            <el-form-item label="工商注册号">
                                <span>{{ orgInfoData.regno }}</span>
                            </el-form-item>
                            <el-form-item label="行业">
                                <span>{{ orgInfoData.industryphyname }}</span>
                            </el-form-item>
                            <el-form-item label="登记机关">
                                <span>{{ orgInfoData.regorg }}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form :model="orgInfoData" label-width="150px">
                        <el-form-item label="经营范围">
                            <span>{{ orgInfoData.zsopscope }}</span>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <br>
        </el-dialog>
    </div>
</template>
<script>
export default {
data () {
    return {
        orgDialogVisible: false,
        orgInfoData: {}
    }
},
methods: {
    show(orgInfo) {
        this.orgInfoData = orgInfo
        this.orgDialogVisible = true
    },
    orgDialogClose() {
        this.orgInfoData = {}
        this.orgDialogVisible = false
    }
    
}
}
</script>
<style lang="less" scoped>
.org-info{
    padding-right: 30px;
    /deep/.el-form-item{
        margin-bottom: 10px;
        .el-form-item__label{
            color: #888;
        }
        .el-form-item__content{
            color: #333;
        }
    }
}
</style>