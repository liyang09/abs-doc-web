<template>
  <div class="login-container" style="background: #f5f5f5;padding:0;bottom:0;">
    <div v-if="!showAgreement">
      <div v-if="!registerOrResetpwdSuccess">
        <!-- 登录 -->
        <div class="login-content clearfix">
          <div class="login-content-left pull-left">
              <img src="static/images/login_bg.png" alt="" style="width:480px;height:495px;">
          </div>
          <div class="login-content-right pull-left" >
            <p style="font-size:28px;color:#333;margin-top:20px;">登录</p>
            <p class="login-input-title m-t-40" style="margin-top:40px;color:#333;">账号</p>
            <p>
              <input type="text" v-model="loginForm.userName" placeholder="请输入账号" @focus="inputFocus" class="login-input" @change="formatError = false">
            </p>
            <p class="form-error_text"
              v-if="userNameError || formatError">{{userNameError}}</p>
            <p class="login-input-title m-t-40" style="color:#333;">密码</p>
            <p>
              <input :type="pwdShow?'text':'password'" autocomplete="new-password" placeholder="请输入密码" v-model="loginForm.pwd" @focus="inputFocus" class="login-input">
              <i :class="pwdShow?'iconfont iconeyepageview pwdEye':'iconfont iconeye1 pwdEye'" @click="pwdShow = !pwdShow"></i>
            </p>
            <p class="form-error_text" v-if="pwdError">{{pwdError}}</p>
            <!-- <p class="login-input-title m-t-40" style="color:#333;">验证码</p>
            <div><input type="text" v-model="loginForm.smsCode" placeholder="请输入验证码" @keyup.enter="login" @focus="inputFocus" class="login-input">
              <p class="login-input-title smsCode" @click="getSMScode">{{smsCodeTip}}</p>
            </div>
            <p class="form-error_text" v-if="smsCodeError">{{smsCodeError}}</p> -->
            <p class="m-t-40">
              <el-checkbox v-model="checked"><span  style="color:rgb(51, 51, 51);">记住账号密码</span></el-checkbox>
            </p>
            <p>
              <span class="login-btn" @click="login">
                <span v-if="!loginLoading">登 录 <i class="el-icon-right"></i></span>
                <span v-else>登录中...</span>
              </span>
            </p>
            <p class="form-error_text text-right" v-if="loginErrorMessage"><span>{{loginErrorMessage}}</span></p>
          </div>
        </div>
        <div style="text-align:center;position:absolute;bottom:-68px;width:100%;">
            <p>区块链信息服务备案</p>
            <p>易见区块：粤网信备 44030419239726130015 号   可信数据池：京网信备 1101081963896882001X 号</p>
        </div>
    </div>
  </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  components: {
  },
  data() {
    return {
      loginForm: {
        realName: '',
        userName: '',
        pwd: '',
        smsCode: '233900',
        // smsToken: '',
        smsToken: '456415345454',
        checkpwd: '',
        referralPhone: ''
      },
      userOrgRelation: {
        phone: '',
        orgs: []
      },
      dialogVisible: false,
      showAgreement: '',
      realNameError: '',
      userNameError: '',
      pwdError: '',
      checkPwdError: '',
      smsCodeError: '',
      loginErrorMessage: '',
      tipsShow: false,
      formatError: false,
      pwdPatternError: false,
      repeatError: false,
      checked: true,
      loginLoading: false,
      smsCodeTip: '获取验证码',
      timer: null,
      pwdShow: false,
      checkpwdShow: false,
      agreemnentCheck: true,
      registerOrResetpwdSuccess: false,
      showMode: 'login',
      successTitle: '',
      successTip: '',
      selectedOrg: {},
      reg: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0135-9]\d{2}|66\d{2})\d{6}$/, // 手机号格式
      pwdPattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,20}$/
      // pwdPattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?(){}\[\]<>《》—\-\=\+；;:：'"‘’“”、/\\\|`·.。，,》]+)$)^[\w~!@#$%^&*?(){}\[\]<>《》—\-\=\+；;:：'"‘’“”、/\\\|`·.。，,]{8,20}$/
    };
  },
  watch: {
    'loginForm.userName': function userNameChange(val) {
      this.formatError = false;
      this.userNameError = '';
      if ((this.showMode === 'register' || this.showMode === 'resetpwd') && val) {
        this.handleMobilerepeate(val);
      }
    },
    'loginForm.pwd': function pwdDiff(val) {
      this.pwdPatternError = false;
      this.pwdError = '';
      if (!val) {
        return;
      }
      if (this.showMode !== 'login') {
        if (!this.pwdPattern.test(val)) {
          this.pwdError = '请输入8~20位大小写字母数字组合';
          this.pwdPatternError = true;
        }
        if (val && this.loginForm.checkpwd && val !== this.loginForm.checkpwd) {
          this.checkPwdError = '两次密码不一致';
        } else {
          this.checkPwdError = '';
        }
      }
    },
    'loginForm.checkpwd': function pwdDiff(val) {
      if (val && this.loginForm.pwd && val !== this.loginForm.pwd) {
        this.checkPwdError = '两次密码不一致';
      } else {
        this.checkPwdError = '';
      }
    },
    showMode() {
      if (this.showMode !== 'login') {
        this.loginForm = Object.assign(this.loginForm, { userName: '', pwd: '' });
      } else if (localStorage.getItem('userPwd')) {
        this.loginForm = Object.assign(this.loginForm, JSON.parse(localStorage.getItem('userPwd')));
      }
    }

  },
  created() {
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'home' });
    },
    login() {
      this.loginErrorMessage = '';
      if (!this.loginForm.userName) {
        window.$('.login-input:eq(0)').css('border-color', '#ED4040');
        this.userNameError = '账号不能为空';
        return;
      }
      if (!this.loginForm.pwd) {
        window.$('.login-input:eq(1)').css('border-color', '#ED4040');
        this.pwdError = '密码不能为空';
        return;
      }
      // if (!this.loginForm.smsCode) {
      //   window.$('.login-input:eq(2)').css('border-color', '#ED4040');
      //   this.smsCodeError = '验证码不能为空';
      //   return;
      // }
      // if (!this.loginForm.smsToken) {
      //   window.$('.login-input:eq(2)').css('border-color', '#ED4040');
      //   this.smsCodeError = '请发送短信获取验证码';
      //   return;
      // }
      this.loginLoading = true;
      const params = {
        userName: this.loginForm.userName,
        pwd: this.loginForm.pwd,
        smsCode: this.loginForm.smsCode,
        smsToken: this.loginForm.smsToken,
        subsystems:["fin", "trade"]
      };
      params.sys = 'trade';
      this.$http.post(this.$apiUrl.loginUrl, params)
        .then(res => {
          if (res.data.status === 200) {
            sessionStorage.setItem('user', JSON.stringify(res.data.data.user));
            this.handleUserOrgRoles(res.data.data.user.roles);
            this.handleGetOrgInfo(res.data.data.authorities);
            // sessionStorage.setItem('token', `${res.data.data.token}`);
            // sessionStorage.setItem('authorities', JSON.stringify(res.data.data.authorities));
            let data = res.data;
            let roles = [];
            roles.push(data.data.user.orgRole);

            sessionStorage.setItem("userId", data.data.user.id);
            sessionStorage.setItem("access_token", data.data.token)
            sessionStorage.setItem("orgId", data.data.user.orgId)
            sessionStorage.setItem("userName", data.data.user.username);
            sessionStorage.setItem("roles", roles)
            this.$router.push({path:'/home'});
            this.userOrgRelation.phone = res.data.data.user.phone;
            if (this.checked) {
              localStorage.setItem('userPwd', JSON.stringify({
                userName: this.loginForm.userName,
                pwd: this.loginForm.pwd
              }));
            } else {
              localStorage.clear();
            }
          } else {
            this.showErrorMessage(res.data);
          }
          this.loginLoading = false;
        }, error => {
          this.showErrorMessage(error.data);
          this.loginLoading = false;
        });
    },
    selecteOrg(org, e) {
      window.$('.agreement-dialog .el-dialog .agreement p').css('background', 'none');
      if (e.target.tagName === 'SPAN') {
        e.target.parentElement.style.background = '#F5F5F5';
      } else {
        e.target.style.background = '#F5F5F5';
      }
      if (org === 'individual') {
        this.selectedOrg = { individual: 'individual' };
      } else {
        this.selectedOrg = org;
      }
    },
    refreshToken() {
      if (this.selectedOrg.individual) {
        this.goHome();
      } else if (this.selectedOrg.orgId) {
        this.refreshTokenByOrg();
      } else {
        this.$confirm('请选择要登录的身份信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: ' ',
          customClass: 'tipsInfo',
          type: 'text'
        }).then(() => {
        }).catch(() => {
        });
      }
    },
    refreshTokenByOrg() {
      const params = {
        orgId: this.selectedOrg.orgId,
        sys: this.$apiUrl.sys
      };
      this.$Http.post(this.$apiUrl.changeTokenByOrg, params)
        .then(res => {
          if (res.data.status === 200) {
            const user = { ...res.data.data.user, ...res.data.data.org };
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('token', `${res.data.data.token}`);
            sessionStorage.setItem('authorities', JSON.stringify(res.data.data.authorities));
            this.$router.push({ name: 'home' });
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    getSMScode() {
      if (this.smsCodeTip !== '获取验证码') {
        return;
      }
      if (!this.loginForm.userName) {
        if (this.showMode === 'register') {
          window.$('.login-input:eq(1)').css('border-color', '#ED4040');
        } else {
          window.$('.login-input:eq(0)').css('border-color', '#ED4040');
        }
        this.userNameError = '手机号不能为空';
        return;
      }
      if (this.showMode === 'login' ? true : this.reg.test(this.loginForm.userName)) {
        let url = this.$apiUrl.sendVerificationCode;
        let params = {
          mobile: this.loginForm.userName,
          smsType: 'CAPTCHA_SMS'
        };
        if (this.showMode === 'login') {
          if (!this.loginForm.userName) {
            window.$('.login-input:eq(0)').css('border-color', '#ED4040');
            this.userNameError = '手机号不能为空';
            return;
          }
          if (!this.loginForm.pwd) {
            window.$('.login-input:eq(1)').css('border-color', '#ED4040');
            this.pwdError = '密码不能为空';
            return;
          }
          url = this.$apiUrl.getSmsCode;
          params = {
            username: this.loginForm.userName,
            password: this.loginForm.pwd
          };
        }
        if (this.repeatError) {
          this.$message.error(this.showMode === 'register' ? '您输入的手机号已经注册，无需再次注册' : '请按提示填写内容');
          return;
        }
        this.$Http.post(url, params)
          .then(res => {
            if (res.data.status === 200) {
              this.loginErrorMessage = '';
              this.loginForm.smsToken = res.data.data.uid;
              let djs = 60;
              window.$('.smsCode').css('cursor', 'not-allowed');
              this.timer = setInterval(() => {
                this.smsCodeTip = `${djs}秒后重新发送`;
                if (djs <= 0) {
                  this.smsCodeTip = '获取验证码';
                  window.$('.smsCode').css('cursor', 'pointer');
                  clearInterval(this.timer);
                }
                djs -= 1;
              }, 1000);
            }
          }, error => {
            if (this.showMode === 'login') {
              this.showErrorMessage(error);
            } else {
              this.loginErrorMessage = error.message;
            }
            this.loginLoading = false;
          });
      } else {
        this.formatError = true;
        this.userNameError = '手机号格式不正确';
        if (this.showMode === 'register') {
          window.$('.login-input:eq(1)').css('border-color', '#ED4040');
        } else {
          window.$('.login-input:eq(0)').css('border-color', '#ED4040');
        }
      }
    },
    handleMobilerepeate(value) {
      if (this.reg.test(value)) {
        this.$Http.get(this.$apiUrl.checkUserExists + this.loginForm.userName)
          .then(res => {
            if (res.data.status === 200) {
              if (res.data.data === true && this.showMode !== 'resetpwd') {
                window.$('.login-input:eq(1)').css('border-color', '#ED4040');
                this.userNameError = '手机号重复';
                this.repeatError = true;
              } else if (res.data.data === false && this.showMode === 'resetpwd') {
                window.$('.login-input:eq(0)').css('border-color', '#D9D9D9');
                this.userNameError = '手机号未注册';
                this.repeatError = true;
              } else {
                window.$('.login-input:eq(1)').css('border-color', '#D9D9D9');
                this.userNameError = '';
                this.repeatError = false;
              }
            }
          });
      } else {
        this.userNameError = '手机号格式不正确';
        this.formatError = true;
      }
    },
    registered() {
      this.showMode = 'register';
      this.resetErrorMessage();
    },
    resetpwd() {
      if (!this.loginForm.userName) {
        window.$('.login-input:eq(0)').css('border-color', '#ED4040');
        this.userNameError = '手机号不能为空';
        return;
      }
      if (!this.loginForm.smsCode) {
        window.$('.login-input:eq(1)').css('border-color', '#ED4040');
        this.smsCodeError = '验证码不能为空';
        return;
      }
      if (!this.loginForm.pwd) {
        window.$('.login-input:eq(2)').css('border-color', '#ED4040');
        this.pwdError = '密码不能为空';
        return;
      }
      if (!this.loginForm.checkpwd) {
        window.$('.login-input:eq(3)').css('border-color', '#ED4040');
        this.checkPwdError = '确认密码不能为空';
        return;
      }
      if (!this.loginForm.smsToken) {
        window.$('.login-input:eq(1)').css('border-color', '#ED4040');
        this.smsCodeError = '请发送短信获取验证码';
        return;
      }
      if (this.repeatError) {
        this.userNameError = '手机号未注册';
        return;
      }
      if (!this.pwdPattern.test(this.loginForm.pwd)) {
        this.pwdError = '请输入8~20位大小写字母数字组合';
        return;
      }
      if (!this.checkPwdError && !this.pwdPatternError) {
        const params = {
          username: this.loginForm.userName,
          phone: this.loginForm.userName,
          newPassword: this.loginForm.pwd,
          smsCode: this.loginForm.smsCode,
          smsToken: this.loginForm.smsToken
        };
        this.loginLoading = true;
        this.$Http.post(this.$apiUrl.resetPwd, params)
          .then(res => {
            if (res.data.data === '密码重置成功') {
              this.successTitle = '重置密码';
              this.successTip = '您已经成功设置密码，请使用新密码登录';
              this.registerOrResetpwdSuccess = true;
            }
            this.loginLoading = false;
          }).catch(err => {
            this.loginLoading = false;
            this.showErrorMessage(err);
            // this.loginErrorMessage = err.message;
          });
      }
    },
    forgetPassword() {
      this.showMode = 'resetpwd';
      this.resetErrorMessage();
    },
    goLogin() {
      this.showMode = 'login';
      this.resetErrorMessage();
      this.registerOrResetpwdSuccess = false;
    },
    resetErrorMessage() {
      this.loginForm = {
        userName: '',
        pwd: '',
        smsCode: '',
        smsToken: '',
        checkpwd: '',
        referralPhone: ''
      };
      clearInterval(this.timer);
      window.$('.smsCode').css('cursor', 'pointer');
      window.$('.login-input').css('border-color', '#D9D9D9');
      this.userNameError = '';
      this.pwdError = '';
      this.smsCodeError = '';
      this.loginErrorMessage = '';
      this.checkPwdError = '';
      this.successTip = '';
      this.successTitle = '';
      this.repeatError = false;
      this.pwdShow = false;
      this.smsCodeTip = '获取验证码';
      this.formatError = false;
      this.pwdPatternError = false;
      this.checked = false;
      this.loginLoading = false;
      this.checkpwdShow = false;
      this.agreemnentCheck = true;
    },
    inputFocus(e) {
      window.$(e.target).css('border-color', '#D9D9D9');
      if (e.target.dataset.realname) {
        this.tipsShow = true;
      }
      this.userNameError = '';
      this.pwdError = '';
      this.smsCodeError = '';
      this.loginErrorMessage = '';
    },
    logout() {
      sessionStorage.clear();
      this.INIT_USER(null);
      this.INIT_AUTHORITIES(null);
      this.dialogVisible = false;
    },
    getAgreementTemplate(text) {
      const params = {
        systemName: this.$apiUrl.sys,
        templatePaths: this.$appConst.PACA
      };
      if (text === 'user') {
        params.templatePaths = this.$appConst.USER_REGISTER_AGREEMENT;
      } else if (text === 'QYBprivacy') {
        params.templatePaths = this.$appConst.PRIVACY_POLICY_AGREEMENT;
      }
      this.$Http.post(this.$apiUrl.contract.queryUrl, params)
        .then(res => {
          if (res.data.status === 200) {
            this.show(res.data.data.content[0]);
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
    },
    show(scope) {
      if (scope.fileId) this.$refs.confirmRightsDialog.show(`${this.$apiUrl.prevUrl}${scope.fileId}`);
    },
    rolesShow(row) {
      const temSet = new Set([]);
      row.roles.map(item => {
        if (item.name !== 'IU') {
          temSet.add(item.description);
        }
        return 0;
      });
      row.user.roles.map(item => {
        if (item.name !== 'IU') {
          temSet.add(item.description);
        }
        return 0;
      });
      const temStr = [...temSet].join().replace(/,/g, ' ');
      return temStr;
    },
    showErrorMessage(error) {
      if (error.message.length <= 24) {
        if (error.message.includes('密码')) {
          if (this.showMode === 'register') {
            window.$('.login-input:eq(3)').css('border-color', '#ED4040');
          } else if (this.showMode === 'login' || this.showMode === 'resetpwd') {
            window.$('.login-input:eq(1)').css('border-color', '#ED4040');
          }
          this.pwdError = error.message;
        } else if (error.message.includes('用户')) {
          if (this.showMode === 'register') {
            window.$('.login-input:eq(1)').css('border-color', '#ED4040');
          } else if (this.showMode === 'login' || this.showMode === 'resetpwd') {
            window.$('.login-input:eq(0)').css('border-color', '#ED4040');
            this.pwdPatternError = true;
          }
          this.userNameError = error.message;
        } else if (error.message.includes('短信') || error.message.includes('验证码')) {
          if (this.showMode === 'resetpwd') {
            window.$('.login-input:eq(1)').css('border-color', '#ED4040');
          } else {
            window.$('.login-input:eq(2)').css('border-color', '#ED4040');
          }
          this.smsCodeError = error.message;
        } else {
          this.loginErrorMessage = error.message;
        }
      } else {
        this.loginErrorMessage = error.message;
      }
    },
    // 获取企业信息 判断企业为 核心企业 供应商 第三方
    handleGetOrgInfo(authorities) {
        let roleType =[]
        let orgRoles = ["SUPPLIER","CORE_ENT","THIRD_PARTY_ENTERPRISE"]
        let status = false //返回结果content是否有信息
        authorities.forEach(item=>{
            if(orgRoles.includes(item)){
                status = true
                roleType.push(item)
            }
        })
        if(status === false){
            roleType.push("THIRD_PARTY_ENTERPRISE")
        }
        sessionStorage.setItem("authorizationRoleType", JSON.stringify(roleType))
    },
    // 判断企业是否为企业管理员
    handleUserOrgRoles(userRolesArr) {
        let userRolesIsManager = false
        for(let i=0; i<userRolesArr.length; i++) {
            if(userRolesArr[i]["name"] === "EM") {
                userRolesIsManager = true
                break;
            }
        }
        sessionStorage.setItem("userRolesIsManager", userRolesIsManager)
    },
  }
};
</script>

<style scoped lang="scss">
  .login-container{
    position: relative;
    height: calc(90vh);
    min-height: 800px;
  }
  .login-content {
    width: 1100px;
    height: 584px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login-content-right {
      padding: 8px 82px;
      width: 480px;
      height: 584px;
      background: rgba(255, 255, 255, 1);

      img {
        width: 150px;
      }

      .login-input {
        width: 320px;
        border: none;
        border-bottom: 1px solid #D9D9D9;
        color: #333333;
        font-size: 14px;
        height: 40px;
        outline: none;
        // padding-left: 10px;
        &:hover{
          border-color:#999999!important;
        }
        &:focus{
          border-color: #CAA14F!important;
        }
      }

      .login-input-title {
        color: #666666;
      }

      .login-btn {
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        width: 320px;
        height: 48px;
        background: rgba(202, 161, 79, 1);
        border-radius: 2px;
        display: inline-block;
        text-align: center;
        line-height: 48px;
        cursor: pointer;
        margin: 16px 0;

        &:hover {
          background: #B59046;
        }
      }

      .registered {
        color: #CAA14F;
        cursor: pointer;
        &:last-child{
          color: #999999;
        }
      }

      .forget-password {
        color: #999999;
        cursor: pointer;
      }

      .pwdEye {
        float: right;
        position: relative;
        top: -30px;
        background: #fff;
        width: 26px;
        text-align: center;
        color: #999999;
        cursor: default;
      }

      .form-error_text {
        height: 0;
      }

      .text-right {
        position: relative;
        top: -15px;
        span{
          position: absolute;
          width: 100%;
          right: 0;
          background: #fff;
          max-height: 95px;
          overflow: hidden;
        }
      }

      .smsCode{
        position: relative;
        top: -30px;
        color: #CAA14F;
        cursor: pointer;
        float: right;
        width: 112px;
        text-align: right;
        background: #fff;
      }
    }
  }

  .register-content {
    box-shadow: none;
    height: 900px;
    .login-content-left{
      height: 900px;
      width: 460px;
      background-size: 460px 900px;
      position: relative;
      left: 50px;
    }
    .login-content-right  {
      padding: 10px 76px;
      margin:0 45px;
      height: 584px;
      .register-title {
        margin-top: 24px;
        color: #333333;
        font-size: 20px;
        font-weight: 700;
        height: 20px;
      }
      // .text-right{
      //   right: -80px;
      // }
      .agreement{
        color: #333333;
        width: 400px;
        margin-top: 60px;
        span{
          color: #CAA14F;
          cursor: pointer;
        }
      }
      // .login-btn {
      //   width: 400px;
      // }
    }
  }
  .resetpwd-content{
    .login-content-right {
      padding: 157px 115px;
    }
  }
  .success {
    .login-content-right{
      padding: 300px 100px;
      .success-title{
        font-weight: 400;
      }
      .success-content {
        font-size: 14px;
        color: #333333;
        margin: 54px 0;
        i{
          font-size:20px;
          color:#66C947;
          position: relative;
          bottom: -2px;
        }
      }

      .success-btn{
        margin: 0;
      }
    }
  }
  .agreementBox{
    width: 1200px;
    margin: 22px auto 0;
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    .private-agreement-content {
      height: calc(100vh - 105px);
      overflow: auto;
    }
    div {
      p{
        height: 72px;
        color: #333333;
        font-size: 24px;
        .el-icon-back{
          display: inline-block;
          width: 60px;
          font-size: 17px;
          color: #666666;
          text-align: center;
          border-right: 2px solid #D9D9D9;
          margin-right: 16px;
          cursor: pointer;
        }
      }
    }
  }
  .agreement-dialog /deep/ .el-dialog{
    width: 480px;
    .agreement{
      cursor: default;
      font-size: 14px;
      color: #333333;
      .item-title{
        margin:0;
        color: #666666;
      }
      p{
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover{
          background: #F5F5F5;
        }
      }
    }
  }
  .org-name{
    display: inline;
    margin-right: 10px;
  }
  .roles{
    display: inline;
    padding: 0 3px;
    font-size: 12px;
  }
  .new-bg{
    height: 900px!important;
    width: 460px!important;
    // background: url("../../assets/images/newLoginBG.jpg") no-repeat center!important;
    background-size: contain!important;
  }
  input{
    box-shadow: inset 0 0 0 1000px #fff!important;
    filter: none;
  }
  .pull-left {
    float: left;
    }
    *{  
        box-sizing: border-box;
    }
    .clearfix:after {
        content: '';
        height: 0;
        visibility: hidden;
        overflow: hidden;
        display: block;
        clear: both;
    }
.form-error_text {
    color: #ED4040;
    font-size: 12px;
    height:0;
}
.m-t-40 {
    margin-top: 40px;
}
</style>

