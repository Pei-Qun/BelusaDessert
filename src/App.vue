<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`; //API伺服器路徑、path
  },
}
</script>

<style lang="scss">
@import "./assets/all";

</style>
