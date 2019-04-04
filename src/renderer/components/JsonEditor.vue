<template>
  <div class="json-editor">
    <tree-field :data="respStructList"/>
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
      respStructList: []
    };
  },
  mounted() {
    const curApi = jsonData.apiList[0];
    const resList = curApi.respStructList;
    const returnType = curApi.returnType;

    this.respStructList = this.getJsonTree(resList, returnType);

    console.log(this.getJsonTree(resList, returnType));
  },
  methods: {
    getJsonTree(data, type) {
      const itemArr = [];
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        if (node.name === type) {
          for (let j = 0; j < node.fieldList.length; j++) {
            const nodeType = node.fieldList[j].type;
            const newNode = {
              ...node.fieldList[j],
              nodes: this.getJsonTree(data, nodeType)
            };
            itemArr.push(newNode);
          }
        }
      }
      return itemArr;
    }
  }
};
</script>

