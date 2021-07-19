<template>
    <div>
        <div class="assetSetting">
            <el-tabs v-model="activeName" @tab-click="handleTabClick" class="tabInner">
                <!-- <el-tab-pane style="display:inline-block;width;50px;"></el-tab-pane> -->
                <el-tab-pane label="配置资产" name="first">
                    <asset-setting ref="setAsset"></asset-setting>
                </el-tab-pane>
                <el-tab-pane label="配置文档" name="second">
                    <doc-setting ref="docSetting" :type="type" v-if="showDoc"></doc-setting>
                </el-tab-pane>
                <el-tab-pane label="配置项目" name="third">
                    <doc-setting ref="docSettingProject" :type="type" v-if="!showDoc"></doc-setting>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="footer fixed" style="margin-top: 20px;"> 
            <el-button type="primary" class="primaryButton"  @click="saveSetting()">保存设置</el-button>
        </div>
    </div>
</template>
<style>
</style>
<script>
import assetSetting from './assetSetting.vue';
import DocSetting from './docSetting.vue';

export default {
    data(){
        return{
            showDoc: true,
            printBtn: false,
            dialogVisible:false,
            finConId:"",
            tradeContext:[],
            activeName: "first",
            name:"first",
            type: "assetSet"
        }
    },
    components:{
        assetSetting,
        DocSetting
    },
    mountd(){

    },
    methods:{
        handleTabClick(tab, event) {
            var name = tab.name;
            var vm = this;
            vm.name = name;
            if(name == 'first'){
                vm.type = "assetSet"
                vm.search();
            }else if(name == "second"){
                vm.showDoc = true;
                vm.type = 'docSetting'
                vm.$nextTick(() => {
                  vm.$refs.docSetting.init();
                })
            }else{
                vm.showDoc = false;
                vm.type = 'projectSetting'
                vm.$nextTick(() => {
                  vm.$refs.docSettingProject.init();
                })
            }
        },
        saveSetting(){
            // this.$router.push({path: '/readme2'})
            var tableParams = this.$refs.setAsset.handleGetColumns();
            console.log(tableParams, 'tableParams')
            if(this.type === 'assetSet') {
                var isPass = this.$refs.setAsset.saveSubmit();
                if(!isPass) {
                    this.$message.error('您有未填项或格式不正确！')
                    return; 
                }
                this.settingAsset(tableParams)
            } else {
                this.settingDoc(tableParams);
            }
        },
        settingAsset(tableParams) {
            const vm = this;
            let params = {
                attributeConfigVos: tableParams,
                tableConfigId: this.$appConst.tableConfigId
            }
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.post(`${this.$apiUrl.assetAdd}`, params).then(res => {
                if (res.data.status === 200) {
                    vm.$message.success("保存成功333！")
                    vm.search();
                }
                    loading.close();
                }).catch(err => {
                    loading.close();
                    vm.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                });
        },
        settingDoc(tableParams) {
            var vm = this;
            this.$nextTick(() => {
                if(vm.type === 'docSetting') {
                    console.log('2222')
                    vm.$refs.docSetting.handleSaveConfig(tableParams);
                } else {
                    console.log('333')
                    vm.$refs.docSettingProject.handleSaveConfig(tableParams);
                }
            })
        },
        search() {
            this.$refs.setAsset.search();
        }
    },
}
</script>
<style scoped lang="less">
        .assetSetting {
            width: 100%;
            height: 100%;
            background: #FFFFFF;
            // .el-tab-pane {
            //     height: calc(100vh - 130px - 90px);
            // }
            // /deep/ .el-tabs__nav-scroll {
            //     padding-left: 46px;
            // }
            // /deep/ .el-tabs__header {
            //     .el-tabs__item.is-active{
            //         font-size: 18px;
            //     }
            // }
        /deep/ .el-tabs__new-tab {
            display: none;
        }

        /deep/ .tabInner {
            .el-tabs__nav-scroll {
                padding-left: 46px;
            }

            .el-tabs__header {
                margin-bottom: 0;
                height: 66px;
                line-height: 66px;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                background-color: #fff;
                border-bottom: 0;
                .el-tabs__item.is-active {
                    border-color: #fff;
                }

                .el-tabs__active-bar {
                    background: transparent;
                }

                .el-tabs__item {
                    width: initial;
                    color: #606266;
                }

                .el-tabs__item.is-active {
                    font-size: 18px;
                }
                .el-tabs__item.is-top {
                    // font-size: 18px;
                }

                .el-tabs__nav-wrap::after {
                    height: 1px;
                    background: #EBEEF5;
                }

            }

            /deep/ .el-tabs__content {
                // height: calc(100vh - 130px - 140px);
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
                background: #fff;
                // box-shadow: 2px 3px 8px 0px rgba(0, 0, 0, 0.06);
            }

            .el-tab-pane {
                height: calc(100vh - 130px - 90px);
            }

            .docSettingTabPane {
                // height: calc(100vh - 86px - 86px - 44px);
                border: 1px solid #EBEEF5;
                border-top: 0;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
        }
    }
</style>
