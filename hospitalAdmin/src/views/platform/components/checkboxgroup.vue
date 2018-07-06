<template>
  <div>
    <Row type="flex" justify="start" align="middle" :gutter="16">
      <Col span="7">
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">{{ title }}</Checkbox>
      </Col>
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <Checkbox v-for="item in children" :key="item.id" :label="item.id" >{{ item.name }}</Checkbox>
      </CheckboxGroup>
    </Row>
  </div>

</template>
<script>
export default {
  name: 'checkmenu',
   props: {
    title: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    children: {
      type: Array,
      default: [],
    },
    checks: {
      type: Array,
      default: [],
    },
    allchecks: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    console.log(111111);
    this.checkAllGroupChange(this.checks);
  },
  data() {
    return {
      indeterminate: true,
      checkAll: false,
      checkAllGroup: this.checks,
    };
  },
  methods: {
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.allchecks;
      } else {
        this.checkAllGroup = [];
      }
      this.emitToParent();
    },
    checkAllGroupChange(data) {
      if (data.length === this.children.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
      this.emitToParent();
    },
    emitToParent() {
      const array = [];
      array.push(this.id);
      array.push(...this.checkAllGroup);
      if (this.checkAll && this.indeterminate) {
        const result = {
          id: this.id,
          value: this.checkAllGroup,
        };
        this.$emit('onchange', result);
        console.log(result);
      } else if (this.checkAll || this.indeterminate) {
        const result = {
          id: this.id,
          value: array,
        };
        this.$emit('onchange', result);
        console.log(result);
      } else if (!this.checkAll && !this.indeterminate) {
        const result = {
          id: this.id,
          value: this.checkAllGroup,
        };
        this.$emit('onchange', result);
        console.log(result);
      }
    },
  },
};
</script>