<template>
  <div>
    <Card>
      <Row type="flex" justify="start" align="middle">
        <p style="margin-right:10px;">医疗机构名称</p>
        <Input style="width:120px;margin-right:10px;" v-model="adminName" clearable/>
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
        <span style="margin: 0 10px;">
          <Button type="primary">导入</Button>
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
            location: '',
            adminName: '',
            name: '',
            data: [],
            list: [],
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
                    title: '医疗机构名称',
                    key: 'name'
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
                                            let query = { id: params.row.id }
                                            this.$router.push({
                                                name: 'hospital',
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
                                            let query = { id: params.row.id }
                                            this.$router.push({
                                                name: 'office',
                                                query: query
                                            })
                                        }
                                    }
                                },
                                '详情'
                            )
                        ])
                    }
                }
            ],
            list: []
        }
    },
    methods: {
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
            })
        },
        getData() {
            let postdata = {
                pageNum: this.page,
                size: this.size,
                name: this.adminName,
                addressCode: this.city
            }
            this.$servers.getHospitalList(postdata, res => {
                console.log(res)
                let list = res.data.hospitalList
                list = list.map((item, index) => {
                    let arr1 = {
                        name: item.name,
                        area: item.area,
                        person: item.person || '超级管理员',
                        date: item.ctime,
                        id: item.id
                    }
                    console.log(arr1)
                    return arr1
                })
                this.list = list
            })
        },
        handleOnChange(page) {
            this.page = page
            this.getData()
        },
        resetFn() {
            this.adminName = ''
            this.city = ''
            this.town = ''
            this.village = ''
        }
    },

    mounted() {
        this.getAdminInfo()
        // this.fetchCounties();
        this.getData()
    }
}
</script>
<style>
</style>
