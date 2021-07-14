<template>
    <el-dialog title="查看资产图" :close-on-click-modal="false"  :visible.sync="dialogVisible" :before-close="close" width="60%" custom-class="zhuisuDialog">
        <div style="position: relation;">
            <!-- <p>
                <span>{{handleSetShowType(originalAssetType)}}编号：</span>
                <span>{{originalData[0].entityNo}}</span>
            </p> -->
            <el-tabs v-model="activeName"
                class="m-t-50 m-b-102"
                @tab-click="handleClick"
                >
                    <el-tab-pane
                        v-for="(item, index) in headerTabs"
                        :key="index"
                        :label="item.label"
                        :name="item.name">
                      <Table
                            ref="tableRef"
                            :mainTable="mainTable"
                            :assetType="assetType"
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
            </el-tabs>
            <div class="smallBox" v-if="assetTypeUpList.length > 1">
                <p  v-for="(item, index) in assetTypeUpList"
                    :key="index"
                    @click="handleGoPrev(item.type)"
                    >{{handleSetShowType(item.type)}}
                </p>
            </div>
            <div class="smallBoxIconL" v-if="assetTypeUpList.length === 1">
                <i class="el-icon-arrow-left" @click="handleGoPrev(assetTypeUpList[0].type)"></i>
            </div>
             <div class="smallBox2" v-if="assetTypeDownList.length > 1">
                <p  v-for="(item, index) in assetTypeDownList"
                    :key="index"
                    @click="handleGoNext(item.type)"
                    >{{handleSetShowType(item.type)}}
                </p>
            </div>
            <div class="smallBoxIconR" v-if="assetTypeDownList.length === 1">
                <i class="el-icon-arrow-right" @click="handleGoNext(assetTypeDownList[0].type)"></i>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import{mapState,mapMutations} from 'vuex';
import Table from '@/components/Table.vue';

import {dataDetailForm} from './dataDetailForm.js';


