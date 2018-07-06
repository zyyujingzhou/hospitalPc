<template>
  <div>
    <Form>
      <Form-item label="真实姓名:">
        <p>{{docDetail.docname}}</p>
      </Form-item>
      <Form-item label="头像">
        <img :src="docDetail.pic" alt="找不到了" width="80">
      </Form-item>
      <Form-item label="性别">
        <p>{{docDetail.sex}}</p>
      </Form-item>
      <Form-item label="手机号">
        <p>{{docDetail.phone}}</p>
      </Form-item>
      <Form-item label="所属医疗机构">
        <p>{{docDetail.hosName}}</p>
      </Form-item>
      <Form-item label="科室">
        <p>{{docDetail.ofname}}</p>
      </Form-item>
      <Form-item label="角色">
        <p>{{docDetail.roname}}</p>
      </Form-item>
      <Form-item label="擅长">
        <p>{{docDetail.goodAt}}</p>
      </Form-item>
      <Form-item label="简介">
        <p>{{docDetail.docDesc}}</p>
      </Form-item>
      <Form-item label="申请时间">
        <p>{{docDetail.ctime}}</p>
      </Form-item>
      <Form-item label="执业医师证或胸牌">
        <img :src="docDetail.pic2" alt="找不到了" width="80">
      </Form-item>
      <Form-item label="审核结果">
        <p>{{docDetail.status}}</p>
      </Form-item>
      <Form-item label="审核时间">
        <p>{{docDetail.ctime}}</p>
      </Form-item>
      <Form-item label="审核理由">
        <p>{{docDetail.reason}}</p>
      </Form-item>
      <Form-item label="审核人">
        <p>超级管理员</p>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="back">返回</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
    export default {
        name: "tab2",
        data(){
          return{
            docDetail: ''
          }
        },
        methods: {
          getData(){
            let id = this.$route.query.id
            let memberList = JSON.parse(localStorage.getItem('memberList'))
            let info = []
            memberList.forEach(item => {
                if (item.id === id) {
                    info = item
                }
            })
            console.log(info)
            if (info.length === 0) {
                this.$router.push({
                    name: 'doctorTeam-page'
                })
            }else {
                let other = JSON.parse(info.otherDesc)
                console.log(other)
                info.goodAt = other.goodAt
                info.sex = other.sex
                info.phone= other.phone
                info.pic = other.pic
                info.pic2 = other.pic_2


                if(info.status === '01'){
                  info.status = '通过'
                }else{
                  info.status = '未通过'
                }
                this.docDetail = info
            }

          },
          back(){
            this.$router.go(-1)
          }
        },
        mounted(){
          this.getData()
        }
    }
</script>

<style scoped>

</style>
