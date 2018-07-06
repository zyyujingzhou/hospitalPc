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
                        <FormItem label="角色名" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入角色名"></Input>
                            <p style="color:#999">不大于15个字</p>
                        </FormItem>
                        <FormItem label="状态" prop="status">
                            <RadioGroup v-model="formValidate.status">
                                <Radio label="00">启用</Radio>
                                <Radio label="01">停用</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="角色描述" prop="roleDesc">
                            <Input type="textarea" v-model="formValidate.roleDesc" placeholder="请输入描述"></Input>
                            <p style="color:#999">不大于30个字</p>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                            <Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
                        </FormItem>

                    </Form>
                    </Col>
                </Row>
            </Modal>
            <!-- 角色权限设置 -->
            <Modal width="700" v-model="showInfo2" class="modalhidefooter" :title="title" :mask-closable=false @on-visible-change="formModalChange2">
                <Row>
                    <Col span="20" offset="2">
                    <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate" :label-width="80">
                        <FormItem label="角色名称" prop="name">
                          <Input v-model="formValidate2.name" placeholder="请输入角色名称"></Input>
                        </FormItem>
                        <FormItem label="角色描述" prop="roleDesc">
                          <Input v-model="formValidate2.roleDesc" placeholder="请输入角色描述"></Input>
                        </FormItem>
                        <FormItem label="状态" prop="status">
                            <RadioGroup v-model="formValidate2.status">
                                <Radio label="00">启用</Radio>
                                <Radio label="01">停用</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="权限列表" :required="true" prop="functionList">
                          <div v-for="(item, index) in functionList" :key="index">
                            <checkboxgroup @onchange="hanleOnCheckBoxGroupChange" :id="item.id" :title="item.name" :children="item.childList" :checks="getAuthList(item.childList)" :allchecks="getAllAuthList(item.childList)"></checkboxgroup>
                          </div>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit2('formValidate2')">提交</Button>
                            <Button type="ghost" @click="handleCancel2()" style="margin-left: 8px">取消</Button>
                        </FormItem>

                    </Form>
                    </Col>
                </Row>
            </Modal>
            <Row>
                <div class="margin-top-20">
                    <Button type="primary" size="large" @click="exportData()">
                        <Icon type="ios-download-outline"></Icon> 新增平台角色</Button>
                </div>
            </Row>
            <Row class="margin-top-10">
                <Input v-model="name" icon="search" @on-change="" placeholder="请输入角色名称搜索..." style="width: 200px" />
                <span @click="handleSearch1" style="margin: 0 10px;">
                    <Button type="primary" icon="search">搜索</Button>
                </span>
                <!-- <Button @click="handleCancel1" type="ghost" >取消</Button> -->
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
import checkboxgroup from './components/checkboxgroup';
export default {
  name: 'argument-page',
  components: {
    checkboxgroup,
  },
  data() {
    return {
      title: '',
      permissions: {},
      loading: false,
      id: '',
      page: 1,
      size: 10,
      name: '', //搜索条件
      totalNum: 1,

      showInfo2: false,

      showInfo: false,
      doctorId: '',
      doctorList: [],
      doctorEditTitle: '',

      hospitalList: [],
      keshiList: [],

      imgUploadUrl: this.$servers._baseurl_4,

      formValidate: {
        name: '',
        status: '',
        roleDesc: '',
        type: '01',
      },

      formValidate2: {
        name: '',
        roleDesc: '',
        status: '',
      },

      functionList: [],
      functionList2: [],
      functionChooseList: [],

      ruleValidate: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { max: 15, message: '角色名不能超过15个字', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        roleDesc: [
          { message: '请输入描述', trigger: 'blur' },
          { max: 30, message: '描述不能超过30个字', trigger: 'blur' },
        ],
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
        functionList: [{ required: true, type: 'array', min: 1, message: '请勾选权限，至少一项', trigger: 'change' }],
      },

      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '权限名称',
          key: 'name',
        },
        {
          title: '说明',
          key: 'descripe',
        },
      ],
      data1: [
        // {
        //     name: 'John Brown',
        //     descripe: 'New York No. 1 Lake Park',
        // },
      ],

      list: [
        // {
        //     type: 'index',
        //     title: '序号',
        //     width: 60
        // },
        {
          title: '角色',
          key: 'name',
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

              //         // this.handleReset('formValidate');
              //         // this.getHospitalList();
              //         this.doctorId = params.row.id;
              //         let _this = this;
              //         this.doctorEditTitle = '编辑平台角色资料';
              //         this.doctorList = [];
              //         this.getRoleDetail(params.row.id);
              //         setTimeout(function() {
              //           _this.showInfo = true;
              //         }, 200);
              //       },
              //     },
              //   },
              //   '编辑',
              // ),
              // h('Button', {
              //     props: {
              //         type: 'text',
              //         size: 'small'
              //     },
              //     on: {
              //         click: () => {
              //             alert('功能待添加')
              //             return;
              //             let query = {id: params.row.id};

              //             this.handleReset('formValidate');
              //             // this.getHospitalList();
              //             this.doctorId = params.row.id;
              //             let _this = this;
              //             this.doctorEditTitle = '编辑平台角色资料';
              //             this.doctorList = [];
              //             this.getRoleDetail(params.row.id);
              //             setTimeout(function(){
              //                 _this.showInfo = true
              //             },200)
              //         }
              //     }
              // }, '查看权限'),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      console.log(params);
                      
                      this.handleReset('formValidate');
                      this.initFunctionList();
                      this.formValidate2.name = params.row.name;
                      this.formValidate2.roleId = params.row.id;
                      this.formValidate2.roleDesc = params.row.roleDesc;
                      this.formValidate2.status = params.row.status;
                      this.title = '编辑角色';
                      this.type = 'edit';
                      this.doctorList = [];
                      this.functionChooseList = [];
                      this.permissions = {};
                      this.getFunctionList(params.row.id);
                      this.showInfo2 = true;
   
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
      type: '',
    };
  },
  methods: {
    onselchange(selection) {
      console.log('selection', selection);
      let arr = selection.map(item => {
        return item.id;
      });
      this.functionChooseList.length = 0;
      this.functionChooseList.push.apply(this.functionChooseList, arr);
      console.log(this.functionChooseList);
    },
    initFunctionList() {
      this.formValidate2.name = '';
      this.formValidate2.roleId = '';
      this.formValidate2.roleDesc = '';
      this.formValidate2.status = '';
      this.functionList = [];
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
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
    handleCancel2() {
      this.$refs.formValidate2.resetFields();
      this.showInfo2 = false;
    },
    handleSubmit2(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let functionList = [];
          const array = Object.values(this.permissions);
          for (let index = 0; index < array.length; index += 1) {
            functionList.push(...array[index]);
          }
          if (!functionList.length) {
            _this.$Message.warning('请勾选权限，至少一项!');
            return;
          }
          let postdata = {
            roleId: this.formValidate2.roleId,
            name: this.formValidate2.name,
            functionList: functionList,
            roleDesc: this.formValidate2.roleDesc,
            status: this.formValidate2.status,
            type: '01',
          };
          if (this.type === 'add') {
            delete postdata.roleId;
          }
          console.log(postdata);
          _this.$servers.addRoleFunction(postdata, function(data) {
            if (data.retCode == '000') {
              _this.$Notice.success({ title: '设置权限成功', duration: 3 });
              _this.getData();
              _this.showInfo2 = false;
              // _this.$router.go(0);
            }
          });
        }
      });
    },
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        // debugger;
        if (valid) {
          // this.$Message.success('Success!');
          if (!_this.doctorId) {
            //新增
            let postdata = {
              // "id":"8c0d993d97054e49b7ebd545e33af4a6",                //类型：String  必有字段  备注：无
              name: _this.formValidate.name, //类型：String  必有字段  备注：名称
              type: _this.formValidate.type, //类型：String  必有字段  备注：类型：01医生，02护士，03助理
              roleDesc: _this.formValidate.roleDesc, //类型：String  必有字段  备注：医生描述
              status: _this.formValidate.status,
            };
            if (!_this.formValidate.name.trim()) {
                _this.$Notice.warning({ title: '权限名格式错误，请重新填写', duration: 3 });
                return;
            }
            console.log(postdata);
            _this.$servers.addRole(postdata, function(data) {
              if (data.retCode == '000') {
                // alert('ok')
                _this.$Notice.success({ title: '添加角色成功', duration: 3 });

                _this.$Modal.remove();

                _this.getData();

                setTimeout(function() {
                  _this.showInfo = false;
                }, 500);
              }
            });
          } else {
            //编辑
            let postdata = {
              id: _this.doctorId, //类型：String  必有字段  备注：无
              name: _this.formValidate.name, //类型：String  必有字段  备注：名称
              type: _this.formValidate.type, //类型：String  必有字段  备注：类型：01医生，02护士，03助理
              roleDesc: _this.formValidate.roleDesc, //类型：String  必有字段  备注：医生描述
              status: _this.formValidate.status,
            };
            _this.$servers.modifyRole(postdata, function(data) {
              if (data.retCode == '000') {
                // alert('ok')
                _this.$Notice.success({
                  title: '修改角色信息成功',
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
      status = status == '00' ? '01' : '00';
      let _this = this;
      let status_text = {
        '00': '您确定要启用当前角色吗？',
        '01': '您确定要停用当前角色吗？停用后该角色将不可再使用！',
      };
      this.$Modal.confirm({
        title: '提示',
        content: status_text[status],
        onOk: function() {
          // alert('ok')
          let postdata = {
            id: id, //类型：String  必有字段  备注：无
            status: status, //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
          };
          _this.$servers.modifyRoleStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '角色状态修改成功', duration: 3 });
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
          _this.$servers.deleteRole(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '角色删除成功', duration: 3 });
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
    formModalChange2(status) {
      // alert(status);
      //modal状态改变
    },
    exportData() {
      // alert('新增平台角色')
      this.handleReset('formValidate');
      this.initFunctionList();
      // this.getHospitalList();
      this.doctorId = '';
      this.title = '新增角色';
      this.type = 'add';
      this.getFunctionList();
      this.doctorList = [];
      this.functionChooseList = [];
      this.permissions = {};
      this.showInfo2 = true;
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
        name: this.name,
        officeId: '',
        type: '01', //00家医角色 01平台角色
        roleDesc: '',
      };
      this.$servers.getRoleList(postdata, function(data) {
        if (data.retCode == '000') {
          _this.loading = false;
          let list = data.data.roleList;
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
      this.$servers.getRole(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.RoleList;
          // list = list.map((item) => {
          //     item.statusShow = _this.statusObj[item.status];
          //     item.editFlag = true;
          //     return item;
          // })
          _this.doctorList = list;

          let obj = list[0];

          _this.formValidate = {
            name: obj.name,
            status: obj.status,
            roleDesc: obj.roleDesc,
            type: obj.type,
          };
        }
      });
    },
    getRoleDetail2(id) {
      console.log('getRoleDetail2');
      let _this = this;
      let postdata = {
        id: id,
      };
      this.$servers.getRole(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.RoleList;
          // list = list.map((item) => {
          //     item.statusShow = _this.statusObj[item.status];
          //     item.editFlag = true;
          //     return item;
          // })
          _this.doctorList = list;

          let obj = list[0];

          _this.formValidate2 = {
            name: obj.name,
            roleDesc: obj.roleDesc,
          };
        }
      });
    },
    getFunctionList(id) {
      console.log('getFunctionList');
      let _this = this;
      let postdata = {
        status: '00', //00有效，01无效
        pageNum: this.page,
        size: 200,
        name: '',
        officeId: '',
        type: '01', //00家医职能 01平台职能
        funcDesc: '',
        modelName: '',
        roleId: id,
      };
      this.$servers.getFunctionList(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.functionList;
          list = list.map(item => {
            item.statusShow = item.status == '00' ? '已启用' : '已停用';
            return item;
          });
          _this.functionList = list;

          // _this.getRoleFunction(id);
        }
      });
    },
    getRoleFunction(id) {
      console.log('getRoleFunction');
      let _this = this;
      let postdata = {
        roleId: id,
      };
      this.$servers.getRoleFunction(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.functionList;

          let arr = _this.functionList.map(item => {
            item.name = item.name;
            item.descripe = item.funcDesc;

            if (
              list.find(it => {
                return item.id == it.funcId;
              })
            ) {
              _this.functionChooseList.push(item.id);
              item._checked = true;
            }
            return item;
          });
          _this.data1 = arr;
        }
      });
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
      this.$refs.formValidate.resetFields()
      this.showInfo = false;
    },
    handleOnChange(page) {
      this.page = page;
      this.getData();
    },
    hanleOnCheckBoxGroupChange(data) {
      console.log('子组件传过来的', data);
      this.permissions[data.id] = data.value;
      const array = Object.values(this.permissions);
      let functionList = [];
      for (let index = 0; index < array.length; index += 1) {
        functionList.push(...array[index]);
      }
      console.log(functionList);
      this.formValidate2.functionList = functionList;
      if (functionList.length) {
        this.$refs.formValidate2.validateField('functionList');
      }
    },
     getAuthList(data) {
      if (this.type === 'add') {
        return [];
      }
      let authlist = [];
      for (let index = 0; index < data.length; index += 1) {
        const element = data[index];
        if (element.selected) {
          authlist.push(element.id);
        }

        if (element.childList) {
          authlist = authlist.concat(this.getAuthList(element.childList));
        }
      }

      return authlist;
    },
    getAllAuthList(data) {
      let authlist = [];
      for (let index = 0; index < data.length; index += 1) {
        const element = data[index];
        authlist.push(element.id);

        if (element.childList) {
          authlist = authlist.concat(this.getAuthList(element.childList));
        }
      }

      return authlist;
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
  },
};
</script>
