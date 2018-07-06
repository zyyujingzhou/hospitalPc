<template>
  <div>
    <Form>
      <FormItem  label="负责人账号：" >
        <p :value="numAdmin">{{hosDetail.tel}}</p>
      </FormItem>
      <FormItem label="负责人姓名：" >
        <p :value="personAdmin">{{hosDetail.name}}</p>
      </FormItem>
      <FormItem label="机构名称：" >
        <p :value="centerAdmin">{{hosDetail.name}}</p>
      </FormItem>
      <FormItem label="详细地址：" >
        <p :value="addressAdmin">{{hosDetail.address}}</p>
      </FormItem>
      <FormItem label="联系电话：" >
        <p :value="phoneAdmin">{{hosDetail.tel}}</p>
      </FormItem>
      <FormItem label="其它联系电话：" >
        <p :value="otherAdmin">{{hosDetail.contact2}} </p>
      </FormItem>
      <FormItem label="电子邮件：" >
        <p :value="emailAdmin">{{hosDetail.email}}</p>
      </FormItem>
      <FormItem label="机构简介：" >
        <p :value="hospitalAdmin">{{hosDetail.intro}}</p>
      </FormItem>
      <FormItem label="行政街道：" >
        <p :value="roadAdmin">{{hosDetail.addressCode}}</p>
      </FormItem>
      <Button style="width: 120px" type="primary" @click="back">返回</Button>
    </Form>
  </div>
</template>
<script>
export default{
  data(){
    return{
      numAdmin:'',
      personAdmin:'',
      centerAdmin:'',
      addressAdmin:'',
      phoneAdmin:'',
      otherAdmin:'',
      emailAdmin:'',
      hospitalAdmin:'',
      roadAdmin:'',
      hosDetail:''
    }
  },
  methods:{
    getHospitalDetail() {
      let id=this.$route.query.id
      let postdata = {
        id:id
      }
      this.$servers.getHospital(postdata, res => {
        //console.log(res.data)
        this.hosDetail = res.data.hospitalList[0]
        let otherDesc = JSON.parse(res.data.hospitalList[0].otherDesc.otherDesc)
        console.log(otherDesc)
        this.hosDetail.contact2=otherDesc.contact2
        this.hosDetail.email=otherDesc.email
        this.hosDetail.intro=otherDesc.intro
      })



    },
    back() {
      this.$router.push({
        name: 'hospital-detail'
      })
    }
  },

  mounted(){
    this.getHospitalDetail()
  }
}
</script>
<style>

</style>
