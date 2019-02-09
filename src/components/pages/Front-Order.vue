<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="page-banner">
      <h1>訂購商品</h1>
    </div>
    <div class="pay" v-if="carts.final_total">
      <div class="container">
        <div class="my-5 row justify-content-center" @submit.prevent="creatOrder">
          <form class="col-md-7" @submit.prevent="">
            <h3>訂購資料</h3>
            <table class="table carts mb-3">
              <thead>
                <tr>
                  <th scope="col">縮圖</th>
                  <th scope="col">品名</th>
                  <th scope="col">數量</th>
                  <th scope="col">單價</th>
                  <th scope="col">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in carts.carts" :key="index">
                  <td><img :src="item.product.imageUrl" height="40" alt=""></td>
                  <td>
                    {{ item.product.title }}
                    <p class="text-success" v-if="item.coupon">已套用優惠券</p>
                  </td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.product.price | currency }}</td>
                  <td>{{ item.final_total | currency }}</td>
                </tr>
              </tbody>
            </table>
            <h3>訂購人</h3>
            <div class="form-group">
              <label for="useremail">Email</label>
              <input type="email" class="form-control" name="email" id="useremail"
                :class="{'is-invalid': errors.has('email')}"
                v-model="form.user.email" placeholder="請輸入 Email" v-validate="'required|email'">
              <span class="text-danger" v-if="errors.has('email')">
                {{ errors.first('email') }}
              </span>
            </div>

            <div class="form-group">
              <label for="username">收件人姓名</label>
              <input type="text" class="form-control" name="name" id="username"
                :class="{'is-invalid': errors.has('name')}"
                v-model="form.user.name" placeholder="輸入姓名" v-validate="'required'">
              <span class="text-danger" v-if="errors.has('name')">姓名必須輸入</span>
            </div>

            <div class="form-group">
              <label for="usertel">收件人電話</label>
              <input type="tel" class="form-control" id="usertel" name="usertel"
                :class="{'is-invalid': errors.has('usertel')}"
                v-model="form.user.tel" placeholder="請輸入電話" v-validate="'required'">
                <span class="text-danger" v-if="errors.has('usertel')">電話必須輸入</span>
            </div>

            <div class="form-group">
              <label for="useraddress">收件人地址</label>
              <input type="address" class="form-control" name="address"
              :class="{'is-invalid': errors.has('address')}"
                id="useraddress" v-model="form.user.address"
                placeholder="請輸入地址" v-validate="'required'">
              <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
            </div>

            <div class="form-group">
              <label for="useraddress">留言</label>
              <textarea name="" id="" class="form-control" cols="30" rows="10"
                v-model="form.message"></textarea>
            </div>
            <div class="text-right">
              <button class="btn btn-danger">送出訂單</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="non" v-else>購物車尚無資料</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      carts: [],
      temp: {
        nums: 0,
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      status: {
        loadingItem: '',
      },
      isLoading: false,
    }
  },
  methods: {
    getProducts() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      const vm = this;
      vm.isLoading= true;
      this.$http.get(api).then((response) => {
        vm.isLoading= false;
        vm.products = response.data.products;
        console.log(response.data.products)
      })
    },
    getCart() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.isLoading= false;
        vm.carts = response.data.data;
        vm.temp.nums = response.data.data.carts.length
        this.$bus.$emit('get:cartval', response.data.data.carts.length);
      })
    },
    creatOrder() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const order = vm.form;
      vm.isLoading = true;
      this.$validator.validate().then((result) => {
        if(result) {
          this.$http.post(url, { data:order }).then((response) => {
            vm.isLoading= false;
            if (response.data.success) {
              vm.$router.push(`/customer_checkout/${response.data.orderId}`)
            }
            vm.isLoading= false;
            vm.getCart();
            console.log('訂單已建立',response)
          })
        } else {
          console.log('欄位不完整')
          vm.isLoading= false;
        }
      })
      
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
}
</script>

<style lang="scss" scoped>
  .non{
    min-height: calc(100vh - 443px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-banner{
    background-image: url('../../assets/img/banner3.jpg');
  }
  .pay{
    margin-bottom: 60px;
    .con{
      background: #f6f6f6;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 30px 5%;
      .input-group{
        width: 400px;
        max-width: 100%;
      }
      .total{
        text-align: right;
        span{
          display: block;
          color: #999;
        }
      }
    }
  }
</style>