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
            oldActiveName: '',
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
            uids: [],
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
            if (vm.originalAssetType === vm.activeName) { //判断如果是起始时tab,则不需发请求，直接赋值；
                vm.prevOrDownIsShow(vm.activeName)
                vm.initExecute(vm.activeName);
                vm.uids = [vm.entityUuid];
                vm.mainTable.tableData = vm.originalData;
                vm.pageShow = true;
                vm.totalCount = 1;
            } else {
                var num = 0;
                var numOriginal = 0;
                var numOldActive = 0;
                vm.headerTabs.forEach((val, index) => {
                    if(val.name === vm.activeName) {
                       num = index;
                    }
                    if(val.name === vm.originalAssetType) {
                       numOriginal = index;
                    }
                    if(val.name === vm.oldActiveName) {
                       numOldActive = index;
                    }
                })

                // var jueduizhi = Math.abs(numOldActive - num);
                // console.log(Math.abs(numOldActive - num), '绝对值', numOldActive, num)
                // if(jueduizhi != 1) {
                //    vm.uids = vm.headerTabs[numOldActive].Uuids;
                //    vm.crossLevelNode(vm.activeName);
                // }
                if (vm.originalAssetType === 'TRADECONTRACT' || numOriginal < num) { //起始入口是合同时，必须从前往后查；或者 点击的tab 在最开始的asstType之后
                    vm.uids = vm.headerTabs[num-1].Uuids;
                    vm.getDictionary(vm.activeName);
                    vm.initExecute(vm.activeName);
                    vm.handleGoLast(vm.activeName);
                } else {
                    if (num < vm.headerTabs.length-1 && num >= 0) { // 点击非最后的tab时，用后面的tab uids,发请求up;
                        vm.uids = vm.headerTabs[num+1].Uuids;
                        vm.handleGoPrev(vm.activeName);
                    }

                    if(num === vm.headerTabs.length-1) { // 点击最后一个tab时，用前面tab uids, 发请求down；
                        vm.uids = vm.headerTabs[num-1].Uuids;
                        vm.getDictionary(vm.activeName);
                        vm.initExecute(vm.activeName);
                        vm.handleGoLast(vm.activeName);
                    }

                }

            }
            this.oldActiveName = JSON.parse(JSON.stringify(vm.activeName))
        },
        // 分页
        handleCurrentChange(currentPage) {
            this.page = currentPage;
            this.handleCreateRelationGetData(this.nowRelationRow);
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.page = 1;
            this.$refs.tableRef.resetCurrentPage();
            this.handleCreateRelationGetData(this.nowRelationRow);
        },
        async handleDetailInfo(row) {
            const vm = this;
            vm.dialogVisible = true;
            // vm.$refs.dialogCommonComponent.show();
            if (vm.assetType === 'TRADECONTRACT') {
                vm.$nextTick(() => {
                    vm.$refs.contractInfoDetailComponent.handleGetOrgInfo(row);
                });
            }else{
                var response = await vm.$http.get(`${vm.$apiUrl.queryAssetsById}${vm.assetType}/queryById/${row.entityUuid}`);
                if(response.data.status == vm.$appConst.status) {
                    vm.detailInfo = response.data.data.data;
                }
            }
        },
        close() {
            this.dialogVisible = false;
        },
        handleCurrentChange(page) {
            this.currentPage = page;
        },
        handleSizeChange(size) {
            this.pageSize = size;
        },
        handleSetShowType (keyVal) {
            return this.$appConst.dataType[keyVal]
        },
        async init(row) {
            const vm = this;
            vm.dialogVisible = true;
            vm.headerTabs = [];
            this.uids = [];
            console.log(row,'row');
            vm.originalData = [row];
            vm.originalAssetType = row.assetType;
            vm.entityUuid = row.entityUuid;
            vm.currentGraphUuid = row.graphUuid;
            vm.assetType = row.assetType;
            vm.headerTabs.push({name: vm.assetType, label: vm.handleSetShowType(vm.assetType), Uuids: [this.entityUuid]});
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
            console.log(this.headerTabs,this.assetTypeUpList, '上下级list', this.assetTypeDownList)
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
                // datas = res.data.data;
                datas = res.data.data.udf ? JSON.parse(res.data.data.udf) : [];
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
        async handleGoNext(assetType) {
            this.loading = true;
            this.assetType = assetType;
            this.getDictionary(assetType);
            this.initExecute(assetType);
            if (this.originalAssetType === assetType) { //判断如果是起始时tab,则不需发请求，直接赋值；
                this.activeName = assetType;
                this.prevOrDownIsShow(assetType)
                this.uids = [this.entityUuid];
                this.mainTable.tableData = this.originalData;
                this.pageShow = true;
                this.totalCount = 1;
                this.loading = false;
                return;
            }
            var num = null;
            var isExist = this.headerTabs.some( v=> { return v.name === assetType});
            if(isExist) {
                this.headerTabs.forEach( (val, index) => {
                    if (val.name === assetType) {
                        num = index;
                    }
                });
                if(num === this.headerTabs.length-1) { //最后一个tab时，用前一个查；
                    this.uids = this.headerTabs[num-1].Uuids;
                    this.handleGoLast(assetType);
                } else {
                    this.uids = this.headerTabs[num+1].Uuids;
                    this.handleGoPrev(assetType);
                }
                return;
            }

            var uidsParam = [];
            if (!this.uids.length) {
               uidsParam = [this.entityUuid];
            }
            
            var uidsParams = [];
            if (uidsParam && uidsParam.length) {
                uidsParams = uidsParam;
            } else {
                uidsParams = this.uids;
            }

            const params = {
                page: this.currentPage - 1,
                size: this.pageSize,
                assetType: assetType,
                entityUuids: uidsParams
            };

            this.uids = await this.getDownUids(assetType);
            var isPush = this.headerTabs.some( v=> { return v.name === assetType});
            var downList = JSON.parse(JSON.stringify(this.assetTypeDownList));
            var isSomeExit = false;
            var someType = '';
            if(downList.length>1 && downList) {
                isSomeExit = this.isTabsAndlistExit(downList).flag;
                someType = this.isTabsAndlistExit(downList).someType
            }
            if(isSomeExit) {
                this.headerTabs.forEach((val, index) => {
                    if (val.name === someType) { //如果存在相同的就进行删除
                        this.headerTabs.splice(index, this.headerTabs.length-index)
                    }
                })
            }

            if (!isPush) {
                if(!this.uids) { this.uids = [] }
                this.headerTabs.push({name: assetType, label: this.handleSetShowType(assetType), Uuids: this.uids});
            }

            if (this.headerTabs.length && this.headerTabs) {
                this.headerTabs.forEach(val => {
                    if(val.name === assetType) {
                        this.activeName = val.name;
                    }
                })
            }
            this.assetTypeDownList = [];
            this.oldActiveName = JSON.parse(JSON.stringify(this.activeName));

            let response = await this.$http.post(`${this.$apiUrl.loadDownStreamAssets}`,params);
            if (response.data.status == 200) {
                await this.prevOrDownIsShow(assetType);
                if(!response.data.data) {
                    this.mainTable.tableData = [];
                    this.totalCount = 0;
                    this.pageShow = false;
                    this.loading = false;
                    this.assetTypeDownList = [];
                    return;
                }
                this.mainTable.tableData = response.data.data.content;
                this.pageShow = true;
                this.totalCount = response.data.data.totalElements;
            }
            this.loading = false;
        },
        //判断标题headTabs与下一级assetTypeDownList是否存在一样的类型
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
                    console.log(num, 'num', n)
	                if (n === num) {
                       isSomeExist.flag = true;
                       isSomeExist.someType = n;
	                   break;
	                }
	            }
            }
            return isSomeExist;
        },
        async handleGoLast(assetType) {
            this.loading = true;
            var uidsParam = [];
            if (!this.uids.length) {
               uidsParam = [this.entityUuid];
            }
            var uidsParams = [];
            if (uidsParam && uidsParam.length) {
                uidsParams = uidsParam;
            } else {
                uidsParams = this.uids;
            }
            const params = {
                page: this.currentPage - 1,
                size: this.pageSize,
                assetType: assetType,
                entityUuids: uidsParams
            };

            this.uids = await this.getDownUids(assetType);
            this.assetTypeDownList = [];

            let response = await this.$http.post(`${this.$apiUrl.loadDownStreamAssets}`,params);
            if (response.data.status == 200) {
                await this.prevOrDownIsShow(assetType);
                if(!response.data.data) {
                    this.mainTable.tableData = [];
                    this.totalCount = 0;
                    this.pageShow = false;
                    this.loading = false;
                    this.assetTypeDownList = [];
                    return;
                }
                this.mainTable.tableData = response.data.data.content;
                this.pageShow = true;
                this.totalCount = response.data.data.totalElements;
            }
            this.loading = false;
        },
        async handleGoPrev(assetType) {
            this.loading = true;
            var vm = this;
            this.assetType = assetType;
            this.getDictionary(assetType);
            this.initExecute(assetType);
            if (this.originalAssetType === assetType) { //判断如果是起始时tab,则不需发请求，直接赋值；
                this.activeName = assetType;
                await this.prevOrDownIsShow(assetType)
                this.uids = [this.entityUuid];
                this.mainTable.tableData = this.originalData;
                this.pageShow = true;
                this.totalCount = 1;
                this.loading = false;
                return;
            }

            vm.activeName = assetType;
            var num = 0;
            var numOriginal = 0;
            vm.headerTabs.forEach((val, index) => {
                if(val.name === vm.activeName) {
                    num = index;
                }
                if(val.name === vm.originalAssetType) {
                    numOriginal = index;
                }
            })

            var upList = JSON.parse(JSON.stringify(this.assetTypeUpList));
            var isSomeExit = false;
            var someType = '';
            if(upList.length>1 && upList) {
                isSomeExit = this.isTabsAndlistExit(upList).flag;
                someType = this.isTabsAndlistExit(upList).someType;
            }
            if ((vm.originalAssetType === 'TRADECONTRACT' || numOriginal < num) && assetType !='TRADECONTRACT' && !isSomeExit) { //起始入口是合同时，必须从前往后查；
                vm.uids = vm.headerTabs[num-1].Uuids;
                vm.handleGoLast(vm.activeName);
                return;
            }

            var uidsParam = [];
            if (!this.uids.length) {
               uidsParam = [this.entityUuid];
            } else {
               uidsParam = this.uids;
            }

            const params = {
                page: this.currentPage - 1,
                size: this.pageSize,
                assetType: assetType,
                entityUuids: uidsParam
            };

            this.uids = await this.getUpUids(assetType);
            var isPush = this.headerTabs.some( v=> { return v.name === assetType});

            // var upList = JSON.parse(JSON.stringify(this.assetTypeUpList));
            // var isSomeExit = false;
            // var someType = '';
            // if(upList.length>1 && upList) {
            //     isSomeExit = this.isTabsAndlistExit(upList).flag;
            //     someType = this.isTabsAndlistExit(upList).someType;
            //     console.log(isSomeExit, '1isSomeExit', someType)
            // }

            console.log('2是否存在', isPush)
            if(isSomeExit) {
                this.headerTabs.forEach((val, index) => {
                    if (val.name === someType) { //如果存在相同的就进行删除')
                        this.headerTabs.splice(index, this.headerTabs.length-index)
                    }
                })
                this.headerTabs.push({name: assetType, label: this.handleSetShowType(assetType), Uuids: this.uids});
            }
            if (!isPush && !isSomeExit) {
                if(!this.uids) { this.uids = [] }
                this.headerTabs.unshift({name: assetType, label: this.handleSetShowType(assetType), Uuids: this.uids});
            }
            if (this.headerTabs.length && this.headerTabs) {
                this.headerTabs.forEach(val => {
                    if(val.name === assetType) {
                        this.activeName = val.name;
                    }
                })
            }

            let response = await this.$http.post(`${this.$apiUrl.loadUpStreamAssets}`,params);
            // let response = await this.$http.post(`${this.$apiUrl.queryDownNoRelatedAssets}node/${this.entityUuid}/true/queryUpNoRelatedAssets`,params);
            if (response.data.status == 200) {
                await this.prevOrDownIsShow(assetType);
                if(!response.data.data) {
                    this.mainTable.tableData = [];
                    this.totalCount = 0;
                    this.pageShow = false;
                    this.loading = false;
                    return;
                }
                this.pageShow = true;
                this.mainTable.tableData = response.data.data.content;
                this.totalCount = response.data.data.totalElements;
            }
            this.loading = false;
        },
        crossLevelNode(assetType) {
            const params = {
                page: this.currentPage - 1,
                size: this.pageSize,
                entityUuids: this.uids
            };
            this.loading = true;
            this.$http.post(`${this.$apiUrl.loadStreamAssets}${assetType}`,params)
                .then(res => {
                    this.loading = false;
                    console.log(res, 'res33')
                    if (res.data.status !== 200) return;
                    
                }).catch(err => {
                    this.loading = false;
                    this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
                });
        },
        // 得到下级节点所有资产的uids
        async getDownUids(assetType) {
            // this.activeName = assetType;
            var uidsParam = [];
            if(!this.uids.length) {
                uidsParam = [this.entityUuid];
            } else {
                uidsParam = this.uids;
            }
            const params = {
                page:this.currentPage - 1,
                size:this.pageSize,
                assetType: assetType,
                entityUuids: uidsParam
            };
            let response = await this.$http.post(`${this.$apiUrl.loadDownStreamEntityUuids}`,params);
            if (response.data.status == 200) {
                var uids = response.data.data;
                return uids
            }
        },
        // 得到上级节点所有资产的uids
        async getUpUids(assetType) {
            // this.activeName = assetType;
            var uidsParam = [];
            if(!this.uids.length) {
                uidsParam = [this.entityUuid];
            } else {
                uidsParam = this.uids;
            }
            const params = {
                page:this.currentPage - 1,
                size:this.pageSize,
                assetType: assetType,
                entityUuids: uidsParam
            };
            let response = await this.$http.post(`${this.$apiUrl.loadUpStreamEntityUuids}`,params);
            if (response.data.status == 200) {
                var uids = response.data.data;
                return response.data.data;
            }
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