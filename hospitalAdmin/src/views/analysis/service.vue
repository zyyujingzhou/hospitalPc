<template>
  <Card>
    <div>
      <Button type="primary" @click="addAdmin">新增</Button>
      <Row type="flex" justify="start" align="middle">

        <p style="margin-right:10px;">管理员账号/名称</p>
        <input style="width:120px;margin-right:10px;" v-model="adminName">

        <p style="margin-right:10px;">管理员角色</p>
        <Select style="width:120px;margin-right:10px;" v-model="role">
          <Option v-for="(item,index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>

        <p style="margin-right:10px;">状态</p>
        <Select style="width:120px;margin-right:10px;" v-model="adminStatus">
          <Option value="1">已启用</Option>
          <Option value="0">已停用</Option>
        </Select>

        <p style="margin-right:10px;">管辖区域</p>
        <Select style="width:120px;margin-right:10px;" v-model="counties" @on-change="fetchTowns">
          <Option v-for="(item,index) in countiesList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
        <Select style="width:120px;margin-right:10px;" clearable v-model="towns">
          <Option v-for="(item,index) in townsList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
        <span style="margin: 0 10px;">
          <Button type="primary" @click="getData()">搜索</Button>
        </span>
        <span style="margin: 0 10px;">
          <Button @click="resetFn">重置</Button>
        </span>

      </Row>

      <Table highlight-row :columns="columns" :data="list"></Table>
      <Row class="margin-top-10">
        <Col>
        <Row type="flex" justify="end">
          <Page :page-size="size" :current="page" show-elevator @on-change="handleOnChange"></Page>
        </Row>
        </Col>
      </Row>
    </div>
  </Card>
</template>
<script>
export default {
    data() {
        return {
            page: 1,
            size: 10,
            teamName: '',
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    align: 'center',
                    title: '管理员账号',
                    key: 'number'
                },
                {
                    align: 'center',
                    title: '管理员名称',
                    key: 'name'
                },
                {
                    align: 'center',
                    title: '管理员角色',
                    key: 'role'
                },

                {
                    align: 'center',
                    title: '状态',
                    key: 'state'
                },
                {
                    align: 'center',
                    title: '管辖区域',
                    key: 'area'
                },
                {
                    align: 'center',
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeUseStatus(
                                                params.row.id,
                                                params.row.status
                                            )
                                        }
                                    }
                                },
                                params.row.act
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let query = { id: params.row.id }
                                            this.$router.push({
                                                name: 'manage',
                                                query: query
                                            })
                                        }
                                    }
                                },
                                '编辑'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                },
                                '删除'
                            )
                        ]
                    }
                }
            ],
            data: [],
            list: [],
            adminName: '',
            adminStatus: '',
            counties: '',
            countiesList: [],
            towns: '',
            townsList: '',
            location: '',
            role: '',
            roleList: ''
        }
    },
    methods: {
        getAdminInfo() {
            let id = JSON.parse(localStorage.getItem('loginInfo')).managerId
            this.$servers.getAdminInfo(id, res => {
                console.log(res.data.detail)
                // this.roleId = res.data.detail.roleId
                this.location = res.data.detail.locationCode
                this.fetchCounties()
            })
        },
        getData() {
            let postdata = {
                pageSize: this.size, //类型：Mixed  必有字段  备注：无
                pageNo: this.page, //类型：Mixed  必有字段  备注：无
                keyword: this.adminName, //类型：String  可有字段  备注：无
                region: this.counties, //类型：String  可有字段  备注：区县码值
                villages: this.towns, //类型：String  可有字段  备注：乡镇街道码值
                roleId: this.role
            }
            this.$servers.getUserList(postdata, res => {
                console.log(res.data.list)
                let list = res.data.list

                list = list.map((item, index) => {
                    let show = ''
                    if (item.status === '1') {
                        show = '启用'
                    } else {
                        show = '停用'
                    }
                    let act = ''
                    if (item.status === '1') {
                        act = '停用'
                    } else {
                        act = '启用'
                    }
                    let tObj = {
                        index: index,
                        number: item.userName,
                        name: item.realName,
                        role: item.roleName,
                        state: show,
                        area: item.locationCode,
                        id: item.id,
                        status: item.status,
                        act: act
                    }
                    return tObj
                })
                console.log(list)
                this.list = list
            })
        },
        handleOnChange(page) {
            this.page = page
            this.getData()
        },
        getRoleList() {
            this.$servers.getRoleList(res => {
                this.roleList = res.data.list
            })
        },
        fetchCounties() {
            this.$servers.fetchCounties(this.location, res => {
                console.log(res.data.counties)
                this.counties = res.data.counties[0].code
                this.countiesList = res.data.counties
                this.fetchTowns()
            })
        },
        fetchTowns() {
            this.$servers.fetchTowns(this.counties, res => {
                console.log(res)
                this.towns = res.data.towns[0].code
                this.townsList = res.data.towns
            })
        },
        resetFn() {
            this.adminName = ''
            this.addAdmin = ''
            this.adminStatus = ''
            this.counties = this.countiesList[0].code
            this.towns = this.townsList[0].code
        },
        addAdmin() {
            console.log(1)
            this.$router.push({
                name: 'manage'
            })
        },
        remove(id) {
            let arr = []
            arr.push(id)
            let postdata = {
                ids: arr //类型：String  必有字段  备注：管理员id,多个id之间以逗号分隔
            }
            this.$servers.userDel(postdata, res => {
                if (res.retCode === '000000') {
                    console.log('ok')
                    this.getData()
                }
            })
        },
        changeUseStatus(id, status) {
            let setStatus = ''
            if (status === '1') {
                setStatus = '0'
            } else {
                setStatus = '1'
            }
            let postdata = {
                id: id, //类型：String  必有字段  备注：管理员Id
                status: setStatus
            }
            this.$servers.useStatus(postdata, res => {
                if (res.retCode === '000000') {
                    console.log('ok')
                    this.getData()
                }
            })
        }
    },
    mounted() {
        this.getAdminInfo()
        this.getRoleList()
        this.getData()
    }
}
</script>
<style lang="less">
</style>
