<style lang="less">
.margin-top-20 {
    margin-top: 20px;
}
.margin-top-10 {
    margin-top: 10px;
}
.modalhidefooter .ivu-modal-footer {
    display: none !important;
}
</style>

<template>
  <Card>
    <div>
      <!-- 编辑团队 -->
      <Modal scrollable width="700" v-model="showInfo" class="modalhidefooter" :title="doctorEditTitle" :mask-closable=false @on-visible-change="formModalChange">
        <Row>
          <Col span="16" offset="4">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <FormItem label="医院" prop="hospitalId">
              <Select v-model="formValidate.hospitalId" @on-change="hospitalChange" transfer>
                <Option v-for="(item, index) in hospitalList" :key="index" :value="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="医生" prop="docId">
              <Select v-model="formValidate.docId" label-in-value @on-change="docChange" transfer>
                <Option v-for="(item, index) in doctorListAll" :key="index" :value="item.id">{{ item.name }}</Option>
              </Select>
              <p style="color:#999">注：更改医生时，请确认原医生的任务都已完成</p>
            </FormItem>

            <FormItem label="家医团队名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入团队名称"></Input>
            </FormItem>
            <FormItem label="添加成员" :required="true">
              <Row v-for="(it, idx) in formValidate.memberList" :key="idx">
                <Col span="11">
                <Select v-model="it.userId" placeholder="请选择成员" transfer placement="top">
                  <Option v-for="(item, index) in doctorListAll" :key="index" :value="item.id">{{ item.name }}</Option>
                </Select>

                </Col>
                <Col span="1">&nbsp;</Col>
                <Col span="7">

                <Select v-model="it.roleId" placeholder="请选择角色" transfer placement="top">
                  <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{ item.name }}</Option>
                </Select>

                </Col>
                <Col span="1">&nbsp;</Col>
                <Col span="4">
                <Row v-show="idx>0" type="flex" justify="center" align="middle">
                  <Col span="24">
                  <Button @click="removeMemberMe(idx)">删除</Button>
                  </Col>
                </Row>
                </Col>
              </Row>
              <Button @click="addMemberOne()">新增</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" :loading="saveLoading" @click="handleSubmit('formValidate')">确定</Button>
              <Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
          </Col>
        </Row>
      </Modal>
      <!-- 家医团队成员 -->
      <Modal scrollable width="700" v-model="showTeam" class="modalhidefooter" :title="doctorEditTitle" :mask-closable=false>
        <Row>
          <Col span="16" offset="4">
          <Table :columns="teamCol" :data="teamData" style="width: 100%;"></Table>
          </Col>
        </Row>
      </Modal>

      <Row>
        <div class="margin-top-20">
          <Button type="primary" size="large" @click="exportData()">
            <Icon type="ios-download-outline"></Icon> 创建家医团队</Button>
        </div>
      </Row>
      <Row class="margin-top-10">
        <Input v-model="name" icon="search" @on-change="" placeholder="请输入团队名称搜索..." style="width: 200px" />
        <span @click="handleSearch1" style="margin: 0 10px;">
          <Button type="primary" icon="search">搜索</Button>
        </span>
      </Row>
      <Row class="margin-top-10">
        <Col>
        <Row type="flex" justify="center" align="middle" class="">
          <Table :loading="loading" :columns="list" :data="listData" style="width: 100%;"></Table>
        </Row>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col>
        <Row type="flex" justify="end">
          <Page :page-size="size" :current="page" :total="totalNum" show-total show-elevator @on-change="handleOnChange"></Page>
        </Row>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
