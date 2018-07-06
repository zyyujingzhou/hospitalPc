<style lang="less">
.margin-top-20 {
    margin-top: 20px;
}
.margin-top-10 {
    margin-top: 10px;
}
.step {
    &-header-con {
        text-align: center;
        h3 {
            margin: 10px 0;
        }
        h5 {
            margin: 0 0 5px;
        }
    }
    &-content {
        padding: 5px 20px 26px;
        margin-bottom: 20px;
        border-bottom: 1px solid #dbdddf;
    }
    &-form {
        padding-bottom: 10px;
        border-bottom: 1px solid #dbdddf;
        margin-bottom: 20px;
    }
}
</style>

<template>
  <Card>
    <div>
      <Row>
        <Col span="12">医疗机构管理</Col>
      </Row>
      <Row>
        <Col span="12">
        <Button style="width:200px;" type="default" @click="handleSubmit">{{ editBtnText }}</Button>
        </Col>
      </Row>
      <Row class="margin-top-10">
        <Col class="step-header-con">
        <h4>{{ hospitalDetail.name }}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
        <Form class="step-form" ref="formValidate" :model="hospitalDetail" :rules="ruleValidate" :label-width="150">
          <FormItem label="医院简介：" prop="intro">
            <Input v-show="!hasSubmit" v-model="hospitalDetail.intro" type="textarea" :autosize="{minRows: 10,maxRows: 80}" placeholder="请输入医院简介" />
            <p v-show="hasSubmit">{{ hospitalDetail.intro}}</p>
          </FormItem>
          <FormItem label="行政地址：" prop="intro">
            <div v-show="!hasSubmit">
              <Select v-model="provincesCode" clearable style="width:150px" @on-change="handleprovinces">
                <Option v-for="item in provincesList" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
              <Select v-model="citiesCode" clearable style="width:150px" @on-change="handlecity">
                <Option v-for="item in citiesList" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
              <Select v-model="countiesCode" clearable style="width:150px" @on-change="handlecounties">
                <Option v-for="item in countiesList" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
              <Select v-model="townsCode" clearable style="width:150px" @on-change="handletowns">
                <Option v-for="item in townsList" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
              <Select v-model="villagesCode" clearable style="width:150px">
                <Option v-for="item in villagesList" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
            </div>
            <p v-show="hasSubmit">{{ hospitalDetail.addressCode }}</p>
          </FormItem>
          <FormItem label="医院详细地址：" prop="address">
            <Input v-show="!hasSubmit" v-model="hospitalDetail.address" placeholder="请输入医院详细地址" />
            <p v-show="hasSubmit">{{ hospitalDetail.address }}</p>
          </FormItem>
          <FormItem label="联系电话：">
            <Input v-show="!hasSubmit" v-model="hospitalDetail.contact" placeholder="请输入联系电话" />
            <p v-show="hasSubmit">{{ hospitalDetail.tel }}</p>
          </FormItem>
          <FormItem label="其他补充联系方式：">
            <Input v-show="!hasSubmit" v-model="hospitalDetail.contact2" placeholder="请输入其他补充联系方式" />
            <p v-show="hasSubmit">{{ hospitalDetail.contact2 }}</p>
          </FormItem>
          <FormItem label="电子邮件：">
            <Input v-show="!hasSubmit" v-model="hospitalDetail.email" placeholder="请输入电子邮件" />
            <p v-show="hasSubmit">{{ hospitalDetail.email }}</p>
          </FormItem>
        </Form>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
