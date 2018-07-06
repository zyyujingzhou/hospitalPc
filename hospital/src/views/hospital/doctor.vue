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
      <div v-show="conn">
        <Row>
          <Col span="12">医护人员管理</Col>
        </Row>
        <Row>
          <Col span="4">
          <Button style="width:200px;" type="default" @click="pick('00')">已审核</Button>
          </Col>
          <Col span="4">
          <Button style="width:200px;" type="default" @click="pick('01')">待审核</Button>
          </Col>
          <Col span="4">
          <Button style="width:200px;" type="default" @click="pick('02')">已拒绝</Button>
          </Col>
        </Row>
        <Row class="margin-top-10">
          <Input v-model="searchDoc" icon="search" placeholder="请输入人员名称搜索..." style="width: 200px" />
          <span style="margin: 0 10px;">
            <Button type="primary" icon="search" @click="searchDocFn">搜索</Button>
          </span>
        </Row>
        <Row class="margin-top-10">
          <Table :columns="columns" :data="doctorList"></Table>
        </Row>
      </div>

      <div v-show="hosDeta">
        <Row>
          <Col span="16"><h1 style="text-align: center">医护人员详情</h1></Col>
          <Col span="2">
          <Button type="primary" @click="editDoc = true">编辑</Button>
          </Col>
          <Col span="2">
          <Button type="primary" @click="hosDeta = false;conn = true">返回</Button>
          </Col>
        </Row>
        <Row>
          <Col span="16" offset="4">
          <Form ref="formValidate2" :model="docDetail" :label-width="120">
            <FormItem label="头像">
              <Avatar icon="person" size="large" :src="docDetail.pic" />
            </FormItem>
            <FormItem label="真实姓名:">
              <span>{{docDetail.name}}</span>
            </FormItem>
            <FormItem label="身份证">
              <span>{{docDetail.identiy}}</span>
            </FormItem>
            <FormItem label="性别">
              <span>{{docDetail.sex}}</span>
            </FormItem>
            <FormItem label="手机号">
              <span>{{docDetail.phone}}</span>
            </FormItem>
            <FormItem label="专业信息认证：">
            </FormItem>
            <FormItem label="科室">
              {{docDetail.officeName}}
            </FormItem>
            <FormItem label="角色">{{docDetail.docRoleName}}</FormItem>
            <FormItem label="简介">{{docDetail.docDesc}}</FormItem>
            <FormItem label="执业资格证">
              <img width="200" :src="docDetail.pic_2" />
            </FormItem>
            <FormItem label="手持身份证">
              <img width="200" :src="docDetail.docCertificate" />
            </FormItem>
          </Form>
          </Col>
        </Row>
        <!-- <Row class="margin-top-10">
          <Input v-model="searchDoc" icon="search" placeholder="请输入人员名称搜索..." style="width: 200px" />
          <span style="margin: 0 10px;">
            <Button type="primary" icon="search" @click="searchDocFn">搜索</Button>
          </span>
        </Row>
        <Row class="margin-top-10">
          <Table :columns="columns" :data="doctorList"></Table>
        </Row> -->
      </div>

      <Modal width="700" v-model="editDoc" class="modalhidefooter" title="编辑医护人员" :mask-closable=false>
        <Row>
          <Col span="16" offset="4">
          <Form ref="formValidate2" :model="docDetail" :label-width="120">
            <FormItem label="头像">
              <Avatar icon="person" size="large" :src="docDetail.pic" />
            </FormItem>
            <FormItem label="真实姓名:">
              <span>{{docDetail.name}}</span>
            </FormItem>
            <FormItem label="身份证">
              <span>{{docDetail.identiy}}</span>
            </FormItem>
            <FormItem label="性别">
              <span>{{docDetail.sex}}</span>
            </FormItem>
            <FormItem label="手机号">
              <span>{{docDetail.phone}}</span>
            </FormItem>
            <FormItem label="专业信息认证：">
            </FormItem>
            <FormItem label="科室">
              <Col span="6">
              <Select v-model="officeName" placeholder="请选择" @on-change="setChildOffice" transfer placement="top">
                <Option v-for="(item,index) in officeList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
              <Select placeholder="请选择">
                <Option v-for="(item,index) in childList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
              </Col>
            </FormItem>
            <FormItem label="角色">
              <i-select :model.sync="docDetail.type" placeholder="请选择">
                <i-option value="01">医生</i-option>
                <i-option value="02">护士</i-option>
                <i-option value="03">助理</i-option>
              </i-select>
            </FormItem>
            <FormItem label="简介">
              <i-input :value.sync="docDetail.docDesc" placeholder="请输入"></i-input>
            </FormItem>
            <FormItem label="执业资格证">
              <img width="200" :src="docDetail.pic_2" />
            </FormItem>
            <FormItem label="手持身份证">
              <img width="200" :src="docDetail.docCertificate" />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="passSubmit">确定</Button>
            </FormItem>
          </Form>
          </Col>
        </Row>
      </Modal>

      <Modal width="700" v-model="examine" class="modalhidefooter" title="资质审核" :mask-closable=false>
        <Row>
          <Col span="16" offset="4">
          <Form ref="formValidate2" :model="docDetail" :label-width="120">
            <FormItem label="头像">
              <Avatar icon="person" size="large" :src="docDetail.pic" />
            </FormItem>
            <FormItem label="真实姓名">
              <span>{{docDetail.name}}</span>
            </FormItem>
            <FormItem label="性别">
              <span>{{docDetail.sex}}</span>
            </FormItem>
            <FormItem label="手机号">
              <span>{{docDetail.phone}}</span>
            </FormItem>
            <FormItem label="专业信息认证">
            </FormItem>
            <FormItem label="医院">
              <span>{{docDetail.hosname}}</span>
            </FormItem>
            <FormItem label="科室">
              <span>{{docDetail.ofname}}</span>
            </FormItem>
            <FormItem label="职称">
              <span v-show="docDetail.type=='01'">医生</span>
              <span v-show="docDetail.type=='02'">护士</span>
              <span v-show="docDetail.type=='03'">助理</span>
            </FormItem>
            <FormItem label="执业医师证或胸牌">
              <img width="200" :src="docDetail.pic_2" />
            </FormItem>
            <FormItem label="手持身份证照片">
              <img width="200" :src="docDetail.pic_2" />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="showRefuse = true">拒绝</Button>
              <Button type="primary" @click="passExamine(docDetail.certifyId)">通过审核</Button>
            </FormItem>
          </Form>
          </Col>
        </Row>
      </Modal>

      <Modal width="700" v-model="showRefuse" class="modalhidefooter" title="拒绝原因" :mask-closable=false>
        <Row>
          <Input v-model="refuseReason" placeholder="请输入医院详细地址" />
        </Row>
        <Col span="6"></Col>
        <Row>
          <Col span="6">
          <Button type="primary" @click="showRefuse = false">取消</Button>
          </Col>
          <Col span="6">
          <Button type="primary" @click="refuseExamine(docDetail.certifyId)">确认拒绝</Button>
          </Col>
        </Row>
      </Modal>

    </div>
  </Card>
