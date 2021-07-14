
import { Message } from 'element-ui';
import appConst from './appConst';

export default {
  imgExceed() {
    Message.warning('最多只能上传十张图片！');
  },
  imgExceed20() {
    Message.warning('最多只能上传二十张图片！');
  },
  imgExceed5() {
    Message.warning('最多只能上传五张图片！');
  },
  beforeImgAvatarUpload(file) {
    const isJPG = appConst.imgType[file.type];
    if (!isJPG) {
      Message.error('上传图片格式错误!');
    }
    return !!isJPG;
  },
  beforeDocAvatarUpload(file) {
    const typeList = file.name.split('.');
    const type = typeList[typeList.length - 1];
    const isDoc = appConst.docType[type];
    if (!isDoc) {
      Message.error('文件格式错误，只支持doc，docx文件!');
    }
    return !!isDoc;
  },
  beforeExcelAvatarUpload(file) {
    const typeList = file.name.split('.');
    const type = typeList[typeList.length - 1];
    const isZip = appConst.excelType[type];
    if (!isZip) {
      Message.error('文件格式错误，只支持zip，rar文件!');
    }
    return !!isZip;
  },
  beforeZipAvatarUpload(file) {
    const typeList = file.name.split('.');
    const type = typeList[typeList.length - 1];
    const isZip = appConst.zipType[type];
    if (!isZip) {
      Message.error('文件格式错误，只支持zip，rar文件!');
    }
    return !!isZip;
  },
  beforePdfAvatarUpload(file) {
    const typeList = file.name.split('.');
    const type = typeList[typeList.length - 1];
    const isPdf = appConst.pdfType[type];
    if (!isPdf) {
      Message.error('文件格式错误，只支持pdf，PDF文件!');
    }
    return !!isPdf;
  },
  beforePdfAvatarUpload2(file) {
    const typeList = file.name.split('.');
    const type = typeList[typeList.length - 1];
    const isFile = appConst.fileType[type];
    if (!isFile) {
      Message.error('文件格式错误，只支持pdf及图片格式!');
    }
    return !!isFile;
  },
  processingMoneyFormat(data, keys) {
    data.forEach(val => {
      keys.forEach(key => {
        this.processingMoneyFormatItemDecimal(val, key);
      });
    });
  },
  nameValidate(rule, value, callback) {
    if (!value) return;
    const reg = /^[\u4e00-\u9fa5]{2,20}/;
    if (!reg.test(value)) callback(new Error('请输入2-20位汉字')); else callback();
  },
  idCardValidate(rule, value, callback) {
    if (!value) return;
    const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(value)) callback(new Error('请输入正确的18位身份证号码')); else callback();
  },
  idCardValidateOrEmpty(rule, value, callback) {
    if (value === '') callback();
    if (!value) return;
    const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(value)) callback(new Error('请输入正确的18位身份证号码')); else callback();
  },
  phoneValidate(rule, value, callback) {
    if (!value) return;
    // const reg = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0135-9]\d{2}|66\d{2})\d{6}$/;
    const reg = /^(0\d{2,3}-\d{7,8})$|(4\d{2,3}-\d{3,8}(-\d{3,5}){0,1})$|(((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8})$/;
    if (!reg.test(value)) {
      callback(new Error('请输入正确电话或手机号码'));
    } else {
      callback();
    }
  },
  cellNumValidate(rule, value, callback) { // 限定11-19位的数字
    if (!value) return;
    const reg = /^([1-9]{1})(\d{10}|\d{11}|\d{12}|\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/;
    if (!reg.test(value)) callback(new Error('请输入正确银行卡号')); else callback();
  },
  cellNumValidateOrEmpty(rule, value, callback) { // 限定11-19位的数字
    if (value === '') callback();
    if (!value) return;
    const reg = /^([1-9]{1})(\d{10}|\d{11}|\d{12}|\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/;
    if (!reg.test(value)) callback(new Error('请输入正确银行卡号')); else callback();
  },
  detailsAddressValidate(rule, value, callback) {
    if (!value) return;
    const reg = /^[\s\S]{1,100}$/;
    if (!reg.test(value)) callback(new Error('项目地址为1-100个汉字和数字')); else callback();
  },
  projectNameValidate(rule, value, callback) {
    if (!value) return;
    const reg = /^[\s\S]{1,50}$/;
    if (!reg.test(value)) callback(new Error('项目名称为1-50个字符')); else callback();
  },
  projectDescValidate(rule, value, callback) {
    if (!value) return;
    const reg = /^[\s\S]{0,255}$/;
    if (!reg.test(value)) callback(new Error('项目介绍不超过255个汉字')); else callback();
  },
  twoDecimalPlaces(rule, value, callback) {
    const reg = /^\d+(\.\d{0,2})?$/;
    if (!reg.test(value)) callback(new Error('必须为数字，最多保留两位小数')); else callback();
  },
  fourDecimalPlaces(rule, value, callback) {
    const reg = /^\d+(\.\d{0,4})?$/;
    if (!reg.test(value)) callback(new Error('必须为数字，最多保留四位小数')); else callback();
  },
  fourDecimalPlaces2(rule, value, callback) {
    const reg = /^\d+(\.\d{0,4})?$/;
    if (!reg.test(value)) callback(new Error('必须为数字，最多保留四位小数'));
    if (Number(value) === 0) callback(new Error('转让价格必须大于0')); else callback();
  },
  fourDecimalPlaces3(rule, value, callback) {
    const reg = /^\d+(\.\d{0,4})?$/;
    if (!reg.test(value)) callback(new Error('必须为数字，最多保留四位小数'));
    if (Number(value) === 0) callback(new Error('提现金额必须大于0')); else callback();
  },
  batchUpdatePrice(rule, value, callback) { // 批量更新价格
    const reg = /^\d+(\.\d{0,4})?$/;
    if (value && !reg.test(value) && value !== '') callback(new Error('必须为数字，最多保留四位小数')); else callback();
  },
  integer(rule, value, callback) {
    const reg = /^\d+$/;
    if (value && !reg.test(value) && value !== '') callback(new Error('必须为整数')); else callback();
  },
};
