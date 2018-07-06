import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import store from '@/store/index';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import { routers, otherRouter, appRouter, routererror } from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);
const whiteList = ['/login', '/authredirect'];// 不重定向白名单
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    const isLogin = localStorage.autoLoginJiayi;
    if (isLogin === 'true') {
        if (to.path === '/login') {
            next({
                name: 'home_index',
            });
            iView.LoadingBar.finish();
        } else {
            if (store.state.app.menuList.length === 0) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GenerateRoutes').then(() => { // 生成可访问的路由表
                    router.addRoutes(store.state.app.menuList); // 动态添加可访问路由表
                    router.addRoutes(routererror);
                    next({ ...to, replace: true });
                }).catch(() => {
                });
            }
            next();
        }
    } else if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next();
    } else {
        next('/login');
        iView.LoadingBar.finish();
        // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
