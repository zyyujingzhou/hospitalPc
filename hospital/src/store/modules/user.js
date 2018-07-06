import { otherRouter, appRouter } from '@/router/router';
import Cookies from 'js-cookie';
import Services from '../../services/services';

const user = {
    state: {
        roles: [],
    },
    mutations: {
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        logout (state, vm) {
            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('access');
            // 恢复默认样式
            // let themeLink = document.querySelector('link[name="theme"]');
            // themeLink.setAttribute('href', '');
            // // 清空打开的页面等数据，但是保存主题数据
            // let theme = '';
            // if (localStorage.theme) {
            //     theme = localStorage.theme;
            // }
            localStorage.clear();
            // if (theme) {
            //     localStorage.theme = theme;
            // }
        }
    },
    actions: {
        // 获取用户信息
        fetchUserPermission({ commit }) {
          return new Promise((resolve, reject) => {
            Services.$servers.fetchUserPermission({}, (response) => {
                if (!response.data) {
                reject('error');
                }
                const data = response.data.managerFuncList;
                commit('SET_ROLES', data);
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
          });
        },
      },
};

export default user;
