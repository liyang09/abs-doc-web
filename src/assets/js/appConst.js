/* eslint-disable */
export default{
    auditTypeSet: `${sessionStorage.getItem("projectConfigEnName")}Audit`,
    tableConfigId: 1,
    setProjectName: sessionStorage.getItem("projectConfigEnName"),
    tableEnNameCompany: `${sessionStorage.getItem("projectConfigEnName")}CompanyEntity`,
    tableEnNameAsset: `${sessionStorage.getItem("projectConfigEnName")}AssetEntity`,
    uosUrl: uosUrl,
    edocUrl: bizUrl,
    bucketName: bucketName,
    assetIdentification: assetIdentification,
    systemSelectShow: systemSelectShow,
    projectAddress: projectAddress,
    SYSTEMS:SYSTEMS,
    ClIENT_ID:ClIENT_ID,
    home:home,
    loginNavigation:loginNavigation,
    uploadFile:uploadFile,
    fileQuery:fileQuery,
    nowBusinessScenarios:nowBusinessScenarios,
    everySendNum: 10,//每次分批关联或者推送的单据数量
    pages: 10,
    pageSize: [10, 20, 30], // [20, 30, 50]
    status: 200,
    zipType: {
      zip: true,
      rar: true
    },
    excelType: {
      xls: true,
      xlsx: true
    },
    docType: {
      doc: true,
      docx: true
    },
    pdfType: {
      pdf: true,
      PDF: true
    },
    fileType: {
      pdf: true,
      PDF: true,
      jpg: true,
      jpeg: true,
      png: true,
      gif: true
    },
    imgType: {
      'image/jpg': true,
      'image/jpeg': true,
      'image/bmp': true,
      'image/png': true,
      'image/gif': true,
      'image/psd': true
    },
    fmoney: function (s, n) {
      var negative = false
      n = n > 0 && n <= 20 ? n : 2
      Number(s).toFixed(n)
      if (Number(s) < 0) {
        negative = true
        s = Math.abs(s)
      }
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
      let l = s.split('.')[0].split('').reverse()
      let r = s.split('.')[1]
      let t = ''
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
      }
      if (s === 0 || s === '0') {
        t += '.00'
        return t
      } else {
        if (!r) {
          r = ''
          for (var i = 0; i < n.length; i++) {
            r = r + '0'
          }
        }
        let sT = t.split('').reverse().join('') + '.' + r
        if (sT[1] === ',' && sT[0] === '-') {
          let arr = sT.split(sT[1])
          t = arr[0] + arr[1]
        } else {
          t = sT
        }
        if (negative) {
          t = '-' + t
        }
        return t
      }
    },
    handleSetTime (time) {
        if (time && (time.indexOf(' ') > -1)) {
          return time.split(' ')[0]
        } else if (time && (time.indexOf('T') > -1)) {
          return time.split('T')[0]
        } else {
          return time
        }
      },
    timeTransfer (value) {
      if (value === '' || value === undefined) return ''
      let values = new Date(value)
      var year = values.getFullYear()
      var month = values.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var date = values.getDate()
      if (date < 10) {
        date = '0' + date
      }
      return year + '-' + month + '-' + date
    },
    handleTimeTrans (val) { // 时间格式转时间戳
      if (val === '' || val === undefined) return ''
      let date = new Date(val.replace(/-/g, '/')).getTime()
      return date
    },
    // 业务类型
    "businessTypes": {
      FIRST_GOODS_AFTER_MONEY:'先货后款',
      FIRST_MONEY_AFTER_GOODS:'先款后货',
      FIRST_GOODS_AFTER_MONEY_PLEDGE_PURCHASE:'先货后款质押采购',
      FIRST_MONEY_AFTER_GOODS_PLEDGE_PURCHASE:'先款后或质押销售'
    },
    // 合同类型
    "cTypes": {
      SALE:'销售合同',
      PURCHASE:'采购合同',
      SALE_SINGLE_PARTY:'单方提交销售合同',
      PURCHASE_SINGLE_PARTY:'单方提交采购合同',
      SELLING:'采购订单',
      PURCHASE:'销售订单'
    },
    // 机构类型
    "corpTypes":{
      STATE_OWNED:'国有公司',
      PRIVATE:'私营企业',
      LIMITED_PARTNERSHIP:'合伙企业',
      COLLECTIVE:'集体所有制公司',
      JOINT_STOCK:'股份制公司',
      LIMITED_LIABILITY:'有限责任公司',
      OTHER:'其他'
    },
    //企业类型
    "orgTypes":{
      INCORPORATED:'法人企业',
      UNINCORPORATED:'非法人企业'
    },
    //身份证
    "legalPersIdTypes":{
      ID_CARD:'身份证'
    },
    // 角色类型
    "roleTypes":{
      PLATFORM:'平台',
      MERCHANT:'贸易商',
      FIN_INSTITUTION:'金融机构'
    },
    // 企业角色
    "businessRoleTypes": {
        SUPPLIER: "供应商",
        THIRD_PARTY_ENTERPRISE: "第三方企业",
        CORE_ENT: "核心企业"
    },
    //项目状态
    "projecType": {
      DRAFT: "草稿",
      RELEASE: "发布"
    },
    //企业项目申请状态
    "requestStatus":{
      REQUEST: "申请",
      CONFIRM: "通过",
      REJECT: "拒绝"
    },
    "dataType": {
        TRADECONTRACT: "合同",
        TRADEORDER: "订单",
        TRADESETTLEMENT: "结算单",
        TRADEPRESETTLEMENT: "单次结算单",
        TRADERECVGGOODS: "收货单",
        TRADEDLVRGOODS: "发货单",
        TRADEINVOICE: "发票",
        TRADELOGISTICS: "物流单",
        TRADEPONDERATION:  "过磅单",
        TRADECHECKAPPLY: "报检单",
        TRADEQUALITY: "质检单",
        TRADEWAREHOUSE: "库存单"
    },
    "dictionaryType": {
      contractType: 'SC-CONTERACT-TYPE', // 合同类型
      buzType: 'SC-BUSINESS-TYPE', // 业务类型
      orderType: 'SC-ORDER-TYPE', // 订单类型
      invoiceType: 'SC-INVOICE-TYPE', // 发票类型
      invoiceStatus: 'SC-INVOICE_STATUS', // 发票状态
      invoiceCheckStatus: 'SC-CHECK_STATUS', // 发票核验状态
      settlementType: 'SC-SETTLEMENT-TYPE', // 结算单类型,
      financeStatus:'SC-FINANCE-STATUS', // 是否已融资
      pounderationType: 'SC-PONDERATION-TYPE',//过磅单单据类型
      deliveryType: 'SC-DELIVERY-TYPE',//发货类型
      receiveType: 'SC-RECEIVE-TYPE',//收货类型
    }
  }
  