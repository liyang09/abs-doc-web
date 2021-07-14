<template>
    <div>
        <div class="step">
            <el-col class="contractInfo" style="max-height: 500px; overflow-y: scroll;">
                    <protle-title-component class="protle">
                        <span>{{handleSetShowType(assetType)}}</span>
                        <span v-if="assetType === 'TRADESETTLEMENT'" style="float:right;color:#000;">结算单总金额:<span style="margin-left:10px;margin-right:6px;">{{responseSumTotalAmount}}</span>元</span>
                        <span v-if="assetType === 'TRADEPONDERATION'" style="float:right;color:#000;">总净重:<span style="margin-left:10px;margin-right:6px;">{{responseSumTotalAmount}}</span></span>
                    </protle-title-component>
                    <el-col
                            v-show="nowSelectVal.length>0"
                            class="formItem"
                            :span="24"
                            v-for="item in nowSelectVal"
                            :key="item.entityUuid">

                        <span
                                v-show="upShow"
                                class="prev"
                                @click="handleGoPrev(item,upAssetType,true)">
                            <img src="static/images/prev.png" alt="prev">
                        </span>

                        <el-col
                                class="dataDetailForm"
                                :span="8"
                                v-for="(val, key) in dataDetailForm[assetType]"
                                :key="key">                           
                              <el-col
                                      class="infoTextCenter"
                                      :span="10">
                                  &nbsp;{{val}}：
                              </el-col>
                              <el-col
                                      class="infoBorderBottom"
                                      :span="12">
                                  &nbsp;{{ handleReturnType(item[key], key) }}
                              </el-col>
                        </el-col>                       
                        <span class="info" @click="handleDetailInfo(item)" v-if="nowSelectVal.length>0">
                            <img src="static/images/info.png" alt="info">
                        </span>
                        <span
                                v-show="downShow"
                                class="next"
                                @click="handleGoNext(item,downAssetType,true)">
                            <img src="static/images/next.png" alt="next">
                        </span>
                    </el-col>

                    <el-col
                            v-show="nowSelectVal.length === 0"
                            :span="24"
                            class="el-table__empty-text"
                            style="text-align: center;">
                        暂无数据
                    </el-col>

                <div style="clear:both;"></div>
            </el-col>
            <div style="clear:both;"></div>
            <div  v-if="nowSelectVal.length>0" style="text-align:center;">
                <el-pagination
                    v-if="pageShow"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="pageSizes"
                    layout="total,sizes, prev, pager, next,jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <div style="text-align:center;margin-top:30px;">
                <el-button
                        size="small"
                        @click="close()">
                    取 消
                </el-button>
        </div>
        <!-- 查看合同详情 -->
        <!-- <dialogCommonComponent ref="dialogCommonComponent" title="明细信息" width="80%"> -->
        <el-dialog v-dialogDrag  title="明细信息" :close-on-click-modal="false" :append-to-body="true"
              :visible.sync="dialogVisible"
              :before-close="close2" width="80%">
            <contractInfoDetailComponent  v-if="assetType=== 'TRADECONTRACT'" ref="contractInfoDetailComponent" :showCancel="showCancel"></contractInfoDetailComponent>
            <div v-else class="baseInfo">
                <protle-title-component v-if="assetType !== 'TRADECONTRACT'">
                    <span class="el-dialog__title">{{handleSetShowType(assetType)}}详情</span>
                </protle-title-component>
                <div class="detailItem">
                    <el-col 
                            class="dataDetailForm"
                            :span="8"
                            v-for="(val, key) in dataDetailForm[assetType+'Detail']"
                            :key="key">
                        <el-col class="infoTextCenter" :span="10">{{val}}&nbsp;</el-col>
                        <el-col class="infoBorderBottom" :span="12">&nbsp;{{handleReturnType(detailInfo[key], key)}}</el-col>
                    </el-col>
                    <div style="clear:both;"></div>
                </div>
            </div>
            <div style="text-align:center;margin-top:30px;">
                <el-button size="small"  @click="close2()">
                    取 消
                </el-button>
            </div>
        </el-dialog>
        <!-- </dialogCommonComponent> -->
    </div>
