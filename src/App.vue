<template>
  <div id="app">
    <div v-if="visible" style="width:100%;height:100%;">
      <router-view></router-view>
    </div>
    <div
      style="width:100%;height:100%;position:fixed;top:0;left:0;z-index:10;background:rgba(0,0,0,0.6)"
      v-show="progressShow"
    >
      <el-progress
        type="circle"
        :percentage="percentage"
        class="currentProgress"
        style="position:absolute;left:45%;top:30%;"
      ></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      progressShow: false,
      percentage: 0,
      visible: false,
      roleType: [], // 当前企业 角色  核心企业  供应商  第三方
    };
  },
  created() {
      if (window.name) {
        this.visible = false;
        this.handlechangetoken(JSON.parse(window.name).token);
      }else{
        window.location.href = encodeURI(`${this.$appConst.loginNavigation}/?clientId=${this.$appConst.ClIENT_ID}&redirectUri=${this.$appConst.home}`)
      }
  },
  components: {},
  mounted() {
    const vm = this;
    vm.$bus.$on("showProgress", function(value) {
      vm.progressShow = true;
      vm.percentage = value;
    });
    vm.$bus.$on("hideProgress", function() {
      vm.progressShow = false;
    });
  },
  methods: {
        handlechangetoken(token) {
                this.roleType = [];
                let params = {
                    subsystems: this.$appConst.SYSTEMS
                };
                var vm = this;
                sessionStorage.setItem("access_token", token);
                let systemType = JSON.parse(window.name).systemType;
                if(systemType) {
                  sessionStorage.setItem("systemType", systemType);
                }
                vm.$http
                    .post(`${this.$apiUrl.tokenRefresh}`, params)
                    .then(response => {
                    if (response.status == "200") {
                        // let orgRoles = ["SUPPLIER", "CORE_ENT", "THIRD_PARTY_ENTERPRISE"];
                        // let roleArr = response.data.data.authorities;
                        // let status = false; //返回结果content是否有信息
                        // roleArr.forEach(item => {
                        // if (orgRoles.includes(item)) {
                        //     status = true;
                        //     this.roleType.push(item);
                        // }
                        // });
                        // if (status === false) {
                        // this.roleType.push("THIRD_PARTY_ENTERPRISE");
                        // }
                        // let authStr = JSON.stringify(this.roleType);
                        // sessionStorage.setItem("authorizationRoleType", authStr);

                        // 62到75行，以后就不需要了；this.roleType用78行这个获得；
                        this.getRoleType(response.data.data.user.orgId);

                        var data = response.data;
                        let rolesArr = [];
                        let user = response.data.data.user;
                        sessionStorage.setItem('user',JSON.stringify(user));
                        sessionStorage.setItem('authorities', JSON.stringify(response.data.data.authorities))
                        let userRolesArr = response.data.data.user.roles;
                        vm.handleUserOrgRoles(userRolesArr);
                        rolesArr = vm.handleRemoveDoubleArr(rolesArr);
                        vm.handleSetSession(data, rolesArr);
                        this.$message.success("登录成功");
                        vm.visible = true;
                    } else {
                        vm.$message.error("登录失败");
                    }
                    });
                },
                async getRoleType(orgIdParam) {
                  const vm = this;
                  // let url = `${this.$apiUrl.getOrgInfoByOrgId}${orgIdParam}`
                  // let response = await this.$http.get(url);
                  // if(response.data.status === this.$appConst.status) {
                  //   response.data.data.forEach(item => {
                  //     if(item.orgId === orgIdParam) {
                  //       vm.roleType.push(item.orgRole)
                  //     }
                  //   })
                  // }
                  this.roleType = ["SUPPLIER","CORE_ENT","THIRD_PARTY_ENTERPRISE"];
                  console.log(this.roleType, 'this.roleType')
                  sessionStorage.setItem("authorizationRoleType", JSON.stringify(this.roleType));
                  this.$bus.$emit('getMenu');
                },
                handleUserOrgRoles(userRolesArr) {
                    // let arr = [];
                    let userRolesIsManager = false;
                    for (let i = 0; i < userRolesArr.length; i++) {
                        if (userRolesArr[i]["name"] === "EM") {
                        userRolesIsManager = true;
                        }
                    }
                    sessionStorage.setItem("userRolesIsManager", userRolesIsManager);
                },
                handleRemoveDoubleArr(arr) {
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = i + 1; j < arr.length; j++) {
                        if (arr[i] === arr[j]) {
                            arr.splice(j, 1);
                        }
                        }
                    }
                    return arr;
                },
                handleSetSession(data) {
                    // let flag = 0;
                    // let currentEnterprise = this.$appConst.currentEnterprise;
                    let roles = [];
                    roles.push(data.data.user.orgRole);

                    sessionStorage.setItem("userId", data.data.user.id);
                    sessionStorage.setItem("access_token", data.data.token);
                    sessionStorage.setItem("orgId", data.data.user.orgId);
                    sessionStorage.setItem("userName", data.data.user.username);
                    sessionStorage.setItem("roles", roles);
                    if (data.data.user.orgRole === "PLATFORM") {
                        sessionStorage.setItem("orgName", "平台");
                    } else if (data.data.user.orgRole === "CORE_ENT") {
                        sessionStorage.setItem("orgName", "核心企业");
                    } else {
                        sessionStorage.setItem("orgName", data.data.user.orgName);
                    }
                },
  }
};
</script>

<style>
@import "../public/static/css/main.css";
.currentProgress .el-progress__text {
  color: green !important;
  font-size: 25px !important;
}
#app {
  width: 100%;
  height: 100%;
  background: rgb(239, 238, 248);
}
</style>
