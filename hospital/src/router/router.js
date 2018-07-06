import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () =>
    import ('@/views/login.vue')
};

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () =>
    import ('@/views/error-page/404.vue')
};

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () =>
    import ('@//views/error-page/403.vue')
};

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () =>
    import ('@/views/error-page/500.vue')
};

// export const preview = {
//     path: '/preview',
//     name: 'preview',
//     component: () => import('@/views/form/article-publish/preview.vue')
// };

export const locking = {
  path: '/locking',
  name: 'locking',
  component: () =>
    import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    {
      path: 'home',
      title: '首页',
      name: 'home_index',
      component: () =>
        import ('@/views/home/home.vue')
    },
    {
      path: 'hospitalDetail',
      title: '医疗机构管理',
      name: 'hospital-detail',
      component: () =>
        import ('@/views/hospital/hospitalDetail.vue')
    },
    {
      path: 'office',
      title: '科室管理',
      name: 'office-page',
      component: () =>
        import ('@/views/hospital/office.vue')
    },
    {
      path: 'doctor',
      title: '医护人员管理',
      name: 'doctor-page',
      component: () =>
        import ('@/views/hospital/doctor.vue')
    },
    {
      path: 'doctorTeam',
      title: '家医团队管理',
      name: 'doctorTeam-page',
      component: () =>
        import ('@/views/doctorteam/doctorteam.vue')
    },
    {
      path: 'ownspace',
      title: '个人中心',
      name: 'ownspace_index',
      component: () =>
        import ('@/views/own-space/own-space.vue')
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/hospitalDetail',
    icon: 'ios-medkit',
    name: 'hospital-detail',
    title: '医疗机构管理',
    component: Main,
    children: [{
      path: 'hospitalDetail',
      title: '医疗机构管理',
      name: 'hospital-detail',
      component: () =>
        import ('@/views/hospital/hospitalDetail')
    }]
  },
  {
    path: '/office',
    icon: 'wrench',
    name: 'office-page',
    title: '科室管理',
    component: Main,
    children: [{
      path: 'office',
      title: '科室管理',
      name: 'office-page',
      component: () =>
        import ('@/views/hospital/office')
    }]
  },
  {
    path: '/doctor',
    icon: 'ios-body',
    name: 'doctor-page',
    title: '医护人员管理',
    component: Main,
    children: [{
      path: 'doctor',
      title: '医护人员管理',
      name: 'doctor-page',
      component: () =>
        import ('@/views/hospital/doctor')
    }]
  },
  {
    path: '/doctorTeam',
    icon: 'android-contacts',
    name: 'doctorTeam-page',
    title: '家医团队管理',
    component: Main,
    children: [{
      path: 'doctorTeam',
      title: '家医团队管理',
      name: 'doctorTeam-page',
      component: () =>
        import ('@/views/doctorteam/doctorteam')
    }]
  },
  {
    path: '/analysis',
    icon: 'ios-compose',
    name: 'analysis',
    title: '统计',
    component: Main,
    children: [{
        path: 'service',
        title: '服务包',
        name: 'service-manage',
        component: () =>
          import ('@/views/analysis/service')
      },
      {
        path: 'createdocument',
        title: '建档',
        name: 'createdocument-manage',
        component: () =>
          import ('@/views/analysis/createdocument')
      },
      {
        path: 'followup',
        title: '随访',
        name: 'followup-manage',
        component: () =>
          import ('@/views/analysis/followup')
      }
    ]
  },
  {
    path: '/ownspace',
    icon: 'cube',
    name: 'ownspace_index',
    title: '个人中心',
    component: Main,
    children: [{
      path: 'ownspace',
      title: '个人中心',
      name: 'ownspace_index',
      component: () =>
        import ('@/views/own-space/own-space')
    }]
  }
];
export const routererror = [
  page404,
  page403,
  page500,
];


// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  // preview,
  locking,
  ...appRouter,
];
