<template>
  <Row>
    <Form :label-width="120">
      <FormItem label="角色名称：">
        <Input placeholder="请输入0-12个字符" clearable style="width: 500px" v-model="username"></Input>
      </FormItem>
      <FormItem label="角色描述：">
        <Input placeholder="请输入2-100个字符" clearable style="width: 500px" v-model="desc"></Input>
      </FormItem>
      <FormItem label="状态：">
        <RadioGroup v-model="status">
          <Radio label="1">启用</Radio>
          <Radio label="0">停用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label='区域权限：'>
        <FormItem label='地区管理：'>
          <Checkbox :value="addressAdmin">地区管理</Checkbox>
        </FormItem>

        <FormItem label='医疗机构管理：'>

          <Checkbox :value="hosAdmin">医疗机构管理</Checkbox>
          <Checkbox :value="teamAdmin">家医团队管理</Checkbox>

        </FormItem>

        <FormItem label='权限管理：'>

          <Checkbox :value="accountAdmin">账号管理</Checkbox>
          <Checkbox :value="roleAdmin">角色管理</Checkbox>

        </FormItem>
      </FormItem>

      <FormItem>
        <i-button type="primary" style="margin-left: 100px" @click="save">保存</i-button>
        <i-button type="primary" style="margin-left: 50px" @click="back">取消</i-button>
      </FormItem>
    </Form>
  </Row>
</template>

<script>
export default {
    name: 'role',
    data() {
        return {
            username: '',
            desc: '',
            status: '1',
            addressAdmin: false,
            hosAdmin: false,
            teamAdmin: false,
            accountAdmin: false,
            roleAdmin: false
        }
    },
    methods: {
        getRoleDetail(id) {
            let postdata = {
                roleId: id //类型：Number  必有字段  备注：角色ID
            }
            this.$servers.getRole(postdata, res => {
                console.log(res.data)
                this.username = res.data.name
                this.status = res.data.status
                this.desc = res.data.remark
            })
        },
        getRoleFn(id) {
            let postdata = {
                roleId: id //类型：Number  必有字段  备注：角色ID
            }
            this.$servers.getRoleFunction(postdata, res => {
                console.log(res.data)
                let list = res.data
                let toArr = []
                for (var i in list) {
                    toArr.push(list[i]) //值
                }
                console.log(toArr)
                toArr.forEach(item => {
                    if (item.node) {
                        let arr = item.node
                        console.log(arr)
                        arr.forEach(one => {
                            console.log(one)
                            if (one.permissionId == '103') {
                                this.hosAdmin = true
                            }
                            if (one.permissionId == '104') {
                                this.teamAdmin = true
                            }
                            if (one.permissionId == '105') {
                                this.accountAdmin = true
                            }
                            if (one.permissionId == '106') {
                                this.roleAdmin = true
                            }
                        })
                    }
                })
            })
        },
        save() {
            let id = this.$route.query.id
            if (id) {
                console.log('编辑')
                // modifyRole
                let permissionArr = []
                let postdata = {
                    id: id,
                    name: this.username, //类型：String  必有字段  备注：角色名称
                    // supervisor: 0, //类型：Number  可有字段  备注：是否超管
                    // type: 1, //类型：Number  可有字段  备注：预留角色类型
                    permissions: permissionArr,
                    status: parseInt(this.status)
                }
                console.log(postdata)
                this.$servers.modifyRole(postdata, res => {
                    if (res.retCode === '000') {
                        this.$router.push({
                            name: 'role-manage'
                        })
                    }
                })
            } else {
                let permissionArr = []
                if(this.hosAdmin === true){
                  permissionArr.push(103)
                }
                if(this.teamAdmin === true){
                  permissionArr.push(104)
                }
                if(this.accountAdmin === true){
                  permissionArr.push(105)
                }
                if(this.hosAdmin === true){
                  permissionArr.push(106)
                }
                if(this.hosAdmin === true){
                  permissionArr.push(103)
                }

                let postdata = {
                    name: this.username, //类型：String  必有字段  备注：角色名称
                    // supervisor: 0, //类型：Number  可有字段  备注：是否超管
                    type: 1, //类型：Number  可有字段  备注：预留角色类型
                    permissions: permissionArr,
                    status: parseInt(this.status)
                }
                console.log(postdata)
                this.$servers.addRole(postdata, res => {
                    if (res.retCode === '000') {
                        this.$router.push({
                            name: 'role-manage'
                        })
                    }
                })
            }
        },
        back() {
            this.$router.push({
                name: 'role-manage'
            })
        },
        getFunctionList(){
          this.$servers.getFunctionList(res => {
            console.log(res)
          })
        }
    },
    mounted() {
        let id = this.$route.query.id
        if (id) {
            this.getRoleDetail(id)
            this.getRoleFn(id)
        }
        this.getFunctionList()
    }
}
</script>

<style scoped>
</style>