</template>

<script>
export default {
    name: 'docter-page',
    data() {
        return {
            hosDeta: false,
            conn: true,
            searchDoc: '',
            refuseReason: '',
            showRefuse: false,
            docName: '',
            columns: [
                {
                    title: '医生',
                    key: 'name',
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
                                            this.conn = false
                                            this.hosDeta = true
                                            this.getDocDetail(params.row.id)
                                            // this.showTeam = true
                                        }
                                    }
                                },
                                params.row.name
                            )
                        ]
                    }
                },
                {
                    title: '角色',
                    key: 'type',
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'action',
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
                                            console.log(params.row)
                                            this.modifyDoctorStatus(
                                                params.row.id,
                                                params.row.goto
                                            )
                                        }
                                    }
                                },
                                params.row.goto
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
                                            // console.log(params.row)
                                            this.editDoc = true
                                            this.getDocDetail(params.row.id)
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
                                            this.removeDoc(params.row.id)
                                            // console.log(params.row)
                                        }
                                    }
                                },
                                params.row.remarks
                            )
                        ]
                    }
                }
            ],
            doctorList: [],
            doctorDetail: [],
            editDoc: false,
            docDetail: {},
            officeList: [],
            childList: [],
            officeName: '',
            examine: false
        }
    },
    methods: {
        getDoctor(allStatus) {
            var postdata = {
                pageNum: '',
                size: 0,
                // status: '00' && '01',
                type: '01',
                name: '',
                certifyStatus: allStatus
            }
            this.$servers.getDoctorList(postdata, res => {
                console.log(res.data.doctorList)
                // this.allDctorList = res.data.doctorList
                // this.doctorDetail = res.data.doctorList
                let doctorList = res.data.doctorList
                doctorList = doctorList.map(item => {
                    let docStatus = ''
                    if (allStatus === '00') {
                        docStatus = '正常'
                    } else if (allStatus === '01') {
                        docStatus = '待审核'
                    } else if (allStatus === '02') {
                        docStatus = '已拒绝'
                    }
                    let gogo = ''
                    if (item.status === '00') {
                        gogo = '停用'
                    } else if (item.status === '01') {
                        gogo = '启用'
                    }
                    let remarks = ''
                    if (!item.teamId) {
                        remarks = '移出机构'
                    }
                    let tobj = {
                        name: item.name,
                        type: item.docRoleName,
                        status: docStatus,
                        action: '编辑',
                        remarks: remarks,
                        id: item.id,
                        goto: gogo,
                        reason: item.reason,
                        certifyStatus: item.certifyStatus
                    }
                    if (item.status === '02') {
                        return
                    }
                    return tobj
                })
                this.doctorList = doctorList
            })
            console.log(1)
        },
        getDocDetail(id) {
            let postdata = {
                id: id
            }
            this.$servers.getDoctorDetail(postdata, res => {
                let info = res.data.doctorList[0]
                let otherDesc = res.data.doctorList[0].otherDesc
                info.sex = otherDesc.sex
                info.identiy = '没有信息'
                info.pic = otherDesc.pic
                info.pic_2 = otherDesc.pic_2
                this.docDetail = info
                console.log(this.docDetail)
                this.getOffice()
            })
        },
        getOffice() {
            let _this = this
            this.$servers.getOfficeList(function(data) {
                console.log(data)
                if (data.retCode == '000') {
                    let list = data.data.OfficeList
                    _this.officeList = list
                    if (list.length) {
                        // _this.officeName = list[0].id
                        _this.childList = list[0].childList
                    }
                    console.log(_this.childList)
                }
            })
        },
        setChildOffice() {
            console.log(this.childList)
            console.log(this.officeName)
            let childOffice = []
            let office = this.officeList
            let curId = this.officeName
            office.forEach(item => {
                if (item.id === curId) {
                    childOffice = item.childList
                    console.log(childOffice)
                }
            })
            this.childList = childOffice
        },
        passSubmit() {
            let postdata = {
                id: this.docDetail.id, //类型：String  必有字段  备注：无
                name: this.docDetail.name, //类型：String  必有字段  备注：无
                officeId: this.officeName, //类型：String  必有字段  备注：无
                type: this.docDetail.type, //类型：String  必有字段  备注：无
                docDesc: this.docDetail.type, //类型：String  必有字段  备注：无
                otherDesc: {
                    //类型：Object  必有字段  备注：无
                    sex: this.docDetail.sex, //类型：String  必有字段  备注：无
                    phone: this.docDetail.phone, //类型：String  必有字段  备注：无
                    pic: this.docDetail.pic, //类型：String  必有字段  备注：无
                    cardPic: this.docDetail.pic_2 //类型：String  必有字段  备注：无
                },
                certifyPic: this.docDetail.docCertificate //类型：String  必有字段  备注：无
            }
            this.$servers.modifyDoctor(postdata, res => {
                if (res.retCode === '000') console.log(res)
                this.editDoc = false
            })
        },
        passExamine(certifyId) {
            let postdata = {
                certifyId: certifyId, //类型：String  必有字段  备注：资质审核Id
                status: '00' //类型：String  必有字段  备注：状态：00通过，02驳回
            }
            this.$servers.auditDoctorStatus(postdata, function(data) {
                console.log(data)
                if (data.retCode === '000') {
                    this.examine = false
                }
            })
        },
        refuseExamine(certifyId) {
            console.log(this.refuseReason)
            let postdata = {
                certifyId: certifyId, //类型：String  必有字段  备注：资质审核Id
                status: '02', //类型：String  必有字段  备注：状态：00通过，02驳回
                reason: this.refuseReason
            }
            this.$servers.auditDoctorStatus(postdata, function(data) {
                if (data.retCode === '000') {
                    console.log(1)
                    this.showRefuse = false
                    this.examine = false
                }
            })
        },
        pick(certifyStatus) {
            this.getDoctor(certifyStatus)
            if (certifyStatus === '00') {
                this.columns = [
                    {
                        title: '医生',
                        key: 'name',
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
                                                this.conn = false
                                                this.hosDeta = true
                                                this.getDocDetail(params.row.id)
                                                // this.showTeam = true
                                            }
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        }
                    },
                    {
                        title: '角色',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
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
                                                console.log(params.row)
                                                this.modifyDoctorStatus(
                                                    params.row.id,
                                                    params.row.goto
                                                )
                                            }
                                        }
                                    },
                                    params.row.goto
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
                                                // console.log(params.row)
                                                this.editDoc = true
                                                this.getDocDetail(params.row.id)
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
                                                this.removeDoc(params.row.id)
                                                // console.log(params.row)
                                            }
                                        }
                                    },
                                    params.row.remarks
                                )
                            ]
                        }
                    }
                ]
            } else if (certifyStatus === '01') {
                this.columns = [
                    {
                        title: '医生',
                        key: 'name',
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
                                                this.conn = false
                                                this.hosDeta = true
                                                this.getDocDetail(params.row.id)
                                                // this.showTeam = true
                                            }
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        }
                    },
                    {
                        title: '角色',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
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
                                                this.examine = true
                                                this.getDocDetail(params.row.id)
                                            }
                                        }
                                    },
                                    '资质审核'
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
                                                // console.log(params.row)
                                                this.editDoc = true
                                                this.getDocDetail(params.row.id)
                                            }
                                        }
                                    },
                                    '编辑'
                                )
                            ]
                        }
                    }
                ]
            } else if (certifyStatus === '02') {
                this.columns = [
                    {
                        title: '医生',
                        key: 'name',
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
                                                this.conn = false
                                                this.hosDeta = true
                                                this.getDocDetail(params.row.id)
                                                // this.showTeam = true
                                            }
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        }
                    },
                    {
                        title: '角色',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'reason',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
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
                                                this.removeDoc(params.row.id)
                                                // console.log(params.row)
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
        searchDocFn() {
            console.log(this.searchDoc)
            let docList = this.doctorList
            let list = []
            if (!Array.isArray(this.searchDoc) && docList !== '') {
                let reg = new RegExp(this.searchDoc, 'i')
                docList.forEach(item => {
                    if (item.name.match(reg)) {
                        list.push(item)
                    }
                })
            }
            this.doctorList = list
            // docList.forEach(item => {})
        },
        modifyDoctorStatus(docId, status) {
            console.log(docId)
            console.log(status)
            let setStatus = ''
            if (status === '停用') {
                setStatus = '01'
            } else {
                setStatus = '00'
            }
            console.log(setStatus)
            let postdata = {
                id: docId, //类型：String  必有字段  备注：无
                status: setStatus //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
            }
            this.$servers.modifyDoctorStatus(postdata, res => {
                if (res.retCode === '000') {
                    console.log('ok')
                    this.pick('00')
                    this.getDoctor('00')
                }
            })
        },
        removeDoc(docId) {
            let postdata = {
                id: docId, //类型：String  必有字段  备注：无
                status: '02' //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
            }
            this.$servers.modifyDoctorStatus(postdata, res => {
                if (res.retCode === '000') {
                    console.log('ok')
                    this.pick('00')
                    this.getDoctor('00')
                }
            })
        }
    },
    mounted() {
        this.getDoctor('00')
    }
}
</script>
<style  >
.cannot_edit {
    border: 0px;
}
</style>
