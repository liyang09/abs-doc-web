<template>
    <div id='assetTable'>
      <el-form :model="ruleForm" ref="ruleForm" size="small">
        <el-table 
          ref="multipleTable" 
          tooltip-effect="dark" 
          class="detailEntry"
          id="detailEntry"
          :data="ruleForm.tabData"
          :height="height"
          >
          <el-table-column fixed type="index" width="65" center >
            </el-table-column>
    
            <el-table-column 
              v-for="(item, key) in mainTable.tableHeader" 
              :prop="key" 
              :column-key="key" 
              :label="item" 
              :key="key" 
              :show-overflow-tooltip="true" 
              >
              <template slot="header" slot-scope="scope">
                  <!-- <div  v-if="key == 'fieldCnName'" class="table-head" style="width: 100%;">
                    <i style="color: #f56c6c;">*</i>
                    {{item}}
                  </div>
                  <div v-else>
                    {{item}}
                  </div> -->
                  <div >
                    {{item}}
                  </div>
              </template>
              <template slot-scope="scope">
                <el-form-item
                	:prop="'tabData.' + scope.$index + '.'+key"
                	:rules="rules[key]"
                >
                  <div v-if="key === 'fieldCnName' || key === 'fieldEnName'" class="tableInnerInput" @click.stop=''>
                      <!-- <el-input
                          v-model="scope.row[key]"
                          :disabled="!scope.row['editChange']"
                          :ref='"companyName" + scope.$index'>
                      </el-input> -->
                      <el-input
                        size="medium"
                        :disabled="!scope.row['editChange']"
                        v-model="scope.row[key]"
                        class="editInput"
                        :keyVal="key"
                        :index="scope.$index"
                        :val="scope.row[key]">
                      </el-input>
                  </div>
                  <!-- 类型 -->
                  <el-select
                      v-else-if="key === 'fieldType'"
                      v-model="scope.row[key]"
                      :disabled="!scope.row['editChange']"
                      placeholder="请选择类型"
                      class="tableInnerInput"
                      style="width: 100px;">
                      <el-option
                          v-for="item in typeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
                <div v-else-if="key === 'ifSort' || key === 'ifQuery' || key === 'ifEdit' || key === 'listVisible'"
                    @click.stop=''>
                        <span v-if="!scope.row['editChange']" class="el-checkbox checkBoxBtn"> {{ scope.row[key] ? '是' : '否'}} </span>
                        <el-checkbox v-else v-model="scope.row[key]" class="checkBoxBtn"></el-checkbox>
                </div>
              <div v-else-if="key === 'portalTypeVisible'" @click.stop=''>
                <!-- <div v-else-if="key === 'portals'"> -->
                  <el-checkbox-group
                      v-model="scope.row[key]"
                      :disabled="!scope.row['editChange']"
                      class="isWebViewBtn">
                      <el-checkbox-button
                          v-for="item in isWebViewOptions"
                          :key="item.value"
                          :label="item.value">
                          {{ item.label }}
                      </el-checkbox-button>
                  </el-checkbox-group>
              </div> 
  	    				<!-- <el-input
		    			  	size="medium"
  	    					v-else
  	    					v-model="scope.row[key]"
  	    					class="editInput"
  	    					:keyVal="key"
  	    				  :index="scope.$index"
  	    					:val="scope.row[key]"
  	    					@blur="handleDetailBlur($event, scope.row, key, scope.$index)"
  	    					>
  	    				</el-input> -->
                </el-form-item>
		    	    </template>
		        </el-table-column>
    
		         <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <i class="el-icon-edit" @click.stop="handleEditChange(scope.$index)" style="cursor:pointer;font-size:18px;margin-right: 20px;"></i>
                  <i class="el-icon-delete" @click="handleDeleteRow(scope.$index)"  style="cursor:pointer;font-size:18px"></i>
                </template>
            </el-table-column>
		    </el-table>
      </el-form>
        <div class="detailAdd">
          <span class="redColor pointer" @click="handleDetailAdd()"><i class="el-icon-plus"></i>添加</span>
        </div>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import commonSetData from '@/assets/js/commonSetData.js';


