/* eslint-disable */

// const apiGateway = 'https://test.easy-sight.com/api';
// const currentApiUrl = "https://test.easy-sight.com/api/trade";//本系统对应企业的URL。https://test.easy-sight.com/api/trade   http://192.168.28.64:8091  https://test.easy-sight.com/api/tlyy/trade
// const uploadFile = 'https://test.easy-sight.com';//数据池文件预览
// // const invoiceUpload = 'https://test.easy-sight.com/api';//发票部分文件上传
// const fileQuery = "/tdp/0f307499499c478089f874edfe389957/network/a25eaecd3d6f4a35a4d163b0e9f69d9d/ledger/95d07aa9f7884212a9618f4d537ed998/v2.0/attachment";
// const nowBusinessScenarios = 'yjgf';
// const currentCssStyle = 'defaultStyle';//配置主题色模板

// const loginNavigation = "https://192.168.20.226/web/sso/#"//跳转到统一登录页面 "https://192.168.20.70/web/sso/#"
// const home = "http://192.168.28.126:8082/#/readme";//跳到本系统的首页;
// const ClIENT_ID = "94786734adc64e46a6b8281fbecb2539";//从认证中心获取此系统的ClIENT_ID 
// const SYSTEMS = ["trade"];//从认证中心获取此系统的名称
// const projectAddress = [{
//     "value": "https://test.easy-sight.com/web/trade/#/readme",
//     "label": "本系统"
//     },
//    {
//     "value": "https://test.easy-sight.com/web/trade-yjjt/#/readme",
//     "label": "系统2"
//    }]
const systemSelectShow = true;//下拉框系统切换显示就true，隐藏就false;
// const bucketName = 'file.ev-uos-default'
const bucketName = 'file.uos-test'

const apiGateway = 'https://test.easy-sight.com/api';
const uosUrl = apiGateway + '/uos'
const bizUrl = apiGateway + '/edoc'
const assetIdentification = '系统编号'
const absCommonApiUrl = apiGateway + '/abs-common'
// const apiGateway = 'https://192.168.20.70/api';
// const currentApiUrl = "http://192.168.28.69:8091";//本系统对应企业的URL。https://test.easy-sight.com/api/trade   http://192.168.28.64:8091  https://test.easy-sight.com/api/tlyy/trade
// const currentApiUrl = "https://test.easy-sight.com/api/tlyy/trade";//本系统对应企业的URL。https://test.easy-sight.com/api/trade   http://192.168.28.64:8091  https://test.easy-sight.com/api/tlyy/trade
// const currentApiUrl = "https://test.easy-sight.com/api/trade";//本系统对应企业的URL。https://test.easy-sight.com/api/trade   http://192.168.28.64:8091  https://test.easy-sight.com/api/tlyy/trade
const currentApiUrl = "http://192.168.28.76:8088"; //会玲本地的IP http://192.168.28.90:8091
const currentApiUrl3 = "http://192.168.28.90:9099"; //
const currentApiUrl2 = "http://192.168.28.76:8088"; //
// const uploadFile = 'https://test.easy-sight.com';//数据池文件预览
const uploadFile = 'https://192.168.20.70/api/baoli/tdp';//数据池文件预览
// const invoiceUpload = 'https://test.easy-sight.com/api';//发票部分文件上传
// const fileQuery = "/tdp/0f307499499c478089f874edfe389957/network/a25eaecd3d6f4a35a4d163b0e9f69d9d/ledger/95d07aa9f7884212a9618f4d537ed998/v2.0/attachment";
const fileQuery = "/tdp/024095e674224c99af67966ef72f53f3/network/cb79daf3705f4ec5b9d5750ef862cbe1/ledger/70b2cfa9d93c48408613694496df81a3/v2.0/attachment";
const nowBusinessScenarios = 'yjgf';
// const nowBusinessScenarios = 'rlhk';
// const nowBusinessScenarios = 'tlyy';
const currentCssStyle = 'defaultStyle';//配置主题色模板

// const loginNavigation = "https://192.168.20.70/web/sso/#"//跳转到统一登录页面
const loginNavigation = "https://192.168.20.226/web/sso/#"//跳转到统一登录页面
const home = "http://192.168.28.74:8081/#/readme";//跳到本系统的首页;
// const home = "http://localhost:8081/#/readme";//跳到本系统的首页;
const ClIENT_ID = "94786734adc64e46a6b8281fbecb2539";//从认证中心获取此系统的ClIENT_ID 
const SYSTEMS = ["trade"];//从认证中心获取此系统的名称
const projectAddress = [
   {
    "value": "http://localhost:8084/#/readme",
    "label": "本系统"
    },
   {
    "value": "http://localhost:8086/#/readme",
    "label": "系统2"
   }
]

//测试环境
// const apiGateway = 'https://test.easy-sight.com/api';
// const currentApiUrl = "https://test.easy-sight.com/api/trade";
// const uploadFile = 'https://test.easy-sight.com';
// const fileQuery = "/tdp/0f307499499c478089f874edfe389957/network/a25eaecd3d6f4a35a4d163b0e9f69d9d/ledger/95d07aa9f7884212a9618f4d537ed998/v2.0/attachment";
// const nowBusinessScenarios = 'yjjt';
// const currentCssStyle = 'defaultStyle';

// const loginNavigation = "https://test.easy-sight.com/web/sso/#"
// // const home = "http://test.easy-sight.com/web/trade/#/readme";
// const home = "http://localhost:8081/#/readme";
// const ClIENT_ID = "94786734adc64e46a6b8281fbecb2539";
// const SYSTEMS = ["trade"];
// const projectAddress = [{
//      "value": "http://localhost:8085/#/readme",
//    //   "value": "https://test.easy-sight.com/web/trade/#/readme",
//      "label": "股份系统1"
//      },
//     {
//    //   "value": "https://test.easy-sight.com/web/trade-yjjt/#/readme",
//      "value": "http://localhost:8086/#/readme",
//      "label": "股份系统2"
//     }]





// const apiGateway = 'https://test.easy-sight.com/api';
// const currentApiUrl = "https://test.easy-sight.com/api/hsyy/trade";
// const uploadFile = 'https://test.easy-sight.com';
// const fileQuery = "/tdp/7f5af4ba7dd4458e9118ae46e18bec05/network/a25eaecd3d6f4a35a4d163b0e9f69d9d/ledger/f6c9d6bd8458495585e9c3ee15243c73/v2.0/attachment";
// const nowBusinessScenarios = 'yjjt';
// const currentCssStyle = 'defaultStyle';

// const loginNavigation = "https://test.easy-sight.com/web/sso/#"
// // const home = "http://test.easy-sight.com/web/trade-yjjt/#/readme";
// const ClIENT_ID = "94786734adc64e46a6b8281fbecb2539";
// const SYSTEMS = ["trade"];
// // const systemSelectShow = true;//下拉框系统切换显示就true，隐藏就false;
// const projectAddress = [{
//     "value": "https://test.easy-sight.com/web/trade/#/readme",
//     "label": " 股份系统1"
//     },
//    {
//     "value": "https://test.easy-sight.com/web/trade-yjjt/#/readme",
//     "label": " 股份系统2"
//    }]
