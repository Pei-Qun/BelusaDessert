<template>
  <div class="signin-form">
  <form class="form-signin" @submit.prevent="signin">
    <div class="text-center">
      <h1 class="h3 mb-3 font-weight-normal">會員登入</h1>
    </div>

    <div class="form-label-group">
      <label>會員帳號</label>
      <input type="text" class="form-control" placeholder="請輸入帳號" v-model="user.username" required autofocus>
    </div>

    <div class="form-label-group">
      <label>會員密碼</label>
      <input type="password" class="form-control mb-4" v-model="user.password" placeholder="請輸入密碼" required>
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit">會員登入</button>
  </form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      user: {
        username: '',
        password: '',
      },
      remember: '',
    }
  },
  methods: {
    signin() {
      const api = `${process.env.APIPATH}/admin/signin`;
      const vm = this;
      this.$http.post(api, vm.user).then((response) => {
        if (response.data.success) {
          vm.$router.push('/admin/products');
        }
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
