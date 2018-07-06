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

        <FormItem v-for="(item,index) in adminList" :key="index" :label='item.name'>
          <Checkbox v-for="(ite,idx) in item.node" :key='idx' @on-change="ite.torf = !ite.torf;addPermissionsList(ite.permissionId);" :value='ite.torf'>{{ite.name}}</Checkbox>
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
            adminList: [],
            permissionsList: [],
            checkList: [],
            allList: []
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
                let list = res.data
                let toArr = []
                for (var i in list) {
                    if (list[i].node) {
                        toArr.push(list[i]) //值
                    }
                }
                console.log(toArr)

                let checkList = []
                toArr.forEach(item => {
                    if (item.node) {
                        item.node.forEach(ite => {
                            checkList.push(ite.permissionId)
                        })
                    }
                })
                console.log(checkList)
                this.permissionsList = checkList

                let goList = this.adminList

                goList.forEach(item => {
                    item.node.forEach(ite => {
                        checkList.forEach(it => {
                            if (ite.permissionId === it) {
                                ite.torf = true
                            }
                        })
                    })
                })

                this.adminList = goList
            })
        },
        save() {
            let id = this.$route.query.id
            if (id) {
                console.log('编辑')
                // modifyRole
                let postdata = {
                    id: id,
                    name: this.username, //类型：String  必有字段  备注：角色名称
                    // supervisor: 0, //类型：Number  可有字段  备注：是否超管
                    // type: 1, //类型：Number  可有字段  备注：预留角色类型
                    permissions: this.permissionsList,
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
                let postdata = {
                    name: this.username, //类型：String  必有字段  备注：角色名称
                    // supervisor: 0, //类型：Number  可有字段  备注：是否超管
                    type: 1, //类型：Number  可有字段  备注：预留角色类型
                    permissions: this.permissionsList,
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
        getFunctionList() {
            this.$servers.getFunctionList(res => {
                let list = res.data
                let toArr = []
                for (var i in list) {
                    if (list[i].node) {
                        toArr.push(list[i]) //值
                    }
                }
                console.log(toArr)
                toArr = toArr.map(item => {
                    if (item.node) {
                        item.node.forEach(ite => {
                            ite.torf = false
                        })
                        return item
                    }
                })

                let checkList = []
                toArr.forEach(item => {
                    if (item.node) {
                        item.node.forEach(ite => {
                            checkList.push(ite.permissionId)
                        })
                    }
                })
                this.checkList = checkList
                this.adminList = toArr
                console.log(toArr)
                let id = this.$route.query.id
                if (id) {
                    this.getRoleDetail(id)
                    this.getRoleFn(id)
                }
            })
        },
        addPermissionsList(id) {
            let adminList = this.adminList
            let list = []
            adminList.forEach(item => {
                item.node.forEach(ite => {
                    console.log(ite)
                    if (ite.torf === true) {
                        list.push(item.permissionId)
                        list.push(ite.permissionId)
                    }
                })
            })
            let arr = Array.from(new Set(list))
            this.permissionsList = arr
        }
    },
    mounted() {
        this.getFunctionList()
    }
}
</script>

<style scoped>
</style>