export default {
    name: 'doctorTeam-page',
    data() {
        return {
            showTeam: false,
            saveLoading: false,
            loading: false,
            id: '',
            page: 1,
            size: 10,
            name: '', //搜索条件
            totalNum: 1,

            showInfo: false,
            doctorId: '',
            doctorList: [],
            doctorEditTitle: '',

            hospitalList: [],
            keshiList: [],
            doctorListAll: [],
            doctorList: [],
            roleList: [
                {
                    id: '01',
                    name: '医生'
                },
                {
                    id: '02',
                    name: '护士'
                },
                {
                    id: '03',
                    name: '助理'
                }
            ],

            imgUploadUrl: this.$servers._baseurl_4,

            formValidate: {
                name: '',
                status: '00',
                roleDesc: '',
                type: '00',
                hospitalId: '',
                officeId: '',
                docId: '',
                memberId: [],
                memberId33: [],
                teamManage: '',
                teamDesc: '',
                teamPic: '',
                teamAddress: '',
                teamTel: '',
                roleId: [],

                memberList: [
                    {
                        userId: '',
                        roleId: ''
                    }
                ]
            },
            ruleValidate: {
                teamDesc: [
                    {
                        required: true,
                        message: '团队介绍不能为空',
                        trigger: 'blur'
                    }
                ],
                teamPic: [
                    {
                        required: true,
                        message: '团队头像不能为空',
                        trigger: 'blur'
                    }
                ],
                teamAddress: [
                    {
                        required: true,
                        message: '团队地址不能为空',
                        trigger: 'blur'
                    }
                ],
                teamTel: [
                    {
                        required: true,
                        message: '团队联系电话不能为空',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '团队名不能为空',
                        trigger: 'blur'
                    }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                phone: [
                    {
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    },
                    {
                        type: 'string',
                        pattern: /^1[3578]\d{9}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur'
                    }
                ],
                hospitalId: [
                    { required: true, message: '请选择医院', trigger: 'change' }
                ],
                officeId: [
                    { required: true, message: '请选择科室', trigger: 'change' }
                ],
                docId: [
                    { required: true, message: '请选择医生', trigger: 'change' }
                ],
                // memberId: [
                //     { required: true, message: '请选择护士', trigger: 'change' }
                // ],
                type: [
                    { required: true, message: '请选择职称', trigger: 'change' }
                ]
                // interest: [
                //     { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
                //     { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                // ],
                // date: [
                //     { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
                // ],
                // time: [
                //     { required: true, type: 'date', message: 'Please select time', trigger: 'change' }
                // ],
                // desc: [
                //     { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                //     { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                // ],
            },

            list: [
                // {
                //     type: 'index',
                //     title: '序号',
                //     width: 60
                // },
                {
                    title: '家医团队名称',
                    key: 'teamName',
                    align: 'center',
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
                                            this.showTeam = true
                                            this.getTeamRole(params.row.id)
                                        }
                                    }
                                },
                                params.row.teamName
                            )
                        ]
                    }
                },
                {
                    title: '所属医院',
                    key: 'hosname',
                    align: 'center'
                },
                {
                    title: '医生',
                    key: 'teamManage',
                    align: 'center'
                },
                {
                    title: '成员人数',
                    key: 'teamCount',
                    align: 'center',
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
                                            this.showTeam = true
                                            this.getTeamRole(params.row.id)
                                        }
                                    }
                                },
                                params.row.teamCount
                            )
                        ]
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    render: (h, params) => {
                        if (params.row.status == '00') {
                            return '已启用'
                        }
                        return this.$renderText(h, '已停用')
                    }
                },
                {
                    title: '操作',
                    key: 'show_more',
                    align: 'center',
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

                                            this.handleRoleStatus(
                                                params.row.id,
                                                params.row.status
                                            )
                                        }
                                    }
                                },
                                params.row.status == '00' ? '停用' : '启用'
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

                                            this.handleReset('formValidate')
                                            this.getHospitalList()
                                            this.getKeshi(params.row.hospitalId)
                                            this.doctorId = params.row.id
                                            this.doctorEditTitle =
                                                '编辑家医团队资料'
                                            this.doctorList = []
                                            this.doctorListAll = []
                                            this.getRoleDetail(params.row.id)
                                            this.showInfo = true
                                        }
                                    }
                                },
                                '编辑'
                            )
                        ]
                    }
                }
            ],
            listData: [
                {
                    officeId: '940a89173298456582507a9f4224c50d',
                    hospitalId: '1ada51e9366f40c58ffa43c294a679d4',
                    docDesc: '个人介绍',
                    utime: 1516096239000,
                    name: '牙科医生笑不露齿4',
                    ofname: '牙科一',
                    ctime: 1516096239000,
                    id: '4e2528994c74438899b0e1af4c900bce',
                    type: '01',
                    hosname: '北京人民1105医院',
                    otherDesc: -{
                        jobNumber: '45444',
                        phone: '15010220014',
                        pic: 'www.baidu.com/3',
                        sex: '男'
                    },
                    status: '00',
                    statusShow: '已启用'
                }
            ],
            teamCol: [
                {
                    title: '姓名',
                    key: 'docName',
                    align: 'center'
                },
                {
                    title: '角色',
                    key: 'docRole',
                    align: 'center'
                }
            ],
            teamData: [],
            currentTeam: ''
        }
    },
    methods: {
        getTeamRole(id) {
            let self = this
            let postdata = {
                pageNum: 1, //类型：Number  可有字段  备注：当前页
                size: 1, //类型：Number  可有字段  备注：每页条数
                teamId: id //类型：String  可有字段  备注：团队ID
            }
            console.log(id)
            self.$servers.getTeamRole(postdata, function(data) {
                let list = data.data.teamMemberList
                // let list = []
                console.log(list)
                let teamData = []
                list.forEach(item => {
                    let tObj = {
                        docName: item.docname,
                        docRole: item.roname
                    }
                    teamData.push(tObj)
                })
                console.log(teamData)
                self.teamData = teamData
            })
        },
        removeMemberMe(index) {
            this.formValidate.memberList.splice(index, 1)
        },
        addMemberOne() {
            this.formValidate.memberList.splice(
                this.formValidate.memberList.length,
                1,
                {
                    userId: '',
                    roleId: ''
                }
            )
        },
        pgChange(page) {
            console.log('page', page)
            this.page = page + ''
            this.getData()
        },
        changeMember(obj) {
            // debugger
        },
        changeMember3(obj) {
            // debugger
        },
        hospitalChange(id) {
            // debugger
            console.log('hospitalChange (id) {')
            if (!id) {
                return
            }
            // this.formValidate.officeId = '';
            // this.keshiList = [];
            this.getKeshi(id)
            this.getDoctorList()
        },
        keshiChange(id) {
            if (id) {
                this.doctorList = this.doctorListAll.filter(
                    m => m.officeId === id && m.type === '01'
                )
                console.log('当前医院-科室-医生', this.doctorList)
                // if (this.doctorList.length) {
                //   this.formValidate.docId = this.doctorList[0].id;
                //   this.formValidate.teamManage = this.doctorList[0].name;
                //   console.log('this.formValidate.docId:', this.formValidate.docId);
                // } else {
                //   this.formValidate.docId = '';
                // }
            }
        },
        docChange(sel) {
            console.log('选择的医生', sel)
            const arr = this.doctorList.filter(m => m.id === sel.value)
            console.log(arr)
            if (arr.length) {
                this.formValidate.teamManage = arr[0].name
            }

            console.log(
                'this.formValidate.teamManage',
                this.formValidate.teamManage
            )
        },
        pichandleSuccess(res, file) {
            // alert(res.status)
            // alert(res.newPath)
            if (res.status === 0 && res.newPath) {
                this.formValidate.pic = res.newPath
            }
        },
        pichandleSuccess2(res, file) {
            // alert(res.status)
            // alert(res.newPath)
            if (res.status === 0 && res.newPath) {
                // debugger
                this.formValidate.teamPic = res.newPath
            }
        },
        handleSubmit(name) {
            let _this = this
            this.$refs[name].validate(valid => {
                // debugger;
                if (valid) {
                    // this.$Message.success('Success!');
                    if (!_this.doctorId) {
                        //新增
                        //筛选出人员和角色都选中的项
                        console.log(
                            'memberList: ',
                            _this.formValidate.memberList
                        )
                        let teamMemberList = _this.formValidate.memberList.filter(
                            item => {
                                return item.userId && item.roleId
                            }
                        )
                        console.log('teamMemberList: ', teamMemberList)
                        if (_this.roleList && _this.roleList.length) {
                            //添加医生本身
                            let doctor = _this.roleList.find(item => {
                                return item.name == '医生'
                            })
                            if (doctor && doctor.id) {
                                teamMemberList.unshift({
                                    userId: _this.formValidate.docId,
                                    roleId: doctor.id
                                })
                            }
                        }

                        if (teamMemberList.length < 1) {
                            _this.$Notice.warning({
                                title: '请至少添加一名成员',
                                duration: 3
                            })
                            return
                        }
                        const userIdArr = []
                        for (let m = 0; m < teamMemberList.length; m += 1) {
                            userIdArr.push(teamMemberList[m].userId)
                        }

                        if (new Set(userIdArr).size != userIdArr.length) {
                            _this.$Notice.warning({
                                title: '成员不能重复添加',
                                duration: 3
                            })
                            return
                        }
                        _this.saveLoading = true
                        console.log('teamMemberList: ', teamMemberList)
                        let postdata = {
                            docId: _this.formValidate.docId,
                            deptId: _this.formValidate.officeId,
                            teamDesc: _this.formValidate.teamDesc,
                            teamName: _this.formValidate.name,
                            teamPic: _this.formValidate.teamPic,
                            teamAddress: _this.formValidate.teamAddress,
                            teamTel: _this.formValidate.teamTel,
                            teamManage: _this.formValidate.teamManage,
                            teamMemberList: teamMemberList,
                            status: _this.formValidate.status
                        }
                        console.log(postdata)
                        // return;
                        _this.$servers.addTeam(postdata, function(data) {
                            if (data.retCode == '000') {
                                // alert('ok')
                                _this.saveLoading = false
                                _this.$Notice.success({
                                    title: '添加团队成功',
                                    duration: 3
                                })

                                _this.$Modal.remove()

                                _this.getData()

                                setTimeout(function() {
                                    _this.showInfo = false
                                }, 500)
                            } else {
                                _this.saveLoading = false
                                _this.$Notice.warning({
                                    title: data.errInfo,
                                    duration: 3
                                })
                            }
                        })
                    } else {
                        let teamMemberList = _this.formValidate.memberList.filter(
                            item => {
                                return item.userId && item.roleId
                            }
                        )
                        if (_this.roleList && _this.roleList.length) {
                            //添加医生本身
                            let doctor = _this.roleList.find(item => {
                                return item.name == '医生'
                            })
                            if (doctor && doctor.id) {
                                teamMemberList.unshift({
                                    userId: _this.formValidate.docId,
                                    roleId: doctor.id
                                })
                            }
                        }
                        console.log('teamMemberList:', teamMemberList)
                        if (teamMemberList.length < 1) {
                            _this.$Notice.warning({
                                title: '请至少添加一名成员',
                                duration: 3
                            })
                            return
                        }
                        const userIdArr = []
                        for (let m = 0; m < teamMemberList.length; m += 1) {
                            userIdArr.push(teamMemberList[m].userId)
                        }
                        console.log('userIdArr:', userIdArr)
                        if (new Set(userIdArr).size !== userIdArr.length) {
                            _this.$Notice.warning({
                                title: '成员不能重复添加',
                                duration: 3
                            })
                            return
                        }
                        _this.saveLoading = true
                        let postdata = {
                            id: _this.doctorId,
                            docId: _this.formValidate.docId,
                            deptId: _this.formValidate.officeId,
                            teamDesc: _this.formValidate.teamDesc,
                            teamName: _this.formValidate.name,
                            teamPic: _this.formValidate.teamPic,
                            teamAddress: _this.formValidate.teamAddress,
                            teamTel: _this.formValidate.teamTel,
                            teamManage: _this.formValidate.teamManage,
                            teamMemberList: teamMemberList,
                            status: _this.formValidate.status
                            //成员信息分开修改
                        }
                        console.log(postdata)
                        _this.$servers.modifyTeam(postdata, function(data) {
                            if (data.retCode == '000') {
                                // alert('ok')
                                _this.saveLoading = false
                                _this.$Notice.success({
                                    title: '修改团队信息成功',
                                    duration: 3
                                })

                                _this.$Modal.remove()

                                _this.getData()

                                setTimeout(function() {
                                    _this.showInfo = false
                                }, 500)
                            } else {
                                _this.saveLoading = false
                                _this.$Notice.warning({
                                    title: data.errInfo,
                                    duration: 3
                                })
                            }
                        })
                    }
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields()
        },
        handleRoleStatus(id, status) {
            // this.formDynamic.items[index].status = 0;
            console.log('handleRoleStatus')
            // alert(id)
            // alert(status)
            // return
            //逆操作，启用改停用，停用改启用
            status = status == '00' ? '01' : '00'
            let status_text = { '00': '启用', '01': '停用' }
            let vm = this
            vm.$Modal.confirm({
                title: '提示',
                content: '您确定要' + status_text[status] + '当前团队吗？',
                onOk: function() {
                    // alert('ok')
                    let postdata = {
                        id: id, //类型：String  必有字段  备注：无
                        status: status //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
                    }
                    console.log(postdata)
                    vm.$servers.modifyTeamStatus(postdata, function(data) {
                      console.log(data)
                        if (data.retCode == '000') {
                            // alert('ok')
                            vm.$Notice.success({
                                title: '团队状态修改成功',
                                duration: 3
                            })
                            // _this.listData[index].status = status;
                            vm.getData()
                        }
                    })
                },
                onCancel: function() {
                    // alert('cancel')
                }
            })
            return
        },
        handleRoleStatusDel(id, status) {
            // this.formDynamic.items[index].status = 0;
            console.log('handleRoleStatusDel')
            // alert(id)
            // alert(status)
            // return
            let _this = this
            this.$Modal.confirm({
                title: '提示',
                content: '您确定要删除当前信息吗？删除后将不可恢复！',
                onOk: function() {
                    // alert('ok')
                    let postdata = {
                        id: id, //类型：String  必有字段  备注：无
                        status: '03'
                    }
                    _this.$servers.deleteRole(postdata, function(data) {
                        if (data.retCode == '000') {
                            // alert('ok')
                            _this.$Notice.success({
                                title: '角色删除成功',
                                duration: 3
                            })
                            // _this.listData[index].status = status;
                            _this.getData()
                        }
                    })
                },
                onCancel: function() {
                    // alert('cancel')
                }
            })
            return
        },
        formModalChange(status) {
            // alert(status);
            //modal状态改变
        },
        exportData() {
            // alert('创建家医团队')
            this.handleReset('formValidate')
            this.formValidate.name = ''
            this.formValidate.hospitalId = ''
            this.formValidate.officeId = ''
            this.formValidate.docId = ''
            this.formValidate.memberList = [
                {
                    userId: '',
                    roleId: ''
                }
            ]
            this.formValidate.teamDesc = ''
            this.formValidate.teamPic = ''
            this.formValidate.teamAddress = ''
            this.formValidate.teamTel = ''
            this.getHospitalList()
            this.doctorId = ''
            this.doctorEditTitle = '创建家医团队'
            this.doctorList = []
            this.doctorListAll = []
            this.showInfo = true
        },
        handleSearch1() {
            this.page = 1
            this.getData()
        },
        handleCancel1() {
            this.name = ''
            this.listData = []
            this.getData()
        },
        getData() {
            console.log('getData')
            this.loading = true
            let _this = this
            let postdata = {
                pageNum: this.page,
                size: this.size,
                deptId: '',
                teamId: '',
                docId: '',
                teamName: this.name,
                hospitalId: ''
            }
            this.$servers.teamList(postdata, function(data) {
                if (data.retCode == '000') {
                    _this.loading = false
                    let list = data.data.teamList
                    list = list.map(item => {
                        //缺少成员人数字段
                        item.teamNum = '缺少此字段'
                        return item
                    })
                    _this.listData = list

                    _this.totalNum = data.data.totalNum * 1
                }
            })
        },
        getRoleDetail(id) {
            console.log('getRoleDetail')
            let _this = this
            let postdata = {
                teamId: id
            }
            this.currentTeam = id
            this.$servers.teamInfo(postdata, function(data) {
                if (data.retCode == '000') {
                    let list = data.data.member
                    let team = data.data.team
                    console.log('team', team)
                    let newList = []
                    for (let m = 0; m < list.length; m += 1) {
                        let temp = {}
                        temp.userId = list[m].userId
                        temp.roleId = list[m].roleId
                        if (list[m].userId !== team.docId) {
                            newList.push(temp)
                        }
                    }
                    console.log('newList', newList)

                    _this.formValidate = {
                        name: team.teamName,
                        status: team.status,
                        roleDesc: team.teamDesc,
                        // type: '00',
                        hospitalId: team.hospitalId,
                        officeId: team.deptId,
                        docId: team.docId,
                        teamManage: team.teamManage,
                        teamDesc: team.teamDesc,
                        teamPic: team.teamPic,
                        teamAddress: team.teamAddress,
                        teamTel: team.teamTel,
                        memberList: newList
                    }
                    console.log('编辑的所有信息:', _this.formValidate)
                }
            })
        },
        getHospitalList() {
            console.log('getHospitalList')
            let _this = this
            // let postdata = {
            //     "oaHosId": _this.id, //只定位到本医院
            //     "pageNum": "",
            //     "size": 0,
            //     "name": "",
            // };
            // this.$servers.getHospitalList(postdata, function(data){
            let postdata = {
                oaHosId: '',
                pageNum: '0',
                size: 1000,
                name: '',
                status: '00'
            }
            this.$servers.getHospitalList(postdata, function(data) {
                if (data.retCode == '000') {
                    let list = data.data.hospitalList

                    _this.hospitalList = list
                    _this.getDoctorList()
                    _this.getRoleList()
                }
            })
        },
        getRoleList(){
          this.$servers.getRoleList(res => {
            this.roleList = res.data.roleList
            console.log(res)
          })
        },
        getKeshi(id) {
            console.log('getKeshi')
            let _this = this
            let postdata = {
                hospitalId: id,
                status: '00',
                pageNum: '',
                size: 0,
                name: ''
            }
            this.$servers.getOfficeList(postdata, function(data) {
                if (data.retCode == '000') {
                    let list = data.data.OfficeList
                    // debugger
                    _this.keshiList = list
                }
            })
        },
        getDoctorList(id) {
            let _this = this
            let postdata = {
                hospitalId: this.formValidate.hospitalId,
                status: '00',
                pageNum: 1,
                size: 1000,
                name: '',
                officeId: '',
                type: '', //01医生 02护士 03助理
                certifyStatus: '00'
            }
            this.$servers.getDoctorList(postdata, function(data) {
                if (data.retCode == '000') {
                    let list = data.data.doctorList
                    _this.doctorListAll = list
                    _this.keshiChange(_this.formValidate.officeId)
                }
            })
        },
        handleNetConnect(state) {
            this.breakConnect = state
        },
        handleLowSpeed(state) {
            this.lowNetSpeed = state
        },
        getCurrentData() {
            this.showCurrentTableData = true
        },
        handleDel(val, index) {
            this.$Message.success('删除了第' + (index + 1) + '行数据')
        },
        handleCellChange(val, index, key) {
            this.$Message.success(
                '修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据'
            )
        },
        handleChange(val, index) {
            this.$Message.success('修改了第' + (index + 1) + '行数据')
        },
        cancel() {
            this.$refs.formValidate.resetFields()
            this.showInfo = false
        },
        handleOnChange(page) {
            this.page = page
            this.getData()
        },
        addTeamMember(idx) {
            console.log(this.formValidate)
            let vmDoc = this.formValidate.memberList[idx].userId
            let vmRol = this.formValidate.memberList[idx].roleId
            if (vmDoc && vmRol) {
                console.log('可以提交')
                let postdata = {
                    userId: vmDoc, //类型：String  必有字段  备注：医生ID
                    teamId: this.currentTeam, //类型：String  必有字段  备注：所属机构ID，科室id
                    roleId: vmRol
                }
                this.$servers.addTeamMember(postdata, res => {
                  console.log(res)
                })
            }
        }
    },
    created() {
        // },
        // activated () {
        this.listData = []
        var id = this.$route.query.id
        // alert(id);
        this.id = id
        this.getData()
    }
}
</script>
