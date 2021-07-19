export default [
    {
        "icon": "el-icon-s-home",
        "index": "/readme",
        "title": "首页",
        "subs": []
    }, 
    {
        "icon": "el-icon-search",
        "index": "21",
        "title": "资料管理",
        "subs": [
            {
                "index": "/commonAsset2/com.evisible.entity.base.common.entity.AssetEntity",
                "title": "文档管理",
                "subs": [],
                "billType": "order",
                // "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'yndl', 'kggm', 'inspur', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/commonAsset/com.evisible.entity.base.common.entity.AssetEntity",
                "title": "审核查询",
                "subs": [],
                "billType": "order",
                // "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'yndl', 'kggm', 'inspur', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
        ]
    },
    {
        "icon": "el-icon-s-tools",
        "index": "/setting",
        "title": "设置",
        "subs": []
    }, 
    // {
    //     "icon": "el-icon-menu",
    //     "index": "11",
    //     "title": "企业管理",
    //     "subs": [
    //         {
    //             "icon": "el-icon-s-order",
    //             "index": "/wareHouseInformation",
    //             "title": "企业信息",
    //         },
    //         {
    //             "icon": "el-icon-s-order",
    //             "index": "/authorization",
    //             "title": "企业授权",
    //             "userRole": ["EM"], // 企业管理员
    //             "authRole": ['CORE_ENT'],
    //             "enterprise": ['ems', 'hsyy','jhyy', 'zhyy','tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'yndl', 'bohai', 'kggm', 'mlf', 'yjjt']
    //         },
    //         {
    //             "index": "/orgRolesManage",
    //             "title": "添加企业",
    //             "userRole": ["EM"], // 企业管理员
    //             "authRole": ['CORE_ENT'],
    //             "enterprise": ['ems', 'hsyy','jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'yndl', 'bohai', 'kggm', 'yjjt']
    //         }
    //     ]
    // },
    // {
    //     "icon": "el-icon-search",
    //     "index": "12",
    //     "title": "贸易管理",
    //     "subs": [
    //         // {
    //         //     "index": "/commonAsset/TRADESUPPLIER",
    //         //     "title": "供应商管理",
    //         //     "subs": [],
    //         //     "enterprise": ['yndl'],
    //         //     "authRole": ['CORE_ENT', 'SUPPLIER']
    //         // },
    //         {
    //             "index": "/contractQuery",
    //             "title": "合同管理",
    //             "billType": "contract",
    //             "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'kggm', 'xydc', 'mlf', 'yjjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEORDER",
    //             "title": "订单管理",
    //             "subs": [],
    //             "billType": "order",
    //             "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'yndl', 'kggm', 'inspur', 'mlf'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         }, 
    //         {
    //             "index": "/commonAsset/TRADEINVOICE",
    //             "title": "发票管理",
    //             "subs": [],
    //             "billType": "invoice",
    //             "enterprise": ['tyjt', 'ycdl', 'inspur', 'mlf', 'yjgf'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEDLVRGOODS",
    //             "title": "发货单管理",
    //             "subs": [],
    //             "enterprise": ['hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'mlf'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADERECVGGOODS",
    //             "title": "收货单管理",
    //             "subs": [],
    //             "enterprise": ['hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'yndl', 'kggm', 'mlf'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADESETTLEMENT",
    //             "title": "结算单管理",
    //             "subs": [],
    //             "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'yndl', 'kggm', 'mlf', 'yjjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEAVIATIONSERVICEFEE",
    //             "title": "航空服务费管理",
    //             "subs": [],
    //             "enterprise": ['rlhk'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEAVIATIONOILDATA",
    //             "title": "航油数据管理",
    //             "subs": [],
    //             "enterprise": ['rlhk'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEEAGLECOINTRANSACTION",
    //             "title": "山鹰币数据管理",
    //             "subs": [],
    //             "enterprise": ['rlhk'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADETICKETSALES",
    //             "title": "机票销售管理",
    //             "subs": [],
    //             "enterprise": ['rlhk'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEQUALITY",
    //             "title": "质检单管理",
    //             "subs": [],
    //             "enterprise": ['tyjt', 'yjgf', 'yjjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEPONDERATION",
    //             "title": "过磅单管理",
    //             "subs": [],
    //             "enterprise": ['tyjt', 'yjgf', 'yth', 'yjjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEWAREHOUSE",
    //             "title": "库存单管理",
    //             "subs": [],
    //             "enterprise": ['tyjt', 'yndl'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADELOGISTICS",
    //             "title": "物流单管理",
    //             "subs": [],
    //             "enterprise": ['tyjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADECHECKAPPLY",
    //             "title": "报检单管理",
    //             "subs": [],
    //             "enterprise": ['tyjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //         {
    //             "index": "/commonAsset/TRADEPRESETTLEMENT",
    //             "title": "单次结算单管理",
    //             "subs": [],
    //             "enterprise": ['ems', 'tyjt'],
    //             "authRole": ['CORE_ENT', 'SUPPLIER']
    //         },
    //     ]
    // },
]
