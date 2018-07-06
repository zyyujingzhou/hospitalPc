<style lang="less">
@import './own-space.less';
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        个人中心
      </p>
      <div>
        <Row>

          <Row>
            <Col span="1">
            <img :src="avatorImgPath" style="width:40px">
            </Col>
            <Col span="1">{{ username }}</Col>
            <Col span="4">医疗机构管理员</Col>
          </Row>
          <Row>
            <Col span="6">所属机构:{{hospital}}</Col>
          </Row>
          <Button style="width:200px;" @click="editModal()">修改密码</Button>
        </Row>

        <!-- <Modal :width="500" v-show="editPasswordModal" :closable='false' :mask-closable='false'>
          <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
          <Form ref="editPasswordForm" :label-width="100" label-position="right">
            <FormItem label="旧密码" prop="oldPass">
              <Input placeholder="请输入现在使用的密码" v-model="oldPass"></Input>
            </FormItem>
            <FormItem label="新密码" prop="newPass">
              <Input placeholder="请输入新密码，至少6位字符" v-model="newPass"></Input>
            </FormItem>
            <FormItem label="重复新密码" prop="rePass">
              <Input placeholder="请再次输入新密码" v-model="rePass"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text">确认修改</Button>
          </div>
        </Modal> -->
        <Modal v-model="editPasswordModal" :width="500" :mask-closable=false>
          <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
          <Form ref="editPasswordForm" :label-width="100" label-position="right">
            <FormItem label="原密码" prop="oldPass">
              <Input v-model="oldPass" type="password" placeholder="请输入现在使用的密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="newPass">
              <Input v-model="newPass" type="password" placeholder="请输入新密码，至少8位字符"></Input>
            </FormItem>
            <FormItem label="确认新密码" prop="rePass">
              <Input v-model="rePass" type="password" placeholder="请再次输入新密码"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="changePass">确认修改</Button>
          </div>
        </Modal>

        <Modal v-model="msg" :width="500" :mask-closable=false>
          <Col>
          <h1>{{msgtxt}}</h1>
          </Col>
        </Modal>

      </div>
    </Card>

  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    name: 'ownspace_index',
    data() {
        return {
            msgtxt: '',
            msg: false,
            avatorImgPath: '',
            loginInfo: '',
            username: '',
            hospital: '',
            editPasswordModal: false,
            oldPass: '',
            newPass: '',
            rePass: ''
        }
    },
    methods: {
        getMsg() {
            this.avatorImgPath = localStorage.getItem('avatorImgPath')
            this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
            this.username = this.loginInfo.managerInfo.realName
            // this.hospital = this.loginInfo.managerInfo.hospitalManager[0].name
            console.log(this.loginInfo)
        },
        editModal() {
            this.editPasswordModal = true
        },
        getHos() {
            let self = this
            self.$servers.getHospital(res => {
                this.hospital = res.data.hospitalList[0].name
            })
        },
        changePass() {
            console.log(111)
            let pass = Cookies.get('password')
            if (this.oldPass !== pass) {
                this.msgtxt = '原密码错误'
                this.msg = true
            } else if (!this.newPass) {
                this.msgtxt = '请输入新密码'
                this.msg = true
            } else if (this.newPass === pass) {
                this.msgtxt = '与原密码相同'
                this.msg = true
            } else if (this.newPass !== this.rePass) {
                this.msgtxt = '确认密码不正确'
                this.msg = true
            } else {
                let oldPsw = encryptbySM2(
                    this.oldPass,
                    '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
                )
                let newPsw = encryptbySM2(
                    this.newPass,
                    '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
                )
                // console.log(password)
                let postdata = {
                    oldPassword: oldPsw,
                    newPassword: newPsw
                }
                let self = this
                self.$servers.changePass(postdata, res => {
                    if (res.retCode === '000000') {
                        self.msgtxt = '密码修改成功！请重新登录'
                        self.msg = true
                        Cookies.set('password', self.newPass)
                        let postdata = {}
                        self.$servers.tkLogout(postdata, function(data) {
                            if (data.retCode == '000000') {
                                self.$servers.adminLogout(response => {
                                    if (response.retCode === '000') {
                                        localStorage.autoLoginJiayi = 'false'
                                        self.$store.commit('logout', this)
                                        self.$store.commit('clearOpenedSubmenu')
                                        self.$router.push({
                                            name: 'login'
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    },
    mounted() {
        this.getMsg()
        this.getHos()
    }
}
</script>
