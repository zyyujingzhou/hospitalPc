<template>
  <div>
     <Form>
       <FormItem  label="医院简介：" >
       <Input v-model="desc" placeholder="请输入医院简介"  clearable style="width: 500px"/>
       </FormItem>
       <FormItem v-model="username" label="负责人姓名：" >
         <Input  placeholder="请输入负责人姓名"  clearable style="width: 500px"/>
       </FormItem>
       <FormItem label="机构名称：" >
         <p :value="centerAdmin">{{hosDetail.name}}</p>
       </FormItem>
       <FormItem label="详细地址：" >
         <p :value="addressAdmin"> {{hosDetail.address}}</p>
       </FormItem>
       <FormItem label="联系电话：" >
         <p :value="phoneAdmin">{{hosDetail.tel}}</p>
       </FormItem>
       <FormItem label="其它联系电话：" >
         <p :value="telAdmin">{{hosDetail.contact2}} </p>
       </FormItem>
       <FormItem label="电子邮件：" >
         <p :value="emailAdmin">{{hosDetail.email}}</p>
       </FormItem>
       <FormItem label="机构简介：" >
         <p :value="hospitalAdmin">{{hosDetail.intro}}</p>
       </FormItem>
     </Form>
    <Row type="flex" justify="start" align="middle">
      <p style="margin-right:10px;">行政区域</p>
      <Select v-model="city" style="width:120px;margin-right:10px;" @on-change="fetchTowns" clearable>
        <Option v-for="(item, index) in cityList" :value="item.code" :key="index">{{ item.name }}</Option>
      </Select>
      <Select v-model="town" style="width:120px;margin-right:10px;" @on-change="fetchVillages" clearable>
        <Option v-for="(item, index) in townList" :value="item.code" :key="index" >{{ item.name }}</Option>
      </Select>
      <Select v-model="village" style="width:120px;margin-right:10px;"  clearable>
        <Option v-for="(item, index) in villageList" :value="item.code" :key="index">{{ item.name }}</Option>
      </Select>
    </Row>
    <Row>
      <Col span="4">
        <Button  @click="save" style="width: 120px;margin-top:20px;" type="primary">保存</Button>
      </Col>
      <Col span="4">
        <Button @click="back" style="width: 120px;margin-top:20px;" type="primary" >取消</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        username: '',
        desc: '',
        city: '',
        town: '',
        village: '',
        cityList: [],
        townList: [],
        villageList: [],
        centerAdmin:'',
        addressAdmin:'',
        phoneAdmin:'',
        telAdmin:'',
        emailAdmin:'',
        hospitalAdmin:'',
        hosDetail: '',

      }
    },
    methods:{
      getAdminInfo() {
        let id = JSON.parse(localStorage.getItem('loginInfo')).managerId
        this.$servers.getAdminInfo(id, res => {
          console.log(res.data.detail)
          // this.roleId = res.data.detail.roleId
          this.location = res.data.detail.locationCode
          console.log(this.location)
          this.fetchCounties()
        })
      },
      fetchCounties() {
        this.$servers.fetchCounties(this.location, res => {
          this.city=res.data.counties[0].code
          this.cityList = res.data.counties;
          this.fetchTowns()
        });
      },
      fetchTowns(){
        this.town=''
        this.townList=[]
        this.$servers.fetchTowns(this.city, res => {
          this.town=res.data.towns[0].code
          this.townList = res.data.towns;
          this.fetchVillages();
        })
      },
      fetchVillages(){
        this.village=''
        this.villageList=[]
        this.$servers.fetchVillages(this.town, res => {
          this.village=res.data.villages[0].code
          this.villageList = res.data.villages;
          /*  this.village=''
            this.town=''*/
        })
      },
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
      save() {
        let otherDesc={}
        otherDesc.contact2=this.hosDetail.contact2
        otherDesc.email=this.hosDetail.email
        otherDesc.intro =this.hosDetail.intro
        otherDesc = JSON.stringify(otherDesc)

        let postdata = {
          hospitalId:this.hosDetail,
          oaHosId:this.hosDetail,
          name:this.username,
          address:this.addressAdmin,
          area:this.city,
          tel:this.telAdmin,
          otherDesc:{
            otherDesc
          },
          provincesCode:'13',
          citiesCode:'1310',
          countiesCode:this.city,
          townsCode:this.town,
          addressCode:this.addressAdmin,
          villagesCode:this.village,
          managerPhone:this. phoneAdmin,
          managerName:this.username
        };
         this.$servers.modifyHospital(postdata, res => {
                  if( res.data.retCode==='000') {
                    this.$router.push({
                      name: 'hospital-detail'
                    })
                  }
          })
        },
      back() {
        this.$router.push({
          name: 'hospital-detail'
        })
      }



    },
    mounted(){
      this.getAdminInfo()
     /* this.fetchCounties();
      this.fetchTowns();
      this.fetchVillages()*/


       this.getHospitalDetail()


    }
  }
</script>
<style >

</style>
