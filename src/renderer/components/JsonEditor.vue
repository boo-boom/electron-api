<template>
  <div class="json-editor">
    <ul class="json-title">
      <el-row :gutter="10">
        <el-col :span="11" class="indent">字段名</el-col>
        <el-col :span="7">类型</el-col>
        <el-col :span="4">描述</el-col>
        <el-col :span="2">操作</el-col>
      </el-row>
    </ul>
    <tree-field
      v-for="(item,index) in respStructList"
      :key="`${item.name}-${index}`"
      :item="item"
      :index="index"
      :depth="0"
      :tree="tree(index)"
      @addField="addField"
    />
  </div>
</template>

<script>
import jsonData from "./../../../static/info.json";
import TreeField from "@/components/TreeField";
export default {
  name: "jsonEditor",
  components: { TreeField },
  data() {
    return {
      respStructList: [],
    };
  },
  mounted() {
    const curApi = jsonData.apiList[0];
    const resList = curApi.respStructList;
    const returnType = curApi.returnType;

    this.respStructList = this.getJsonTree(resList, returnType);

    console.log(this.respStructList);
    // console.log(JSON.stringify(this.respStructList));
  },
  methods: {
    tree(index) {
      // 将递归后的层级保存起来
      const arr = [];
      arr.push(index + ',');
      return arr.toString();
    },
    getJsonTree(data, type) {
      const itemArr = [];
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        if (node.name === type) {
          for (let j = 0; j < node.fieldList.length; j++) {
            const nodeType = node.fieldList[j].type;
            const newNode = {
              ...node.fieldList[j],
              type: node.fieldList[j].isList
                ? `List[${node.fieldList[j].type}]`
                : node.fieldList[j].type,
              nodes: this.getJsonTree(data, nodeType)
            };
            itemArr.push(newNode);
          }
        }
      }
      return itemArr;
    },
    // 添加字段
    addField(tree, index, item) {
      // 将递归的层级进行转换
      const _tree = tree.split(',');
      _tree.splice(_tree.length - 1, 1);
      // 使用eval获取对应数据
      let evalStr = '';
      for(let i = 0; i < _tree.length; i++) {
        if(i == 0){
          evalStr = `this.respStructList[${_tree[i]}]`;
        } else {
          evalStr += `.nodes[${_tree[i]}]`;
        }
      }
      if(_tree.length > 1) {
        // 递归多层时，取上一级，即当前的父级并push数据
        evalStr = evalStr.replace(/\.nodes\[[0-9]*\]$/ig, '');
        eval(evalStr).nodes.splice(index + 1, 0, item);
      } else {
        // 只为第一层时直接push
        this.respStructList.splice(index + 1, 0, item);
      }
      console.log(evalStr)
    },
  }
};
</script>

<style lang="scss" scoped>
.json-editor {
  padding: 20px 20px 20px 0;
  .json-title {
    .indent {
      padding-left: 40px !important;
    }
    color: #444;
    font-size: 14px;
    padding-bottom: 15px;
  }
}
</style>