// import expandRow from './component/expandRow.vue';
export default {
    name: 'hospital-detail',
    // components: {
    //     expandRow
    // },
    data() {
        return {
            editBtnText: '编辑医疗机构资料',
            ruleValidate: {},
            hospitalDetail: {},
            hasSubmit: true,
            provincesCode: '',
            provincesList: [],
            citiesCode: '',
            citiesList: [],
            countiesCode: '',
            countiesList: [],
            townsCode: '',
            townsList: [],
            villagesCode: '',
            villagesList: [],
            addressCode: ''
        }
    },
    methods: {
        getData() {
            let self = this
            self.$servers.getHospital(res => {
                console.log(123)
                let hospitalDetail = res.data.hospitalList[0]
                console.log(hospitalDetail)
                if (hospitalDetail.otherDesc.otherDesc) {
                    let otherDesc = JSON.parse(
                        hospitalDetail.otherDesc.otherDesc
                    )
                    hospitalDetail.intro = otherDesc.intro
                    hospitalDetail.email = otherDesc.email
                    hospitalDetail.contact2 = otherDesc.contact2
                } else {
                    hospitalDetail.intro = ''
                    hospitalDetail.email = ''
                    hospitalDetail.contact2 = ''
                }
                console.log(123)
                // self.$servers.fetchAddress(hospitalDetail.addressCode, res => {
                //     self.regionInfo = res.data.regionList[0].name
                // })
                self.hospitalDetail = hospitalDetail
            })
        },
        fetchProvinces() {
            this.$servers.fetchProvinces(res => {
                console.log(res.data.provinces)
                this.provincesList = res.data.provinces
            })
        },
        fetchCities(provincesCode) {
            this.$servers.fetchCities(provincesCode, res => {
                console.log(res.data.cities)
                this.citiesList = res.data.cities
            })
        },
        fetchCounties(citiesCode) {
            this.$servers.fetchCounties(citiesCode, res => {
                this.countiesList = res.data.counties
            })
        },
        fetchTowns(countiesCode) {
            this.$servers.fetchTowns(countiesCode, res => {
                this.townsList = res.data.towns
            })
        },
        fetchVillages(towns) {
            this.$servers.fetchVillages(towns, res => {
                this.villagesList = res.data.villages
            })
        },
        handleSubmit() {
            if (this.hasSubmit === false) {
                let addressCode = this.villagesCode
                    ? this.villagesCode
                    : this.townsCode

                let otherDesc = {}
                otherDesc.intro = this.hospitalDetail.intro
                otherDesc.email = this.hospitalDetail.email
                otherDesc.contact2 = this.hospitalDetail.contact2
                otherDesc = JSON.stringify(otherDesc)
                let postdata = {
                    name: this.hospitalDetail.name, //类型：String  必有字段  备注：无
                    address: this.hospitalDetail.address, //类型：String  必有字段  备注：无
                    area: this.hospitalDetail.area, //类型：String  必有字段  备注：无
                    tel: this.hospitalDetail.contact, //类型：String  必有字段  备注：无
                    otherDesc: {
                        otherDesc
                        //类型：Object  可有字段  备注：其他信息，JSON格式保存，可自行扩展
                    },
                    provincesCode: this.provincesCode, //类型：String  必有字段  备注：省份码
                    citiesCode: this.citiesCode, //类型：String  必有字段  备注：市编码
                    countiesCode: this.countiesCode, //类型：String  必有字段  备注：区县编码
                    townsCode: this.townsCode, //类型：String  必有字段  备注：街道编码
                    addressCode: addressCode, //类型：String  必有字段  备注：地址码
                    villagesCode: this.villagesCode //类型：String  可有字段  备注：居委会/村编码
                }
                console.log(postdata)
                this.$servers.modifyHospital(postdata, res => {
                    console.log(res)
                })
            }
            this.hasSubmit = !this.hasSubmit
            this.editBtnText = this.hasSubmit ? '编辑医疗机构资料' : '完成编辑'
        },
        handleprovinces() {
            this.fetchCities(this.provincesCode)
            ;(this.citiesCode = ''),
                (this.citiesList = []),
                (this.countiesCode = ''),
                (this.countiesList = []),
                (this.townsCode = ''),
                (this.townsList = []),
                (this.villagesCode = ''),
                (this.villagesList = [])
        },
        handlecity() {
            this.fetchCounties(this.citiesCode)
            ;(this.countiesCode = ''),
                (this.countiesList = []),
                (this.townsCode = ''),
                (this.townsList = []),
                (this.villagesCode = ''),
                (this.villagesList = [])
        },
        handlecounties() {
            this.fetchTowns(this.countiesCode)
            ;(this.townsCode = ''),
                (this.townsList = []),
                (this.villagesCode = ''),
                (this.villagesList = [])
        },
        handletowns() {
            this.fetchVillages(this.townsCode)
            ;(this.villagesCode = ''), (this.villagesList = [])
        }
    },
    mounted() {
        this.getData()
        this.fetchProvinces()
    }
}
</script>