export default {
    data(){
        return{
            activeName: 'one',
            headerTabs: [
                {name: 'one', label: '结算单'},
                // {name: 'two', label: '发票'}
            ],
            // 表格数据
            mainTable: {
              tableHeader: {},
              tableData: [],
              // tableWidth: {}
            },
            totalCount: 0, // 数据总数
            page: 1,
            pageSize: 10,
            dialogVisible:false,
            loading: false,
            sortTerms: {},
            queryTerms: {},
            assetType: '',
            assetTypeUpList: [],
            assetTypeDownList: [],
            upAssetType: '',
            currentPage: 1,
            entityUuid: '',
            arr:[],
            originalData: [],
            originalAssetType: '',
            assetTypeList: {}, // 字典取资产类型
            invoiceStatusList: {}, // 发票状态
            invoiceTypesList:{},//发票类型
            financeStatusList:{},//是否已融资
            invoiceCheckStatusList: {}, // 发票核验状态
        }
    },
    computed: {
        ...mapState(['DICTIONARY', 'ASSETSPARAMS']),
        dataDetailForm() {
            return dataDetailForm;
        }
    },
    components:{
        Table
    },
    mounted() {
       this.pageSizes = this.$appConst.pageSize;
    },
    methods:{
        ...mapMutations(['SET_DATALIST', 'SET_DICTIONARY']),
        height2() {
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            return height - 380;
        },
        downLoad() {
            window.location = ''
        },
        handleClick(tab, from) {
            var vm = this;
            vm.activeName = tab.name;
            vm.initExecute(vm.activeName);
            vm.headerTabs.forEach((val, index) => {
                if (val.name === vm.activeName) {
                    vm.mainTable.tableData = val.tableData;
                    vm.assetTypeUpList = val.assetTypeUpList;
                    vm.assetTypeDownList = val.assetTypeDownList;
                    vm.pageShow = true;
                    vm.totalCount = val.tableData.length;
                }
            })
        },
        crossLevelNode(assetType) {
            const vm = this;
            const params = {
                page: this.page - 1,
                size: this.pageSize,
                condition: {
                    assetType: assetType,
                    uuids: [vm.entityUuid]
                }
            };
            this.loading = true;
            // let response = await this.$http.post(`${this.$apiUrl.loadStreamAssets}${assetType}`,params);
            this.$http.post(`${this.$apiUrl.loadStreamAssets}${assetType}`,params)
                .then (async response => {
                    this.loading = false;
                    if (response.data.status !== 200) {
                        this.mainTable.tableData= [];
                        return;
                    };
                    if (response.data.status == 200) {
                        await this.prevOrDownIsShow(assetType);
                        if(!response.data.data) {
                            this.mainTable.tableData = [];
                            this.totalCount = 0;
                            this.pageShow = false;
                            this.loading = false;
                            this.assetTypeDownList = [];
                            vm.headerTabs.forEach((val, index) => {
                                if (val.name === assetType) {
                                    val.tableData = vm.mainTable.tableData;
                                    val.assetTypeDownList = [];
                                }
                            })
                            return;
                        }
                        this.mainTable.tableData = response.data.data.content;
                        vm.headerTabs.forEach((val, index) => {
                            if (val.name === assetType) {
                               val.tableData = vm.mainTable.tableData;
                               if(vm.mainTable.tableData.length === 0) {
                                   val.assetTypeDownList = [];
                               }
                            }
                        })
                        this.pageShow = true;
                        this.totalCount = response.data.data.totalElements;
                    }
                    
                }).catch(err => {
                    this.loading = false;
                    this.mainTable.tableData= [];
                    this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                });
        },
        async handleGoNext(assetType) {
            this.loading = true;
            this.assetType = assetType;
            this.getDictionary(assetType);
            this.initExecute(assetType);
            if (this.originalAssetType === assetType) { //判断如果是起始时tab,则不需发请求，直接赋值；
                this.activeName = assetType;
                this.fuzhiData(assetType)
                return;
            }
            var isPush = this.headerTabs.some( v=> { return v.name === assetType});
            var downList = JSON.parse(JSON.stringify(this.assetTypeDownList));
            var isSomeExit = false;
            var someType = '';
            if(downList.length>1 && downList) {
                isSomeExit = this.isTabsAndlistExit(downList).flag;
                someType = this.isTabsAndlistExit(downList).someType;
            }

            if(isSomeExit  && someType != assetType) {
                this.headerTabs.forEach((val, index) => {
                    if (val.name === someType) { //如果存在相同的就进行删除
                        this.headerTabs.splice(index, this.headerTabs.length-index)
                    }
                })
            }
            if (!isPush) {
                this.headerTabs.push({name: assetType, label: this.handleSetShowType(assetType), tableData: [], assetTypeUpList: [], assetTypeDownList: []});
            }
            if (this.headerTabs.length && this.headerTabs) {
                this.headerTabs.forEach(val => {
                    if(val.name === assetType) {
                        this.activeName = val.name;
                    }
                })
            }

            if(isPush) {
                this.fuzhiData(assetType)
            } else {
                this.crossLevelNode(assetType)
            }
        },
        async handleGoPrev(assetType) {
            this.loading = true;
            this.assetType = assetType;
            this.getDictionary(assetType);
            this.initExecute(assetType);
            if (this.originalAssetType === assetType) { //判断如果是起始时tab,则不需发请求，直接赋值；
                this.activeName = assetType;
                this.fuzhiData(assetType);
                return;
            }

            this.activeName = assetType;
            var isPush = this.headerTabs.some( v=> { return v.name === assetType});
            var upList = JSON.parse(JSON.stringify(this.assetTypeUpList));
            var isSomeExit = false;
            var someType = '';
            if(upList.length>1 && upList) {
                isSomeExit = this.isTabsAndlistExit(upList).flag;
                someType = this.isTabsAndlistExit(upList).someType;
            }

            if(isSomeExit && someType != assetType) {
                this.headerTabs.forEach((val, index) => {
                    if (val.name === someType) { //如果存在相同的就进行删除
                        this.headerTabs.splice(index, this.headerTabs.length-index)
                    }
                })
                this.headerTabs.push({name: assetType, label: this.handleSetShowType(assetType), tableData: [], assetTypeUpList: [], assetTypeDownList: []});
            }
            if (!isPush && !isSomeExit) {

                this.headerTabs.unshift({name: assetType, label: this.handleSetShowType(assetType), tableData: [], assetTypeUpList: [], assetTypeDownList: []});
            }
            if (this.headerTabs.length && this.headerTabs) {
                this.headerTabs.forEach(val => {
                    if(val.name === assetType) {
                        this.activeName = val.name;
                    }
                })
            }

            if (isPush) {
                this.fuzhiData(assetType);
            } else {
                this.crossLevelNode(assetType);
            }
        },
        fuzhiData(assetType) {
            const vm = this;
            vm.headerTabs.forEach((val, index) => {
                if (val.name === assetType) {
                    vm.mainTable.tableData = val.tableData;
                    vm.assetTypeUpList = val.assetTypeUpList;
                    vm.assetTypeDownList = val.assetTypeDownList;
                    vm.pageShow = true;
                    vm.totalCount = val.tableData.length;
                }
            })
            vm.loading = false;
        },
        // 分页
        handleCurrentChange(currentPage) {
            this.page = currentPage;
            this.crossLevelNode(this.assetType);
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.$refs.tableRef.resetCurrentPage();
            this.crossLevelNode(this.assetType);
        },
        close() {
            this.dialogVisible = false;
        },
        handleSetShowType (keyVal) {
            return this.$appConst.dataType[keyVal]
        },
        async init(row) {
            const vm = this;
            vm.dialogVisible = true;
            vm.headerTabs = [];
            vm.originalData = [row];
            vm.originalAssetType = row.assetType;
            vm.entityUuid = row.entityUuid;
            vm.currentGraphUuid = row.graphUuid;
            vm.assetType = row.assetType;
            vm.headerTabs.push({name: vm.assetType, label: vm.handleSetShowType(vm.assetType), tableData: vm.originalData, assetTypeUpList: [], assetTypeDownList: []});
            this.activeName = vm.assetType;
            vm.initExecute(vm.assetType);
            vm.mainTable.tableData = [row];
            vm.pageShow = true;
            vm.totalCount = 1;
            let response = await this.$http.get(`${vm.$apiUrl.getAssetGraphUuid}${row.graphUuid}/get`);
            vm.graphUuid = response.data.data.graphInfo.graphUuid;
            vm.prevOrDownIsShow(vm.assetType);
        },
        async prevOrDownIsShow(assetType) {
            var vm = this;
            this.assetTypeUpList = [];
            this.assetTypeDownList = [];
            let response2 = await this.$http.get(`${this.$apiUrl.getUpStreamAllAssetType}${this.graphUuid}/${assetType}`)
            if (response2.data.data.length>0) {
                this.upShow = true;
                var data2 = response2.data.data;
                data2.forEach(item2 => {
                    this.assetTypeUpList.push({type: item2})
                })
                this.upAssetType = response2.data.data[0];
            }else{
                this.upShow = false;
                this.upAssetType = "";
            }
            let response3 = await this.$http.get(`${this.$apiUrl.getDownStreamAllAssetType}${this.graphUuid}/${assetType}`)
            if (response3.data.data.length>0) {
                this.downShow = true;
                var data3 = response3.data.data;
                data3.forEach(item3 => {
                    this.assetTypeDownList.push({type: item3})
                })
                this.downAssetType = response3.data.data[0];
            }else{
                this.downShow = false;
                this.downAssetType = "";
            }
            vm.headerTabs.forEach((val, index) => {
                if (val.name === assetType) {
                    val.assetTypeUpList = vm.assetTypeUpList;
                    val.assetTypeDownList = vm.assetTypeDownList;
                }
            })
        },
        async initExecute(assetType) {
          const vm = this;
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
            // this.loading = true;
            // await vm.$http.get(`${this.$apiUrl.tableConfigName}?tableName=${assetType}`)
            await vm.$http.get(`${this.$apiUrl.tableConfigName2}?typeName=${assetType}`)
            .then((res)=>{
              if(res.data.status == this.$appConst.status){
                datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
                console.log(datas, 'datsa合同')
                // datas = res.data.data;
                vm.SET_DATALIST({value1:datas,value2:assetType});
              }
            //   this.loading = false;
            }).catch(err => {
            //   this.loading = false;
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
            // 表格中需要展示的字段
            if(item.listVisible){
              vm.mainTable.tableHeader[item['fieldEnName']] = item['fieldCnName'];
            }
          });
        },
        //判断标题headTabs与上一级或下一级assetTypeDownList是否存在一样的类型
        isTabsAndlistExit(upOrDownList) {
            var isSomeExist= {
                flag: false,
                someType: ''
            };
            for (var i = 0; i < this.headerTabs.length; i++) {
	            var obj = this.headerTabs[i];
                var num = obj.name;
	            for (var j = 0; j < upOrDownList.length; j++) {
	                var aj = upOrDownList[j];
                    var n = aj.type;
	                if (n === num) {
                       isSomeExist.flag = true;
                       isSomeExist.someType = n;
	                   break;
	                }
	            }
            }
            return isSomeExist;
        },
        // 字典取值
        getDictionary(assetType) {
            // 合同类型
            if (assetType === 'TRADECONTRACT') {
                this.contractType = {};
                this.buzType = {};
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
            }

            //  if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.invoiceStatus)) {
            //     this.invoiceStatusList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.invoiceStatus]);
            //   }else{
            //     this.getDictionaryApi(this.invoiceStatusList, this.$appConst.dictionaryType.invoiceStatus);
            //   }

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
    }
}
</script>
<style scoped lang="scss">
    .smallBox {
        background: #FFFFFF;
        width: 100px;
        position:absolute;
        bottom: 45%;
        left: -100px;
        border: 1px solid #ccc;
        
        p {
           height: 40px;
           line-height: 40px;
           text-align: center;
           width: 100%;
           border-bottom: 1px solid #ccc;
           cursor: pointer;
        }
    }
    
    .smallBox2 {
        background: #FFFFFF;
        width: 100px;
        position:absolute;
        bottom: 45%;
        right: -100px;
        border: 1px solid #ccc;
        
        p {
           height: 40px;
           line-height: 40px;
           text-align: center;
           width: 100%;
           border-bottom: 1px solid #ccc;
           cursor: pointer;
        }
    }
    
    .smallBoxIconR, .smallBoxIconL {
        width: 40px;
        position: absolute;
        bottom: 45%;
        z-index: 9999 !important;
        
        i {
           height: 40px;
           line-height: 40px;
           text-align: right;
           width: 100%;
           font-size: 70px;
           font-weight: 800;
           color: #ccc;
           cursor: pointer;
        }
        i:hover {
           color: #FF5701!important;
        }
    }
    .smallBoxIconR {
        right: 16px;
    }
    .smallBoxIconL {
        left: -11px;
    }
</style>