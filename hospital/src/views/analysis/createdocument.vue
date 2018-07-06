<template>
  <div>
    <Card>
      <Row type="flex" justify="start" align="middle">
        <p style="margin-right:10px;">建档完成情况</p>
        <Select style="width:120px;margin-right:10px;" v-model="region" clearable>
          <Option v-for="(item, index) in regionList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
        <Select style="width:120px;margin-right:10px;" v-model="regionService" clearable>
          <Option v-for="(item, index) in regionServiceList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
        <DatePicker format="yyyy/MM/dd" type="daterange" v-model="date" placement="bottom-start" placeholder="请选择日期" style="width: 200px"></DatePicker>
        <span style="margin: 0 10px;">
          <Button type="primary" icon="search" @click="search">查询</Button>
        </span>
      </Row>
      <Row style="margin:20px;">
        <Col span="24">
         <div style="width:100%;height:300px;" id="createDom"></div>
        </Col>
      </Row>
      <Row style="margin-top:20px;">
        <Table :loading="loading" border size="small" :columns="columns" :data="data"></Table>
      </Row>
      <br>
      <Row type="flex" justify="end" align="middle" :gutter="16">
        <Page :page-size="pageSize" :current="page" :total="total" show-total show-elevator @on-change="handleOnChange"></Page>
      </Row>
    </Card>
  </div>
</template>
<script>
import pieOption from './data';
const echarts = require('echarts');
export default {
  data() {
    return {
      createDom: null,
      createDomOption: pieOption(),
      date: '',
      region: '',
      regionList: [
        {
          id: '1',
          name: '安次区',
        },
        {
          id: '2',
          name: '广阳区',
        },
      ],
      regionService: '',
      regionServiceList: [
        {
          id: '1',
          name: '银河南路街道',
        },
        {
          id: '2',
          name: '光明西道街道',
        },
      ],
      columns: [
        {
          title: '区',
          key: 'region',
          align: 'center',
          width: 120,
        },
        {
          title: '总户数',
          key: 'userAll',
          align: 'center',
          width: 80,
        },
        {
          title: '完成签约',
          key: 'finish',
          align: 'center',
        },
        {
          title: '签约居民用户总数',
          key: 'all',
          align: 'center',
        },
        {
          title: '完成建档数',
          key: 'num',
          align: 'center',
        },
        {
          title: '建档完成率',
          key: 'percent',
          align: 'center',
        },
        // {
        //   title: '操作',
        //   key: 'operator',
        //   align: 'center',
        //   width: 220,
        //   render: (h, params) => {

        //   },
        // },
      ],
      columns: [
        {
          title: '区',
          key: 'region',
          align: 'center',
          width: 120,
        },
        {
          title: '总户数',
          key: 'userAll',
          align: 'center',
        },
        {
          title: '完成签约',
          key: 'finish',
          align: 'center',
        },
        {
          title: '签约居民用户总数',
          key: 'all',
          align: 'center',
        },
        {
          title: '完成建档数',
          key: 'num',
          align: 'center',
        },
        {
          title: '建档完成率',
          key: 'percent',
          align: 'center',
        },
        // {
        //   title: '操作',
        //   key: 'operator',
        //   align: 'center',
        //   width: 220,
        //   render: (h, params) => {

        //   },
        // },
      ],
      page: 1,
      pageSize: 20,
      total: 3,
      data: [
        {
          region: '安次区',
          userAll: '48976',
          finish: '38975',
          all: '67898',
          num: '39861',
          percent: '59%',
        },
        {
          region: '广阳区',
          userAll: '68979',
          finish: '60084',
          all: '168795',
          num: '128976',
          percent: '53%',
        },
        {
          region: '总计',
          userAll: '117955',
          finish: '99059',
          all: '236693',
          num: '168837',
          percent: '56%',
        },
      ],
      loading: false,
      echartsData: {
        legend: ['未建档人数', '已建档人数'],
        series: [
          { name: '未建档人数', value: 40 },
          { name: '已建档人数', value: 60 },
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.createDom = echarts.init(document.getElementById('createDom'));
      this.createDomOption.title.text = '廊坊市建档完成度60%';
      this.createDomOption.series[0].name = '廊坊市建档完成度60';
      window.addEventListener('resize', () => {
        this.createDom.resize();
      });
      console.log('this.echartsData.series ----', this.echartsData.series);
      this.createDomOption.series[0].data = this.echartsData.series;
      this.createDom.setOption(this.createDomOption);
    },
    search() {
      this.page = 1;
      // this.healthSearchList();
    },
    // 分页
    handleOnChange(page) {
      this.page = page;
      // this.search(page);
    },
  },
};
</script>


