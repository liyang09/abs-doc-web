<template>
  <div class="table-content">
    <el-table :data="mainTable.tableData"
              highlight-current-row
              tooltip-effect="dark"
              border
              @selection-change="selectionWarehouse"
              :row-key="getRowKey"
              header-cell-class-name="table-header-cell"
              cell-class-name="table-cell"
              style="width: 100%"
              ref="multipleTable"
              v-loading="loading"
              @row-click="rowClick"
              :height="height" size="medium">
      <el-table-column
        type="selection"
        v-if="selected"
        :reserve-selection="true"
        align="center"
        :selectable="selectable"
        width="55">
      </el-table-column>
      <el-table-column label="#" type="index"  width="98" align="center"> </el-table-column>
      <el-table-column  v-if="key != 'goodsHead'" v-for="(item, key) in mainTable.tableHeader "
                       :key="key"
                       :prop="key"
                       show-overflow-tooltip
                       :label="item"
                       :width='handlewidth(key)'>
        <template slot-scope="scope">
          <span v-if="key.indexOf('Date')!=-1 || key.indexOf('Time')!=-1">
            {{scope.row[key] ? $appConst.handleSetTime(scope.row[key]) : '/'}}
          </span>
          <span v-else-if="key === 'recvgStatus'">
            {{scope.row.recvgStatus === "FALSE" || scope.row.recvgStatus === 'false' || scope.row.recvgStatus === false? '未收货':'收货完成'}}
          </span>
          <span v-else-if="key === 'buzType'">
            {{DICTIONARY[$appConst.dictionaryType.buzType][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'invoiceType' && assetType=='TRADEINVOICE'">
            {{DICTIONARY[$appConst.dictionaryType.invoiceType][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'financed'">
            {{scope.row[key]===true ? "已融资" :"未融资"}}
            <!-- {{DICTIONARY[$appConst.dictionaryType.financeStatus][scope.row[key]]}} -->
          </span>
          <span v-else-if="key === 'type' && assetType=='TRADECONTRACT'">
            {{DICTIONARY[$appConst.dictionaryType.contractType][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'type' && assetType=='TRADEORDER'">
            {{DICTIONARY[$appConst.dictionaryType.orderType][scope.row[key]]}}
          </span>
          <span v-else-if="(key === 'type' && assetType=='TRADEINVOICE') || key === 'fplx'">
            {{DICTIONARY[$appConst.dictionaryType.invoiceType][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'type' && assetType=='TRADESETTLEMENT'">
            {{DICTIONARY[$appConst.dictionaryType.settlementType][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'type' && assetType=='TRADEPONDERATION'">
            {{DICTIONARY[$appConst.dictionaryType.pounderationType][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'invoiceStatus'">
            {{DICTIONARY[$appConst.dictionaryType.invoiceStatus][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'checkStatus'">
            {{DICTIONARY[$appConst.dictionaryType.invoiceCheckStatus][scope.row[key]]}}
          </span>
          <span v-else-if="key === 'amount' || key.indexOf('Amount') !=-1 || key.indexOf('Price')!=-1 || key==='airportServiceFee' ||key==='civilAviationDevelopmentFund'||key==='balance' || key.indexOf('Money')!=-1">
            {{scope.row[key]=== 0 || scope.row[key] ? $appConst.fmoney(scope.row[key], 2) : '/'}}
          </span>
          <span v-else>{{(scope.row[key] && scope.row[key] !== '') || (scope.row[key] === 0) ?  scope.row[key] : '/'}}</span>
        </template>
      </el-table-column>
      <!--            订单商品展示-->
      <el-table-column
              v-else-if="key === 'goodsHead'"
              :label="mainTable.tableHeader[key]['title']"
              :render-header="labelHead"
              align="center"
              scoped-slot>
          <el-table-column
                  v-for="(orderItem, orderKey) in mainTable.tableHeader[key]['children']"
                  :key="orderKey"
                  :label="orderItem"
                  :show-overflow-tooltip="true"
                  :render-header="labelHead"
                  :prop="orderKey"
                  align="center"
                  :width="orderKey === 'goodsName' ? '280' : '100'">
              <template
                      slot-scope="scope">
                  <div
                          v-if="scope.row['goods'].length"
                          v-for="(item, index) in scope.row['goods']"
                          :key="index"
                          style="line-height: 30px; height: 30px;"
                          :style="index < (scope.row['goods'].length - 1) ? goodStyle : ''">
                      {{ item[orderKey] ? item[orderKey] : '&nbsp;'}}
                  </div>
              </template>
          </el-table-column>
      </el-table-column>
      <slot></slot>
      <!-- 搜索空 -->
      <div slot="empty" v-if="isSearch === 'search'">
        <div style="margin:80px 0 123px 0;">
          <img :src="$global.imgUrl.empty"
          alt="无显示数据"
          style="display:block;height: 136px;width: 160px;margin:0 auto;"
          >
          <p style="color:#999;line-height: 14px;">
          搜索不到相关信息
          </p>
        </div>
      </div>
      <div slot="empty" v-else>
        <!-- 数据空 -->
          <div style="margin:80px 0 123px 0;">
            <img :src="$global.imgUrl.empty"
            alt="无显示数据"
            style="display:block;height: 136px;width: 160px;margin:0 auto;"
            >
            <p style="color:#999;line-height: 14px;">
            暂无数据
            </p>
          </div>
        </div>
    </el-table>
    <div class="clearfix page-nav" v-if="totalCount>0">
      <!-- <span class="pull-left current-page_text">每页{{$appConst.pageSize}}条</span> -->
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
</template>

<script>
/* eslint-disable */
import{mapState} from 'vuex';

export default {
  name: 'Table',
  components: {
    
  },
  props: ['assetType','mainTable', 'showPagination', 'selected', 'totalCount', 'pageSize', 'loading', 'bannedElection', 'isSearch','height2','selectable'],
  data() {
    return {
      goodStyle:
        {
          borderBottom: "1px solid #eee",
        },
      pageSizes:[],
      currentPage: 1,
      pageShow: true,
      assetsUidList:[],
      selectedAssetsList:[]
    };
  },
  mounted() {
    this.pageSizes = this.$appConst.pageSize;
    this.$refs.multipleTable.doLayout()
  },
  computed: {
    ...mapState(['DICTIONARY']),
    height() {
      if (this.height2)  {
        return this.height2 +'px';
      };
      var height2 = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // return height2 - 300 + 'px';
      return 350 + 'px';
    },
  },
  methods: {
    rowClick (row) {
      if(this.assetType === this.$appConst.tableEnNameAsset) {
        this.$emit('rowClick', row)
      }
    },
    currentKey(key) {
      // 给key加上Math.random()是为了解决操作一列固定错位的问题，但是又造成了【添加企业】模块弹出框输入的时候表格闪动的问题，所以先这样处理。
      return window.location.href.lastIndexOf('orgRolesManage')!=-1 ? key :key + Math.random()
    },
    getRowKey(row) {
      return row.id
    },
    labelHead (h, {column, index}) {
      let l = column.label.length
      let f = 16

      if (!(column.label.indexOf("时间") > -1)) {
        column.minWidth = f * (l + 4)
        if (column.label === "状态" || column.label === "发货单单号" || column.label === "订单单号" || column.label === "收货单单号" || column.label === "结算单单号" || column.label === "买方" || column.label === "时间") {
          // column.minWidth = f*(l+2)
          return h('div', {class: 'table-head', style: {width: '70%'}}, [column.label])
        } else {
          return h('div', {class: 'table-head', style: {width: '100%'}}, [column.label])
        }
      } else {
        column.minWidth = f * (l + 3)
        return h('div', {class: 'table-head', style: {width: '80%'}}, [column.label])
      }
    },
    // 给当前分页之前选中的勾选复现。
    toggle() {
      const vm = this;
      console.log(this.assetsUidList,'之前全部选择的数据');
      const assetsUidList = this.assetsUidList; // 之前全部选择的数据
      const tableData = this.mainTable.tableData; // 表格中的全部数据
      const rowIndexs = [];
      for (let i = 0; i < tableData.length; i += 1) {
        for (let j = 0; j < assetsUidList.length; j += 1) {
          if (tableData[i].id === assetsUidList[j]) {
            rowIndexs.push(i);
          }
        }
      }
      rowIndexs.forEach(row => {
        vm.$refs.multipleTable.toggleRowSelection(vm.mainTable.tableData[row]);
      });
    },
    clearSelection() {
      this.assetsUidList = [];
      this.$refs.multipleTable.clearSelection();
    },
    handlewidth(key) {
      let num = '';
      if (this.mainTable.tableWidth) {
        num = this.mainTable.tableWidth[key];
      }
      return num;
    },
    // 存储之前勾选的全部数据。
    selectionWarehouse(items) {
      const vm = this;
      // // 选择的行的完整数据。
      // vm.selectedAssetsList = Array.from(new Set([...vm.selectedAssetsList,...items]));
      // const currentArr = items.map(item => item._id);
      // const arr1 = [...vm.assetsUidList, ...currentArr];
      // vm.assetsUidList = Array.from(new Set(arr1));
      // const tableData = vm.mainTable.tableData.map(item => item._id);
      // const difference = tableData.filter(v => !currentArr.includes(v));
      // difference.forEach(item => {
      //   if (vm.assetsUidList.indexOf(item) !== -1) {
      //     vm.assetsUidList.splice(vm.assetsUidList.indexOf(item), 1);
      //   }
      // });
      // // 把选中的行数据进行去重。
      // var list = vm.selectedAssetsList.filter(item=>vm.assetsUidList.indexOf(item._id)!=-1);
      // for(var i =0;i<list.length;i++){
      //   for(var j=i+1;j<list.length;j++){
      //     if(list[i]._id==list[j]._id){
      //       list.splice(j,1);
      //       j--;
      //     }
      //   }
      // }
      // 选择的行的完整数据。
      vm.selectedAssetsList = Array.from(new Set([...vm.selectedAssetsList,...items]));
      const currentArr = items.map(item => item.entityUuid);
      const arr1 = [...vm.assetsUidList, ...currentArr];
      vm.assetsUidList = Array.from(new Set(arr1));
      const tableData = vm.mainTable.tableData.map(item => item.entityUuid);
      const difference = tableData.filter(v => !currentArr.includes(v));
      difference.forEach(item => {
        if (vm.assetsUidList.indexOf(item) !== -1) {
          vm.assetsUidList.splice(vm.assetsUidList.indexOf(item), 1);
        }
      });
      // 把选中的行数据进行去重。
      var list = vm.selectedAssetsList.filter(item=>vm.assetsUidList.indexOf(item.entityUuid)!=-1);
      for(var i =0;i<list.length;i++){
        for(var j=i+1;j<list.length;j++){
          if(list[i].entityUuid==list[j].entityUuid){
            list.splice(j,1);
            j--;
          }
        }
      }
      vm.$bus.$emit('getAssetsUidList',vm.assetsUidList,list);
    },
    setCurrentPage(page) {
      this.currentPage = page;
    },
    handleSizeChange(size) {
      this.$emit('handleSizeChange', size);
    },
    handleCurrentChange(currentPage) {
      this.$emit('handleCurrentChange', currentPage);
    },
    resetCurrentPage() {
      this.pageShow = false;
      this.currentPage = 1;
      this.$nextTick(() => {
        this.pageShow = true;
      });
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    }
  }
};
/* eslint-enable */
</script>

<style lang="scss">
.page-nav{
  width:100%;
  text-align:right;
  margin-right:20px;
  margin-top:20px;
}
  .el-tooltip__popper {
    max-width: 400px !important;
  }
  .table-content {

    .table-header-cell {
      color: #333333;
      border-right: none;
      background:#FCFDFE;
    }

    .table-img_s {
      width: 40px;
      height: 40px;
    }

    .table-cell {
      color: #333333;
      border-right: none;
    }

    .pagination-container {
      border: 1px solid #EBEEF5;
      border-top: none;
      border-right: none;
      padding: 10px 20px;
      text-align: right;

      .el-pagination {
        padding: 0;
      }

      .current-page_text {
        line-height: 28px;
      }
      .el-pager li.active{
        color: #caa14f;
      }
      .el-pager li:hover{
        color: #deb157;
      }
    }
    .el-pagination button:hover{
      color: #deb157;
    }
  }
  // .agreement-dialog{
  //   /deep/.el-dialog {
  //     width: 1000px;
  //     height: 100%;
  //   }
  //   .agreement{
  //     height: 100%;
  //   }
  // }
  .el-table{
    font-size:14px;
  }
// .el-table__body tr:hover>td{
//     background-color: rgb(255,252,249) !important
//   }
 
//   .el-table__body tr.current-row>td{
//     background-color: rgb(255,252,249) !important
//   }
.el-pagination.is-background .el-pager li:not(.disabled).active {
    color: #fff !important;
    background: #312F2F !important;
}
.el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
    border: 1px solid #E1E5EF;
    color: #BBBBBB !important;
    background: #fff !important;
    border-radius: 4px !important;
}
.el-select .el-input.is-focus .el-input__inner {
    border-color: #deb157;
}
.el-pagination .el-select .el-input .el-input__inner:hover{
  border-color: #deb157;
}
.el-select-dropdown__item.selected {
    color: #deb157;
    font-weight: 700;
}
.el-select .el-input__inner:focus {
    border-color: #C0C4CC;
}
</style>
