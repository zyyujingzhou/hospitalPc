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
                        <FormItem label="管理员账号" prop="loginName">
                            <Input v-model="formValidate.loginName" placeholder="请输入3-30位字母或数字或者_"></Input>
                        </FormItem>
                        <FormItem label="管理员名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入1-12个字"></Input>
                        </FormItem>
                        <FormItem label="设置密码" prop="pwd" :required="pwd">
                          <Input type="password" v-model="formValidate.pwd" placeholder="请输入8~16位的字母数字混合"></Input>
                        </FormItem>
                        <FormItem label="确认密码" prop="pwd2" :required="pwd2">
                            <Input type="password" v-model="formValidate.pwd2" placeholder="请重复输入密码"></Input>
                        </FormItem>
  
                        <FormItem label="选择角色" prop="roleId">
                            <Select v-model="formValidate.roleId" @on-change="roleChange" transfer>
                                <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择医院" v-if="roleHospital" prop="hospitalId">
                            <Select v-model="formValidate.hospitalId" transfer>
                                <Option v-for="(item, index) in hospitalList" :key="index" :value="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="电子邮箱" prop="email">
                            <Input v-model="formValidate.email" placeholder="请输入邮箱地址"></Input>
                        </FormItem>
                        <FormItem label="手机" prop="phone">
                            <Input v-model="formValidate.phone" placeholder="请输入手机号码"></Input>
                        </FormItem>
                        <FormItem label="状态" prop="status">
                            <RadioGroup v-model="formValidate.status">
                                <Radio label="00">启用</Radio>
                                <Radio label="01">停用</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem>
                            <Button :loading="saveLoading" type="primary" @click="handleSubmit('formValidate')">确定</Button>
                            <Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
                        </FormItem>

                    </Form>
                    </Col>
                </Row>
            </Modal>

            <Row>
                <Col :span="4">
                <div class="margin-top-20">
                    <Button type="primary" size="large" @click="exportData()">
                        <Icon type="ios-download-outline"></Icon> 新增管理员</Button>
                </div>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Input v-model="name" icon="search" @on-change="" placeholder="请输入管理员账号/名称搜索..." style="width: 200px" />
                <span @click="handleSearch1" style="margin: 0 10px;">
                    <Button type="primary" icon="search">搜索</Button>
                </span>
            </Row>
            <Row class="margin-top-10">
                <Col>
                <Row type="flex" justify="center" align="middle" class="">
                    <Table :loading="loading" border :columns="list" :data="listData" style="width: 100%;"></Table>
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
    const validePassword = (rule, value, callback) => {
      const reg = /^(?![^a-zA-Z]+$)(?!\D+$).{8,16}$/
      if (this.type === 'add') {
        if (!value) {
          callback(new Error('请输入密码'));
        } 
      }
      if(value && !reg.test(value)) {
        callback(new Error('密码格式不对，请输入8~16位的字母数字混合'));
      } else {
        callback();
      }
    };
    const valideRePassword = (rule, value, callback) => {
      console.log('**************');
      if (this.type === 'add' || this.formValidate.pwd) {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } 
      }
      if (value && value !== this.formValidate.pwd) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    const valideName = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_]{3,30}$/
      if (!value) {
        callback(new Error('管理员账号不能为空'));
      } else if (value && !reg.test(value)) {
        callback(new Error('管理员账号格式不对'));
      } else {
        callback();
      }
    };
    const validePhone = (rule, value, callback) => {
      const re = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value && !re.test(value)) {
        callback(new Error('请输入正确格式的手机号'));
      } else {
        callback();
      }
    };
    
    return {
      roleHospital: false,
      pwd: false,
      pwd2: false,
      pwdProp: 'pwd',
      pwd2Prop: 'pwd2',
      required: true,
      saveLoading: false,
      type: '',
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

      roleList: [],

      imgUploadUrl: this.$servers._baseurl_4,

      loginUserId: '',

      formValidate: {
        loginName: '',
        name: '',
        pwd: '',
        pwd2: '',
        roleName: '',
        roleId: '',
        email: '',
        phone: '',
        status: '',
        hospitalId: '',
      },
      ruleValidate: {
        loginName: [
          { required: true, message: '管理员账号不能为空', trigger: 'blur' },
          { validator: valideName, trigger: 'blur' },
        ],
        name: [
          { required: true, message: '管理员名称不能为空', trigger: 'blur' },
          { max: 12, message: '管理员账号不能超过12个字', trigger: 'blur' },
        ],
        pwd: [
          { validator: validePassword, trigger: 'blur' },
        ],
        pwd2: [
          { validator: valideRePassword, trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
        phone: [
            { type: 'string', validator: validePhone, trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        hospitalId: [{ required: true, message: '请选择医院', trigger: 'change' }],

      },

      list: [
        {
          title: '账号',
          key: 'loginName',
          align: 'center',
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
        },
        {
          title: '账号角色',
          key: 'roleName',
          align: 'center',
        },
        {
          title: '状态',
          key: 'statusShow',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == '00') {
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
            return [
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

                      this.handleRoleStatus(params.row.id, params.row.status);
                    },
                  },
                },
                params.row.status == '00' ? '停用' : '启用',
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

                      // this.handleReset('formValidate');
                      // this.getHospitalList();
                      this.doctorId = params.row.id;
                      let _this = this;
                      this.doctorEditTitle = '编辑管理员资料';
                      this.doctorList = [];
                      this.getRoleDetail(params.row.id);
                      this.type = 'edit';
                      this.pwd = false;
                      this.pwd2 = false;
                      this.pwdProp = '';
                      this.pwd2Prop = '';
                      //this.$set(this.ruleValidate.pwd,'required',false);
                      this.ruleValidate.pwd[0].required = false;
                      this.required = false;
                      setTimeout(function() {
                        _this.showInfo = true;
                      }, 200);
                    },
                  },
                },
                '编辑',
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
    roleChange(id) {
      if (id === '22f4cff4200b46d987e32b9c37142028') {
        this.roleHospital = true;
        this.getHospitalList();
      } else {
        this.roleHospital = false;
        this.formValidate.hospitalId = '';
      } 
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
          let password = '';
          if (_this.formValidate.pwd) {
            password = encryptbySM2( _this.formValidate.pwd, '04de6b4199b52be667bc0167594c7eebea438e9591a28b0a206949506ca4299a40c981e3dde48689895da8e1c932854b7068a1e8fa64cef93e976b196aad3678f6');
          }
          if (!_this.doctorId) {
            //新增
            let postdata = {
              //????????没有角色信息呢
              loginUserId: _this.loginUserId,
              loginName: _this.formValidate.loginName,
              name: _this.formValidate.name,
              email: _this.formValidate.email,
              address: '',
              area: '',
              hospitalId: _this.formValidate.hospitalId,
              password,
              password1: password,
              status: _this.formValidate.status,
              roleId: _this.formValidate.roleId,
              phoneNumber: _this.formValidate.phone,
            };
            console.log(postdata);
            _this.saveLoading = true;
            _this.$servers.addManager(postdata, function(data) {
              if (data.retCode == '000') {
                // debugger;
                // return;
                _this.saveLoading = false;
                let postdata = {
                  loginUserId: _this.loginUserId,
                  roleId: _this.formValidate.roleId,
                  managerId: data.data.id,
                };
                _this.$servers.addManagerRole(postdata, function(data) {
                  if (data.retCode == '000') {
                    // alert('ok')
                    _this.$Notice.success({
                      title: '添加管理员成功',
                      duration: 3,
                    });

                    _this.$Modal.remove();

                    _this.getData();

                    setTimeout(function() {
                      _this.showInfo = false;
                    }, 500);
                  }
                });
              } else {
                _this.saveLoading = false;
              }
            });
          } else {
            //编辑
            
            let postdata = {
              id: _this.doctorId,
              loginName: _this.formValidate.loginName,
              name: _this.formValidate.name,
              email: _this.formValidate.email,
              address: '',
              area: '',
              hospitalId: _this.formValidate.hospitalId,
              password,
              password1: password,
              status: _this.formValidate.status,
              roleId: _this.formValidate.roleId,
              phoneNumber: _this.formValidate.phone,
            };
            _this.$servers.modifyManager(postdata, function(data) {
              if (data.retCode == '000') {
                // debugger
                let postdata = {
                  loginUserId: _this.loginUserId,
                  roleId: _this.formValidate.roleId,
                  managerId: data.data.id,
                };
                _this.$servers.addManagerRole(postdata, function(data) {
                  if (data.retCode == '000') {
                    // alert('ok')
                    _this.$Notice.success({
                      title: '修改管理员信息成功',
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
      status = status == '00' ? '01' : '00';
      let status_text = {
        '00': '您确定要启用当前管理员吗？',
        '01': '您确定要停用当前管理员吗？停用后该管理员将不可再登录！',
      };
      let _this = this;
      this.$Modal.confirm({
        title: '提示',
        content: '' + status_text[status],
        onOk: function() {
          // alert('ok')
          let postdata = {
            id: id, //类型：String  必有字段  备注：无
            status: status, //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
          };
          _this.$servers.modifyManagerStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({
                title: '管理员状态修改成功',
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
          };
          _this.$servers.deleteManager(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '管理员删除成功', duration: 3 });
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
      // alert('新增管理员')
      // this.handleReset('formValidate');
      this.formValidate = {
        loginName: '',
        name: '',
        pwd: '',
        pwd2: '',
        roleName: '',
        roleId: '',
        email: '',
        phone: '',
        status: '',
        hospitalId: '',
      },
      this.$refs.formValidate.resetFields();
      this.formValidate.goodAt = '';
      this.formValidate.docDesc = '';
      this.formValidate.pic = '';
      this.formValidate.pic_2 = '';
      // this.getHospitalList();
      this.doctorId = '';
      this.doctorEditTitle = '新增管理员';
      this.doctorList = [];
      this.type = 'add';
      this.pwd = true;
      this.pwd2 = true;
      this.pwdProp = 'pwd';
      this.pwd2Prop = 'pwd2';
      this.showInfo = true;
    },
    roleSetting() {
      let query = {};
      this.$router.push({
        name: 'platform-manage',
        query: query,
      });
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
      let _this = this;
      this.loading = true;
      let postdata = {
        status: '', //00有效，01无效
        pageNum: this.page,
        size: this.size,
        loginName: '',
        hospitalId: '',
        email: '',
        address: '',
        area: '',
        name: this.name,
      };
      this.$servers.getManagerList(postdata, function(data) {
        if (data.retCode == '000') {
          _this.loading = false;
          let list = data.data.managerList;
          _this.listData = list;

          _this.totalNum = data.data.totalNum * 1;
        }
      });
    },
    getRoleDetail(id) {
      console.log('getRoleDetail');
      let _this = this;
      let postdata = {
        id: id,
      };
      this.$servers.getManager(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.manager;
          // list = list.map((item) => {
          //     item.statusShow = _this.statusObj[item.status];
          //     item.editFlag = true;
          //     return item;
          // })
          _this.doctorList = list;

          let obj = list[0];

          _this.formValidate = {
            loginName: obj.loginName,
            name: obj.name,
            pwd: '',
            pwd2: '',
            roleId: obj.roleId,
            roleName: '',
            email: obj.email,
            phone: obj.phoneNumber,
            status: obj.status,
            hospitalId: obj.hospitalId,
          };
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
        type: '01', //00家医角色 01平台角色
        roleDesc: '',
      };
      this.$servers.getRoleList(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.roleList;

          _this.roleList = list;
        }
      });
    },
    getHospitalList() {
      console.log('getHospitalList');
      let _this = this;
      let postdata = {
        // id: _this.id, //只定位到本医院
      };
      this.$servers.getHospitalList(postdata, function(data) {
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
      this.$refs.formValidate.resetFields();
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
