<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="page-banner">
      <h1>購物車</h1>
    </div>
    <div class="cart-table">
      <div class="container" v-if="carts.final_total">
        <table class="table carts">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">縮圖</th>
              <th scope="col">品名</th>
              <th scope="col">數量</th>
              <th scope="col">單價</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in carts.carts" :key="index">
              <td>
                <button class="btn btn-outline-danger btn-sm ml-auto">
                  <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem"></i>
                  <i class="far fa-trash-alt" @click="delCartItem(item.id)"
                    v-else></i>
                </button> 
              </td>
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
          <!-- <tfoot>
          </tfoot> -->
        </table>
      </div>
      <div class="container" v-else>
        <div class="row else-con">
          <img src="../../assets/img/cart-no.jpg" alt="">
        </div>
      </div>
    </div>
    <div class="pay" v-if="carts.final_total">
      <div class="container">
        <div class="con">
          <div class="total">
            共計 {{ temp.nums }} 項商品 <br>
            總計: {{ carts.final_total | currency }}
            <span>(不含運費) 皆以新台幣NTD付款</span>
          </div>
          <div class="text-success" v-if="carts.final_total !== carts.total">
              折扣價: {{ carts.total | currency }}
          </div>
          <div class="input-group my-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
          <router-link class="btn btn-danger" to="/order">
            結帳去 <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
      
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      carts: [],
      coupon_code:'',
      temp: {
        nums: 0,
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
    delCartItem(id) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      var r = confirm("確定要刪除?");
      if (r == true) {
        vm.status.loadingItem = id;
        this.$http.delete(url).then(() => {
          vm.getCart();
          vm.status.loadingItem = '';
        })
      }
      
    },
    addCouponCode() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      }
      this.$http.post(url, { data:coupon }).then((response) => {
        vm.getCart();
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
  .cart-table{
    margin: 60px 0;
    @media (max-width: 576px){
      .carts tr td:nth-child(5),.carts tr th:nth-child(5){
        display: none;
      }
    }
  }
  .page-banner{
    background-image: url('../../assets/img/banner3.jpg');
  }
  .else-con{
    text-align: center;
    justify-content: center;
    align-items: center;
    img{
      width: 500px;
      max-width: 100%;
    }
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