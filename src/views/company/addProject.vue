<template>
<el-dialog title="新增项目合作公司" :visible.sync="addMessageVisiable" @close="closeBtn" width="700px">
    <el-form :model="form" ref="form" label-width="130px" style="width: 580px; ">
        <el-form-item prop="projectCompany" label="公司名称:">
            <el-row>
            <el-col>
                <el-autocomplete
                style="width: 450px"
                class="inline-input"
                v-model="form.projectCompany"
                :fetch-suggestions="querySearch"
                placeholder="请输入项目合作公司"
                @select="handleSelect"
                ></el-autocomplete>
            </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="意见:" prop="comment">
            <el-input type="textarea" v-model="form.comment" class="comments"></el-input>
        </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:30px;">
        <el-button size="small" @click="close()">
            取 消
        </el-button>
        <el-button  size="small" type="primary"
                @click="addMessageSure()" class="primaryButton">
            确 定
        </el-button>
    </div>
</el-dialog>
</template>

<script>
export default {
props: ['title'],
data () {
    return {
        addMessageVisiable: false,
        companyList: [],
        inputPlaceholder: '请输入项目合作公司',
        id: '',
        projectEntityUuid: '',
        projectName: '',
        addr:'',
        orgId:'',
        acceptNew:'PDF,pdf,rar',
        form: {
            projectCompany: '',
            comment: ''
        },
    }
},
components: {
    
},
mounted() {
    this.companyList = this.loadAll();
},
methods: {
    querySearch(queryString, cb) {
        var companyList = this.companyList;
        var results = queryString ? companyList.filter(this.createFilter(queryString)) : companyList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
    createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
    handleSelect(item) {
        this.addr = item.address
        this.orgId = item.orgId
    },
    show(row) {
        console.log(row)
        this.addMessageVisiable = true
        this.id = row.id
        this.projectEntityUuid = row.entityUuid
        this.projectName = row.projectName
    },
    // 确定
    addMessageSure() {
        if(!this.form.projectCompany){
            this.addMessageVisiable = true
            this.$message.warning('请选择合作公司!');
        } else {
            this.addMessageVisiable = false
            this.add()
        }
    },
    add() {
        const params = {
             addr: this.addr,
             attachments: [],
             comments: this.form.comment,
             orgId: this.orgId,
             id: this.id,
             orgName: this.form.projectCompany,
             projectEntityUuid: this.projectEntityUuid,
             projectName: this.projectName
        };
        this.loading = true;
        const url = `${this.$apiUrl.factoringAddOrg}`;
        this.$http.post(url,params)
            .then(res => {
                if (res.data.status !== 200) return;
                this.loading = false;
                this.form.projectCompany = ''
                this.$emit('search');
            }).catch(err => {
                this.$message.warning(err.message);
                this.loading = false;
            });
    },
    close() {
      this.addMessageVisiable = false
      this.form.projectCompany = ''
      this.comment = ''
      this.reset()
    },
    closeBtn() {
        this.close()
    },
    reset() {
        this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        });
    },
    loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号", "orgId":"488f96d2-b605-4850-8310-26b8a1bf98d4"},
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号", "orgId":"488f96d2-b705-4850-8310-26b8a1bf98d4" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113", "orgId":"488f96d2-b608-4850-8310-26b8a1bf98d4" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号", "orgId":"488f96d2-b605-4850-9310-26b8a1bf98d4" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101", "orgId":"481f96d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "贡茶", "address": "上海市长宁区金钟路633号", "orgId":"488f96d2-b605-4850-8350-26b8a1bf98d4" },
          { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号", "orgId":"488f26d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号", "orgId":"488f93d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107", "orgId":"488f96d2-b705-4850-8310-26b8a1bf98d4" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号", "orgId":"488f96d2-b905-4850-8310-26b8a1bf98d4" },
          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号", "orgId":"488f96d2-b805-4850-8310-26b8a1bf98d4" },
          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号", "orgId":"488f16d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F", "orgId":"428f96d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层", "orgId":"488f96d2-b605-4850-8310-26b8a1bf38d4" },
          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号", "orgId":"488f96d2-b605-4850-8310-26b8a1bf78d4" },
          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路", "orgId":"488f96d2-b605-4850-8310-26b8a1bf58d4" },
          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺", "orgId":"488f96d2-b605-4850-8310-26b6a1bf98d4" },
          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819", "orgId":"488f96d2-b605-4850-8370-26b8a1bf98d4" },
          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306", "orgId":"488f96d2-b655-4850-8310-26b8a1bf98d4" },
          { "value": "枪会山", "address": "上海市普陀区棕榈路", "orgId":"488f96d2-b605-4850-8310-26b8a1bf93d4" },
          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号", "orgId":"488f96d2-b605-4850-8410-26b8a1bf98d4" },
          { "value": "钱记", "address": "上海市长宁区天山西路", "orgId":"488f96d2-b605-4850-8310-26b8a9bf98d4" },
          { "value": "壹杯加", "address": "上海市长宁区通协路", "orgId":"488f96d2-b605-4850-8310-26b8a6bf98d4" },
          { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元", "orgId":"488f96d2-b607-4850-8310-26b8a1bf98d4" },
          { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室", "orgId":"488f96d2-b605-4859-8310-26b8a1bf98d4" },
          { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺", "orgId":"488f96f2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6", "orgId":"488f96d2-b605-4850-8310-26b8a1ef98d4" },
          { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号", "orgId":"488f96d2-b605-4850-8310-26b9a1bf98d4" },
          { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号", "orgId":"488f96d2-b605-4850-8310-27b8a1bf98d4" },
          { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号", "orgId":"488f96d2-b605-4890-8310-26b8a1bf98d4" },
          { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号", "orgId":"488f96d2-b605-4850-8370-26b8a1bf98d4" },
          { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号", "orgId":"488f96d3-b605-4850-8310-26b8a1bf98d4" },
          { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室", "orgId":"488f96h2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1", "orgId":"488f96d2-b615-4850-8310-26b8a1bf98d4" },
          { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号", "orgId":"488f96d2-b205-4850-8310-26b8a1bf98d4" },
          { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室", "orgId":"487f96d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部", "orgId":"488s96d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B", "orgId":"488f56d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "浏阳蒸菜", "address": "天山西路430号", "orgId":"488f96d2-b605-4850-8310-26b8b1bf98d4" },
          { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路", "orgId":"488f96d2-b605-4850-8310-26b8a1ff98d4" },
          { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室", "orgId":"488f96d2-b605-4850-8310-26f8a1bf98d4" },
          { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号", "orgId":"488f96d2-b605-4850-8310-26b8a1bz98d4" },
          { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号", "orgId":"488z96d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位", "orgId":"488f96z2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号", "orgId":"488f96h2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼", "orgId":"488r96d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "阳阳麻辣烫", "address": "天山西路389号", "orgId":"488f90d2-b605-4850-8310-26b8a1bf98d4" },
          { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13", "orgId":"488f96d2-b005-4850-8310-26b8a1bf98d4" }
        ];
      },
}
}
</script>
<style lang="less" scoped>

</style>
