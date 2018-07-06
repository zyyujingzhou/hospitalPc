<template>
  <div>
    <Card>
      <Row type="flex" justify="start" align="middle">
        <p style="margin-right:10px;">建档完成情况</p>
        <Select style="width:120px" v-model="searchData.selected" clearable>
          <Option v-for="item in catList" :value="item.catId" :key="item.catId + item.catName">{{ item.catName }}</Option>
        </Select>
        <Select style="width:120px" v-model="searchData.selected" clearable>
          <Option v-for="item in catList" :value="item.catId" :key="item.catId + item.catName">{{ item.catName }}</Option>
        </Select>
        <DatePicker format="yyyy/MM/dd" type="daterange" v-model="searchData.createDate" placement="bottom-start" placeholder="请选择日期" style="width: 200px"></DatePicker>
        <span style="margin: 0 10px;">
          <Button type="primary" icon="search" @click="search">查询</Button>
        </span>
      </Row>
    </Card>
  </div>
</template>
<script>

export default {
  data() {
    return {
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
      page: 1,
      pageSize: 20,
      total: 0,
      data: [],
      loading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },
    search() {
      this.currentPage = 1;
      this.healthSearchList();
    },
    // 列表
    fetchHealthAuditList(data) {
      this.loading = true;
      fetchHealthAuditList(data).then((response) => {
        this.total = response.data.totalNum;
        this.data.splice(0, this.data.length);
        this.data = response.data.list;
        this.loading = false;
      });
    },
    // 分页
    handleOnChange(page) {
      this.currentPage = page;
      this.healthSearchList(page);
    },
  },
};
</script>


