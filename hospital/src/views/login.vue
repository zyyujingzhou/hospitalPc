<style lang="less">
@import './login.less';
.a {
    cursor: pointer;
}
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          家医助手-医疗机构管理平台
        </p>

        <div class="form-con" v-show="passLogin">
          <Form ref="loginForm" :model="form">
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
            <FormItem>
              <Button :loading="saveLoading" @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p style="text-decoration:underline;cursor: pointer;color:blue;text-align:right" @click="resetPass">找回密码</p>
          <p>我还没有账号,去
            <Button type="default" @click="goRegister">注册</Button>
          </p>
        </div>

        <div class="form-con" v-show="phoneLogin">
          <Form ref="loginForm" :model="form">
            <FormItem prop="userName">
              <Input v-model="form.phone" placeholder="请输入手机号">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="userName">
              <Button :loading="sendLoading" long @click="sendPhoneCode">发送短信验证码</Button>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.phoneCode" placeholder="请输入验证码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button :loading="saveLoading" @click="phoneSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>

        <div class="form-con" v-show="registerBar">
          <Form ref="regisForm" :model="regisForm">

            <FormItem prop="userName">
              <Input v-model="phone" placeholder="请输入您的手机号">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>

            <FormItem prop="userName">
              <Input v-model="phoneCode" placeholder="请输入验证码">
              <span slot="prepend">
                <Icon :size="16" type="locked"></Icon>
              </span>
              </Input>
              <Button :loading="sendLoading" long @click="sendPhoneCode">获取验证码</Button>
            </FormItem>

            <FormItem prop="password">
              <Input type="password" v-model="regisForm.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>

            <FormItem prop="password">
              <Input type="password" v-model="regisForm.repass" placeholder="请输入确认密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>

            <FormItem>
              <Button :loading="saveLoading" @click="regisSubmit" type="primary" long>注册</Button>
            </FormItem>

            <p>我已有账号，直接
              <Button type="default" @click="goLogin">登录</Button>
            </p>

          </Form>
        </div>

        <div class="form-con" v-show="resetBar">
          <Form ref="regisForm" :model="regisForm">

            <FormItem prop="userName">
              <Input v-model="phone" placeholder="请输入您的手机号">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>

            <FormItem prop="userName">
              <Input v-model="phoneCode" placeholder="请输入验证码">
              <span slot="prepend">
                <Icon :size="16" type="locked"></Icon>
              </span>
              </Input>
              <Button :loading="sendLoading" long @click="sendPhoneCode">获取验证码</Button>
            </FormItem>

            <FormItem prop="password">
              <Input type="password" v-model="regisForm.password" placeholder="请输入新密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>

            <FormItem prop="password">
              <Input type="password" v-model="regisForm.repass" placeholder="请输入确认密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>

            <FormItem>
              <Button @click="resetFn" type="primary" long>重置密码</Button>
            </FormItem>

          </Form>
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
            resetBar: false,
            registerBar: false,
            phoneLogin: false,
            passLogin: true,
            saveLoading: false,
            sendLoading: false,
            daojishi: '发送手机验证码',
            checkCodeUrl: '',
            regisForm: {
                password: '',
                repass: ''
            },
            phone: '',
            phoneCode: '',
            form: {
                userName: '',
                password: ''
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
        goRegister() {
            this.passLogin = false
            this.registerBar = true
        },
        goLogin() {
            this.registerBar = false
            this.passLogin = true
        },
        resetPass() {
            this.passLogin = false
            this.resetBar = true
        },
        regisSubmit() {
            if (!this.regisForm.password || !this.regisForm.repass) {
                alert('请输入密码')
            }
            if (this.regisForm.password !== this.regisForm.repass) {
                alert('请输入相同的密码')
            } else {
                this.$servers.checkAvailable(this.phone, data => {
                    console.log(data.retCode)
                    if (data.retCode === '000000') {
                        console.log(1)
                        let postdata = {
                            mobileNo: this.phone, //类型：String  必有字段  备注：手机号
                            smsCode: this.phoneCode //类型：String  必有字段  备注：短信验证码
                        }
                        console.log(postdata)
                        this.$servers.smsCodeVerify(postdata, response => {
                            if (response.retCode === '000000') {
                                let password = encryptbySM2(
                                    this.regisForm.password,
                                    '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
                                )
                                let postdata = {
                                    verifyCode: this.phoneCode, //类型：String  必有字段  备注：无
                                    userMobile: this.phone, //类型：String  必有字段  备注：无
                                    newPassword: password //类型：String  必有字段  备注：无
                                }
                                this.$servers.resetFn(postdata, res => {
                                    console.log(res)
                                    if (res.retCode === '000000') {
                                        alert('恭喜您，重置密码成功')
                                        this.$router.push({
                                            name: 'login'
                                        })
                                    }
                                })
                            } else if (response.retCode === '010005') {
                                alert('验证码错误')
                            }
                        })
                    } else {
                        alert('您已经注册过了')
                    }
                })
            }
        },
        sendPhoneCode() {
            console.log(1)
            this.sendLoading = true
            this.$servers.sendSmsCode(this.phone, res => {
                console.log(res)
                if (res.retCode === '000000') {
                    this.sendLoading = false
                } else {
                    this.sendLoading = false
                }
            })
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
                        if (res.retCode === '000') {
                            _this.saveLoading = false
                            let loginInfo = {}
                            loginInfo.managerId =
                                data.data.userInfo.globalUserId
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
                            Cookies.set('password', _this.form.password)
                            _this.$router.push({
                                name: 'home_index'
                            })
                        }
                    })
                } else if (data.retCode === '010028') {
                    _this.saveLoading = false
                    _this.passLogin = false
                    _this.phoneLogin = true
                } else {
                    _this.saveLoading = false
                }
            })
        },
        phoneSubmit() {
            let postdata = {
                mobileNo: this.phone, //类型：String  必有字段  备注：手机号
                smsCode: this.phoneCode //类型：String  必有字段  备注：短信验证码
            }
            console.log(postdata)
            this.$servers.smsCodeVerify(postdata, response => {
                if (response.retCode === '000000') {
                    let postdata = {
                        loginName: this.phone,
                        verifyCode: this.phoneCode
                    }
                    this.$servers.getToken(postdata, function(data) {
                        console.log(data)
                        if (data.retCode == '000000') {
                            let token = data.data.serviceToken
                            let tkdata = {
                                serviceToken: token
                            }
                            this.$servers.adminLogin(tkdata, res => {
                                if (res.retCode === '000') {
                                    _this.saveLoading = false
                                    let loginInfo = {}
                                    loginInfo.managerId =
                                        data.data.userInfo.globalUserId
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
                                    Cookies.set('password', _this.form.password)
                                    _this.$router.push({
                                        name: 'home_index'
                                    })
                                }
                            })
                        } else {
                            _this.saveLoading = false
                        }
                    })
                } else if (response.retCode === '010005') {
                    alert('验证码错误')
                }
            })
        },
        resetFn() {
            if (!this.regisForm.password || !this.regisForm.repass) {
                alert('请输入密码')
            }
            if (this.regisForm.password !== this.regisForm.repass) {
                alert('请输入相同的密码')
            } else {
                let postdata = {
                    mobileNo: this.phone, //类型：String  必有字段  备注：手机号
                    smsCode: this.phoneCode //类型：String  必有字段  备注：短信验证码
                }
                console.log(postdata)
                this.$servers.smsCodeVerify(postdata, response => {
                    if (response.retCode === '000000') {
                        let password = encryptbySM2(
                            this.regisForm.password,
                            '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
                        )
                        let postdata = {
                            userName: 'newUser', //类型：String  必有字段  备注：无
                            userMobile: this.phone, //类型：String  必有字段  备注：无
                            userPass: password, //类型：String  必有字段  备注：无
                            verifyCode: this.phoneCode //类型：String  必有字段  备注：无
                        }
                        this.$servers.regist(postdata, res => {
                            console.log(res)
                            if (res.retCode === '00000') {
                                alert('恭喜您，注册成功')
                            }
                        })
                    } else if (response.retCode === '010005') {
                        alert('验证码错误')
                    }
                })
            }
        }
    },
    created: function() {
        //this.sendCodeSubmit()
    }
}
</script>

<style>
</style>
