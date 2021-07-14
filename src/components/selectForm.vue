<template>
<div>
    <el-form :inline="true" class="demo-form-inline searchIconp" size="medium">
            <el-form-item>
                <el-select v-model="queryTerm" placeholder="查询条件">
                    <el-option v-for="(val,key) in queryTerms" :key="key" :label="val" :value="key" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryTerm && queryTerm.indexOf('Date')!=-1 || queryTerm.indexOf('Time')!=-1">
                <el-date-picker
                    v-model="selectTerms[queryTerm]"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-else-if="queryTerm&&queryTerm.indexOf('amount')!=-1">
                <el-input type="number" v-model="selectTerms['minAmount']" placeholder="最低金额"  style="width:120px;"></el-input>
                <span style="margin-left:25px;margin-right:20px;"> —— </span>
                <el-input type="number"  v-model="selectTerms['maxAmount']" placeholder="最高金额"  style="width:120px;"></el-input>
            </el-form-item>
            <!-- 资产类型 -->
            <el-form-item v-else-if="queryTerm&&(queryTerm === 'type' || queryTerm==='fplx')">
                <el-select v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]"  clearable>
                    <el-option v-for="(val, key) in type" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <!-- 业务类型 -->
            <el-form-item v-else-if="queryTerm&&queryTerm === 'buzType'">
                <el-select v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]"  clearable>
                    <el-option v-for="(val, key) in buzType" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <!-- 发票类型 -->
            <el-form-item v-else-if="queryTerm&&queryTerm === 'invoiceType'">
                <el-select v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]"  clearable>
                    <el-option v-for="(val, key) in invoiceTypesList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <!-- 是否融资 -->
            <el-form-item v-else-if="queryTerm&&queryTerm === 'financed'">
                <el-select v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]"  clearable>
                    <el-option :key="true" label="已融资" :value="true"></el-option>
                    <el-option :key="false" label="未融资" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <!-- 发票状态 -->
            <el-form-item v-else-if="queryTerm&&queryTerm === 'invoiceStatus'">
                <el-select v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]"  clearable>
                    <el-option v-for="(val, key) in invoiceStatusList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <!-- 发票核验状态 -->
            <el-form-item v-else-if="queryTerm&&queryTerm === 'checkStatus'">
                <el-select v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]"  clearable>
                    <el-option v-for="(val, key) in invoiceCheckStatusList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else-if="queryTerm">
                <el-input v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]" clearable=""></el-input>
            </el-form-item>
            <!-- <el-form-item>
                <el-select ref="sortRef" :multiple-limit='multiplelimit' v-model="sortTerm" multiple placeholder="排序条件"  clearable  @change='selectSortValue' style="width:250px;">
                    <el-option v-show="showSortValue" v-for="(val, key) in sortTerms" :key="key" :label="val" :value="key"></el-option>
                    <el-option v-show="showSortKey" v-for="(val, key) in sort" :key="key" :label="val" :value="key" ></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item style="margin-right:0;">
                <el-button class="primaryButton" @click="query" >查询</el-button>
                <el-tag
                    v-for="(tag,index) in dynamicTags"
                    :key="index"
                    closable
                    type="warning"
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag.name}}
            </el-tag>
            </el-form-item>
        </el-form>
</div>
</template>

