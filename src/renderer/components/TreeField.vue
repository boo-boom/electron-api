<template>
  <div class="tree-field">
    <el-row :gutter="10">
      <el-col class="indent" :span="11" :style="{paddingLeft:`${depth * 30 + 20}px`}">
        <i :class="[`el-icon-caret-${item.showNodes?'top':'bottom'}`]" v-if="nodesLen" @click="toggle(item)"></i>
        <i v-else></i>
        <el-input size="mini" placeholder="字段名" v-model="item.name"></el-input>
      </el-col>
      <el-col :span="7">
        <el-input size="mini" placeholder="类型" v-model="item.type" v-if="!nodesLen || !item.type"></el-input>
        <el-tooltip class="pd-0" effect="dark" :content="item.type" placement="top" v-if="item.type && nodesLen">
          <el-input size="mini" placeholder="类型" v-model="item.type" :change="editIsList(item)">
            <i slot="suffix" class="el-input__icon el-icon-warning" v-if="item.isList"></i>
          </el-input>
        </el-tooltip>
      </el-col>
      <el-col :span="4">
        <el-input size="mini" placeholder="备注" v-model="item.desc" v-if="!item.desc"></el-input>
        <el-tooltip class="pd-0" effect="dark" :content="item.desc" placement="top" v-else>
          <el-input size="mini" placeholder="备注" v-model="item.desc"></el-input>
        </el-tooltip>
      </el-col>
      <el-col :span="2" class="btns">
        <i class="el-icon-close" @click="removeField(tree, index)"></i>
        <el-tooltip class="pd-0" effect="dark" :content="tooltip(item.type).text" placement="top">
          <el-button type="text" icon="el-icon-plus" @click="addField(tree, index, item)"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <div class="children" v-if="nodesLen && item.showNodes">
      <tree-field
        v-for="(child,idx) in item.nodes"
        :key="child.nanoid"
        :item="child"
        :index="idx"
        :depth="depth + 1"
        :tree="tree + (idx + ',')"
        @addField="addField"
        @removeField="removeField"
      />
    </div>
  </div>
</template>

<script>
import nanoid from 'nanoid';
import { nodesPath } from "@/assets/utils/nodes.js";
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
      showListIocn: false,
    };
  },
  computed: {
    nodesLen: function () {
      return this.item.nodes && this.item.nodes.length;
    },
  },
  methods: {
    toggle(item) {
      if(this.nodesLen) {
        item.showNodes = !item.showNodes;
      }
    },
    addField(tree, index, item) {
      const _item = {
        desc: "",
        isList: false,
        name: `Field_${nanoid(5)}`,
        nodes: [],
        type: "string"
      };
      const tag = this.tooltip(item.type).tag;
      if( tag === 'child') {
        item.nodes.push(_item);
      } else {
        this.$emit('addField', tree, index, _item);
      }
    },
    removeField(tree, index) {
      this.$emit('removeField', tree, index);
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
