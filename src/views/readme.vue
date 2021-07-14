<template>
    <div>
        <div style="background:white;padding-bottom:50px;">
            <div style="margin-bottom:50px;padding-top:20px;">
                <span :class="{'active':currentShow}" class="spanName" @click="currentClick">{{orgName}}<label v-show="currentShow"></label></span>
                <span :class="{'active':!currentShow}" class="spanName" @click="currentClick">平台<label v-show="!currentShow"></label></span>
            </div>
            <!-- 统计 -->
            <data-statistics
                v-show="currentShow"
                :isCursor="isCursor"
                :content="content">
            </data-statistics>
            <data-statistics
                v-show="!currentShow"
                :isCursor="!isCursor"
                :content="content2">
            </data-statistics>
        </div>
    </div>
</template>
<script>
    import dataStatistics from "@/components/dataStatistics";
    import{mapState} from 'vuex';

    export default {
        name: 'readme',
        data () {
            return {
                currentShow:true,
                isCursor:true,
                content:[],
                content2:[],
                orgName:JSON.parse(sessionStorage.getItem('user')).orgName,
                userName: JSON.parse(sessionStorage.getItem('user')).username,
                subMenuList:[]
            }
        },
        computed: {
            ...mapState(['menuList'])
        },
        components: {
            dataStatistics
        },
        methods: {
            async init(subMenuList) {
                var vm = this;
                if(this.currentShow){
                    var response = await this.$http.post(`${this.$apiUrl.getStatistic}/false`,subMenuList);
                    if (response.data.status == this.$appConst.status){
                        var result = response.data.data;
                        vm.content = result;
                    }
                    return;
                }else{
                    var response2 = await this.$http.post(`${this.$apiUrl.getStatistic}/true`,subMenuList);
                    if (response2.data.status == this.$appConst.status){
                        var result2 = response2.data.data;  
                        vm.content2 = result2;
                    }
                }
            },
            currentClick() {
                this.currentShow = !this.currentShow;
                this.init(JSON.parse(sessionStorage.getItem('subMenuList')));
            }
        },
        mounted() {
            var vm = this;
            vm.currentShow = true;
            console.log(sessionStorage.getItem('subMenuList'), 'sessionStorage.getItem(subMenuList)')
            if(sessionStorage.getItem('subMenuList')){
                this.init(JSON.parse(sessionStorage.getItem('subMenuList')));
            }
            this.$bus.$on('getStatic',function(){
                vm.subMenuList = [];
                if(!vm.menuList[2]){return;}
                vm.menuList[2].subs.map(item=>{
                    if(item.index==='/contractQuery'){
                        vm.subMenuList.push('TRADECONTRACT');
                    }
                    if(item.index.indexOf('commonAsset')!=-1){
                        var sub = item.index.split('/')[2];
                        vm.subMenuList.push(sub);
                    }
                });
                sessionStorage.setItem('subMenuList',JSON.stringify(vm.subMenuList));
                vm.init(vm.subMenuList);
            });
                
        },
    }
</script>
<style lang="scss" scoped>
    .welcome{
        top: 30px;
        left: 3px;
        color: #666666;
        font-size: 16px;
        font-weight: 500;
        span{
            color: #333333;
            font-weight: 600;
        }
    }
    .spanName{
        font-size: 18px;
        letter-spacing: 0;
        margin-right:20px;
        margin-left:20px;
        color: #999999;
        cursor: pointer;
        position: relative;
    }
    .spanName label{
        position: absolute;
        width: 30px;
        height: 4px;
        color: #FF5701;
        background: #FF5701;
        left: 50%;
        margin-left:-13px;
        bottom: -6px;
    }
    .spanName.active{
        color: #333333;
        font-weight: bold;
    }
</style>
