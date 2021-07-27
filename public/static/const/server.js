/* eslint-disable */

const apiGateway = 'https://test.easy-sight.com/api';
const uosUrl = apiGateway + '/uos'
const bizUrl = apiGateway + '/edoc'
const assetIdentification = '系统编号'
const currentApiUrl = "http://192.168.28.90:9099";//会玲本地http://192.168.28.90:9099
const uploadFile = 'https://test.easy-sight.com';//数据池文件预览 // 'https://192.168.20.70/api/baoli/tdp'
const fileQuery = "/tdp/024095e674224c99af67966ef72f53f3/network/cb79daf3705f4ec5b9d5750ef862cbe1/ledger/70b2cfa9d93c48408613694496df81a3/v2.0/attachment";
const nowBusinessScenarios = 'yjgf';
const currentCssStyle = 'defaultStyle';//配置主题色模板
const loginNavigation = "https://192.168.20.226/web/sso/#"// 跳转到统一登录页面 https://192.168.20.70/web/sso/#
const home = "http://localhost:8082/#/readme";//跳到本系统的首页;
const ClIENT_ID = "94786734adc64e46a6b8281fbecb2539";//从认证中心获取此系统的ClIENT_ID 
// const SYSTEMS = ["trade"];//从认证中心获取此系统的名称
const SYSTEMS = ["ev-doc-thbl"];//从认证中心获取此系统的名称
const projectAddress = [{
    "value": "https://test.easy-sight.com/web/trade/#/readme",
    "label": " 股份系统1"
    },
   {
    "value": "https://test.easy-sight.com/web/trade-yjjt/#/readme",
    "label": " 股份系统2"
   }]
const systemSelectShow = false;//下拉框系统切换显示就true，隐藏就false;
const bucketName = 'file.uos-test' // file.uos-test     file.ev-uos-default
const crediturl = apiGateway + '/evisible-credit'
const zhongdeng = apiGateway + '/zhongdeng'
const zhongdengUploadUrl = apiGateway + '/files'

