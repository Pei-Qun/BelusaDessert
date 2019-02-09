<template>
  <div>
    <Frontnav></Frontnav>
    <router-view></router-view>
    <Frontfooter></Frontfooter>
  </div>
</template>

<script>
import Frontnav from './Front-nav';
import Frontfooter from './Front-footer';

export default {
  components:{
    Frontnav,
    Frontfooter,
  }
}
</script>



