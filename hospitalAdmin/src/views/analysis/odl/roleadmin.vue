<template>
  <Card>
    <div>
      <Row type="flex" justify="start" align="middle">
        <p style="margin-right:10px;">角色名称</p>
        <input style="width:120px;margin-right:10px;" clearable v-model="searchName">
        <p style="margin-right:10px;">状态</p>
        <Select style="width:120px;margin-right:10px;" clearable v-model="searchStatus">
          <Option value="11">全部</Option>
          <Option value="00">已启用</Option>
          <Option value="01">已停用</Option>
        </Select>
        <span style="margin: 0 20px;">
          <Button type="primary" @click="searchFn">搜索</Button>
        </span>
        <span style="margin: 0 20px;">
          <Button @click="initSearch">重置</Button>
        </span>
        <span style="margin: 0 20px;">
          <Button type="primary" @click="addRole">新增</Button>
        </span>
      </Row>
      <Table highlight-row :columns="columns" :data="list"></Table>

    </div>
  </Card>
</template>
<script>
export default {
    name: 'role-manage',
    data() {
        return {
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    align: 'center',
                    title: '角色名称',
                    key: 'name'
                },
                {
                    align: 'center',
                    title: '状态',
                    key: 'state'
                },
                {
                    align: 'center',
                    title: '创建时间',
                    key: 'date'
                },
                {
                    align: 'center',
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeStatus(
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
                                                name: 'role',
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
                                            this.deleteRole(params.row.id)
                                        }
                                    }
                                },
                                '删除'
                            )
                        ])
                    }
                }
            ],
            data: [],
            list: [],
            searchStatus: '11',
            searchName: ''
        }
    },
    methods: {
        getData() {
            this.$servers.getRoleList(res => {
                let list = res.data.list
                console.log(list)
                list = list.map((item, index) => {
                    let state = ''
                    if (item.status === '1') {
                        state = '已启用'
                    } else {
                        state = '已停用'
                    }
                    let tObj = {
                        name: item.name,
                        state: state,
                        date: item.createDt,
                        status: item.status,
                        type: item.type,
                        id: item.id
                    }
                    let act = ''
                    if (item.status === '1') {
                        act = '停用'
                    } else {
                        act = '启用'
                    }
                    tObj.act = act
                    // if (item.type !== 0) {
                    //     tObj.act = act
                    // }
                    return tObj
                })
                this.data = list
                this.list = list
            })
        },
        searchFn() {
            let list = this.data
            let arr1 = []

            if (this.searchName) {
                let reg = new RegExp(this.searchName, 'i')
                list.forEach(item => {
                    if (item.name.match(reg)) {
                        arr1.push(item)
                    }
                })
            } else {
                arr1 = list
            }
            let arr2 = []
            arr1.forEach(item => {
                if (item.type === 0) {
                    arr2.push(item)
                }
                if (item.status === this.searchStatus) {
                    arr2.push(item)
                }
            })
            this.list = arr2

            // this.list = arr
            //   this.doctorList = list
        },
        initSearch() {
            this.searchStatus = '11'
            this.searchName = ''
        },
        addRole() {
            this.$router.push({
                name: 'role'
            })
        },
        deleteRole(id) {
            console.log(id)
            let postdata = {
                id: id //类型：Number  必有字段  备注：角色ID
            }
            this.$servers.deleteRole(postdata, res => {
                this.getData()
            })
        },
        changeStatus(id, status) {
            console.log(id)
            console.log(status)
            let setStatus = ''
            if (status === '1') {
                setStatus = 0
            } else {
                setStatus = 1
            }
            let postdata = {
                status: setStatus, //类型：String  必有字段  备注：状态
                roleId: id //类型：String  必有字段  备注：角色ID
            }
            this.$servers.modifyRoleStatus(postdata,res => {
              this.getData()
            })
        }
    },
    mounted() {
        this.getData()
    }
}
</script>
<style>
</style>
