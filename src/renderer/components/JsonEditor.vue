<template>
  <div class="json-editor">
    <el-button type="primary" size="small" @click="dialogVisible=true">导入 JSON</el-button>
    <el-button type="success" size="small" @click="generateDoc">生成文档</el-button>
    <el-dialog
      title="导入 JSON"
      width="50%"
      customClass="dialog"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <div id="javascript-editor"></div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="getJson">确 定</el-button>
      </span>
    </el-dialog>

    <div class="json-view">
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
        :key="item.nanoid"
        :item="item"
        :index="index"
        :depth="0"
        :tree="tree(index)"
        @addField="addField"
        @removeField="removeField"
      />
    </div>
  </div>
</template>

<script>
import jsonData from "./../../../static/info.json";
import mockData from "./../../../static/mock.json";
import { nodesPath } from "@/assets/utils/nodes.js";
import TreeField from "@/components/TreeField";
import nanoid from 'nanoid';
import generateSchema from "generate-schema/src/schemas/json.js";
import ace from "brace";
import "brace/mode/json";

export default {
  name: "jsonEditor",
  components: { TreeField },
  data() {
    return {
      respStructList: [],
      dialogVisible: false,
      editor: null,
      jsonState: null,
    };
  },
  mounted() {
    const curApi = jsonData.apiList[0];
    const resList = curApi.respStructList;
    const returnType = curApi.returnType;

    this.respStructList = this.getJsonTree(resList, returnType);

    // console.log(this.respStructList);
    // console.log(JSON.stringify(this.respStructList));
  },
  methods: {
    tree(index) {
      // 将递归后的层级保存起来
      const arr = [];
      arr.push(index + ",");
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
              nanoid: nanoid(),
              type: node.fieldList[j].isList
                ? `List[${node.fieldList[j].type}]`
                : node.fieldList[j].type,
              nodes: this.getJsonTree(data, nodeType),
              showNodes: false
            };
            itemArr.push(newNode);
          }
        }
      }
      return itemArr;
    },
    getJsonSchemaTree(data) {
      const newData = [];
      for (let key in data) {
        let curNodes = [];
        const type = data[key]["type"];
        const newNode = {
          name: key,
          type: type,
          isList: type === "array",
          desc: "",
          nodes:
            type == "array"
              ? this.getJsonSchemaTree(data[key].items.properties)
              : this.getJsonSchemaTree(data[key].properties)
        };
        newData.push(newNode);
      }
      return newData;
    },
    // 添加字段
    addField(tree, index, item) {
      const { evalStr, nodesLen } = nodesPath(tree);
      if (nodesLen > 1) {
        // 递归多层时，取上一级，即当前的父级并push数据
        const _evalStr = evalStr.replace(/\.nodes\[[0-9]*\]$/gi, "");
        eval(_evalStr).nodes.splice(index + 1, 0, item);
      } else {
        // 只为第一层时直接push
        this.respStructList.splice(index + 1, 0, item);
      }
    },
    // 删除字段
    removeField(tree, index) {
      const { evalStr, nodesLen } = nodesPath(tree);
      if (nodesLen > 1) {
        const _evalStr = evalStr.replace(/\.nodes\[[0-9]*\]$/gi, "");
        eval(_evalStr).nodes.splice(index, 1);
      } else {
        this.respStructList.splice(index, 1);
      }
    },
    // 关闭弹窗
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 导入json
    getJson() {
      const editorValue = this.editor.getValue();
      if (editorValue) {
        if (!this.jsonState.format) {
          this.$notify.error({
            title: "错误",
            message: `json数据格式有误：${this.jsonState.forat}`
          });
        } else {
          this.dialogVisible = false;
          this.jsonState.schema = generateSchema(this.jsonState.data);
          this.respStructList = this.getJsonSchemaTree(mockData);
        }
      } else {
        this.$notify.error({
          title: "错误",
          message: "json不能为空"
        });
      }
    },
    // 生成文档
    generateDoc() {
      console.log(this.respStructList);
    },
  },
  watch: {
    // 创建json-editor
    dialogVisible(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (!this.editor) {
            this.editor = ace.edit("javascript-editor");
            this.editor.getSession().setMode("ace/mode/json");
            this.editor.getSession().on("change", e => {
              // 捕获json格式错误信息
              const jsonState = {};
              try {
                const value = this.editor.getValue();
                const obj = JSON.parse(value);
                jsonState.data = obj;
                jsonState.format = true;
              } catch (err) {
                jsonState.format = false;
                jsonState.forat = err.message;
              }
              this.jsonState = jsonState;
              this.editor.clearSelection();
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.json-editor {
  & > .el-button {
    margin-bottom: 20px;
  }
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  #javascript-editor {
    height: 280px;
  }
  .json-view {
    border-radius: 3px;
    background: $gray_5;
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
}
</style>
