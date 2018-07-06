<template>
  <Card>
    <div>
      <div class="modal-content">
        <Row>
          <Col span="12">一级科室</Col>
          <Col span="12" style="padding-left:20px;">二级科室</Col>
        </Row>
        <Row>

          <Col span="12">
          <div v-for="(item, index) in officeList" :key="index" style="margin-top:10px;padding-left:20px;">
            <Row>
              <Col :class="['officeList', item.isActive ? 'active' : '']" @click.native="active(item, $event)">
              <Row type="flex" align="middle">
                <Col span="12" v-show="!item.editFlag">{{ item.name }}</Col>
                <Col span="12" v-show="item.editFlag">
                <Input type="text" v-model="item.name" placeholder="请输入科室名称"></Input>
                </Col>
                <Col style="padding-left:20px;">
                <Button class="officeBtn" type="ghost" @click="handleKeshiEdit(item.id, item.editFlag, index, item.name)">{{ !item.editFlag ? '修改' : '完成' }}</Button>
                </Col>
                <Col style="margin-left:10px;">
                <Button class="officeBtn" type="ghost" @click="handleKeshiStatus(item.id, item.status, index)">{{ item.status=='00' ? '停用' : '启用' }}</Button>
                </Col>
              </Row>
              </Col>
            </Row>
          </div>
          <Row style="margin-left:20px;margin-top:20px;">
            <Col>
            <Button type="dashed" long icon="plus-round" @click="handleAdd">添加一级科室</Button>
            </Col>
          </Row>
          </Col>

          <Col span="12">
          <Row style="padding-left:20px;margin-top:10px;" class="officeList-child" type="flex" align="middle" v-for="(child, index) in childList" :key="index">
            <Col span="12" v-show="!child.editFlag">{{ child.name }}</Col>
            <Col span="12" v-show="child.editFlag">
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
            <Col>
            <Button type="dashed" long icon="plus-round" @click="handleAdd2">添加二级科室</Button>
            </Col>
          </Row>
          </Col>

        </Row>
      </div>
    </div>
  </Card>

</template>