</template>
<script>
import{mapState} from 'vuex';
import {dataDetailForm} from './dataDetailForm.js';
import protleTitleComponent from "@/components/protleTitleComponent";
// import dialogCommonComponent from '@/components/dialogCommonComponent';
import contractInfoDetailComponent from '@/components/contractInfoDetailComponent';

 export default {
     data(){
         return{
            showCancel:false,
            dialogVisible:false,
            assetType:'',
            nowSelectVal:[],
            graphUuid:'',
            upShow:false,
            downShow:false,
            upAssetType:'',
            downAssetType:'',
            currentGraphUuid:'',
            pageShow:false,
            pageSizes:[],
            currentPage: 1,
            pageSize:10,
            shouldSearch:'',
            item:{},
            totalCount:0,
            responseSumTotalAmount:0,
            detailInfo:{}
         }
     },
     computed: {
        ...mapState(['DICTIONARY']),
        dataDetailForm() {
            return dataDetailForm;
        }
     },
     components:{
        protleTitleComponent,
        // dialogCommonComponent,
        contractInfoDetailComponent,
     },
     mounted() {
         this.pageSizes = this.$appConst.pageSize;
     },
     methods:{
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
        close2() {
            this.dialogVisible = false;
        },
        close() {
            this.$bus.$emit('closeDialog');
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            if(this.shouldSearch === 'up'){
                this.handleGoPrev(this.item,this.assetType);
            }else{
                this.handleGoNext(this.item,this.assetType);
            }
        },
        handleSizeChange(size) {
            this.pageSize = size;
            if(this.shouldSearch === 'up'){
                this.handleGoPrev(this.item,this.assetType);
            }else{
                this.handleGoNext(this.item,this.assetType);
            }
        },
        handleSetShowType (keyVal) {
            return this.$appConst.dataType[keyVal]
        },
        async init(row) {
            const vm = this;
            this.nowSelectVal = [];
            console.log(row,'row');
            this.currentGraphUuid = row.graphUuid;
            this.assetType = row.assetType;
            this.nowSelectVal.push(row);
            this.pageShow = true;
            this.totalCount = 1;
            let response = await this.$http.get(`${this.$apiUrl.getAssetGraphUuid}${row.graphUuid}/get`);
            vm.graphUuid = response.data.data.graphInfo.graphUuid;
            vm.prevOrDownIsShow(this.assetType);
        },
        async prevOrDownIsShow(assetType) {
            let response2 = await this.$http.get(`${this.$apiUrl.getUpStreamAllAssetType}${this.graphUuid}/${assetType}`)
            if (response2.data.data.length>0) {
                this.upShow = true;
                this.upAssetType = response2.data.data[0];
            }else{
                this.upShow = false;
                this.upAssetType = "";
            }
            let response3 = await this.$http.get(`${this.$apiUrl.getDownStreamAllAssetType}${this.graphUuid}/${assetType}`)
            if (response3.data.data.length>0) {
                this.downShow = true;
                this.downAssetType = response3.data.data[0];
            }else{
                this.downShow = false;
                this.downAssetType = "";
            }
        },
        handleReturnType (val, key) {
            if (key === "amount"
            || key === "taxamount"
            || key === "goodsamount"
            || key === "sumamount") {
            return this.$appConst.fmoney(val, 2)
            }
            if (key === 'createTime' || (typeof key === 'string' && key.endsWith('Date'))) {
            return this.$appConst.handleSetTime(val)
            }
            if (key === 'buzType'){
                return this.DICTIONARY[this.$appConst.dictionaryType.buzType][val];
            }
            if (key === 'type') {
                return this.DICTIONARY[this.$appConst.dictionaryType.contractType][val];
            }
            return val;
        },
        async handleGoNext(item,assetType,flag) {
            if (flag){
                this.currentPage = 1;
            }
            this.item = item;
            const params = {
                page:this.currentPage - 1,
                size:this.pageSize,
                condition:{
                    entityType:assetType
                }
            };
             let response = await this.$http.post(`${this.$apiUrl.queryDownNoRelatedAssets}node/${item.entityUuid}/true/queryDownNoRelatedAssets`,params);
            // let response = await this.$http.post(`${this.$apiUrl.queryDownNoRelatedAssets}${this.currentGraphUuid}/node/${item.entityUuid}/queryDownNoRelatedAssets`,params);
            if (response.data.status == 200) {
                this.nowSelectVal = response.data.data.content;
                this.shouldSearch = "down";
                this.pageShow = true;
                this.totalCount = response.data.data.totalElements;
                if (flag){
                    this.assetType = this.downAssetType;
                    this.prevOrDownIsShow(this.downAssetType);
                }else{
                    this.prevOrDownIsShow(this.assetType);
                }
            }
        },
        async handleGoPrev(item,assetType,flag) {
            if (flag){
                this.currentPage = 1;
            }
            this.item = item;
            const params = {
                page:this.currentPage - 1,
                size:this.pageSize,
                condition:{
                    entityType:assetType
                }
            };
            let response = await this.$http.post(`${this.$apiUrl.queryDownNoRelatedAssets}node/${item.entityUuid}/true/queryUpNoRelatedAssets`,params);
            // let response = await this.$http.post(`${this.$apiUrl.queryDownNoRelatedAssets}${this.currentGraphUuid}/node/${item.entityUuid}/queryUpNoRelatedAssets`,params);
            if (response.data.status == 200) {
                this.nowSelectVal = response.data.data.content;
                this.shouldSearch = 'up';
                this.pageShow = true;
                this.totalCount = response.data.data.totalElements;
                if (flag){
                    this.assetType = this.upAssetType;
                    this.prevOrDownIsShow(this.upAssetType);
                }else{
                    this.prevOrDownIsShow(this.assetType);
                }
            }
        }
     }
 }
</script>
<style scoped>
.baseInfo {
    margin-top: 15px;
    padding: 20px;
    border: 1px solid #eef1f5;
}
.detailItem{
    background: #F5F5F5;
    padding: 10px 0;
    margin-bottom: 15px;
}
.formItem{
    position:relative;
    padding: 20px 40px 20px 0px;
}
.contractInfo {
    padding: 0 10px;
    border: 1px solid #e7ecf1;
    margin-bottom: 20px;
    box-sizing: border-box;
}
.protle .contractInfo{
    border:none;
    margin-bottom:20px;
}
.infoTextCenter {
    text-align: right;
}

.infoBorderBottom {
    border-bottom: 1px dashed #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height:20px;
    line-height:20px;
    margin-left:10px;
}

.info {
    position: absolute;
    right: 73px;
}

.info img {
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.next {
    position: absolute;
    right: 36px;
    cursor: pointer;
}

.prev {
    position: absolute;
    left: 45px;
    cursor: pointer;
}
.dataDetailForm {
        height: 25px;
        margin-bottom: 5px;
}

.detailTit {
    width: 100%;
    text-align: center;
    float: left;
    margin: 20px 0 30px 0;
}

/*.v-modal {
    z-index: 2000!important;
}*/
.baseInfo {
    margin-top: 15px;
    padding: 20px;
    border: 1px solid #eef1f5;
}

.detailItem {
    background: #F5F5F5;
    padding: 10px 0;
    margin-bottom: 15px;
}

.servTit {
    width: 117px;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>