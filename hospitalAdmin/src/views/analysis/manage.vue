<template>
  <div>
    <Form :label-width="120">

      <FormItem label="管理员账号：">
        <p v-show="editok">{{account}}</p>
        <Input placeholder="请输入3-30个字符(非中文)" clearable style="width: 500px" v-model="account" v-show="!editok"></Input>
      </FormItem>

      <FormItem label="管理员名称：">
        <Input placeholder="请输入2-12个字符" clearable style="width: 500px" v-model="adminName"></Input>
      </FormItem>

      <FormItem label="设置密码：">
        <Input placeholder="请输入8~16位的字母数字混合" type="password" clearable style="width: 500px" v-model="password"></Input>
      </FormItem>

      <FormItem label="确认密码：">
        <Input placeholder="请重复输入密码" clearable type="password" style="width: 500px" v-model="repass"></Input>
      </FormItem>

      <FormItem label="管理员角色：">
        <Select style="width:500px;margin-right:10px;" clearable v-model="role">
          <Option v-for="(item,index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="电子邮箱：">
        <Input placeholder="请输入邮箱地址" clearable style="width: 500px" v-model="email"></Input>
      </FormItem>

      <FormItem label="手机：">
        <p v-show="editok">{{phone}}</p>
        <Input placeholder="请输入手机号码" clearable style="width: 500px" v-model="phone" v-show="!editok"></Input>
      </FormItem>

      <FormItem label="状态：">
        <RadioGroup v-model="status">
          <Radio label="1">启用</Radio>
          <Radio label="0">停用</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="管辖区域：">
        <Select style="width:120px;margin-right:10px;" clearable v-model="counties" @on-change="fetchTowns">
          <Option v-for="(item,index) in countiesList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
        <Select style="width:120px;margin-right:10px;" clearable v-model="towns" @on-change="fetchVillages">
          <Option v-for="(item,index) in townsList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
        <Select style="width:120px;margin-right:10px;" clearable v-model="villages">
          <Option v-for="(item,index) in villagesList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="详细地址：">
        <Input placeholder="请输入详细地址" clearable style="width: 500px" v-model="address"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary" style="margin-left: 50px" @click="submitFn">{{editText}}</Button>
        <Button type="ghost" style="margin-left: 20px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
    name: 'manage',
    data() {
        return {
            editText: '完成',
            account: '',
            adminName: '',
            password: '',
            repass: '',
            role: '',
            roleList: [],
            status: '1',
            email: '',
            phone: '',
            location: '',
            counties: '',
            countiesList: [],
            towns: '',
            townsList: [],
            villages: '',
            villagesList: [],
            address: '',
            editok: false
        }
    },
    methods: {
        getRoleList() {
            this.$servers.getRoleList(res => {
                console.log(res)
                this.roleList = res.data.list
            })
        },
        getAdminInfo() {
            let id = JSON.parse(localStorage.getItem('loginInfo')).managerId
            this.$servers.getAdminInfo(id, res => {
                console.log(res.data.detail)
                // this.roleId = res.data.detail.roleId
                this.location = res.data.detail.locationCode
                this.fetchCounties()
            })
        },
        fetchCounties() {
            this.$servers.fetchCounties(this.location, res => {
                console.log(res.data.counties)
                this.counties = ''
                this.countiesList = res.data.counties
                // this.fetchTowns()
            })
        },
        fetchTowns() {
            this.towns = ''
            this.townsList = []
            this.villages = ''
            this.villagesList = []
            this.$servers.fetchTowns(this.counties, res => {
                console.log(res)
                this.towns = ''
                this.townsList = res.data.towns
                // this.fetchVillages()
            })
        },
        fetchVillages() {
            this.$servers.fetchVillages(this.towns, res => {
                console.log(res)
                this.villages = ''
                this.villagesList = res.data.villages
            })
        },
        submitFn() {
            let id = this.$route.query.id
            if (!id) {
                this.userAdd()
            } else {
                this.userUpdate()
            }
        },
        userAdd() {
            if (
                !this.account ||
                !this.adminName ||
                !this.password ||
                !this.phone ||
                !this.status ||
                !this.address ||
                !this.role
            ) {
                alert('请检查信息')
                return
            }
            if (this.password !== this.repass) {
                alert('两次输入密码不一致')
                return
            }
            let password = encryptbySM2(
                this.password,
                '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
            )
            let locationCode = ''
            if (this.villages) {
                locationCode = this.villages
            } else if (this.towns) {
                locationCode = this.towns
            } else if (this.counties) {
                locationCode = this.counties
            } else {
                locationCode = this.location
            }
            let postdata = {
                userName: this.account, //类型：String  必有字段  备注：管理员帐号（/^[a-zA-Z]\\w{5,20}$/）
                realName: this.adminName, //类型：String  必有字段  备注：管理员姓名
                password: password, //类型：String  必有字段  备注：密码
                mobilePhone: this.phone, //类型：String  必有字段  备注：手机（/^((16[0-9])|(17[0-9])|(14[0-9])|(13[0-9])|(15[^4,\\D])|(18[0-9]))\\d{8}$/）
                userMail: this.email, //类型：String  必有字段  备注：邮箱（/^[a-zA-z0-9][a-zA-Z0-9_\-\.]*@([a-zA-Z0-9]+[_\-\.])+[a-zA-Z]{2,4}$/）
                status: this.status, //类型：String  必有字段  备注：状态 1-启用 0-停用
                address: this.address, //类型：String  必有字段  备注：详细地址
                locationCode: locationCode, //类型：String  必有字段  备注：地址码
                roleId: this.role.toString()
            }
            console.log(postdata)
            this.$servers.userAdd(postdata, res => {
                console.log(res)
                if (res.retCode === '000000') {
                    this.$router.push({
                        name: 'service-manage'
                    })
                }
            })
        },
        userUpdate() {
            console.log(1)
            if (
                !this.account ||
                !this.adminName ||
                !this.phone ||
                !this.status ||
                !this.address ||
                !this.role
            ) {
                alert('请检查信息')
                return
            }
            if (this.password !== this.repass) {
                alert('两次输入密码不一致')
                return
            }
            let password = encryptbySM2(
                this.password,
                '04dbbaaa5891c6be721d7fb7f06f2f8d2caa173d342c9d3e8865819f5cb49f51e32c64032252fe1ac3e7d1a6c44acda6ad921420b2b5d770a6e9580e964cecd96c'
            )
            let locationCode = ''
            if (this.villages) {
                locationCode = this.villages
            } else if (this.towns) {
                locationCode = this.towns
            } else if (this.counties) {
                locationCode = this.counties
            } else {
                locationCode = this.location
            }

            let postdata = {
                id: this.$route.query.id, //类型：String  必有字段  备注：管理员id
                realName: this.adminName, //类型：String  必有字段  备注：姓名
                userMail: this.mail, //类型：String  必有字段  备注：邮箱
                status: this.status, //类型：String  必有字段  备注：状态 1-启用 0-停用
                address: this.address, //类型：String  必有字段  备注：详细地址
                locationCode: locationCode, //类型：String  必有字段  备注：12位地址码
                roleId: this.role.toString() //类型：String  必有字段  备注：角色Id
            }
            if (this.password) {
                postdata.password = password
            }
            console.log(postdata)
            this.$servers.userUpdate(postdata, res => {
                console.log(res)
                if (res.retCode === '000000') {
                    this.$router.push({
                        name: 'service-manage'
                    })
                }
            })
        },
        getAdminDetail() {
            let id = this.$route.query.id
            console.log(id)
            this.$servers.getAdminInfo(id, res => {
                let obj = res.data.detail
                this.account = obj.userName
                this.adminName = obj.realName
                this.phone = obj.mobilePhone
                this.email = obj.userMail
                this.status = obj.status
                this.address = obj.address
                this.role = parseInt(obj.roleId)
            })
        }
    },
    mounted() {
        this.getAdminInfo()
        this.getRoleList()
        let id = this.$route.query.id
        if (!id) {
            this.editText = '新建'
        } else {
            this.editok = true
            this.getAdminDetail()
        }
    }
}
</script>

<style scoped>
</style>
