<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px" size="mini" style="padding-right:20px;">
            <div v-for="(item,index) in form.tabData" :key="index"> 
                <el-form-item :label="value" v-for="(value,key) in formItem" :key="key">
                    <el-input v-model="item[key]"></el-input>
                </el-form-item>
                <div style="text-align:right;"><i class="el-icon-delete delete" @click="handleDelete(index)" v-show="form.tabData.length>1"></i></div>
                <div class="divider" v-show="index!=form.tabData.length-1"></div>
            </div>
            <div style="text-align:center;margin-bottom:20px;">
                <span class="redColor pointer" @click="handleDetailAdd()"><i class="el-icon-plus"></i>添加</span>
            </div>
            <el-form-item size="large" style="text-align:center;margin-left:0;" v-show="isShow">
                <el-button type="primary" @click="onSubmit" class="primaryButton" style="margin-left:-80px;">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped>
.divider{
    border:1px dashed #ccc;
    margin-bottom:10px;
}
.delete{
    cursor:pointer;
    font-size:18px;
    color:red;
    position:relative;
    top:-41px;
    right:-30px;
}
</style>
<script>
export default {
    data(){
        return{
            json:{},
            formItem:{
                itemName:"项目名称",
                referenceValue:"参考值",
                inspectionResult:"检查结果"
            },
            form:{
                tabData:[
                ]
            },
            isShow:true,
        }
    },
    mounted(){
        this.isShow = true;
    },
    methods:{
        onSubmit(){
            this.$bus.$emit('closeDialog');
            this.$emit('getData',this.form.tabData);
        },
        resetData(){
            this.form.tabData = [
                {
                    itemName:"",
                    referenceValue:"",
                    inspectionResult:""
                }
            ];
        },
        setData(tabData,ifEdit){
            if(tabData.length == 0){
                this.resetData();
            }else{
                this.form.tabData = tabData;
            }
            this.isShow = ifEdit;
        },
        handleDetailAdd(){
            this.form.tabData.push({
                itemName:"",
                referenceValue:"",
                inspectionResult:""
            });
        },
        handleDelete(index){
            this.form.tabData.splice(index,1);
        }
    }
}
</script>