<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          家医助手-医疗机构管理平台
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入账号">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <!-- <FormItem prop="phone">
                            <Input v-model="form.phone" placeholder="请输入手机号">
                                <span slot="prepend">
                                    <Icon :size="16" type="iphone"></Icon>
                                </span>
                            </Input>
                        </FormItem> -->
            <!-- <FormItem prop="checkCode">
                            <Row>
                                <Col :span="16">
                                <Input v-model="form.checkCode" placeholder="请输入验证码">
                                <span slot="prepend">
                                    <Icon :size="14" type="ipad"></Icon>
                                </span>
                                </Input>
                                </Col>
                                <Col :span="1">&nbsp;</Col>
                                <Col :span="6">

                                <img @click="sendCodeSubmit" :src="checkCodeUrl" height="32" />
                                </Col>
                                <Col :span="1">&nbsp;</Col>
                            </Row>
                        </FormItem> -->
            <!-- <Button type="primary" @click="sendCodeSubmit">{{ daojishi }}</Button> -->
            <FormItem>
              <Button :loading="saveLoading" @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    data() {
        return {
            saveLoading: false,
            daojishi: '发送手机验证码',
            checkCodeUrl: '',
            form: {
                userName: '',
                password: '',
                checkCode: ''
                // phone: '',
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
                // checkCode: [
                //   { required: true, message: '验证码不能为空', trigger: 'blur' },
                // ],
            }
        }
    },
    methods: {
        sendCodeSubmit() {
            let _this = this
            let postdata = {}
            _this.$servers.adminGetCode(postdata, function(data) {
                console.log('**********', data)
                if (data.src) {
                    // alert('ok')
                    _this.checkCodeUrl = data.src
                }
            })
            return
        },
        handleSubmit() {
            let _this = this
            // this.$refs.loginForm.validate(valid => {
            // if (valid) {
            const password = encryptbySM2(
                _this.form.password,
                '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
            )
            let postdata = {
                loginName: _this.form.userName,
                password
                // checkcode: _this.form.checkCode,
            }

            this.saveLoading = true

            _this.$servers.getToken(postdata, function(data) {
                console.log(data)
                if (data.retCode == '000000') {
                    let token = data.data.serviceToken
                    let tkdata = {
                        serviceToken: token
                    }
                    _this.$servers.adminLogin(tkdata, res => {
                        if (res.retCode === '000000') {
                            _this.saveLoading = false
                            let loginInfo = {}
                            loginInfo.managerId = data.data.userInfo.globalUserId
                            loginInfo.managerInfo = data.data.userInfo
                            console.log(loginInfo)
                            localStorage.setItem(
                                'loginInfo',
                                JSON.stringify(loginInfo)
                            )
                            localStorage.autoLoginJiayi = 'true'
                            _this.$store.commit(
                                'setAvator',
                                'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
                            )
                            Cookies.set('password', _this.form.password);
                            _this.$router.push({
                                name: 'home_index'
                            })
                        }
                    })
                } else {
                    _this.saveLoading = false
                }
            })
        }
    },
    created: function() {
        //this.sendCodeSubmit()
    }
}
</script>

<style>
</style>
