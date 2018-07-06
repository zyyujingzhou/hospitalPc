<style lang="less">
.margin-top-20 {
  margin-top: 20px;
}
.margin-top-10 {
  margin-top: 10px;
}
</style>

<template>
    <Card>
        <div>
            <!-- 科室列表 -->
            <!-- <Modal width="700"  v-model="showInfo" title="科室列表" :mask-closable=false @on-visible-change="formModalChange" >
              <div class="modal-content">
                <Row>
                    <Col span="12">一级科室</Col>
                    <Col span="12" style="padding-left:20px;">二级科室</Col>
                </Row>
                <Row>
                    <Col span="12">
                      <div   v-for="(item, index) in formDynamic.items" :key="index" style="margin-top:10px;padding-left:20px;">
                        <Row>
                          <Col :class="['officeList', item.isActive ? 'active' : '']"   @click.native="active(item, $event)">
                            <Row type="flex" align="middle">
                              <Col span="8"  v-show="item.editFlag">{{ item.name }}</Col>
                              <Col span="8" v-show="!item.editFlag">
                                <Input type="text" v-model="item.name" placeholder="请输入科室名称"></Input>
                              </Col>
                              <Col style="padding-left:20px;">
                                <Button  class="officeBtn" type="ghost" @click="handleKeshiEdit(item.id, item.editFlag, index, item.name)">{{ item.editFlag ? '修改' : '完成' }}</Button>
                              </Col>
                              <Col style="margin-left:10px;">
                                <Button  class="officeBtn" type="ghost" @click="handleKeshiStatus(item.id, item.status, index)">{{ item.status=='00' ? '停用' : '启用' }}</Button>
                              </Col>
                            </Row>
                          </Col>

                        </Row>
                      </div>
                      <Row style="margin-left:20px;margin-top:20px;">
                        <Col><Button type="dashed" long @click="handleAdd" icon="plus-round">添加一级科室</Button></Col>
                      </Row>
                    </Col>
                    
                    <Col span="12">
                      <Row style="padding-left:20px;margin-top:10px;" class="officeList-child" type="flex" align="middle" v-for="(child, index) in childList" :key="index">
                        <Col span="8"  v-show="!child.editFlag">{{ child.name }}</Col>
                        <Col span="8" v-show="child.editFlag">
                          <Input type="text" v-model="child.name" placeholder="请输入科室名称"></Input>
                        </Col>
                        <Col style="padding-left:20px;">
                          <Button type="ghost" @click="handleKeshiEdit2(child)">{{ !child.editFlag ? '修改' : '完成' }}</Button>
                        </Col>
                        <Col style="margin-left:10px;">
                          <Button type="ghost" @click="handleKeshiStatus2(child)">{{ child.status=='00' ? '停用' : '启用' }}</Button>
                        </Col>
                      </Row>
                      <Row style="margin-left:20px;margin-top:20px;">
                        <Col><Button type="dashed" long @click="handleAdd2" icon="plus-round">添加二级科室</Button></Col>
                      </Row>
                    </Col>
                </Row>
              </div>
            </Modal> -->

            <!-- 医院上级设置 -->

            <Modal width="700" v-model="showInfo2" title="设置上级机构" :mask-closable=false @on-visible-change="formModalChange2">
                <Row>
                    <Col span="12">
                    <Form ref="formDynamic3" :model="formDynamic3" :rules="ruleValidate" :label-width=120>
                        <FormItem label="当前医院">
                            {{ hospitalName }}
                        </FormItem>
                        <FormItem label="选择上级医院" prop="interest">
                            <CheckboxGroup v-model="formDynamic3.interest">
                                <Checkbox v-for="(item, index) in hospitalData" :key="index" :label="item.name"></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Form>

                    </Col>
                </Row>
                <div slot="footer">
                    <Button type="text" @click="cancel">取消</Button>
                    <Button type="primary" :loading="saveLoading" @click="ok">确定</Button>
                </div>
            </Modal>

            <Row>
                <div class="margin-top-20">
                    <Button type="primary" size="large" @click="exportData()">
                        <Icon type="ios-download-outline"></Icon> 初始数据导入</Button>
                </div>
            </Row>
            <Row class="margin-top-10">
                <Input v-model="name" icon="search" @on-change="" placeholder="请输入医院名称搜索..." style="width: 200px" />
                <span @click="handleSearch1" style="margin: 0 10px;">
                    <Button type="primary" icon="search">搜索</Button>
                </span>
            </Row>
            <Row class="margin-top-10">
                <Col>
                <Row type="flex" justify="center" align="middle" class="">
                    <Table border :loading="loading" :columns="list" :data="listData" style="width: 100%;"></Table>
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
// import expandRow from './component/expandRow.vue';
export default {
  name: 'argument-page',
  // components: {
  //     expandRow
  // },
  data() {
    return {
      childList: [],
      isActive: false,
      saveLoading: false,
      loading: false,
      page: 1,
      size: 10,
      name: '', //搜索条件
      totalNum: 1,
      showInfo: false,
      showInfo2: false,

      keshiOpEdit: true,
      index: 1,
      formDynamic: {
        items: [
          // {
          //     value: '',
          //     index: 1,
          //     status: 1
          // }
        ],
      },
      formDynamic2: {
        items: [],
      },

      formDynamic3: {
        interest: [],
      },
      ruleValidate: {
        interest: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '请选择至少一家上级医院',
            trigger: 'change',
          },
          // { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
      },

      hospitalData: [],
      hospitalSJ: [],

      list4: [],
      currentindex: 0,
      currentid: 0,

      index: 0,
      index2: 0,

      hospitalId: '',
      hospitalName: '',

      statusObj: {
        '00': '已启用',
        '01': '已停用',
        '02': '关闭',
        '99': '其他',
      },

      list: [
        // {
        //     type: 'index',
        //     title: '序号',
        //     width: 60
        // },
        {
          title: '医院',
          key: 'name',
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
                      this.$router.push({
                        name: 'hospital-detail',
                        query: query,
                      });
                    },
                  },
                },
                params.row.name,
              ),
            ];
          },
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
        // {
        //     title: '购买时间',
        //     key: 'time'
        // },
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
                      let query = { id: params.row.id, edit: 1 };
                      this.$router.push({
                        name: 'hospital-detail',
                        query: query,
                      });
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

                      this.handleHospitalStatus(
                        params.row.id,
                        params.row.status,
                      );
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
                      // alert(params.row.id)
                      this.handleReset('formDynamic3');

                      this.hospitalId = params.row.id;
                      this.hospitalName = params.row.name;
                      let _this = this;
                      this.getAllHospital(params.row.id);
                      setTimeout(function() {
                        _this.showInfo2 = true;
                      }, 200);
                    },
                  },
                },
                '设置上级机构',
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
                      this.$router.push({
                        name: 'office-manage',
                        query: query,
                      });
                      // let query = { id: params.row.id };
                      // // alert(params.row.id)

                      // this.hospitalId = params.row.id;
                      // let _this = this;
                      // this.getKeshi(params.row.id);
                      // setTimeout(function() {
                      //   _this.showInfo = true;
                      // }, 200);
                    },
                  },
                },
                '查看科室',
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
                      this.$router.push({
                        name: 'doctor-manage',
                        query: query,
                      });
                    },
                  },
                },
                '查看医生',
              ),
            ];
          },
        },
      ],
      listData: [
        {
          //类型：Object  必有字段  备注：无
          id: '2', //类型：String  必有字段  备注：无
          oaHosId: '1102', //类型：String  必有字段  备注：无
          name: '1102医院', //类型：String  必有字段  备注：无
          address: '2', //类型：String  必有字段  备注：无
          otherDesc: '2', //类型：String  必有字段  备注：无
          area: '2', //类型：String  必有字段  备注：无
          tel: '2', //类型：String  必有字段  备注：无
          ctime: 1514908800000, //类型：Number  必有字段  备注：无
          utime: 1514908800000, //类型：Number  必有字段  备注：无
          status: '00', //类型：String  必有字段  备注：无
          statusShow: '已启用',
        },
      ],
    };
  },
  methods: {
    listKeshi2(id, index) {
      // alert(id)
      this.currentindex = index;
      this.currentid = id;
      let _this = this;
      _this.formDynamic2.items = this.list4.filter(item => {
        return item.parentId == id;
      });

      _this.index2 = _this.formDynamic2.items.length;
    },
    handleSubmit(name) {
      this.keshiOpEdit = !this.keshiOpEdit;
      // this.$refs[name].validate((valid) => {
      //     if (valid) {
      //         this.$Message.success('Success!');
      //     } else {
      //         this.$Message.error('Fail!');
      //     }
      // })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleAdd() {
      this.index++;
      this.formDynamic.items.push({
        value: '',
        index: this.index,
        status: 1,
        id: -1,
        editFlag: false,
        childList: [],
      });
    },
    handleAdd2() {

      this.childList.push({
        value: '',
        status: 1,
        id: -2,
        editFlag: true,
      });
    },
    formModalChange(status) {
      // alert(status);
      //modal状态改变
      this.keshiOpEdit = status;
    },
    formModalChange2(status) {
      // alert(status);
      //modal状态改变
    },
    ok() {
      let _this = this;
      this.$refs['formDynamic3'].validate(valid => {
        // debugger;
        if (valid) {
          //新增
          let higherupsList = [];

          let arr = _this.hospitalData.filter(item => {
            return _this.formDynamic3.interest.find(it => {
              return it == item.name;
            });
          });
          higherupsList = arr.map(item => {
            return {
              parentId: item.id,
            };
          });
          let postdata = {
            hospitalId: _this.hospitalId,
            higherupsList: higherupsList,
          };
          console.log(postdata);
          _this.$servers.addHospitalGrade(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '设置上级医院成功', duration: 3 });

              _this.$Modal.remove();

              setTimeout(function() {
                _this.showInfo2 = false;
              }, 500);
            }
          });
        }
      });
    },
    shangjisettingcancel() {
      this.handleReset('formDynamic3');
    },
    handleKeshiStatus(id, status, index) {
      // this.formDynamic.items[index].status = 0;
      console.log('handleKeshiStatus');
      // alert(id)
      // alert(status)
      // return
      //逆操作，启用改停用，停用改启用
      status = status == '00' ? '01' : '00';
      let status_text = { '00': '启用', '01': '停用' };
      let _this = this;
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要' + status_text[status] + '当前科室吗？',
        onOk: function() {
          let postdata = {
            id: id, //类型：String  必有字段  备注：无
            status: status, //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
          };
          this.$servers.modifyOfficeStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '科室状态修改成功', duration: 3 });
              _this.formDynamic.items[index].status = status;
              _this.formDynamic.items.splice(
                index,
                1,
                _this.formDynamic.items[index],
              );
            }
          });
        },
      });
    },
    active(item) {
      this.currentid = item.id;
      this.childList = item.childList;
      const list = this.formDynamic.items
      for (let i = 0; i < list.length; i += 1) {
        this.$set(list[i], 'isActive', false);
        this.$set(list[i], 'selected', false);
      }
      this.$set(item, 'isActive', true);
      this.$set(item, 'selected', true);
      this.childList = item.childList;
    },
    handleKeshiEdit(id, editFlag, index, name) {
      // debugger
      if (editFlag) {
        editFlag = !editFlag;
        this.formDynamic.items[index].editFlag = editFlag;
        this.formDynamic.items.splice(index, 1, this.formDynamic.items[index]);
        return;
      }
      if (!name) {
        _this.$Notice.error({ title: '科室名称不能为空', duration: 3 });
        return;
      }
      console.log('handleKeshiEdit');
      // alert(id)
      // alert(status)
      // return
      //逆操作，编辑改完成，完成改编辑
      editFlag = !editFlag;
      let _this = this;
      //是新增 一级科室
      if (id == -1) {
        let postdata = {
          // "id": id,                //类型：String  必有字段  备注：无
          name: name, //类型：String  必有字段  备注：无
          hospitalId: this.hospitalId, //类型：String  必有字段  备注：无
          parentId: '0',
        };
        this.$servers.addOffice(postdata, function(data) {
          if (data.retCode == '000') {
            // alert('ok')
            _this.$Notice.success({ title: '一级科室添加成功', duration: 3 });
            delete _this.formDynamic.items[index].status;
            _this.formDynamic.items[index].id = data.data.id;
            _this.formDynamic.items[index].name = name;
            _this.formDynamic.items[index].editFlag = editFlag;
            _this.currentid = data.data.id;
            _this.formDynamic.items.splice(
              index,
              1,
              _this.formDynamic.items[index],
            );
          }
        });
        return;
      }

      let postdata = {
        id: id, //类型：String  必有字段  备注：无
        name: name, //类型：String  必有字段  备注：无
        hospitalId: this.hospitalId, //类型：String  必有字段  备注：无
      };
      this.$servers.modifyOffice(postdata, function(data) {
        if (data.retCode == '000') {
          // alert('ok')
          _this.$Notice.success({ title: '科室名称修改成功', duration: 3 });
          _this.formDynamic.items[index].editFlag = editFlag;
          _this.formDynamic.items.splice(
            index,
            1,
            _this.formDynamic.items[index],
          );
        }
      });
    },
    handleKeshiStatus2(child) {
      const status = child.status == '00' ? '01' : '00';
      let status_text = { '00': '启用', '01': '停用' };
      let _this = this;
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要' + status_text[status] + '当前科室吗？',
        onOk: function() {
          let postdata = {
            id: child.id, //类型：String  必有字段  备注：无
            status: status, //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
          };
          this.$servers.modifyOfficeStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '科室状态修改成功', duration: 3 });
              _this.$set(child, 'status', status);
            }
          });
        },
      });
    },
    handleKeshiEdit2(child) {
      if (!child.editFlag) {
        this.$set(child, 'editFlag', true);
        return;
      }
      if (!child.name) {
        _this.$Notice.error({ title: '科室名称不能为空', duration: 3 });
        return;
      }
      let _this = this;
      //是新增 二级科室
      if (child.id == -2) {
        let postdata = {
          // "id": id,                //类型：String  必有字段  备注：无
          name: child.name, //类型：String  必有字段  备注：无
          officeDesc: '待添加', //类型：String  必有字段  备注：无
          otherDesc: '待添加', //类型：String  可有字段  备注：其他信息，JSON格式
          hospitalId: this.hospitalId, //类型：String  必有字段  备注：无
          parentId: this.currentid,
        };
        this.$servers.addOffice(postdata, function(data) {
          if (data.retCode == '000') {
            // alert('ok')
            _this.$Notice.success({ title: '二级科室添加成功', duration: 3 });
            // delete _this.formDynamic2.items[index].status;
            // _this.formDynamic2.items[index].id = data.data.id;
            // _this.formDynamic2.items[index].name = name;
            // _this.formDynamic2.items[index].editFlag = editFlag;
            // _this.formDynamic2.items.splice(
            //   index,
            //   1,
            //   _this.formDynamic2.items[index],
            // );
            _this.$set(child, 'editFlag', false);

          }
        });
        return;
      }
      let postdata = {
        id: child.id, //类型：String  必有字段  备注：无
        name: child.name, //类型：String  必有字段  备注：无
        officeDesc: '待添加', //类型：String  必有字段  备注：无
        otherDesc: '待添加', //类型：String  可有字段  备注：其他信息，JSON格式
        hospitalId: this.hospitalId, //类型：String  必有字段  备注：无
      };
      this.$servers.modifyOffice(postdata, function(data) {
        if (data.retCode == '000') {
          // alert('ok')
          _this.$Notice.success({ title: '科室名称修改成功', duration: 3 });
          _this.$set(child, 'editFlag', false);

        }
      });
    },
    handleHospitalStatus(id, status) {
      // this.formDynamic.items[index].status = 0;
      console.log('handleRoleStatus');
      // alert(id)
      // alert(status)
      // return
      //逆操作，启用改停用，停用改启用
      status = status == '00' ? '01' : '00';
      let status_text = {
        '00': '您确定要启用当前医院吗？',
        '01': '您确定要停用当前医院吗？停用后该医院将不可用！',
      };
      let _this = this;
      this.$Modal.confirm({
        title: '提示',
        content: '' + status_text[status],
        onOk: function() {
          // alert('ok')
          let postdata = {
            hospitalId: id, //类型：String  必有字段  备注：无
            status: status, //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
          };
          _this.$servers.modifyHospitalStatus(postdata, function(data) {
            if (data.retCode == '000') {
              // alert('ok')
              _this.$Notice.success({ title: '医院状态修改成功', duration: 3 });
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
    exportData() {
      alert('初始数据导入');
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
        oaHosId: '',
        pageNum: this.page,
        size: this.size,
        name: this.name,
      };
      this.$servers.getHospitalList(postdata, function(data) {
        if (data.retCode == '000') {
          _this.loading = false;
          let list = data.data.hospitalList;

          list = list.map((item, index) => {
            item.statusShow = _this.statusObj[item.status];
            return item;
          });
          _this.listData = list;

          _this.totalNum = data.data.totalNum * 1;
        }
      });
    },
    getKeshi(id) {
      console.log('getKeshi');
      let _this = this;
      let postdata = {
        hospitalId: id,
        status: '',
        pageNum: '1',
        size: 200,
        name: '',
      };
      this.$servers.getOfficeList(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.OfficeList;
          _this.list4 = list;
          if (list.length) {
            list[0].selected = true;
            list[0].isActive = true;
            _this.childList = list[0].childList;
          }

          list = list.map(item => {
            item.statusShow = _this.statusObj[item.status];
            item.editFlag = true;
            return item;
          });
          // _this.formDynamic.items = list;
          _this.formDynamic.items = list.filter(item => {
            return item.parentId == '0';
          });

        }
      });
    },
    getAllHospital(id) {
      let _this = this;
      let postdata = {
        oaHosId: '',
        pageNum: '',
        size: 1000,
        name: '',
      };
      this.$servers.getHospitalList(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.hospitalList;

          list = list.map((item, index) => {
            item.statusShow = _this.statusObj[item.status];
            return item;
          });
          _this.hospitalData = list;

          _this.getSJHospital(id);
        }
      });
    },
    getSJHospital(id) {
      console.log('getSJHospital');
      let _this = this;
      let postdata = {
        hospitalId: id,
      };
      this.$servers.getHospitalGrade(postdata, function(data) {
        if (data.retCode == '000') {
          let list = data.data.higherupsList || [];

          _this.hospitalSJ = list;
          // debugger;

          let arr = list.map(item => {
            return item.name;
          });

          _this.formDynamic3.interest = arr;
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
      this.$refs.formDynamic3.resetFields();
      this.showInfo2 = false;
    },
    handleOnChange(page) {
      this.page = page;
      this.getData();
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style scoped>
.officeList {
  background: #eee;
  padding: 5px 10px;
}
.officeList-child{
  padding: 5px 10px;
  margin-bottom:10px;
}
.active{
  background: #fff;
}
.officeBtn{
  background: #fff;
}
.officeList-right {
  position: absolute;
  left: 53%;
  top:0;
  width:47%;
}
.modal-content{
  height:400px;
  overflow-x:hidden;
  overflow-y: auto;
}
</style>

