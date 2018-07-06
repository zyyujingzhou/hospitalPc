/*
 * 可引入不同的ajax库， 并依次修改_http _get _post方法
 */
import axios from 'axios';
import message from 'iview';
import {
  router
} from '@/router/index';
var servers = {};

//此项目接口地址是一样一样的
servers._baseurl = process.env.BASE_API;
// servers._baseurl = 'http://192.168.4.30:9087/';
// servers._baseurl_4 = 'http://192.168.4.30:9084/kfpt_app/uploadMas'; //上传图片用途
// servers._bashurl_5 = 'http://192.168.4.30:8001'; //显示图片前缀

// servers._baseurl = 'http://222.222.111.132:9084/doctor/';
servers._baseurl_4 = `${process.env.BASE_API_upload}/kfpt_app/uploadMasForDocPc`; //上传图片用途
// servers._baseurl_4 = process.env.BASE_API_upload;
servers._baseurl_5 = process.env.BASE_API;
servers._http = axios;

servers._get = function (url, data, callback) {

  //加前缀
  // url = this._baseurl + url;
  url = url;

  if (arguments.length == 1) {
    data = {};
  }
  if (arguments.length == 2) {
    callback = data;
    data = {};
  }
  //  if(url.indexOf('http')!=0){
  //     url=servers._baseurl+url;
  // }

  servers._http.request({
      url: url,
      baseURL: servers._baseurl,
      method: 'GET',
      params: data,
      timeout: 60000,
      withCredentials: true, // default
      responseType: 'json', // default options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    })
    .then(function (response) {
      console.log(response);
      if (typeof callback === 'function') {
        if (response.data.retCode === '000') {
          callback(response.data);
        } else if (response.retCode === '000000') {
          callback(response.data);
        } else if (response.data.retCode === '000000') {
          callback(response.data);
        } else if (response.retCode === '000') {
          callback(response.data);
        } else {
          if (response.data.retCode === '006') {
            localStorage.autoLoginJiayi = 'false';
            router.replace({
              path: '/login'
            });
          }
          message.Message.error(response.data.errInfo, 1);
          callback(response.data)
        }

      }
    })
    .catch(function (error) {
      return Promise.reject('error');
    });

};

servers._post = function (url, data, callback) {

  //加前缀
  // url = this._baseurl + url;
  url = url;

  if (arguments.length == 1) {
    data = {};
  }
  if (arguments.length == 2) {
    callback = data;
    data = {};
  }
  // if(url.indexOf('http')!=0){
  //     url=servers._baseurl+url;
  // }
  console.log(servers._baseurl)
  url.replace("jiayiPc", "doctor");
  servers._http.request({
      url: url,
      baseURL: servers._baseurl,
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000,
      withCredentials: true, // default
      responseType: 'json' // default options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    })
    .then(function (response) {
      console.log(response);
      if (typeof callback === 'function') {
        if (response.data.retCode === '000') {
          callback(response.data);
        } else if (response.retCode === '000000') {
          callback(response.data);
        } else if (response.data.retCode === '000000') {
          callback(response.data);
        } else if (response.retCode === '000') {
          callback(response.data);
        } else {
          if (response.data.retCode === '006') {
            localStorage.autoLoginJiayi = 'false';
            router.replace({
              path: '/login'
            });
          }
          message.Message.error(response.data.errInfo, 1);
          callback(response.data)
        }

      }

    })
    .catch((err) => {
      return Promise.reject('error');
    });

};
// // 登录后获取权限
// servers.fetchUserPermission = function (postdata, callback) {
//   let url = '/doctor/platform/manager/getManagerFunction';
//   postdata = postdata || {};
//   servers._get(url, postdata, callback);
// };

// 医院列表 不具备根据id查一条的功能，此功能转到医院详情接口
servers.getHospitalList = function (postdata, callback) {
  let url = '/doctor/adminPlatform/getHospitalList';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 医院详情
servers.getHospital = function (postdata,callback) {
  let url = '/doctor/adminPlatform/getHospital';
  postdata = postdata || {};
  servers._post(url,postdata, callback);
};

// // 医生列表
// servers.getDoctorList = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/doctorList';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// //   医生详情
// servers.getDoctorDetail = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/getDoctor';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };


// // 科室列表
// servers.getOfficeList = function (callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/getOfficeList';
//   servers._get(url, callback);
// };

// // 科室状态修改
// servers.modifyOfficeStatus = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/modifyOfficeStatus ';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// servers.getTeamRole = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/team/teamMenberInfoList'
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// }

// // 科室状态名称（只支持一条一条修改)
// servers.modifyOffice = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/modifyOffice';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 科室名称添加
// servers.addOffice = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/addOffice';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 医院状态修改
// servers.modifyHospitalStatus = function (postdata, callback) {
//   let url = '/doctor/platform/hospital/modifyHospitalStatus';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 修改医院
servers.modifyHospital = function (postdata, callback) {
  let url = '/doctor/adminPlatform/modifyHospital';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// servers.modifyDoctor = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/modifyDoctor';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// }



// // 医生状态修改
// servers.modifyDoctorStatus = function (postdata, callback) {
//   let url = '/doctorPcPlatform/hospital/modifyDoctorStatus';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };
// // 医护人员资质审核
// servers.auditDoctorStatus = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/hospital/auditDoctor';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 医生详情
// servers.getDoctor = function (postdata, callback) {
//   let url = '/doctor/platform/hospital/getDoctor';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 添加医生
// servers.addDoctor = function (postdata, callback) {
//   let url = '/doctor/platform/hospital/addDoctor';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 修改医生助理信息
// servers.modifyDoctor = function (postdata, callback) {
//   let url = '/doctor/platform/hospital/modifyDoctor';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };


// 查询角色详情
servers.getRole = function (postdata, callback) {
  let url = '/doctor/adminPlatform/getRole';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 获取角色列表
servers.getRoleList = function (callback) {
  let url = '/doctor/adminPlatform/getRoleList';
  servers._post(url,callback);
};

// adminPlatform/getRole

// adminPlatform/getRoleFunction

servers.getRoleFunction = function (postdata, callback) {
  let url = '/doctor/adminPlatform/getRoleFunction';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};


// 角色删除
servers.deleteRole = function (postdata, callback) {
  let url = '/doctor/adminPlatform/deleteRole';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 添加角色
servers.addRole = function (postdata, callback) {
  let url = '/doctor/adminPlatform/addRole';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 修改角色信息
servers.modifyRole = function (postdata, callback) {
  let url = '/doctor/adminPlatform/modifyRole';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 查询权限列表
// servers.getFunction = function (postdata, callback) {
//   let url = '/doctor/platform/manager/getFunction';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 获取权限列表
servers.getFunctionList = function (callback) {
  let url = '/doctor/adminPlatform/getFunctionList';
  // postdata = postdata || {};
  servers._post(url, callback);
};

// 权限状态修改
// servers.modifyFunctionStatus = function (postdata, callback) {
//   let url = '/doctor/platform/manager/modifyFunctionStatus';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 权限删除
// servers.deleteFunction = function (postdata, callback) {
//   let url = '/doctor/platform/manager/deleteFunction';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 添加权限
// servers.addFunction = function (postdata, callback) {
//   let url = '/doctor/platform/manager/addFunction';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 修改权限信息
// servers.modifyFunction = function (postdata, callback) {
//   let url = '/doctor/platform/manager/modifyFunction';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 家庭医生团队列表
servers.teamList = function (postdata, callback) {
  let url = '/doctor/adminPlatform/teamList';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 家庭医生团队详情团队成员列表
// servers.teamInfo = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/team/teamInfo';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };
// servers.teamMemInfo = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/team/teamInfo';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };
// 添加团队
// servers.addTeam = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/team/addTeam';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// 修改团队信息
// servers.modifyTeam = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/team/modifyTeam';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 添加团队成员
// servers.addTeamMember = function (postdata, callback) {
//   let url = '/doctor/platform/team/addTeamMember';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 团队成员状态修改
// servers.modifyTeamMbStatus = function (postdata, callback) {
//   let url = '/doctor/platform/team/modifyTeamMbStatus';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 团队状态修改
// servers.modifyTeamStatus = function (postdata, callback) {
//   let url = '/doctor/doctorPcPlatform/team/modifyTeamStatus';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 修改团队成员信息
// servers.modifyTeamMember = function (postdata, callback) {
//   let url = '/doctor/platform/team/modifyTeamMember';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };



// // 管理员状态修改
// servers.modifyManagerStatus = function (postdata, callback) {
//   let url = '/doctor/platform/manager/modifyManagerStatus';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 管理员删除
// servers.deleteManager = function (postdata, callback) {
//   let url = '/doctor/platform/manager/deleteManager';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 修改管理员信息
// servers.modifyManager = function (postdata, callback) {
//   let url = '/doctor/platform/manager/modifyManager';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 添加管理员
// servers.addManager = function (postdata, callback) {
//   let url = '/doctor/platform/manager/addManager';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 设置管理员账号角色接口
// servers.addManagerRole = function (postdata, callback) {
//   let url = '/doctor/platform/manager/addManagerRole';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };


// 登录接口
servers.adminLogin = function (postdata, callback) {
  // doctorPcPlatform/login
  let url = '/doctor/adminPlatform/login';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

servers.tkLogout = function (postdata, callback) {
  let url = '/sso/v1/logout'
  postdata = postdata || {}
  servers._post(url, postdata, callback);
}
// 注销登出接口
servers.adminLogout = function (callback) {
  let url = '/doctor/adminPlatform/logout';
  servers._get(url, callback);
};

// /sso/v1/pwdModify

servers.changePass = function (postdata, callback) {
  let url = '/sso/v1/pwdModify';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};

// 获取验证码接口
// servers.adminGetCode = function (postdata, callback) {
//   let url = '/doctor/platform/getCode';
//   postdata = postdata || {};
//   servers._get(url, postdata, callback);
// };

// 添加/修改医院上下级设置接口
// servers.addHospitalGrade = function (postdata, callback) {
//   let url = '/doctor/platform/hospital/addHospitalGrade';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };

// // 查询医院上下级设置接口
// servers.getHospitalGrade = function (postdata, callback) {
//   let url = '/doctor/platform/hospital/getHospitalGrade';
//   postdata = postdata || {};
//   servers._post(url, postdata, callback);
// };



servers.getToken = function (postdata, callback) {
  let url = '/sso/v1/login';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
};


servers.fetchProvinces = function (callback) {
  let url = '/doctor/adminPlatform/provinces';
  servers._get(url, callback);
};
servers.fetchCities = function (provinces, callback) {
  let url = `/doctor/adminPlatform/${provinces}/cities`;
  servers._get(url, callback);
};
servers.fetchCounties = function (city, callback) {
  let url = `/doctor/adminPlatform/${city}/counties`;
  servers._get(url, callback);
};
servers.fetchTowns = function (counties, callback) {
  let url = `/doctor/adminPlatform/${counties}/towns`;
  servers._get(url, callback);
};
servers.fetchVillages = function (towns, callback) {
  let url = `/doctor/adminPlatform/${towns}/villages`;
  servers._get(url, callback);
};
servers.fetchAddress = function (regionInfo, callback) {
  let url = `/doctor/adminPlatform/regionInfo/${regionInfo}`;
  servers._get(url, callback);
};

servers.getUserList = function (postdata, callback) {
  let url = '/doctor/adminPlatform/userList';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}

servers.getAdminInfo = function (id, callback) {
  let url = `/doctor/adminPlatform/userInfo?id=${id}`
  servers._get(url, callback);
}

servers.modifyRoleStatus = function (postdata, callback) {
  let url = '/doctor/adminPlatform/modifyRoleStatus';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}
// adminPlatform/userAdd
servers.userAdd = function (postdata, callback) {
  let url = '/doctor/adminPlatform/userAdd';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}
// userUpdate
servers.userUpdate = function (postdata, callback) {
  let url = '/doctor/adminPlatform/userUpdate';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}

// adminPlatform/useStatus
servers.useStatus = function (postdata, callback) {
  let url = '/doctor/adminPlatform/useStatus';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}
// adminPlatform/userDel
servers.userDel = function (postdata, callback) {
  let url = '/doctor/adminPlatform/userDel';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}

servers.auditTeam = function (postdata, callback) {
  let url = '/doctor/adminPlatform/auditTeam';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}
// adminPlatform/teamMenberInfoList
servers.teamMenberInfoList = function (postdata, callback) {
  let url = '/doctor/adminPlatform/teamMenberInfoList';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}

// adminPlatform/modifyTeamStatus
servers.modifyTeamStatus = function (postdata, callback) {
  let url = '/doctor/adminPlatform/modifyTeamStatus';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}

// adminPlatform/delTeam
servers.delTeam = function (postdata, callback) {
  let url = '/doctor/adminPlatform/delTeam';
  postdata = postdata || {};
  servers._post(url, postdata, callback);
}




export default {
  install(Vue) {
    Vue.prototype.$http = axios
    Vue.http = axios
    Vue.prototype.$servers = servers
  },
  $http: axios,
  $servers: servers
}


export const $servers = servers