<script>
export default {
    name: 'office-page',
    data() {
        return {
            officeList: [],
            currentid: '',
            childList: [],
            hosId: ''
        }
    },
    methods: {
        getData() {
            this.$servers.getHospital(res => {
                // console.log(res.data.hospitalList[0])
                this.hosId = res.data.hospitalList[0].id
            })
        },
        getOffice() {
            // let hosId = localStorage.getItem('loginInfo').managerInfo.hospitalManager[0].hospitalId
            let _this = this
            // let postdata = {
            //     hospitalId: hosId,
            //     status: '',
            //     pageNum: '1',
            //     size: 200,
            //     name: ''
            // }
            this.$servers.getOfficeList(function(data) {
                console.log(data)
                if (data.retCode == '000') {
                    let list = data.data.OfficeList
                    _this.officeList = list
                    if (list.length) {
                        list[0].selected = true
                        list[0].isActive = true
                        _this.childList = list[0].childList
                    }
                    _this.childList = _this.childList.map(item => {
                        item.statusShow = _this.statusObj[item.status]
                        item.editFlag = true
                        return item
                    })
                }
            })
        },
        active(item) {
            this.currentid = item.id
            this.childList = item.childList
            const list = this.officeList
            for (let i = 0; i < list.length; i += 1) {
                this.$set(list[i], 'isActive', false)
                this.$set(list[i], 'selected', false)
            }
            this.$set(item, 'isActive', true)
            this.$set(item, 'selected', true)
            this.childList = item.childList
        },
        handleKeshiEdit(id, editFlag, index, name) {
            // debugger
            if (!editFlag) {
                editFlag = true
                this.officeList[index].editFlag = editFlag
                this.officeList.splice(index, 1, this.officeList[index])
                return
            } else {
                editFlag = false
            }
            if (!name) {
                _this.$Notice.error({ title: '科室名称不能为空', duration: 3 })
                return
            }
            console.log('handleKeshiEdit')
            // alert(id)
            // alert(status)
            // return
            //逆操作，编辑改完成，完成改编辑
            let _this = this
            //是新增 一级科室
            if (id == -1) {
                let postdata = {
                    // "id": id,                //类型：String  必有字段  备注：无
                    name: name, //类型：String  必有字段  备注：无
                    hospitalId: this.hosId, //类型：String  必有字段  备注：无
                    parentId: '0'
                }
                this.$servers.addOffice(postdata, function(data) {
                    if (data.retCode == '000') {
                        // alert('ok')
                        _this.$Notice.success({
                            title: '一级科室添加成功',
                            duration: 3
                        })
                        delete _this.officeList[index].status
                        _this.officeList[index].id = data.data.id
                        _this.officeList[index].name = name
                        _this.officeList[index].editFlag = false
                        _this.currentid = data.data.id
                        _this.officeList.splice(
                            index,
                            1,
                            _this.officeList[index]
                        )
                    }
                })
                return
            }

            let postdata = {
                id: id, //类型：String  必有字段  备注：无
                name: name, //类型：String  必有字段  备注：无
                hospitalId: this.hosId //类型：String  必有字段  备注：无
            }
            this.$servers.modifyOffice(postdata, function(data) {
                if (data.retCode == '000') {
                    // alert('ok')
                    _this.$Notice.success({
                        title: '科室名称修改成功',
                        duration: 3
                    })
                    _this.officeList[index].editFlag = false
                    _this.officeList.splice(index, 1, _this.officeList[index])
                }
            })
        },
        handleKeshiStatus(id, status, index) {
            // this.formDynamic.items[index].status = 0;
            console.log('handleKeshiStatus')
            // alert(id)
            // alert(status)
            // return
            //逆操作，启用改停用，停用改启用
            status = status == '00' ? '01' : '00'
            let status_text = { '00': '启用', '01': '停用' }
            let _this = this
            this.$Modal.confirm({
                title: '提示',
                content: '您确定要' + status_text[status] + '当前科室吗？',
                onOk: function() {
                    let postdata = {
                        id: id, //类型：String  必有字段  备注：无
                        status: status //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
                    }
                    this.$servers.modifyOfficeStatus(postdata, function(data) {
                        if (data.retCode == '000') {
                            // alert('ok')
                            _this.$Notice.success({
                                title: '科室状态修改成功',
                                duration: 3
                            })
                            _this.officeList[index].status = status
                            _this.officeList.splice(
                                index,
                                1,
                                _this.officeList[index]
                            )
                        }
                    })
                }
            })
        },
        handleAdd() {
            let index = this.officeList.length
            index++
            this.officeList.push({
                value: '',
                index: index,
                status: 1,
                id: -1,
                editFlag: true,
                childList: []
            })
        },
        handleKeshiStatus2(child) {
            const status = child.status == '00' ? '01' : '00'
            let status_text = { '00': '启用', '01': '停用' }
            let _this = this
            this.$Modal.confirm({
                title: '提示',
                content: '您确定要' + status_text[status] + '当前科室吗？',
                onOk: function() {
                    let postdata = {
                        id: child.id, //类型：String  必有字段  备注：无
                        status: status //类型：String  必有字段  备注：状态:00启用，01停用，02关闭，99其他
                    }
                    this.$servers.modifyOfficeStatus(postdata, function(data) {
                        if (data.retCode == '000') {
                            // alert('ok')
                            _this.$Notice.success({
                                title: '科室状态修改成功',
                                duration: 3
                            })
                            _this.$set(child, 'status', status)
                        }
                    })
                }
            })
        },
        handleKeshiEdit2(child) {
            if (!child.editFlag) {
                this.$set(child, 'editFlag', true)
                return
            }
            if (!child.name) {
                _this.$Notice.error({ title: '科室名称不能为空', duration: 3 })
                return
            }
            let _this = this
            //是新增 二级科室
            if (child.id == -2) {
                let postdata = {
                    // "id": id,                //类型：String  必有字段  备注：无
                    name: child.name, //类型：String  必有字段  备注：无
                    officeDesc: '待添加', //类型：String  必有字段  备注：无
                    otherDesc: '待添加', //类型：String  可有字段  备注：其他信息，JSON格式
                    hospitalId: this.$route.query.id, //类型：String  必有字段  备注：无
                    parentId: this.currentid
                }
                this.$servers.addOffice(postdata, function(data) {
                    if (data.retCode == '000') {
                        // alert('ok')
                        _this.$Notice.success({
                            title: '二级科室添加成功',
                            duration: 3
                        })
                        // delete _this.formDynamic2.items[index].status;
                        // _this.formDynamic2.items[index].id = data.data.id;
                        // _this.formDynamic2.items[index].name = name;
                        // _this.formDynamic2.items[index].editFlag = editFlag;
                        // _this.formDynamic2.items.splice(
                        //   index,
                        //   1,
                        //   _this.formDynamic2.items[index],
                        // );
                        _this.$set(child, 'editFlag', false)
                    }
                })
                return
            }
            let postdata = {
                id: child.id, //类型：String  必有字段  备注：无
                name: child.name, //类型：String  必有字段  备注：无
                officeDesc: '待添加', //类型：String  必有字段  备注：无
                otherDesc: '待添加', //类型：String  可有字段  备注：其他信息，JSON格式
                hospitalId: this.$route.query.id //类型：String  必有字段  备注：无
            }
            this.$servers.modifyOffice(postdata, function(data) {
                if (data.retCode == '000') {
                    // alert('ok')
                    _this.$Notice.success({
                        title: '科室名称修改成功',
                        duration: 3
                    })
                    _this.$set(child, 'editFlag', false)
                }
            })
        },
        handleAdd2() {
            this.childList.push({
                value: '',
                status: 1,
                id: -2,
                editFlag: true
            })
        }
    },
    created() {
        this.getData()
        this.getOffice()
    }
}
</script>


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
