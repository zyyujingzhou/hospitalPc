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
            <!-- 医生详情 -->
            <Modal width="700" v-model="showInfo" class="modalhidefooter" :title="doctorEditTitle" :mask-closable=false @on-visible-change="formModalChange">
                <Row>
                    <Col span="16" offset="4">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                        <FormItem label="成员" prop="name">
                            <Input v-model="formValidate.name" placeholder="" :readonly="true" :disabled="true"></Input>
                        </FormItem>
                        <FormItem label="修改角色" prop="roleId">
                            <Select v-model="formValidate.roleId" @on-change="roleChange" transfer>
                                <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <!-- <FormItem label="状态" prop="status">
                            <RadioGroup v-model="formValidate.status">
                                <Radio label="00">启用</Radio>
                                <Radio label="01">停用</Radio>
                            </RadioGroup>
                        </FormItem> -->

                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                            <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button> -->
                        </FormItem>

                    </Form>
                    </Col>
                </Row>
            </Modal>

            <Modal width="700" v-model="showInfo2" class="modalhidefooter" title="查看从业资格证" :mask-closable=true @on-visible-change="formModalChange">
                <Row>
                    <Col span="16" offset="4">
                    <img :src="workingZhengMing" style="width:100%;" />
                    </Col>
                </Row>
            </Modal>

            <Row style="display:none;">
                <div class="margin-top-20">
                    <Button type="primary" size="large" @click="exportData()">
                        <Icon type="ios-download-outline"></Icon> 新增家医团队角色</Button>
                </div>
            </Row>
            <Row class="margin-top-10">
                <Input v-model="name" icon="search" @on-change="" placeholder="请输入团队成员名称搜索..." style="width: 200px" />
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
  name: 'argument-page',
  data() {
    return {
      loading: false,
      id: '',
      page: 1,
      size: 10,
      name: '', // 搜索条件
      totalNum: 1,

      showInfo: false,
      doctorId: '',
      doctorList: [],
      doctorEditTitle: '',

      hospitalList: [],
      keshiList: [],

      roleList: [],

      imgUploadUrl: this.$servers._baseurl_4,

      workingZhengMing: '',
      showInfo2: false,

      formValidate: {
        name: '',
        status: '',
        roleDesc: '',
        type: '00',
        roleName: '',
        roleId: '',
      },
      ruleValidate: {
        name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            type: 'string',
            pattern: /^1[3578]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur',
          },
        ],
        hospitalId: [
          { required: true, message: '请选择医院', trigger: 'change' },
        ],
        officeId: [
          { required: true, message: '请选择科室', trigger: 'change' },
        ],
        type: [{ required: true, message: '请选择职称', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },

      list: [
        {
          title: '姓名',
          key: 'docname',
          align: 'center',
        },
        {
          title: '角色',
          key: 'roname',
          align: 'center',
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == '01') {
              return '已启用';
            } 
            return this.$renderText(h, '已停用');
          },
        },
        {
          title: '操作',
          key: 'show_more',
          align: 'center',
          render: (h, params) => {
            const roleId = params.row.roleId;
            let isHide = 'inline-block';
            // 医生的不能停用
            if (roleId === '81ecdf95aafe4effb2fa7f82fcad0d40') {
              isHide = 'none';
            } else {
              isHide = 'inline-block';
            }
            return [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    display: isHide,
                  },
                  on: {
                    click: () => {
                      let query = { id: params.row.id };

                      this.handleRoleStatus(params.row.id, params.row.status);
                    },
                  },
                },
                params.row.status == '01' ? '停用' : '启用',
              ),
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'text',
              //       size: 'small',
              //     },
              //     on: {
              //       click: () => {
              //         let query = { id: params.row.id };

              //         this.handleReset('formValidate');
              //         // this.getHospitalList();
              //         this.doctorId = params.row.id;
              //         let _this = this;
              //         this.doctorEditTitle = '修改成员角色';
              //         this.doctorList = [];
              //         this.getRoleDetail(params.row.id);
              //         setTimeout(function() {
              //           _this.showInfo = true;
              //         }, 200);
              //       },
              //     },
              //   },
              //   '修改角色',
              // ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.workingZhengMing = params.row.docCertificate;
                      this.showInfo2 = true
                    },
                  },
                },
                '查看从业资格证',
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      let query = { id: params.row.id };

                      this.handleRoleStatusDel(
                        params.row.id,
                        params.row.status,
                      );
                    },
                  },
                },
                '删除',
              ),
            ];
          },
        },
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
            sex: '男',
          },
          status: '00',
          statusShow: '已启用',
        },
      ],
    };
  },
  methods: {
    roleChange(id) {},
    hospitalChange(id) {
      this.getKeshi(id);
    },
    pichandleSuccess(res, file) {
      // alert(res.status)
      // alert(res.newPath)
      if (res.status === 0 && res.newPath) {
        this.formValidate.pic = res.newPath;
      }
    },
    pichandleSuccess2(res, file) {
      // alert(res.status)
      // alert(res.newPath)
      if (res.status === 0 && res.newPath) {
        this.formValidate.pic_2 = res.newPath;
      }
    },
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        // debugger;
        if (valid) {
          // this.$Message.success('Success!');
          // if(!_this.doctorId){
          //     //新增
          //     let postdata = {
          //         // "id":"8c0d993d97054e49b7ebd545e33af4a6",                //类型：String  必有字段  备注：无
          //         "name": _this.formValidate.name,                //类型：String  必有字段  备注：名称
          //         "type": _this.formValidate.type,                //类型：String  必有字段  备注：类型：01医生，02护士，03助理
          //         "roleDesc": _this.formValidate.roleDesc,                //类型：String  必有字段  备注：医生描述
          //         "status": _this.formValidate.status,
          //     }
          //     console.log(postdata);
          //     _this.$servers.addRole(postdata, function(data){
          //         if(data.retCode=='000'){
          //             // alert('ok')
          //             _this.$Notice.success({title:'添加角色成功',duration:3})

          //             _this.$Modal.remove()

          //             _this.getData();

          //             setTimeout(function(){
          //                 _this.showInfo = false
          //             },500)
          //         }
          //     });
          // }else
          {
            //编辑
            let postdata = {
              id: _this.doctorId, //类型：String  必有字段  备注：无
              roleId: _this.formValidate.roleId,
            };
            _this.$servers.modifyTeamMember(postdata, function(data) {
              if (data.retCode == '000') {
                // alert('ok')
                _this.$Notice.success({
                  title: '修改成员角色信息成功',
                  duration: 3,
                });

                _this.$Modal.remove();

                _this.getData();

                setTimeout(function() {
                  _this.showInfo = false;
                }, 500);
              }
            });
          }
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleRoleStatus(id, status) {
      // this.formDynamic.items[index].status = 0;
      console.log('handleRoleStatus');
      // alert(id)
      // alert(status)
      // return
      //逆操作，启用改停用，停用改启用
      status = status == '01' ? '02' : '01';
      let status_text = {
        '01': '您确定要启用当前角色吗？',
        '02': '您确定要停用当前角色吗？停用后该角色将不可再使用！',
      };
      let _this = this;
      this.$Modal.confirm({
        title: '提示',
        content: '' + status_text[status] + '',
        onOk: function() {
          // alert('ok')
          let postdata = {
            id: id, //类型：String  必有字段  备注：无
            status: status, //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
          };
          _this.$servers.modifyTeamMbStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({
                title: '团队成员状态修改成功',
                duration: 3,
              });
              // _this.listData[index].status = status;
              _this.getData();
            }
          });
        },
        onCancel: function() {
          // alert('cancel')
        },
      });
      return;
    },
    handleRoleStatusDel(id, status) {
      // this.formDynamic.items[index].status = 0;
      console.log('handleRoleStatusDel');
      // alert(id)
      // alert(status)
      // return
      let _this = this;
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要删除当前信息吗？删除后将不可恢复！',
        onOk: function() {
          // alert('ok')
          let postdata = {
            id: id, //类型：String  必有字段  备注：无
            status: '03',
          };
          _this.$servers.modifyTeamMbStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '团队成员删除成功', duration: 3 });
              // _this.listData[index].status = status;
              _this.getData();
            }
          });
        },
        onCancel: function() {
          // alert('cancel')
        },
      });
      return;
    },
    formModalChange(status) {
      // alert(status);
      //modal状态改变
    },
    exportData() {
      // alert('新增家医团队角色')
      this.handleReset('formValidate');
      this.formValidate.goodAt = '';
      this.formValidate.docDesc = '';
      this.formValidate.pic = '';
      this.formValidate.pic_2 = '';
      // this.getHospitalList();
      this.doctorId = '';
      this.doctorEditTitle = '新增家医团队角色';
      this.doctorList = [];
      this.showInfo = true;
    },
    handleSearch1() {
      this.page = 1;
      this.getData();
    },
    handleCancel1() {
      this.name = '';
      this.listData = [];
      this.getData();
    },
    getData() {
      console.log('getData');
      this.loading = true;
      let _this = this;
      let postdata = {
        teamId: this.id,
        pageNum: this.page,
        size: this.size,
        docname: this.name,
      };
      this.$servers.teamMemInfo(postdata, (data) => {
        if(data.retCode === '000') {
          this.loading = false;
          this.totalNum = data.data.totalNum;
          this.listData = data.data.teamMemberList;
        }
      });
    },
    getRoleDetail(id) {
      console.log('getRoleDetail');

      let _this = this;
      let obj = _this.listData.find(item => {
        return item.id == id;
      });
      if (obj) {
        _this.formValidate = {
          name: obj.docname,
          status: obj.status,
          roleDesc: obj.roleDesc,
          type: obj.type,
          roleId: obj.roleId,
        };
      }
      return;

      // let postdata = {
      //     "id": id,
      // };
      // this.$servers.getRole(postdata, function(data){
      //     if(data.retCode=='000'){
      //         let list = data.data.RoleList;
      //         // list = list.map((item) => {
      //         //     item.statusShow = _this.statusObj[item.status];
      //         //     item.editFlag = true;
      //         //     return item;
      //         // })
      //         _this.doctorList = list;

      //         let obj = list[0];

      //         _this.formValidate = {
      //             name: obj.name,
      //             status: obj.status,
      //             roleDesc: obj.roleDesc,
      //             type: obj.type,
      //         }

      //     }
      // });
    },
    getHospitalList() {
      console.log('getHospitalList');
      let _this = this;
      // let postdata = {
      //     "oaHosId": _this.id, //只定位到本医院
      //     "pageNum": "",
      //     "size": 0,
      //     "name": "",
      // };
      // this.$servers.getHospitalList(postdata, function(data){
      let postdata = {
        id: _this.id, //只定位到本医院
      };
      this.$servers.getHospital(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.hospitalList;

          _this.hospitalList = list;
        }
      });
    },
    getKeshi(id) {
      console.log('getKeshi');
      let _this = this;
      let postdata = {
        hospitalId: id,
        status: '',
        pageNum: '',
        size: 0,
        name: '',
      };
      this.$servers.getOfficeList(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.OfficeList;

          _this.keshiList = list;
        }
      });
    },
    getRoleList() {
      console.log('getRoleList');
      let _this = this;

      let postdata = {
        status: '00', //00有效，01无效
        pageNum: '0',
        size: 100,
        name: '',
        officeId: '',
        type: '00', //00家医角色 01平台角色
        roleDesc: '',
      };
      this.$servers.getRoleList(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.roleList;

          _this.roleList = list;
        }
      });
    },
    handleNetConnect(state) {
      this.breakConnect = state;
    },
    handleLowSpeed(state) {
      this.lowNetSpeed = state;
    },
    getCurrentData() {
      this.showCurrentTableData = true;
    },
    handleDel(val, index) {
      this.$Message.success('删除了第' + (index + 1) + '行数据');
    },
    handleCellChange(val, index, key) {
      this.$Message.success(
        '修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据',
      );
    },
    handleChange(val, index) {
      this.$Message.success('修改了第' + (index + 1) + '行数据');
    },
    cancel() {
      this.showInfo = false;
    },
    handleOnChange(page) {
      this.page = page;
      this.getData();
    },
  },
  created() {
    // },
    // activated () {
    this.listData = [];
    var id = this.$route.query.id;
    // alert(id);
    this.id = id;
    this.getData();

    let _this = this;

    setTimeout(function() {
      _this.getRoleList();
    }, 400);
  },
};
</script>