<script>
export default {
    props:['type', 'buzType', 'invoiceStatusList', 'invoiceCheckStatusList','invoiceTypesList'],
    data(){
        return{
            queryTerms: {},
            sortTerms: {},
            sort: {
                'DESC' : '降序',
                'ASC' : '升序'
            },
            multiplelimit: 2,
            queryTerm:"",
            showSortValue: true,
            showSortKey: false,
            sortTerm: '',
            sortParam: {
                sortDirection: '',
                sortField: ''
            },
            selectTerms:{
                timeInterval: {}
            },
            dynamicTags: [],
            newSelectTerms:{}
        }
    },
    watch:{
      'selectTerms.TradeContract_amount':{
        deep:true,
        handler:function(newV,oldV){
          return this.selectTerms.minAmount +　this.selectTerms.maxAmount;
        }
      }
    },
    methods:{
        reset() {
            this.queryTerm = '';
            this.dynamicTags = [];
            this.sortTerm = [];
            this.selectSortValue(this.sortTerm);
            for (var key in this.selectTerms) {
                if(key === 'timeInterval') {
                    this.selectTerms[key] = {};
                } else {
                    this.selectTerms[key] = '';
                }
            }
        },
        changeValue(queryData, sortData) {
            this.queryTerms = Object.assign({}, queryData);
            // 查询条件中不包括卖方企业id和买方企业id。
            if(this.queryTerms.hasOwnProperty('sellerId')){
                delete this.queryTerms['sellerId'];
            }
            if(this.queryTerms.hasOwnProperty('buyerId')){
                delete this.queryTerms['buyerId'];
            }
            if(this.queryTerms.hasOwnProperty('type')){
                delete this.queryTerms['type'];
            }
            this.sortTerms = Object.assign({}, sortData);
        },
        selectSortValue(val) {
            if (val.length === 0) {
                this.showSortValue = true;
                this.showSortKey = false;
                this.sortParam.sortDirection = '';
                this.sortParam.sortField = '';
            }
            if (val.length === 1) {
                if (this.sortTerms[val[0]]) {
                    this.showSortValue = false;
                    this.showSortKey = true;
                } else if(this.sort[val[0]]) {
                    this.showSortValue = true;
                    this.showSortKey = false;
                }
            }
            if (val.length === 2) {
                this.$refs.sortRef.blur();
            }
        },
        handleClose(tag) {
            var vm = this;
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            var type = tag.type;
            vm.newSelectTerms[type] = "";
            //如果参数值为空，则不传递。
            if(type=='TradeContract_amount'){
                vm.selectTerms.minAmount = '';
                vm.selectTerms.maxAmount = '';
                delete vm.newSelectTerms.minAmount;
                delete vm.newSelectTerms.maxAmount;
            }
            else if(type.indexOf('Date')!=-1 || type.indexOf('Time')!=-1){
                delete vm.newSelectTerms.timeInterval[type];
                delete vm.selectTerms[type];
                if (vm.newSelectTerms.timeInterval && Object.keys(vm.newSelectTerms.timeInterval).length == 0){
                    delete vm.newSelectTerms.timeInterval;
                }
            }else{
                vm.selectTerms[type] = "";
            }
            for(var param in vm.newSelectTerms){
                if(vm.newSelectTerms[param]==""){
                    delete vm.newSelectTerms[param];
                }
            }
            if(JSON.stringify(vm.newSelectTerms) === "{}"){
                vm.queryTerm = "";
            }
            vm.$emit("search",vm.newSelectTerms);
        },
        query(){
            var vm = this;
            if (vm.sortTerm.length === 1) {
                vm.$message.warning("请完善选择排序条件！");
                return;
            }
            if (vm.sortTerm.length === 2) {
                let sortKeyIndex = vm.sortTerm.indexOf('ASC') === -1 ? vm.sortTerm.indexOf('DESC') : vm.sortTerm.indexOf('ASC');
                let sortValueIndex = Math.abs(sortKeyIndex - 1);
                vm.sortParam.sortDirection = vm.sortTerm[sortKeyIndex];
                vm.sortParam.sortField = vm.sortTerm[sortValueIndex];
            }
            var selectTerms = Object.assign({},vm.selectTerms, vm.sortParam);
            vm.newSelectTerms = selectTerms;
            var label = vm.queryTerms[vm.queryTerm];
            vm.commonOperation(vm.dynamicTags,vm.queryTerm,label);
            //如果参数值为空，则不传递。
            for(var param in selectTerms){
                if(!selectTerms[param] && selectTerms[param]!==false){
                    delete selectTerms[param];
                }
                // 对日期的处理，因为他们是统一的接口
                if((param.indexOf('Date')!=-1 ||param.indexOf('Time')!=-1) &&　selectTerms[param]){
                    selectTerms.timeInterval = Object.assign({},selectTerms.timeInterval,{
                        [param]:{
                            startDate:selectTerms[param][0],
                            endDate : selectTerms[param][1]
                        }
                    })
                    delete selectTerms[param];
                }
            }
            if( Object.keys(selectTerms.timeInterval).length == 0 ){
                delete selectTerms.timeInterval;
            }
            if( Object.keys(selectTerms).length != 0 ){
                vm.$emit("search",selectTerms);
            }else {
                vm.$message.warning("查询内容不能为空！");
            }
        },
        getLabel(type){
            var vm = this;
            for(var i = 0;i<vm.status.length;i++){
                if(vm.status[i].value==type){
                    return vm.status[i].label;
                }
            }
        },
        commonOperation(arr,type,name){
            var vm = this;
            var label = "";
            label = vm.selectTerms[type];
            
            if(this.queryTerm === 'type' || this.queryTerm==='fplx'){
                label = vm.type[vm.selectTerms[vm.queryTerm]];
            }
            if(this.queryTerm === 'buzType'){
                label = vm.buzType[vm.selectTerms[vm.queryTerm]];
            }
            if(this.queryTerm === 'financed'){
                label = vm.selectTerms[vm.queryTerm] ? "已融资":"未融资"
            }
            if(this.queryTerm === 'invoiceStatus'){
                label = vm.invoiceStatusList[vm.selectTerms[vm.queryTerm]];
            }
            if(this.queryTerm === 'checkStatus'){
                label = vm.invoiceCheckStatusList[vm.selectTerms[vm.queryTerm]];
            }
            if(this.queryTerm === 'invoiceType'){
                label = vm.invoiceTypesList[vm.selectTerms[vm.queryTerm]];
            }

            if(!vm.selectTerms[type]){
                label = "";
            }
            if (type==='TradeContract_amount') {
                label = this.selectTerms.minAmount +　'-' + this.selectTerms.maxAmount;            
            }
            if(vm.judgeIsHave(arr,type)){
                arr.find(function(item){
                    if(item.type==type){
                        item.name = name+": "+label;
                    }
                })
            }else{
                if(label != "") {
                    vm.dynamicTags.push({name:name+': '+label,type:type});
                }
            }
        },
        judgeIsHave(arr,type){
            //判断一个数组的对象是否含有某个属性。
            if(arr.filter(item => item['type']===type).length !== 0){
                //存在该属性值为type的。
                return true;
            }else{
                //不存在该属性值为type的。
                return false;
            }
        },
    }
}
</script>

<style scoped>
.el-tag{
    margin-left:10px;
}
.el-form .el-form-item {
    margin-bottom: 15px;
}
</style>
