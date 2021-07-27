/* eslint-disable */
import { MessageBox } from 'element-ui';
export default {
  imgUrl: {
    empty: 'data:image/png;base64,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',
    folder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA5ElEQVRIS+2SOwrCUBBF732Jn8ZeRHchFoLRTtyIO7B1AS7BpQg2ClobEBeQgKXYaGMyEhAEP+g8IY0vZTJnTnLyKGtvkEKmIqjjxUUihWAHmrkpVMZsHo6v5r69x2RtoneyxyUkYuOV2mydo28FTzsuKyM6mDO/nfR1zH2aeiHgFcs1Nk97GyllEyi/0EYDgIwBDPMTZu9JxvkKM2duSW9/wgktj+R7zCV1SdUF3KFRJ/sEuKSfCqmf/0PSMEggMOo2NgCRUsLuAiIdG17NkEvKtldFIiMADfUCHRCB/oQ65vfpK9BZb11zLEpYAAAAAElFTkSuQmCC',
    plus: 'data:image/png;base64,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',
    upload: `data:image/png;base64,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`,
    companyEmpty: 'data:image/png;base64,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',
  },
  toLowerCase(assetType) {
    var lastStr = assetType.slice(6,assetType.length).toLowerCase();
    var entityType = 'Trade' + assetType.slice(5,6) +　lastStr;
    return entityType;
  },
  //messageBox警告提示
  warningMesBox(message){
    MessageBox.alert(message,'提示');
  },
  concateUrl(url1, url2){
      if(!url1 || !url1.length || url1.length == 0 || url1.trim().length == 0){
          return url2;
      }else if(!url2|| !url2.length || url2.length == 0 || url2.trim().length == 0){
          return url1;
      }else{
          url1 = url1.trim();
          url2 = url2.trim();
          if(url1[url1.length -1] == '/' && url2[0] == '/'){
              return url1 + url2.substring(1);
          }else if(url1[url1.length - 1] != '/' && url2[0] != '/'){
              return url1 + '/' + url2;
          }else{
              return url1 + url2;
          }
      }
  },
  // 判断是手机登录还是电脑登录
  browserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          // alert("我是手机登录");
          window.location.href = mobileAddress;
      } else {
          // alert("我是电脑登录");
      }
  },
  // 保留几位小数
  toDecimal(val, s) {
    const str = val.toString();
    const index = str.indexOf('.');
    if (index >= 0 && str.length > index + s + 1) {
      if ('56789'.indexOf(str[index + s + 1]) >= 0) {
        const temp = str.substring(0, index + s + 2);
        let result = '';
        let carryBit = true;
        for (let i = temp.length - 2; i >= 0; i -= 1) {
          const num = temp[i];
          if (carryBit) {
            const idx = '0123456789'.indexOf(num);
            if (idx === 9) {
              result = `0${result}`;
              carryBit = true;
            } else if (idx >= 0) {
              result = '0123456789'[idx + 1] + result;
              carryBit = false;
            } else {
              result = num + result;
            }
          } else {
            result = num + result;
          }
        }
        if (carryBit) {
          result = `1${result}`;
        }
        return Number(result);
      }
      return Number(str.substring(0, index + s + 1));
    }
    return Number(val);
  },
  // 判断模板是否显示
  isVisible(attachments, type2) {
    let flag = false;
    if (!attachments) return;
    attachments.forEach(item => {
      if (item.type && item.type.indexOf(type2) !== -1) {
        flag = true;
      }
    });
    // eslint-disable-next-line consistent-return
    return flag;
  },
  // 获取当前的项目的URL
  getCurrentUrl() {
    const href = window.location.href;
    const index = href.indexOf('/#/openAccount');
    const currentHref = href.slice(0, index);
    return currentHref;
  },
  pictureLazyLoading() {
    // 一开始没有滚动的时候，出现在视窗中的图片也会加载
      start();
      // 当页面开始滚动的时候，遍历图片，如果图片出现在视窗中，就加载图片
      var clock; //函数节流
      $(window).on('scroll',function(){
          if(clock){
              clearTimeout(clock);
          }
          clock = setTimeout(function(){
              start()
          },200)
      })
      function start(){
            $('.assets-content img').not('[data-isLoading]').each(function () {
              if (isShow($(this))) {
                  loadImg($(this));
              }
          })
      }
      // 判断图片是否出现在视窗的函数
      function isShow($node){
          return $node.offset().top <= $(window).height()+$(window).scrollTop();
      }
      // 加载图片的函数，就是把自定义属性data-src 存储的真正的图片地址，赋值给src
      function loadImg($img){
        $img.attr('src', $img.attr('data-src'));
        // 已经加载的图片，我给它设置一个属性，值为1，作为标识
        // 弄这个的初衷是因为，每次滚动的时候，所有的图片都会遍历一遍，这样有点浪费，所以做个标识，滚动的时候只遍历哪些还没有加载的图片
        $img.attr('data-isLoading',1);
      }
  },
  getUrl() {
    var str = window.location.href;
    var index = str.indexOf('/'); // 字符出现的位置
    var num = 0; // 这个字符出现的次数
    while(index !== -1) {
        console.log(index); // 打印字符串出现的位置
        num++; // 每出现一次 次数加一
        if (num == 3) {
          console.log(index, 'index');
          return str.slice(0, index+1);
        }
        index = str.indexOf('/',index + 1); // 从字符串出现的位置的下一位置开始继续查找
    }
  },
  getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
      iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;
    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }
      //create a bogus data channel
    pc.createDataChannel("");
    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });
    //sten for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  },
  formatDate(value) { // 时间戳转换日期格式方法
    if (value == null) {
        return '';
    } else {
        let date = new Date(value);
        let y = date.getFullYear();// 年
        let MM = date.getMonth() + 1;// 月
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();// 日
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();// 时
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();// 分
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();// 秒
        s = s < 10 ? ('0' + s) : s;
        // return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        return y + '-' + MM + '-' + d;
    }
  },
  isAcrobatPDFPluginInstalled() {
        //下面代码都是处理IE浏览器的情况 
        let oAcro = null;
        let oAcro4 = null;
        let oAcro7 = null;
        if((window.ActiveXObject)||(navigator.userAgent.indexOf("Trident") > -1)) {
            for(let x = 2; x < 10; x++) {
                try {
                    oAcro = eval("new ActiveXObject('PDF.PdfCtrl." + x + "');");
                    if(oAcro) {
                        return true;
                    }
                } catch(e) {}
            }
            try {
                oAcro4 = new ActiveXObject('PDF.PdfCtrl.1');
                if(oAcro4)
                    return true;
            } catch(e) {}
            try {
                oAcro7 = new ActiveXObject('AcroPDF.PDF.1');
                if(oAcro7)
                    return true;
            } catch(e) {}
        }else{
        //chrome和FF、safrai等其他浏览器
            return true;
        }
    },
     //生成随机UUID
     uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
     
        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          // rfc4122, version 4 form
          var r;
     
          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
     
          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
     
        return uuid.join('');
    },
    // 导出excel
    downFile(blob, fileName) {
      if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
          var a = document.createElement('a');
          a.innerHTML = fileName;
          // 指定生成的文件名
          a.download = fileName;
          a.href = URL.createObjectURL(blob);
          document.body.appendChild(a);
          var evt = document.createEvent("MouseEvents");
          evt.initEvent("click", false, false);
          a.dispatchEvent(evt);
          document.body.removeChild(a);
      }
  }
};
/* eslint-enable */
