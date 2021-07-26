<template>
  <div>
    <el-drawer
      size="491px"
      custom-class="export-asset-drawer"
      :visible.sync="drawer"
      v-if="drawer"
      direction="rtl"
      :modal="false"
      :show-close="false"
      :before-close="drawerClose">
      <div slot="title">
        导出资产
      </div>
      <div>
        <el-form ref="exportAssetForm" :model="exportAssetForm" label-width="80px">
          <!-- <el-form-item label="审核状态" v-if="fromMenu !== 'assetQuery'">
            <div style='display: flex'>
              <div class='auditType'>
                <el-checkbox v-model="exportAssetForm.Factoring" @change="exportAssetForm.FactoringStatus = ''">保理审核</el-checkbox>
                <el-checkbox v-model="exportAssetForm.Broker" @change="exportAssetForm.BrokerStatus = ''">券商审核</el-checkbox>
              </div>
              <div class='auditStatus'>
                <el-radio-group
                  v-show='exportAssetForm.Factoring'
                  v-model="exportAssetForm.FactoringStatus">
                  <el-radio
                    v-for='(item, key) in $appConst.auditStatus'
                    :key='key'
                    :label='key'>
                    {{item}}
                  </el-radio>
                </el-radio-group>
                <div class="broker-status">
                  <el-radio-group
                    v-show='exportAssetForm.Broker'
                    v-model="exportAssetForm.BrokerStatus">
                    <el-radio
                      v-for='(item, key) in $appConst.auditStatus'
                      :key='key'
                      :label='key'>
                      {{item}}
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </el-form-item> -->
          <el-form-item label="选择字段" :class="['contents', {'assetQuery':fromMenu === 'assetQuery'}]">
            <div><el-button type="text" @click="selectAll">{{exportAssetForm.contents.length === exportContents.length ? '取消全选' : '全选'}}</el-button></div>
            <el-checkbox-group v-model="exportAssetForm.contents">
              <el-checkbox-button v-for="item in exportContents" :label="item.cnName" :name="item.enName" :key="item.enName"></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="buttons">
            <el-button @click="confirmExport">确认导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'exportAsset',
  props: { exportContents: Array, exportOption: Object },
  data () {
    return {
      drawer: false,
      exportAssetForm: {
        companyName: {
          entityUuid: 'all',
          companyName: '全部'
        },
        Factoring: false,
        Broker: false,
        FactoringStatus: '',
        BrokerStatus: '',
        contents: []
      },
      companyOptions: []
    }
  },
  computed: {
    fromMenu () {
      console.log(this.exportContents, 'exportContents')
      console.log(this.exportOption.fromMenu, 'this.exportOption.fromMenu')
      return this.exportOption.fromMenu
    }
  },
  methods: {
    exportAssetHandle () {
      this.drawer = true
    },
   selectAll () {
      if (this.exportAssetForm.contents.length === this.exportContents.length) {
        this.exportAssetForm.contents = []
      } else {
          this.exportAssetForm.contents = [];
          this.exportContents.forEach(item => {
            this.exportAssetForm.contents.push(item.cnName)
          })

      }
    },
    confirmExport(){
      let arr = [];
      if(this.exportAssetForm.contents.length) {
        this.exportAssetForm.contents.forEach(val => {
          this.exportContents.forEach(item => {
            if(val === item.cnName) {
              arr.push(item.enName)
            }
          })
        })
      }
      axios({
        method: 'post',
        url:`${this.$apiUrl.exportDataToExcel2}/${this.$appConst.tableEnNameAsset}`,
        data:{
          "entityType": this.$appConst.tableEnNameAsset,
          "exportRequest": {
            "fieldNames": arr
          }
        },
        responseType: 'arraybuffer'
      })
      .then(res => {
          // res.data 是一个 blob 流格式
          const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          this.$global.downFile(blob,"资产.xlsx");
        })
        .catch(err =>{})
    },
    drawerClose () {
      this.exportAssetForm = {
          companyName: {
            entityUuid: 'all',
            companyName: '全部'
          },
          contents: []
      }
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
$themeColor: #FDB636;
// $themeColor: #FF4040;
.export-asset-drawer {
  .el-drawer__header {
    div{
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .el-form{
    padding: 15px;
    .el-select{
      width: 100%;
    }
    .buttons{
      /deep/.el-form-item__content{
        margin: 0!important;
        .el-button, .el-button:focus, .el-button:hover{
          width: 100%;
          background: $themeColor;
          border-radius: 4px;
          color: #fff;
          border: none;
        }
      }
    }
  }
  .auditType {
    margin-right: 10px;
    width: 80px;
    /deep/ .el-checkbox__input {
      +.el-checkbox__label {
          padding-left: 4px;
          color: #333 !important;
      }
    }
    /deep/ .el-checkbox__input.is-checked {
      +.el-checkbox__label {
          color: #333 !important;
      }
    }
  }
  .auditStatus {
    flex: 1;
    position: relative;
    /deep/.el-radio {
      margin-right: 7px;
      font-size: 12px;
      .el-radio__label {
        padding-left: 3px;
        font-size: 12px;
        color: #666;
      }
    }
    .broker-status{
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
