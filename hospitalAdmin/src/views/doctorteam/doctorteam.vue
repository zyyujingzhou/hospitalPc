<template>
  <div>
    <Card>
      <Row>
        <ButtonGroup>
          <Button style="width:200px" type="default" @click="setShow('0')">待审核</Button>
          <Button style="width:200px" type="default" @click="setShow('1')">审核通过</Button>
          <Button style="width:200px" type="default" @click="setShow('2')">拒绝审核</Button>
        </ButtonGroup>
      </Row>
      <Row type="flex" justify="start" align="middle">
        <p style="margin-right:10px;">家庭团队名称</p>
        <input style="width:120px;margin-right:10px;" v-model="teamName" clearable/>
        <p style="margin-right:10px;">医疗机构名称</p>
        <input style="width:120px;margin-right:10px;" v-model="adminName" clearable/>
        <p style="margin-right:10px;">行政区域</p>
        <Select v-model="city" style="width:120px;margin-right:10px;" @on-change="fetchTowns" clearable>
          <Option v-for="(item, index) in cityList" :value="item.code" :key="index">{{ item.name }}</Option>
        </Select>
        <Select v-model="town" style="width:120px;margin-right:10px;" @on-change="fetchVillages" clearable>
          <Option v-for="(item, index) in townList" :value="item.code" :key="index">{{ item.name }}</Option>
        </Select>
        <Select v-model="village" style="width:120px;margin-right:10px;" clearable>
          <Option v-for="(item, index) in villageList" :value="item.code" :key="index">{{ item.name }}</Option>
        </Select>
        <span style="margin: 0 10px;">
          <Button type="primary" @click="getData">搜索</Button>
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
    </Card>
  </div>
