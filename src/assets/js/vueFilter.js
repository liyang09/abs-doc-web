import Vue from 'vue';
//实现金额每隔三位以’，‘分隔，同时保留两位小数。
Vue.filter('MoneyFormat', function(money) {
    if (money && money != null  && !isNaN(Number(money))) {
      money = String(money);
      var left = money.split('.')[0], right = money.split('.')[1];
      right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
      var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
      return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
    } else if (money === 0) { // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
      return '0.00';
    } else {
      return '';
    }
})
