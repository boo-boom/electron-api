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
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      default-expand-all
      highlight-current
      ref="tree">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "left-list",
  data() {
    return {
      restaurants: [],
      searchKey: "",
      filterText: '',
      treeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
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
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.left-list {
  min-height: 100%;
  background: $white;
  .search {
    padding: 10px;
    background: $gray_2;
    .inline-input {
      width: 100%;
    }
  }
}
</style>