</template>
<script>
export default {
    data() {
        return {
            page: 1,
            size: 10,
            teamName: '',
            adminName: '',
            city: '',
            town: '',
            village: '',
            cityList: [],
            townList: [],
            villageList: [],
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    align: 'center',
                    title: '家医团队名称',
                    key: 'name',
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
                                            let query = { id: params.row.id }
                                            this.$router.push({
                                                name: 'team',
                                                query: query
                                            })
                                        }
                                    }
                                },
                                params.row.name
                            )
                        ]
                    }
                },
                {
                    align: 'center',
                    title: '所属医疗机构',
                    key: 'scope'
                },
                {
                    align: 'center',
                    title: '行政区域',
                    key: 'area'
                },
                {
                    align: 'center',
                    title: '创建者',
                    key: 'person'
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
                                            let query = { id: params.row.id }
                                            this.$router.push({
                                                name: 'team',
                                                query: query
                                            })
                                        }
                                    }
                                },
                                '审查'
                            )
                        ]
                    }
                }
            ],
            list: [],
            data: [],
            showStatus: '0'
        }
    },
    methods: {
        resetFn() {
            this.teamName = ''
            this.adminName = ''
            this.city = ''
            this.town = ''
            this.village = ''
        },
        getAdminInfo() {
            let id = JSON.parse(localStorage.getItem('loginInfo')).managerId
            this.$servers.getAdminInfo(id, res => {
                console.log(res.data.detail)
                // this.roleId = res.data.detail.roleId
                this.location = res.data.detail.locationCode
                console.log(this.location)
                this.fetchCounties()
            })
        },
        fetchCounties() {
            this.$servers.fetchCounties(this.location, res => {
                this.city = res.data.counties[0].code
                this.cityList = res.data.counties
                this.fetchTowns()
            })
        },
        fetchTowns() {
            this.town = ''
            this.townList = []
            this.$servers.fetchTowns(this.city, res => {
                this.town = res.data.towns[0].code
                this.townList = res.data.towns
                this.fetchVillages()
            })
        },
        fetchVillages() {
            this.village = ''
            this.villageList = []
            this.$servers.fetchVillages(this.town, res => {
                this.village = res.data.villages[0].code
                this.villageList = res.data.villages
                /* this.village=''*/
                /* this.town=''*/
            })
        },
        getData() {
            let postdata = {
                pageNum: this.pageNum,
                size: this.size,
                teamName: this.teamName,
                hospitalId: this.adminName
            }
            this.$servers.teamList(postdata, res => {
                console.log(res)
                let list = res.data.teamList
                localStorage.setItem('teamList', JSON.stringify(list))
                list = list.map((item, index) => {
                    let lookStatus = ''
                    if (item.status === '00') {
                        lookStatus = '启用'
                    } else if (item.status === '01') {
                        lookStatus = '停用'
                    }
                    let act = ''
                    if (item.status === '00') {
                        act = '停用'
                    } else if (item.status === '01') {
                        act = '启用'
                    }
                    let arr1 = {
                        name: item.teamName,
                        scope: item.hosname,
                        person: item.teamManage,
                        date: item.auditTime,
                        area: item.teamAddress,
                        id: item.id,
                        auditStatus: item.auditStatus,
                        lookStatus: lookStatus,
                        act: act,
                        status: item.status
                    }
                    return arr1
                })
                this.data = list
                this.fetchList()
            })
        },
        handleOnChange(page) {
            this.page = page
            this.getData()
        },
        fetchList() {
            let data = this.data
            console.log(data)
            let list = []
            data.forEach(item => {
                if (item.auditStatus === this.showStatus) {
                    list.push(item)
                }
            })
            this.list = list
        },
        setColumns() {
            console.log(this.showStatus)
            if (this.showStatus === '0') {
                this.columns = [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        align: 'center',
                        title: '家医团队名称',
                        key: 'name',
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
                                                let query = {
                                                    id: params.row.id
                                                }
                                                this.$router.push({
                                                    name: 'team',
                                                    query: query
                                                })
                                            }
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        }
                    },
                    {
                        align: 'center',
                        title: '所属医疗机构',
                        key: 'scope'
                    },
                    {
                        align: 'center',
                        title: '行政区域',
                        key: 'area'
                    },
                    {
                        align: 'center',
                        title: '创建者',
                        key: 'person'
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
                                                let query = {
                                                    id: params.row.id
                                                }
                                                this.$router.push({
                                                    name: 'team',
                                                    query: query
                                                })
                                            }
                                        }
                                    },
                                    '审查'
                                )
                            ]
                        }
                    }
                ]
            }
            if (this.showStatus === '1') {
                this.columns = [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        align: 'center',
                        title: '家医团队名称',
                        key: 'name',
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
                                                let query = {
                                                    id: params.row.id
                                                }
                                                this.$router.push({
                                                    name: 'team',
                                                    query: query
                                                })
                                            }
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        }
                    },
                    {
                        align: 'center',
                        title: '所属医疗机构',
                        key: 'scope'
                    },
                    {
                        align: 'center',
                        title: '行政区域',
                        key: 'area'
                    },
                    {
                        align: 'center',
                        title: '创建者',
                        key: 'person'
                    },
                    {
                        align: 'center',
                        title: '创建时间',
                        key: 'date'
                    },
                    {
                        align: 'center',
                        title: '状态',
                        key: 'lookStatus'
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
                                                this.changeTeamStatus(
                                                    params.row.id,
                                                    params.row.status
                                                )
                                            }
                                        }
                                    },
                                    params.row.act
                                )
                            ]
                        }
                    }
                ]
            }
            if (this.showStatus === '2') {
                this.columns = [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        align: 'center',
                        title: '家医团队名称',
                        key: 'name',
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
                                                let query = {
                                                    id: params.row.id
                                                }
                                                this.$router.push({
                                                    name: 'team',
                                                    query: query
                                                })
                                            }
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        }
                    },
                    {
                        align: 'center',
                        title: '所属医疗机构',
                        key: 'scope'
                    },
                    {
                        align: 'center',
                        title: '行政区域',
                        key: 'area'
                    },
                    {
                        align: 'center',
                        title: '创建者',
                        key: 'person'
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
                                                this.delTeam(params.row.id)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ]
                        }
                    }
                ]
            }
        },
        setShow(statusCode) {
            this.showStatus = statusCode
            this.fetchList()
            this.setColumns()
        },
        changeTeamStatus(id, status) {
            console.log(status)
            let set = ''
            if (status === '00') {
                set = '01'
            } else if (status === '01') {
                set = '00'
            }
            let postdata = {
                id: id, //类型：String  必有字段  备注：无
                status: set
            }
            console.log(set)
            this.$servers.modifyTeamStatus(postdata, res => {
                this.getData()
            })
        },
        delTeam(id) {
            console.log(id)
            let arr = []
            arr.push(id)
            let postdata = {
                teamList: arr //类型：String  必有字段  备注：无
            }
            this.$servers.delTeam(postdata, res => {
                this.getData()
            })
        }
    },
    mounted() {
        this.getAdminInfo()
        /* this.fetchCounties();
      this.fetchTowns();
      this.fetchVillages()*/
        this.getData()
    }
}
</script>
<style lang="less">
</style>
