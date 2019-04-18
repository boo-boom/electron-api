<template>
  <div class="tree-field">
    <el-row :gutter="10">
      <el-col class="indent" :span="11" :style="{paddingLeft:`${depth * 30 + 20}px`}">
        <i :class="[`el-icon-caret-${showChild?'top':'bottom'}`]" v-if="nodesLen" @click="toggle(container)"></i>
        <i v-else></i>
        <el-input size="mini" placeholder="字段名" v-model="container.name" @focus="getFocusTree(tree)"></el-input>
      </el-col>
      <el-col :span="7">
        <el-input size="mini" placeholder="类型" v-model="container.type" v-if="!nodesLen || !container.type" @focus="getFocusTree(tree)"></el-input>
        <el-tooltip class="pd-0" effect="dark" :content="container.type" placement="top" v-if="container.type && nodesLen">
          <el-input size="mini" placeholder="类型" v-model="container.type" :change="editIsList(container)" @focus="getFocusTree(tree)">
            <i slot="suffix" class="el-input__icon el-icon-warning" v-if="container.isList"></i>
          </el-input>
        </el-tooltip>
      </el-col>
      <el-col :span="4">
        <el-input size="mini" placeholder="备注" v-model="container.desc" v-if="!container.desc" @focus="getFocusTree(tree)"></el-input>
        <el-tooltip class="pd-0" effect="dark" :content="container.desc" placement="top" v-else>
          <el-input size="mini" placeholder="备注" v-model="container.desc" @focus="getFocusTree(tree)"></el-input>
        </el-tooltip>
      </el-col>
      <el-col :span="2" class="btns">
        <i class="el-icon-close" @click="removeField(tree, index)"></i>
        <el-tooltip class="pd-0" effect="dark" :content="tooltip(container.type).text" placement="top">
          <el-button type="text" icon="el-icon-plus" @click="addField(tree, index, container)"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <div class="children" v-show="showChild" v-if="nodesLen">
      <tree-field
        v-for="(child,idx) in container.nodes"
        :key="child.nanoid"
        :item="child"
        :index="idx"
        :depth="depth + 1"
        :tree="tree + (idx + ',')"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import nanoid from 'nanoid';
import { clone } from 'lodash';
export default {
  name: "treeField",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0,
    },
    depth: {
      type: Number,
      default: 0,
    },
    tree: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      showChild: true,
      showListIocn: false,
      focusTree: '',
      container: clone(this.item),
    };
  },
  computed: {
    nodesLen() {
      return this.item.nodes && this.item.nodes.length;
    },
    ...mapGetters(['jsonData'])
  },
  watch: {
    'container.name' (newVal, oldVal)  {
      if(newVal !== oldVal) {
        this.updateApi('updateApiName', newVal);
      }
    },
    'container.type' (newVal, oldVal)  {
      if(newVal !== oldVal) {
        this.updateApi('updateApiType', newVal);
      }
    },
    'container.desc' (newVal, oldVal)  {
      if(newVal !== oldVal) {
        this.updateApi('updateApiDesc', newVal);
      }
    },
  },
  methods: {
    updateApi(name, newVal) {
      this.$store.dispatch(name, {
        update: true,
        tree: this.focusTree,
        updateName: name,
        value: newVal,
      });
    },
    getFocusTree(tree) {
      if(this.focusTree !== tree) {
        this.focusTree = tree;
      }
    },
    toggle(item) {
      if(this.nodesLen) {
        this.showChild = !this.showChild;
      }
    },
    addField(tree, index, item) {
      const _item = {
        desc: "",
        isList: false,
        name: `Field_${nanoid(5)}`,
        nodes: [],
        type: "object"
      };
      const tag = this.tooltip(item.type).tag;
      this.$store.dispatch('setRespStructList', {
        add: true,
        tree,
        tag,
        index,
        item: _item
      })
    },
    removeField(tree, index) {
      // this.$store.dispatch('removeResList', {
      //   tree,
      //   index
      // })
      this.$store.dispatch('setRespStructList', {
        remove: true,
        tree,
        index
      })
    },
    // 判断是否是子节点，用于判断添加字段时的逻辑处理
    tooltip(type) {
      const test = /^Api_/ig.test(type) ||
                   /^list\[/ig.test(type) ||
                   type == 'array' ||
                   type == 'object';
      return test ? {tag: 'child', text: '添加子节点'} : {tag: 'sibling', text: '添加兄弟节点'};
    },
    editIsList(item) {
      item.isList = /^list\[(\w+)\]$/ig.test(item.type) ? true : false;
    },
  }
};
</script>

<style lang="scss" scoped>
.tree-field {
  .pd-0 {
    padding: 0;
  }
  .el-input__icon {
    color: $warning;
  }
  .el-row {
    margin-bottom: 10px;
  }
  .indent {
    display: flex;
    align-items: center;
    & > i {
      width: 22px;
    }
  }
  .btns {
    display: flex;
    align-items: center;
    height: 28px;
    & > i {
      margin-right: 10px;
    }
    .el-icon-close {
      color: $danger;
      cursor: pointer;
    }
    .el-icon-plus {
      color: $primary;
      cursor: pointer;
    }
  }
}
</style>
