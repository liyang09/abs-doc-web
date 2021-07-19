
<template>
    <div style='height: 100%;'>
        <treeComponent ref='treeComponent' :treeData='treeData' :type='type'></treeComponent>
    </div>
</template>

<script>
    import treeComponent from '@/components/tree/index.vue'
    import { mapGetters } from 'vuex'
    export default {
        props: {
            type: String,
            activeTab: String
        },
        name: 'docComponent',
        data () {
            return {
                fieldEnNameStart: '',
                treeData: [],
                defaultTreeData: []
            }
        },
        computed: {
            ...mapGetters([
                'configStatus'
            ])
        },
        methods: {
            init () {
                this.handleGetTreeData()
                // this.handleListen()
            },
            async handleGetTreeData () {
                let url = ''
                let params = {
                    tableEnName: this.$appConst.tableEnNameAsset,
                    projectName: this.$appConst.setProjectName
                }
                if (this.type === 'docSetting') {
                    // url = this.$apiUrl.assetUrl + '/config/asset-type/asset/dir'
                    url = this.$apiUrl.tablefile
                } else {
                    params.tableEnName = this.$appConst.tableEnNameCompany;
                    params.projectName = this.$appConst.setProjectName;
                    url = this.$apiUrl.tablefile;
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$http.get(url, { params }).then(res => {
                    if (res.data.status === 200) {
                        let arr = [];
                        let defaultValue = {};
                        if(res.data.data && res.data.data.length) {
                            defaultValue = res.data.data[0].defaultValue ? res.data.data[0].defaultValue : {};
                            arr = defaultValue.directories;
                            this.fieldEnNameStart = res.data.data[0].fieldEnName ? res.data.data[0].fieldEnName: '';
                        } else {
                            this.treeData = [];
                        }
                        this.handleSetTreeData(arr)
                        this.treeData = arr
                        console.log(this.treeData, 'this.treeData')
                        this.defaultTreeData = JSON.parse(JSON.stringify(arr))
                    }
                    loading.close();
                }).catch(err => {
                    loading.close();
                    this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                });
            },
            searchProject() {
              var vm = this;
              const params = {
                projectName: 'company'
              }
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

              this.$http.get(`${this.$apiUrl.tableAssetName}`, { params })
                .then(res => {
                  if (res.data.status !== 200) return;
                  this.totalCount = res.data.data.totalElements;
                  let content = res.data.data;

                  this.mainTable.tableData = content;
                  this.tabData = content;
                  loading.close()
                }).catch(err => {
                  loading.close()
                  this.totalCount = 0;
                  this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                });
            },
            handleSetTreeData (arr, subId, attrId) {
                var id = 0
                arr.map((v, n) => {
                    v.id = Math.ceil(Math.random(0, 10000) * 1000000)
                    v.status = ''
                    v.selected = false
                    v.opened = false
                    v.operShow = false
                    id += 3

                    if (v.subDirectories && v.subDirectories.length) {
                        this.handleSetTreeData(v.subDirectories, v.id)
                    }
                    if (v.attachments && v.attachments.length) {
                        let innerArr = v.attachments
                        this.handleSetTreeData(innerArr, v.id, 'attachments')
                    }
                })
            },
            handleListen () {
                // this.$bus.$on('handleSaveConfig', () => {
                //     if (this.type === this.activeTab) {
                //         let configType = this.type === 'docSetting' ? '文档' : '项目'
                //         let tit = '是否保存对' + configType + '配置的修改？'
                //         this.$global.confirmBox(tit, this.handleSaveConfig)
                //     }
                // })
            },
            handleSaveConfig (tableParams ) {
               if(!this.fieldEnNameStart) {
                    this.$message.warning('无初始名，请联系后端配置！')
                    return;
                }
                let arr = JSON.parse(JSON.stringify(tableParams));
                arr.forEach((item, index) => {
                    if(item.fieldEnName === this.fieldEnNameStart) {
                        let obj = {
                            directories: this.$refs.treeComponent.treeData
                        }
                        item.defaultValue = JSON.stringify(obj)
                    }
                })
                let params = {
                    attributeConfigVos: arr,
                    tableName: this.$appConst.setProjectName,
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
                        this.$message.success("保存成功！")
                    }
                        loading.close();
                    }).catch(err => {
                        loading.close();
                        this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                    });
            },
            handleGetModified () {
                let defaultTreeDataStr = JSON.stringify(this.defaultTreeData)
                let treeDataStr = JSON.stringify(this.treeData)
                treeDataStr = treeDataStr.replace(/"selected":true/g, '"selected":false')
                treeDataStr = treeDataStr.replace(/"opened":true/g, '"opened":false')
                treeDataStr = treeDataStr.replace(/"operShow":true/g, '"operShow":false')
                if (defaultTreeDataStr !== treeDataStr) {
                    this.handleModify()
                } else {
                    this.handleModify(false)
                }
            },
            // 有过修改
            handleModify (flag) {
                let configStatus = this.configStatus
                configStatus[this.type] = flag !== undefined ? flag : true
                this.$store.commit('SET_CONFIGSTATUS', configStatus)
            }
        },
        mounted () {
            // this.init()
        },
        components: {
            treeComponent
        }
    }
</script>
