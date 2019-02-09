<template>
  <div>
    <Navs/>
    <Alert></Alert>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <main role="main" class="col-md-10 col-lg-9 pt-4 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Navs from './Back-nav';
import Alert from './AlertMessage'

export default {
  components:{
    Navs,
    Alert,
  },
}
</script>

<style lang="scss">

</style>
