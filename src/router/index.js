/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';
import appConst from '@/assets/js/appConst';

Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/',
  //   redirect: '/login'
  // },
  {
    path: '*',
    redirect:'/readme'
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['../views/login/login.vue'], resolve)
  },
  {
    path: '/home',
    name: 'home',
    component: resolve => require(['../views/Home.vue'], resolve),
    children: [
      {
        path: '/',
        component: resolve =>
          require(['../views/readme.vue'], resolve)
      },
      {
        path: '/readme',
        component: resolve =>
          require(['../views/readme.vue'], resolve)
      },
      {
        path: '/readme2',
        component: resolve =>
          require(['../views/readme.vue'], resolve)
      },
      {
        path: '/setting',
        name: 'setting',
        meta: {
            title: '设置',
            icon: 'el-icon-s-order'
        },
        component: resolve => require(['../views/setting/index.vue'], resolve)
      },
      {
        path: '/wareHouseInformation',
        name: 'wareHouseInformation',
        meta: {
            title: '企业查询',
            icon: 'el-icon-s-order'
        },
        component: resolve => require(['../views/wareHouseInformation/index.vue'], resolve)
      },
      // 企业数据授权
      {
        path: '/orgRolesManage',
        name: 'orgRolesManage',
        meta: {
          title: "添加企业",
        },
        component: resolve => require(['../views/orgRolesManage/index.vue'], resolve)
      },
      // 企业数据授权
      {
        path: '/authorization',
        name: 'authorization',
        meta: {
          title: "企业授权",
        },
        component: resolve => require(['../views/authorization/index.vue'], resolve)
      },
      {
        path: '/contractQuery',
        name: 'contractQuery',
        meta: {
            title: '合同查询',
        },
        component: resolve => require(['../views/assetContract/contractQuery.vue'], resolve)
      },
      {
        path: '/commonAsset/:assetType',
        name: 'commonAsset',
        meta: {
            title: '公共的资产组件',
        },
        component: resolve => require(['../views/commonAsset/index.vue'], resolve)
      },
      {
        path: '/commonAsset2/:assetType',
        name: 'commonAsset',
        meta: {
            title: '公共的资产组件',
        },
        component: resolve => require(['../views/commonAsset2/index.vue'], resolve)
      },
      {
        path: '/dataAuthorization/:assetType',
        name: 'dataAuthorization',
        meta: {
            title: '公共的数据授权组件',
        },
        component: resolve => require(['../views/dataAuthorization/index.vue'], resolve)
      },
    ]
  },
  
];

// 点击重复菜单报错
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
});
router.beforeEach((to, from, next) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    let token = sessionStorage.getItem("access_token");
    if (!token) {
      sessionStorage.clear();
      window.location.href = encodeURI(`${appConst.loginNavigation}/?clientId=${appConst.ClIENT_ID}&redirectUri=${appConst.home}`)//统一登录页面的地址；
      next();
      return;
    }
    if (to.path === '/login' || to.path === "/"){
        window.location.href = encodeURI(`${appConst.loginNavigation}/?clientId=${appConst.ClIENT_ID}&redirectUri=${appConst.home}`)
        next()
        return 
    } 
    next();
});
export default router;
/* eslint-enable */
