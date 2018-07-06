<template>
  <div>
    <Card>
      <Form>
        <FormItem label="团队名称：">
          <p>{{teamInfo.teamName}}</p>
        </FormItem>
        <FormItem label="所属医疗机构：">
          <p>{{teamInfo.hosname}}</p>
        </FormItem>
        <FormItem label="科室：">
          <p>{{teamInfo.ofname}}</p>
        </FormItem>
        <FormItem label="团队头像：">
          <img src="" alt="">
        </FormItem>
        <FormItem label="行政区域：">
          <p>{{teamInfo.teamAddress}}</p>
        </FormItem>
        <FormItem label="联系电话：">
          <p>{{teamInfo.teamTel}}</p>
        </FormItem>
        <FormItem label="团队成员：">
          <p style="width: 200px;color:#00f;cursor:pointer" v-for="(item,index) in menberList" :key="index" @click="goHos(item.id)">
            {{item.docname}}- {{item.roname}}
          </p>
        </FormItem>
        <FormItem label="团队介绍：">
          <p>{{teamInfo.teamDesc}}</p>
        </FormItem>
        <FormItem label="审核时间：">
          <p>{{teamInfo.auditTime}}</p>
        </FormItem>

        <div v-show="!auditShow">
          <FormItem label="审核：">
            <RadioGroup v-model="auditStatus">
              <Radio label="1">启用</Radio>
              <Radio label="2">停用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="审核理由：">
            <Input type="textarea" clearable style="width: 200px" v-model="reason" />
          </FormItem>
          <Row>
            <Col span="4">
            <Button style="width: 120px;margin-top:20px;" type="primary" @click="auditTeam">保存</Button>
            </Col>
            <Col span="4">
            <Button style="width: 120px;margin-top:20px;" type="primary" @click="back">取消</Button>
            </Col>
          </Row>
        </div>

        <div v-show="auditShow">
          <FormItem label="审核结果：">
            <p>{{teamInfo.status}}</p>
          </FormItem>
          <FormItem label="审核时间：">
            <p>2018-6-5 14:44:34</p>
          </FormItem>
          <FormItem label="审核理由：">
            <p>审核的理由显示</p>
          </FormItem>
          <FormItem label="审核人：">
            <p>超级超级管理员</p>
          </FormItem>
          <Button style="width: 120px;margin-top:20px;" type="primary" @click="back">返回</Button>
          </Col>
        </div>

      </Form>
    </Card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            teamInfo: '',
            auditShow: false,
            auditStatus: '1',
            menberList: [],
            showStatus: '00',
            reason: ''
        }
    },
    methods: {
        getData() {
            let id = this.$route.query.id
            let teamList = JSON.parse(localStorage.getItem('teamList'))
            let info = []
            teamList.forEach(item => {
                if (item.id === id) {
                    info = item
                }
            })
            if (info.length === 0) {
                this.$router.push({
                    name: 'doctorTeam-page'
                })
            } else {
                this.teamInfo = info
                if (info.auditStatus === '0') {
                    this.auditShow = false
                } else {
                    this.auditShow = true
                }
                this.getTeam(id)
            }

            console.log(this.teamInfo)
        },
        auditTeam() {
            let postdata = {
                teamId: this.$route.query.id, //类型：String  必有字段  备注：无
                auditStatus: this.auditStatus,
                auditRemark: this.reason
            }
            this.$servers.auditTeam(postdata, res => {
                if (res.retCode === '000') {
                    this.back()
                }
            })
        },
        back() {
            this.$router.push({
                name: 'doctorTeam-page'
            })
        },
        goHos(id) {
            let query = { id: id }
            this.$router.push({
                path: '/tab',
                query: query
            })
        },
        getTeam(id) {
            console.log(id)
            let postdata = {
                pageNum: 1, //类型：Number  可有字段  备注：当前页
                size: 1, //类型：Number  可有字段  备注：每页条数
                teamId: id
            }
            this.$servers.teamMenberInfoList(postdata, res => {
                console.log(res.data.teamMemberList)
                this.menberList = res.data.teamMemberList
                localStorage.setItem(
                    'memberList',
                    JSON.stringify(res.data.teamMemberList)
                )
            })
        }
    },
    mounted() {
        this.getData()
    }
}
</script>

<style >
</style>
