<template>
  <div class="left-list">
    <div class="search">
      <el-input
        size="mini"
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
    </div>
    <el-tree
      class="filter-tree"
      node-key="groupIndex"
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :default-expanded-keys="[0]"
      @node-click="curTreeClick"
      highlight-current
      accordion
      ref="tree">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "left-list",
  props: {
    tree: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      restaurants: [],
      searchKey: "",
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    curTreeClick(data) {
      if(data.methodIndex !== undefined) {
        this.$emit('getCurApiIndex', data.methodIndex);
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    treeData() {
      return this.tree
    }
  }
};
</script>

<style lang="scss" scoped>
.left-list {
  min-height: 100%;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .search {
    padding: 10px;
    background: $gray_2;
    .inline-input {
      width: 100%;
    }
  }

  /deep/ .el-tree-node__children {
    background: $gray_5;
  }
}

</style>

