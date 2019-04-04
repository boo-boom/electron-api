<template>
  <div>
    <div v-for="item in data" :key="item.name">
      <div v-if="!item.nodes.length">{{item.desc}}</div>
      <div v-if="item.nodes.length">
        {{item.desc}}
        <tree-field :data="item.nodes"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "treeField",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
