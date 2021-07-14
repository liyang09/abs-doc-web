export default{
    data(){
      return{
        assetTypeList: {}, // 字典取资产类型
        invoiceStatusList: {}, // 发票状态
        invoiceTypesList:{},//发票类型
        financeStatusList:{},//是否已融资
        invoiceCheckStatusList: {}, // 发票核验状态
        buzTypeList:{},//业务类型
        contractTypeList:{},//合同类型
      }
    },
    methods:{
        // 获取字典值
        getDictionary(assetType) {
          // 合同
          if (assetType === 'TRADECONTRACT') {
            // 合同类型
            if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.contractType)) {
              this.contractTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.contractType]);
            }else{
              this.getDictionaryApi(this.contractTypeList, this.$appConst.dictionaryType.contractType);
            }
            // 业务类型
            if(this.DICTIONARY.hasOwnProperty(this.$appConst.dictionaryType.buzType)) {
              this.buzTypeList = Object.assign({}, this.DICTIONARY[this.$appConst.dictionaryType.buzType]);
            }else{
              this.getDictionaryApi(this.buzTypeList, this.$appConst.dictionaryType.buzType);
            }
          }
    
          this.assetTypeList = {};
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