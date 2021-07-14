<template>
    <div style="padding-left:16px;">
        <!-- <el-col :span="24" >
            <el-col  
                :span="6" 
                v-for="(item, index) in content" 
                :key="item.id" 
                style="padding: 10px; box-sizing: border-box;">
                <el-card shadow="always" >
                    <div style="display:flex;" >
                        <div style="width: 100px; text-align:center; line-height: 53px;">
                            <div 
                                :class="index%3===1?'counter-content-one':index%3===2?'counter-content-two':'counter-content-tree'" class="counter-content">
                                <i class="el-icon-s-grid" style="font-size:30px;color:#974621;"></i>
                            </div>
                        </div>
                        <div 
                            :class="{cursor:isCursor}"
                            style="flex: 1; position:relative;"
                            @click="handleClick(item.assetType)">
                            <p style="font-size:16px;font-weight:bold;">{{$appConst.dataType[item.assetType]}}：</p>
                            <div class="showData">
                                合计：{{item.totalNum}} 条
                            </div>
                            <div class="showData">
                                合计：{{item.totalAmount | MoneyFormat}} 元
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-col> -->
        <div class="box">
          <div :class="item.index+'box'"  v-for="(item,index) in content" :key="index" >
              <span class="first">
                <img :src="`static/images/${item.index}.png`" alt="">
              </span>
              <span class="data">{{$appConst.dataType[item.assetType]}} <label>{{item.totalNum}} 条</label></span>
              <span :class="'fixedSpan'+item.index" class="fixedSpan"><img :src="`static/images/${item.index}SHAP.png`"></span>
              <p class="moneySize">{{item.totalAmount | MoneyFormat}}元</p>
              <p class="allSize">合计</p>
          </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['content','isCursor'],
        data() {
            return {}
        },
        watch: {
            content:{
              handler(newValue,oldValue){
                var assetTypes = ['TRADECONTRACT','TRADEDLVRGOODS','TRADEORDER','TRADERECVGGOODS','TRADESETTLEMENT'];
                var vm = this;
                this.content.forEach(item=>{
                  var index = Math.floor(Math.random()*assetTypes.length);
                  item.index = assetTypes[index];
                });
              },
              deep:true //深度监听
            }
        },
        methods: {
            handleClick(type) {
            if(!this.isShow)return;
                let assetType = type.replace("TRADE", "").toLowerCase()
                let router = "/search" + assetType.substring(0, 1).toUpperCase() + assetType.substring(1)
                this.$router.push(router)
            }
        },
        mounted(){

        },
    }
</script>
<style scoped>
  .fixedSpan{
    position: absolute;
  }
  .TRADECONTRACTbox{
    border-top:2px solid #00C7A9;
  }
  .TRADEORDERbox{
    border-top:2px solid #F2A454;
  }
  .fixedSpanTRADECONTRACT{
    right:0;
    top:0;
  }
  .fixedSpanTRADEORDER{
    bottom:-6px;
    left:20%;
  }
  .fixedSpanTRADESETTLEMENT{
    right:0;
    top:0;
  }
  .fixedSpanTRADEDLVRGOODS{
    left:0;
    bottom:-6px;
  }
  .fixedSpanTRADERECVGGOODS{
    right:0;
    top:0;
  }
  .TRADESETTLEMENTbox{
    border-top:2px solid #F7676B;
  }
  .TRADEDLVRGOODSbox{
    border-top:2px solid #63A9EC;
  }
  .TRADERECVGGOODSbox{
    border-top:2px solid#9969F7;
  }
  .box >div{
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
    position: relative;
    padding-top:16px;
  }
  .first{
    margin-left:10px;
  }
  .data{
    position: absolute;;
    left:60px;
    top:30px;
  }
  .data label{
    margin-left:6px;
  }
  .moneySize{
    font-size:24px;
    font-weight: bold;
    margin:0 auto;
    text-align:center;
    padding-top:20px;
  }
  .allSize{
    text-align:center;
    margin-top:20px;
    padding-bottom:30px;
  }
  .box{
    width:100%;
  }
  .box >div{
    width:18%;
    margin-right:1.5%;
    box-sizing:border-box;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    display: inline-block;
  }
  .icon{
    color: #974621;
  }
  .cursor{
    cursor: pointer;
  }
  .dataRight {
    margin-left:20px; 
    height:400px;
  }
  .counter-content {
    width: 45px;
    height: 45px;
    border: 15px solid #ccc;
    border-bottom-color: #fff;
    border-radius: 50%;
  }
  .counter-content-one {
    border-color: #4d9fcf;
    border-bottom-color: #fff;
  }
  .counter-content-two {
    border-color: #AA7A53;
    border-bottom-color: #fff;
  }
  .counter-content-tree {
    border-color: #36c6d3;
    border-bottom-color: #fff;
  }
  .icon:nth-child(odd) {
    color: #974621;
  }
  .showData {
    font-size: 14px;
    margin-top: 3px;
  }
</style>
