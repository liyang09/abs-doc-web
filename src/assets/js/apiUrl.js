
/* eslint-disable */
export let apiUrl = {
    tokenRefresh:apiGateway + '/auth/api/v1.0/token/refresh/v2',//获取最新的token用户信息
    loginUrl: apiGateway + '/auth/api/v1.0/token/new',
    assetQuery:currentApiUrl + '/asset/query',//合同查询
    orguserList:apiGateway + '/orguser/org/v1.0/list',//获取企业列表
    orguserDetail:apiGateway + '/orguser/org/v1.0/detail/',//根据id去查询详情
    fileQuery:apiGateway + '/files/file/query/',//文件预览
    fileUpload:apiGateway + '/files/file/upload',//文件上传
    uploadFileApi:uploadFile + fileQuery,//文件上传
    businessAuthorize:currentApiUrl,//企业授权
    assetAuth:currentApiUrl+ '/auth/to/',//资产授权
    cancelAuth:currentApiUrl+ '/auth/cancelAuth',//取消企业授权
    // tradeAuthQuery:currentApiUrl+ '/auth/query',//已授权企业查询
    tradeAuthQuery:currentApiUrl+ '/auth/queryToOrg',//已授权企业查询
    getOrgInfoByOrgId:currentApiUrl + '/org-info/getOrgInfoByOrgId/' , //根据orgId查询企业
    querySettlementByContract:currentApiUrl + '/asset/querySettlementByContract',//根据合同查询结算单
    pushFullAssetPackage:currentApiUrl + '/asset/pushFullAssetPackage',//合同下的结算单推送
    getAssetGraphUuid:currentApiUrl + '/graph/pattern-graph/asset-graph-uuid/',//获取patterenGraphUuid
    loadStreamAssets:currentApiUrl + '/graph/loadStreamAssets/',//跨节点查询
    getUpStreamAllAssetType:currentApiUrl +　'/graph/getUpStreamAllAssetType/',//获取上游资产类型
    getDownStreamAllAssetType:currentApiUrl + '/graph/getDownStreamAllAssetType/',//获取下游资产类型
    queryUpNoRelatedAssets:currentApiUrl +'/asset/patternGraph/',//获取上游资产
    queryDownNoRelatedAssets:currentApiUrl + '/asset/patternGraph/',//获取下游资产
    loadUpStreamAssets:currentApiUrl + '/graph/loadUpStreamAssets',//追溯上级节点资产
    loadDownStreamAssets:currentApiUrl + '/graph/loadDownStreamAssets',//追溯下级节点资产
    loadUpStreamEntityUuids:currentApiUrl + '/graph/loadUpStreamEntityUuids',//追溯上级节点资产ID
    loadDownStreamEntityUuids:currentApiUrl + '/graph/loadDownStreamEntityUuids',//追溯下级节点资产ID
    queryAssetsById:currentApiUrl + '/graph/',//根据UUID去查询详情
    addAttach:currentApiUrl +　'/asset/asset-type/',//附件修改
    queryAssetNoGraph: currentApiUrl+ '/asset/patternGraph/queryAssetNoGraph',
    assetStart: currentApiUrl + '/asset', // 以asset开头的接口
    assetNodeStart: currentApiUrl + '/asset/patternGraph/node/', // 新的接口 查询上下游未关联资产
    assetGraphStart: currentApiUrl + '/graph/asset-graph', // 以asset开头的接口
    assetGraphStart2: currentApiUrl + '/asset/asset-graph', // 以asset开头的接口
    assetConnectStart: currentApiUrl + '/graph/asset-connect', // 以asset开头的接口
    saveAsset2:currentApiUrl + "/asset/saveAsset",//添加保存
    queryBusiness:currentApiUrl + '/org-info/query',//企业查询
    deleteBusiness:currentApiUrl + '/org-info/delete',//删除企业
    saveBusiness:currentApiUrl + '/org-info/save',//添加企业
    updateBusiness:currentApiUrl +　'/org-info/update',//更新企业
    getStatistic:currentApiUrl + '/asset/statistic',//首页获取统计数据
    // confirmRecvgGoods:currentApiUrl + '/asset/confirmRecvgGoods/by',//单条确认收货
    // confirmRecvgGoodsByBatch:currentApiUrl + '/asset/confirmRecvgGoodsByBatch',//批量确认收货
    getPatternGraphInfos:currentApiUrl + '/graph/pattern-graph-infos/get',//获取业务类型  会玲提供的接口，前面增加了graph.
    createAssetGraph:currentApiUrl + '/graph/asset-graph/create',//创建   会玲提供的，前面增加了一个graph。
    updateAsset:currentApiUrl +　'/asset/updateAsset',//编辑合同
    sumTotalAmount:currentApiUrl + '/asset/sumTotalAmount',//查询总额
    queryEagleCoinListBySettlement:currentApiUrl + '/asset/queryEagleCoinListBySettlement/',//根据结算单查询山鹰币
    queryAuthAsset: currentApiUrl + '/auth/authAssetQuery', //授权数据列表查询
    dictionary: {
        allList: currentApiUrl + '/config/dictionary/all/list', //字典所有枚举
        codeList: currentApiUrl + '/config/dictionary/code/list', //根据字典code查询
    },
    attributeConfig:{
        query: currentApiUrl +　'/config/attribute-config/table/list/by/table-name',//根据表明获取属性列表
    },
    queryRootAssetTypeByGraphUuid:currentApiUrl + '/asset/queryRootAssetTypeByGraphUuid/',//根据业务图UUID查询资产类型
    queryPushAssetList:currentApiUrl + '/asset/queryPushAssetList/',//根据合同查询结算单
    confirmRecvgGoods:currentApiUrl + '/asset/wanderDocument/by/',//会玲提供的最新 单条确认收货
    confirmRecvgGoodsByBatch:currentApiUrl + '/asset/wanderDocumentList',//会玲提供的最新 批量确认收货
    tableConfigName:currentApiUrl + '/config/attribute-config/table/list/by/table-name',//根据属性表明查询展示的字段
    tableConfigName2:currentApiUrl + '/graph/pattern-node-types/getByName',//根据属性表明查询展示的字段
    tableConfigName3:currentApiUrl + '/asset/pattern-node-type/get/asset-type-name',//根据属性表明查询展示的字段
    queryAggregation:currentApiUrl  + '/asset/queryAggregation',//聚合查询总结算单金额和总净重
    exportDataToExcel:currentApiUrl + '/file/exportDataToExcel',
    exportDataToExcel2:currentApiUrl2 + '/asset/exportDataByAttributeToExcel',//文件导出
    invoiceUpload:apiGateway + '/files/file/upload/single',//发票部分文件上传
    saveAssetInvoice:currentApiUrl +　'/asset/invoice-save',//发票部分保存
    batchSaveAsset:currentApiUrl + '/asset/invoice-imgs',//发票批量保存
    invoiceArtificial:currentApiUrl +　'/asset/invoice-artificial',//核验通过
    invoiceCancel:currentApiUrl +　'/asset/invoice-cancel',//废弃
    getAssetRecvg:currentApiUrl + '/asset-action/getAssetRecvg',//查询发货单是否可以收货

    //文档管理原来的接口
    assetUrl: apiGateway + '/asset-config',

    //文档管理新的接口
    tableAssetName:currentApiUrl + '/asset/attribute-config/table/list',//配置查询
    assetAdd:currentApiUrl + '/asset/attribute-config/adds',//设置里面的保存
    docAdd:currentApiUrl + '/config/attribute-config/edit',//设置文档里面的保存
    tablefile:currentApiUrl + '/asset/attribute-config/table/file',//文档查询
    auditSubmit:currentApiUrl + '/asset/audit',//提交审核
    //项目管理（合作公司）接口
    projectUrl:currentApiUrl + '/project/query', // 项目管理查询
    editUrl:currentApiUrl + '/project/edit', // 编辑
    deleatUrl:currentApiUrl + '/project/delete', // 删除
    createdUrl:currentApiUrl + '/project/created', // 创建
    releaseUrl:currentApiUrl + '/project/release', // 发布
    edocUrl: bizUrl, //合作公司查询
    crediturl: crediturl, //企业查询
    zhongdeng:zhongdeng, // 重登
    zhongdengUploadUrl:zhongdengUploadUrl,
    applyUrl:currentApiUrl+ '/project/audit/application', // 项目管理审批
    requestUrl:currentApiUrl+ '/project/queryRequestApprovalPending', // 项目管理申请审批
    queryProject:currentApiUrl+'/project/queryProject', // 项目申请
    projectRequest:currentApiUrl+'/project/projectRequest',
    factoringAddOrg:currentApiUrl+'/project/factoringAddOrg', //新增项目合作公司
    absCommonApiUrl:apiGateway + '/abs-common',
    queryCompany:currentApiUrl+'/asset/query'
}
