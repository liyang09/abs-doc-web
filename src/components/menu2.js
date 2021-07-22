export default [
    {
        "icon": "el-icon-s-home",
        "index": "/readme",
        "title": "首页",
        "subs": []
    },
    {
        "icon": "el-icon-s-management",
        "index": "/company",
        "title": "合作公司",
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
]