export default {
  name: '',
  data() {
    return {
      ruleForm: {
        tabData:[]
      },
      rules: {
        fieldCnName:[
          { required: true, message: '此项必填项', trigger: 'change' },
        ],
        fieldEnName:[
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { pattern:/^[a-zA-Z_]*$/,message:"只能输入英文字母",trigger:"blur" },
        ],
        // quotePrice:[
        // 	{ required: true, message: '单价为必填项', trigger: 'blur' },
        // 	// { pattern:/^\d{1,3}||(\,)+(\.\d{1,2})?$/,message:"只能输入数字和最多两位小数",trigger:"blur" },
        // 	{ pattern:/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/,message:"输入总和最多两位小数",trigger:"blur" }, // 可输入逗号
        // 	{ validator: validateQuotePrice, trigger: 'blur' }
        // ],
      },
      typeOptions: [
        {
          // value: 'STRING',
          value: 98,
          label: '文本'
        },
        {
          // value: 'INTEGER',
          value: 96,
          label: '数字'
        },
        {
          // value: 'DATE',
          value: 99,
          label: '日期'
        },
        {
          // value: 'BOOLEAN',
          value: 95,
          label: '布尔值'
        }
      ],
      isWebViewOptions: [
        {
          value: 'FACTOR',
          label: '保理'
        },
        {
          value: 'BROKER',
          label: '券商'
        }
      ],
      // 表格数据
      mainTable: {
        tableHeader: {},
        tableData: [],
        tableWidth: {}
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      assetType:'',
    };
  },
  components: {
    Table
  },
  created() {
    this.mainTable.tableHeader = commonSetData.tableHeader.setting;
    this.search();
    this.getDictionaryApi();
  },
  computed: {
    // ...mapState(['ASSETSPARAMS', 'DICTIONARY']),
    height() {
      var height2 = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height2 - 300 + 'px';
    },
  },


  mounted() {},
  methods: {
    // ...mapMutations(['SET_DATALIST', 'SET_DICTIONARY']),
    handleEditChange(index) {
      // this.handleSetInputDisabled(index)
      if (!this.handleTableValidate()) {
        this.handleSetInputDisabled(index)
      }
    },
    handleTableValidate () {
        let n = 0
        this.mainTable.tableData.map((v, index) => {
            if(!v.fieldEnName.length) {
              v['editChange'] = true
              n++
              return n;
            }
            if (!v.fieldCnName.length) {
                v['editChange'] = true
                n++
            } else {
                v['editChange'] = false
            }
        })
        if (n) {
            this.$message.error('请录入字段名称！')
            this.$nextTick(() => {
                let leng = this.mainTable.tableData.length - 1
                $('#assetTable .el-table__body .el-table__row').eq(leng).find('.tableInnerInput .el-input__inner').eq(0).trigger('focus')
            })
        }
        console.log(n);
        return n
    },
    handleSetInputDisabled (index) {
      this.ruleForm.tabData = [];
        this.mainTable.tableData.map(v => {
            v['editChange'] = false
            this.ruleForm.tabData.push(v)
        })
        // this.mainTable.tableData[index]['editChange'] = !this.mainTable.tableData[index]['editChange']
        this.mainTable.tableData[index]['editChange'] = true;
        this.ruleForm.tabData[index]['editChange'] = true;
        this.$nextTick(() => {
            // $('.el-table__body').find('.el-table__row').eq(index).find('.el-input .el-input__inner').eq(0).focus()
            $('#assetTable .el-table__body .el-table__row').eq(index).find('.el-input .el-input__inner').eq(0).focus()
        })
    },
    // 添加行
    handleDetailAdd() {
      let obj = {
        id: Math.ceil(Math.random(0, 1000) * 10000) + new Date().getTime(),
        fieldCnName: '',
        fieldType: 'STRING',
        ifSort: false,
        ifQuery: false,
        ifEdit: false,
        portalTypeVisible: ['FACTOR', 'BROKER'],
        // portals: ["FACTOR", "BROKER"],
        editChange: true
      }
        for(var key in this.mainTable.tableHeader){
          if(key === 'portalTypeVisible') {
            obj[key] = [];
          } else {
            obj[key] = '';
          }
        }
        // this.tabData.map(v=> {
        //   v['editChange'] = false;
        // })
        if (!this.handleTableValidate()) {
          this.ruleForm.tabData.push(obj);
        }
		},
    // 删除 行
		handleDeleteRow(index) {
			this.ruleForm.tabData.splice(index,1);
		},
    saveSubmit() {
      const vm = this;
      let flag = false;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          flag = true;
        } else {
          alert('必填项')

        }
      })
      return flag;
    },
    handleGetColumns () {
        let arr = this.ruleForm.tabData
        arr.map((v, index) => {
            // v.orderNo = index + 1
            // v.value = ''
            delete v.editChange
            delete v.portals
            if (String(v.id).length >= 13) {
                delete v.id
            }
        })
        return arr
    },
    handleDetailBlur(event, row, key, index) {
      console.log('7777', event)
		},
    search() {
      var vm = this;
      const params = {
        tableEnName: this.$appConst.tableEnNameAsset,
        projectName: this.$appConst.setProjectName
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http.get(`${this.$apiUrl.tableAssetName}`, { params })
      // this.$http.get(`${this.$apiUrl.tablefile}`, { params })
        .then(res => {
          loading.close()
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          let content = res.data.data;
          // content.forEach(item => {
          //   console.log('数据类型', typeof item.portalTypeVisible);
          //   item['portals'] = item.portalTypeVisible
          //   if(item.portalTypeVisible) {
          //     // var arr = JSON.parse(item.portalTypeVisible);
          //     // item['portals'] = arr;
          //   //   var arr = [];
          //   //   var arr2 = [];
          //   //   arr = item.portalTypeVisible.split(',')
          //   //   item['portals'] = ["FACTOR", "BROKER"];
          //   // } else {
          //   //   item['portals'] = [];
          //   }
          // })
          this.mainTable.tableData = content;
          this.ruleForm.tabData = content;
          if(content.length && content) {
            this.$appConst.tableConfigId = content[0].tableConfigId;
          }
        }).catch(err => {
          loading.close()
          this.totalCount = 0;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
    // 字典请求数据
    getDictionaryApi(list, val) {
      this.$http.get(this.$apiUrl.dictionary.codeList + '?code=CLASS_TYPE')
        .then(res => {
          if (res.data.status !== 200) return;
          this.typeOptions = [];
          res.data.data.forEach(item=>{
            this.typeOptions.push({ value: item.id, label: item.label})
          })
        }).catch(err => {
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.detailEntry {
  overflow-y:scroll!important;
}
.allTotalClass{
  text-align:right;
  line-height:40px;
  font-size:16px;
  color:#000;
}
.approval__box{
  .search{
    height: 120px;
    margin-top: 50px;
  }
  .btn__search{
    bottom: -46px;
    right: 0;
  }
  .table_btn{
    margin: 5px;
  }
}
  .isWebViewBtn {
      /deep/ .el-checkbox-button {
          margin-right: 10px;
          // width: 44px;
          // height: 24px;
          line-height: 24px;
          text-align: center;
          background: transparent;
          border: 0;
          border-radius: 4px;
          color: #333;
          /deep/ .el-checkbox-button__inner {
              padding: 5px 8px;
              box-sizing: border-box;
              border-radius: 4px;
              border: 1px solid #DCDFE6;
          }
      }
      /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
          color: #E59D28;
          background-color: transparent;
          border-color: #E59D28;
          box-shadow: unset;
      }
      /deep/ .el-checkbox-button__inner:hover {
          color: #E59D28;
      }
  }
</style>
