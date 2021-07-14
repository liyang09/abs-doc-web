export default{
    // 贸易管理breadcrumbs
    tradeManagementBreadcrumbs:{
        "com.evisible.entity.base.common.entity.AssetEntity":['资产管理', '文档管理'],
        "TRADEDLVRGOODS":['贸易管理', '发货单管理'],
        "TRADERECVGGOODS":['贸易管理', '收货单管理'],
        "TRADESETTLEMENT":['贸易管理', '结算单管理'],
        "TRADEORDER":['贸易管理', '订单管理'],
        "TRADEINVOICE":['贸易管理', '发票管理'],
        "TRADEPONDERATION":['贸易管理', '过磅单管理'],
        "TRADEQUALITY":['贸易管理', '质检单管理'],
        "TRADESUPPLIER":['贸易管理', '供应商管理'],
        "TRADEAVIATIONSERVICEFEE":['贸易管理', '航空服务费管理'],
        "TRADEAVIATIONOILDATA":['贸易管理', '航油数据管理'],
        "TRADEEAGLECOINTRANSACTION":['贸易管理', '山鹰币数据管理'],
        "TRADETICKETSALES":['贸易管理', '机票销售管理'],
        "TRADEWAREHOUSE":['贸易管理', '库存单管理'],
        "TRADELOGISTICS":['贸易管理', '物流单管理'],
        "TRADECHECKAPPLY":['贸易管理', '报检单管理'],
        "TRADEPRESETTLEMENT":['贸易管理', '单次结算单管理']
    },
    // 授权数据breadcrumbs
    dataAuthorizeBreadcrumbs:{
        "TRADEDLVRGOODS":['授权数据', '发货单管理'],
        'TRADECONTRACT':['授权数据', '合同管理'],
        "TRADERECVGGOODS":['授权数据', '收货单管理'],
        "TRADESETTLEMENT":['授权数据', '结算单管理'],
        "TRADEORDER":['授权数据', '订单管理'],
        "TRADEINVOICE":['授权数据', '发票管理'],
        "TRADEPONDERATION":['授权数据', '过磅单管理'],
        "TRADEQUALITY":['授权数据', '质检单管理'],
        "TRADESUPPLIER":['授权数据', '供应商管理'],
        "TRADEAVIATIONSERVICEFEE":['授权数据', '航空服务费管理'],
        "TRADEAVIATIONOILDATA":['授权数据', '航油数据管理'],
        "TRADEEAGLECOINTRANSACTION":['授权数据', '山鹰币数据管理'],
        "TRADETICKETSALES":['授权数据', '机票销售管理'],
        "TRADEWAREHOUSE":['授权数据', '库存单管理'],
        "TRADELOGISTICS":['授权数据', '物流单管理'],
        "TRADECHECKAPPLY":['授权数据', '报检单管理'],
        "TRADEPRESETTLEMENT":['授权数据', '单次结算单管理']
    },
    // 查询条件
    queryTerms:{
        "TRADEDLVRGOODS":{
            "entityNo":"发货单单号",
            "name":"发货单名称"
        },
        "TRADECONTRACT":{
            "orgName":" 买方或卖方企业名称",
            "entityNo":"合同编号",
            "name":"合同名称",
            "TradeContract_amount":"合同金额区间",
            "TradeContract_signingDate":"合同签署时间区间"
        },
        "TRADERECVGGOODS":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"收货单单号",
            "TradeRecvgGoods_drDate":"收货日期",
            "TradeRecvgGoods_createTime":"创建日期"
        },
        "TRADESETTLEMENT":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"结算单单号",
            "name":"结算单名称",
            "TradeContract_amount":"结算单总金额区间",
            "TradeSettlement_settleDate":"结算日期区间"
        },
        "TRADEORDER":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"订单单号"
        },
        "TRADEINVOICE":{
            "entityNo":"发票代码",
            "fphm":"发票号码"
        },
        "TRADEPONDERATION":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"过磅单编号",
            "TradePonderation_weighingDate":"过磅日期区间"
        },
        "TRADEQUALITY":{
            "orgName":"买方或卖方企业名称",
            "batch":"校验批次",
            "TradeQuality_qualityDate":"质检日期区间"
        },
        "TRADESUPPLIER":{
            "entityNo":"供货商编号",
            "orgName":"供货商名称"
        },
        "TRADEAVIATIONSERVICEFEE":{
            "flightNumber":"航班号",
            "airplaneNumber":"飞机号"
        },
        "TRADEAVIATIONOILDATA":{
            "flightNumber":"航班号",
            "airplaneNumber":"飞机号"
        },
        "TRADEEAGLECOINTRANSACTION":{
            "buyerName":"代理人名称"
        },
        "TRADETICKETSALES":{
            "orgName":"代理人名称"
        },
        "TRADEWAREHOUSE":{
            "warehouseName":"仓库名称",
            "orgName":"买方或卖方企业名称"
        },
        "TRADELOGISTICS":{
            "name":"物流单名称",
        },
        "TRADECHECKAPPLY":{
            "name":"报检单名称",
        },
        "TRADEPRESETTLEMENT":{
            "entityNo":"单次结算单单号",
            "name":"单次结算单名称"
        },
    },
    // 排序条件
    sortTerms:{
        "TRADEDLVRGOODS":{
            "entityNo":"发货单单号",
            "name":"发货单名称"
        },
        "TRADECONTRACT":{
            "orgName":" 买方或卖方企业名称",
            "entityNo":"合同编号",
            "name":"合同名称",
            "TradeContract_amount":"合同金额区间",
            "TradeContract_signingDate":"合同签署时间区间"
        },
        "TRADERECVGGOODS":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"收货单单号",
            "TradeRecvgGoods_drDate":"收货日期",
            "TradeRecvgGoods_createTime":"创建日期"
        },
        "TRADESETTLEMENT":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"结算单单号",
            "name":"结算单名称",
            "TradeContract_amount":"结算单总金额区间",
            "TradeSettlement_settleDate":"结算日期区间"
        },
        "TRADEORDER":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"订单单号"
        },
        "TRADEINVOICE":{
            "entityNo":"发票代码",
            "fphm":"发票号码"
        },
        "TRADEPONDERATION":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"过磅单编号",
            "TradePonderation_weighingDate":"过磅日期区间"
        },
        "TRADEQUALITY":{
            "orgName":"买方或卖方企业名称",
            "batch":"校验批次",
            "TradeQuality_qualityDate":"质检日期区间"
        },
        "TRADESUPPLIER":{
            "entityNo":"供货商编号",
            "orgName":"供货商名称"
        },
        "TRADEAVIATIONSERVICEFEE":{
            "flightNumber":"航班号",
            "airplaneNumber":"飞机号"
        },
        "TRADEAVIATIONOILDATA":{
            "flightNumber":"航班号",
            "airplaneNumber":"飞机号"
        },
        "TRADEEAGLECOINTRANSACTION":{
            "buyerName":"代理人名称"
        },
        "TRADETICKETSALES":{
            "orgName":"代理人名称"
        },
        "TRADEWAREHOUSE":{
            "warehouseName":"仓库名称",
            "orgName":"买方或卖方企业名称"
        },
        "TRADELOGISTICS":{
            "name":"物流单名称",
        },
        "TRADECHECKAPPLY":{
            "name":"报检单名称",
        },
        "TRADEPRESETTLEMENT":{
            "entityNo":"单次结算单单号",
            "name":"单次结算单名称"
        },
    },
    // 表格展示列
    tableHeader:{
        "setting": {
            fieldCnName: '字段名称',
            fieldEnName: '字段英文',
            fieldType: '字段类型',
            ifSort: '是否排序',
            ifQuery: '是否查询',
            ifEdit: '是否编辑',
            portalTypeVisible: '其它系统前端可见',
            listVisible: '本系统前端可见'
            // portals: '是否前端可见2'
        },
        "TRADEDLVRGOODS":{
            name: "发货单名称",
            entityNo: "发货单单号",
            amount: "发货单总金额",
            seller: "卖方名称",
            buyer: "买方名称",
            recvgStatus: "收货状态",
            drDate: "发货日期"
        },
        "TRADECONTRACT": {
            name: "合同名称",
            entityNo: "合同编号",
            contractContent: "合同内容",
            businessType: "业务类型",
            cType: "合同类型",
            buyer: "买方",
            seller: "卖方",
            amount: "合同金额(元)",
            signingDate: "合同签署时间",
            startDate: "合同生效日期",
            endDate: "合同到期日期"
        },
        "TRADERECVGGOODS":{
            entityNo: "收货单单号",
            buyer: "买方名称",
            seller: "卖方名称",
            createTime: '创建日期',
            drDate: "收货日期",
            amount: "收货单总金额",
        },
        "TRADESETTLEMENT":{
            entityNo: "结算单单号",
            name: "结算单名称",
            buyer: "买方",
            seller: "卖方",
            settlePrice: "结算单价",
            totalAmount: "结算单总金额",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            settleDate: "结算日期",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
        },
        "TRADEORDER":{
            name: "订单名称",
            entityNo: "订单单号",
            amount: "订单金额",
            buyer: "买方名称",
            seller: "卖方名称",
            createTime: "订单创建日期",
            startDate: "订单发起日期",
            goodsHead:{
                title: "商品信息",
                children: {
                    skuId: "货品编号",
                    goodsName: "货品名称",
                    remarks: "货品描述",
                    spec: "商品规格",
                    quantity: "数量",
                    unit: "单位",
                    manufacturer: "制造商",
                    unitPrice: "单价",
                    taxRate: "税率(%)",
                }
            }
        },
        "TRADEINVOICE":{
            fpdm: "发票代码",
            fphm: "发票号码",
            code: "发票校验码",
            kprq: "开票日期",
            num: "发票机器码",
            taxamount: "税额合计",
            goodsamount: "价格合计",
            sumamount: "价税合计",
            quantityAmount: "数量合计",
            checkStatus: "状态",
            updateTime: "更新时间"
        },
        "TRADELOGISTICS": {
            logisticsNo: "物流单号",
            name: "物流名称",
            carCode: "车牌号",
            driver: "司机",
            mobile: "手机号",
            idCard: "身份证号",
            quantity: "数量",
            unit: "单位",
            tyBill: "承运单号",
            isused: "状态", //8 作废 , 0未处理，1 LE已同步，2 已验证取卡，3已进厂，9 已二次过磅，10已出厂
            resourceType: "", //来源，0为销售出货，1为采购送货
            remarks: "备注",
            createTime: "创建日期",
            lastUpdateTime: "更新日期",
        },
        "TRADECHECKAPPLY": {
            checkApplyNo: "报检单单号",
            name: "报检单名称",
            quantity: "报检数量",
            applyDept: "报检部门",
            supplier: "供应商",
            applyDate: "报检日期",
            belongGroup: "所属集团",
            sampleWay: "取样方式",
            review: "复检",
            type: "报检类型",
            rejectReason: "拒收原因",
            details: "报检详情",
            unit: "单位",
            remarks: "备注",
        },
        "TRADEPRESETTLEMENT": {
            settlementNo: "单次结算单单号",
            name: "单次结算单名称",
            settlePrice: "结算单价",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            // type: "类型",
            settleCompany: "结算单位",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
            settleDate: "结算日期",
            buyer: "买方",
            seller: "卖方",
        },
        "TRADEPONDERATION":{
            entityNo: "过磅单编号",
            name:"过磅单名称",
            buyer: "买方",
            seller: "卖方",
            carPlateNumber: "车牌号",
            driver: "司机名称",
            netWeight: "净重",
            weighingDate: "过磅日期"
        },
        "TRADEQUALITY":{
            inspectionBatch: "校验批次",
            remarks: "备注",
            qualityDate:'质检日期',
            buyer: "买方",
            seller: "卖方"
        },
        "TRADESUPPLIER":{
            entityNo:"供应商编号",
            seller: "供应商名称",
            supplierSh: "供应商税号",
            supplierAddr: "供应商地址",
            contractUser: "联系人",
            telPhone: "联系人电话",
            email: "联系人邮箱",
            remarks: "备注"
        },
        "TRADEAVIATIONSERVICEFEE":{
            flightNumber: "航班号",
            airplaneNumber: "飞机号",
            passage: "航段",
            airportServiceFee: "机场服务费",
            civilAviationDevelopmentFund: "民航发展基金",
            serviceDate: "日期"
        },
        "TRADEAVIATIONOILDATA":{
            lightNumber: "航班号",
            airplaneNumber: "飞机号",
            passage: "航段",
            fuelAmount: "加油量",
            unit: "单位",
            unitPrice: "单价",
            money2: "金额",
            flightDate: "航班日期"
        },
        "TRADEEAGLECOINTRANSACTION":{
            agentName: "代理人名称",
            accountingTime: "入账时间",
            changeMoney2: "变动金额",
            balance2: "余额"
        },
        "TRADETICKETSALES":{
            agentName: "代理人名称",
            daySaleAmount: "日销售数量",
            daySaleMoney2: "日销售金额",
            dayRefundsAmount: "日退票数量",
            dayRefundsMoney2: "日退票金额",
            saleDate: "销售日期"
        },
        "TRADEWAREHOUSE":{
            buyer: "公司名称",
            warehouseName: "仓库名称",
            seller: "供应商明细",
            checkDate: "盘点日期",
            goodsHead:{
                title: "商品信息",
                children: {
                    skuId: "货品编号",
                    goodsName: "货品名称",
                    remarks: "货品描述",
                    spec: "商品规格",
                    quantity: "数量",
                    unit: "单位",
                    manufacturer: "制造商",
                    unitPrice: "单价",
                    taxRate: "税率(%)",
                    totalAmount: "合计(元)"
                }
            }
        }
    },
    // 添加表单时需要的字段
    addFormItem:{
        "TRADECONTRACT":{
            type:"合同类型",
            myRoles:"我方角色",
            buzType:"业务类型",
            entityNo:"合同编号",
            name:"合同名称",
            clientName:"客户名称",
            amount:"合同金额",
            signingDate:"合同签署时间",
            startDate:"合同约定生效时间",
            endDate:"合同约定到期时间",
            contractContent:"合同内容",
            remarks:"备注"
        },
        "TRADEDLVRGOODS":{
            name: "发货单名称",
            entityNo: "发货单单号",
            operator: "出货单操作人",
            amount: "发货单总金额",
            myRoles: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            drDate: "发货日期",
            unloadAddress: "下货地址",
            sellerAddress: "买家地址",
            buyerAddress: "卖家地址",
            buyerTel: "买家电话",
            sellerTel: "卖家电话",
            detailEntry:''
        },
        "TRADERECVGGOODS":{
            name: "收货单名称",
            entityNo: "收货单单号",
            operator: "出货单操作人",
            amount: "收货单总金额",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            drDate: "收货日期",
            unloadAddress: "下货地址",
            sellerAddress: "买家地址",
            buyerAddress: "卖家地址",
            buyerTel: "买家电话",
            sellerTel: "卖家电话",
            detailEntry: "明细录入"
        },
        "TRADESETTLEMENT":{
            entityNo: "结算单单号",
            name: "结算单名称",
            settlePrice: "结算单价",
            totalAmount: "结算单总金额",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
            settleDate: "结算日期",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            settleCompany: "结算单位",
            detailEntry: "明细录入",
        },
        "TRADEORDER":{
            name: "订单名称",
            entityNo: "订单单号",
            deliveryType: "订单类型",
            amount: "订单金额",
            myRoles: "我方角色",
            buyer: "买方名称",
            orderAddress: "订单地址",
            unloadAddress: "下货地址",
            seller: "卖方名称",
            clientName: "客户名称",
            startDate: "订单发起日期",
            endDate: "订单结束日期",
            inputDate: "订单录入日期",
            remarks: "备注",
            detailEntry:''
        },
        "TRADEINVOICE": {
            invoiceNo: "发票单号",
            fpdm: "发票代码",
            fplx: "发票类型",
            fphm: "发票号码",
            kprq: "开票日期",
            xfMc: "销售方名称",
            xfNsrsbh: "销售方纳税人识别号",
            xfContact: "销售方联系方式",
            xfBank: "销售方开户行",
            gfMc: "购方名称",
            gfNsrsbh: "购方纳税人识别号",
            gfContact: "购方联系方式",
            gfBank: "购方开户行",
            code: "发票校验码",
            num: "发票机器码",
            // del: "是否作废",
            taxamount: "税额合计",
            goodsamount: "价格合计",
            sumamount: "价税合计",
            quantityAmount: "数量合计",
            queryCount: "税局查验次数",
        },
        "TRADEPONDERATION": {
            name: "过磅单名称",
            ponderationNo: "过磅单单号",
            carPlateNumber: "车牌号",
            driver: "驾驶员",
            roughWeight: "毛重",
            tareWeight: "皮重",
            suttleWeight: "净重",
            measureUnit: "计量单位",
            measureWay: "计量方式",
            netWeight: "总净重",
            type: "类型",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            startDate: "货品明细中过磅最早日期",
            endDate: "货品明细中过磅最晚日期",
            remarks: "备注",
        },
        "TRADEQUALITY": {
            qualityNo: "收货质检编号",
            name: "质检单名称",
            qualityGrade: "质量等级",
            inspectionItem: "核验项目",
            checkApplyNumber: "报检数量",
            inspectionNumber: "核验数量",
            reachNumber: "合格数量",
            reachRate: "合格率",
            inspectionBatch: "核验批次",
            institute: "质检机构",
            type: "类型",
            myRoleType: "我方角色",
            seller: "买方",
            buyer: "卖方",
            startDate: "质检开始日期",
            endDate: "质检结束日期",
            remarks: "备注",
        },
        "TRADELOGISTICS": {
            logisticsNo: "物流编号",
            name: "物流名称",
            carCode: "车牌号",
            driver: "司机",
            mobile: "手机号",
            idCard: "身份证号",
            quantity: "数量",
            unit: "单位",
            isused: "状态", //8 作废 , 0未处理，1 LE已同步，2 已验证取卡，3已进厂，9 已二次过磅，10已出厂
            tyBill: "承运单号",
            resourceType: "来源", //来源，0为销售出货，1为采购送货
            remarks: "备注"
        },
        "TRADECHECKAPPLY": {
            name: "报检单名称",
            checkApplyNo: "报检编号",
            belongGroup: "所属集团",
            sampleWay: "取样方式",
            review: "复检",
            type: "报检类型",
            unit: "单位",
            applyDate: "报检日期",
            quantity: "报检数量",
            applyDept: "报检部门",
            supplier: "供应商",
            rejectReason: "拒收原因",
            details: "报检详情",
            remarks: "备注",
        },
        "TRADEPRESETTLEMENT": {
            settlementNo: "单次结算单号",
            name: "单次结算单名称",
            amount: "单次结算单总金额",
            settlePrice: "结算单价",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            settleCompany: "结算单位",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
            settleDate: "结算日期",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            detailEntry: "明细录入",
        },
    },
    // 详情
    detailsGoodsTableHeader:{
        "TRADEDLVRGOODS":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            quantity: "发货数量",
            receiveTotalAmount: "收货金额",
            quantity: "收货数量",
            totalAmount: "发货金额"
        },
        "TRADERECVGGOODS":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)",
        },
        "TRADESETTLEMENT":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)",
        },
        "TRADEORDER":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)"
        },
        "TRADECHECKAPPLY": {
            fkpkApplyBill:"报检单单号",
            pkApplyBillS:"报检单明细单号",
            mxCastUnitId:"单位",
            mxCUnitId:"单位",
            pkMaterial:"物料名称",
        },
        "TRADEPRESETTLEMENT": {
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)",
        }
    }
}