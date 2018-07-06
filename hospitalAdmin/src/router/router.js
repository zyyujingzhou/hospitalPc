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
      path: '/home',
      title: '首页',
      name: 'home_index',
      component: () =>
        import ('@/views/home/home.vue')
    },
    {
      path: '/hospital',
      title: '医疗机构编辑',
      name: 'hospital',
      component: () =>
        import ('@/views/hospital/hospital.vue')
    },
   /* {
      path: 'office',
      title: '科室管理',
      name: 'office-page',
      component: () =>
        import ('@/views/hospital/office.vue')
    },*/
    {
      path: '/office',
      title: '医疗机构详情',
      name: 'office',
      component: () =>
        import ('@/views/hospital/office.vue')
    },

    {
      path: '/team',
      title: '家医审查',
      name: 'team',
      component: () =>
        import ('@/views/doctorteam/team.vue')
    },
    {
      path: '/tab',
      title: '医生详情',
      name: 'tab',
      component: () =>
        import ('@/views/doctorteam/tab.vue')
    },
    {
      path: '/manage',
      title: '管理员编辑',
      name: 'manage',
      component: () =>
        import ('@/views/analysis/manage.vue')
    },
    {
      path: '/role',
      title: '编辑角色',
      name: 'role',
      component: () =>
        import ('@/views/analysis/role.vue')
    },
    {
      path: '/own',
      title: '编辑角色',
      name: 'own',
      component: () =>
        import ('@/views/own-space/own.vue')
    },
    /* {
       path: 'doctorTeam',
       title: '家医团队管理',
       name: 'doctorTeam-page',
       component: () =>
         import ('@/views/doctorteam/doctorteam.vue')
     },*/
    /*{
      path: 'ownspace',
      title: '个人中心',
      name: 'ownspace_index',
      component: () =>
        import ('@/views/own-space/own-space.vue')
    }*/
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
      path: '/hospitalDetail',
      title: '医疗机构管理',
      name: 'hospital-detail',
      component: () =>
        import ('@/views/hospital/hospitalDetail')
    }]
  },
 /* {
    path: '/office',
    icon: 'ios-medkit',
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
  },*/
  {
    path: '/doctor',
    icon: 'ios-medkit',
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
    icon: 'wrench',
    name: 'analysis',
    title: '权限管理',
    component: Main,
    children: [{
        path: '/service',
        title: '管理员管理',
        name: 'service-manage',
        component: () =>
          import ('@/views/analysis/service')
      },
      {
        path: '/roleadmin',
        title: '角色管理',
        name: 'role-manage',
        component: () =>
          import ('@/views/analysis/roleadmin')
      },
     /* {
        path: 'followup',
        title: '随访',
        name: 'followup-manage',
        component: () =>
          import ('@/views/analysis/followup')
      }*/
    ]
  },
 /* {
    path: '/ownspace',
    icon: 'ios-medkit',
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
  }*/
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
