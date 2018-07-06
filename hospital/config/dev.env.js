'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // 连接的是公司4.55测试环境
  BASE_API: '"platform"',
  BASE_API_upload: '"http://192.168.4.30:9083/kfpt_app/uploadMasForDocPc"',
  // 连接的是廊卫4.10号演示环境
  // BASE_API: '"http://222.222.111.132:9084/admSite/v1"',
  // BASE_API_sso: '"http://222.222.111.132:9084/sso/v1"'
})
