<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-primary">
      <div class="container">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <img class="d-none d-md-block" src="../assets/logo-s.png" height="40" alt="">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0 ml-md-3">
            <li class="nav-item active">
              <router-link class="nav-link " to="/admin/products">
                <i class="fas fa-box-open"></i> 產品列表
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link " to="/admin/coupon">
                <i class="fas fa-money-bill"></i> 優惠券管理
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link " to="/admin/orderlist">
                <i class="fas fa-money-bill"></i> 訂單管理
              </router-link>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <router-link target="_blank" class="btn btn-outline-light my-2 my-sm-0 mr-2" to="/product">
              前端介面
            </router-link>
            <a class="btn btn-outline-warning my-2 my-sm-0" href="#" @click.prevent="signOut">管理員登出</a>
          </form>
        </div>  
      </div>
      
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    signOut() {
      const vm = this;
      const url = `${process.env.APIPATH}/logout`;
      this.$http.post(url).then((response) => {
        console.log(response.data);
        if(response.data.success) {
          vm.$router.push('/signin')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-dark .navbar-nav .nav-link{
  color: #fff;
}
</style>
