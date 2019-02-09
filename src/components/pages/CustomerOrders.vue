<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div class="pro-pic"
            :style="{backgroundImage: `url(${item.imageUrl})`}"  >
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.description }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.origin_price">{{ item.price | currency }} 元</div>
              <del class="h6" v-if="item.origin_price">原價 {{ item.origin_price | currency }} 元</del>
              <div class="h5" v-if="item.origin_price">現在只要 {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
         
      </div>
    </div>

    <!-- Cart -->
    <div class="row mt-4">
      <table class="table carts" v-if="carts.final_total">
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
            <td><button @click="delCartItem(item.id)"><i class="far fa-trash-alt"></i></button> </td>
            <td><img :src="item.product.imageUrl" height="40" alt=""></td>
            <td>
              {{ item.product.title }}
              <p class="text-success" v-if="item.coupon">以套用優惠券</p>
            </td>
            <td>{{ item.qty }}</td>
            <td>{{ item.product.price | currency }}</td>
            <td>{{ item.final_total | currency }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-right">總計: </td>
            <td>{{ carts.final_total | currency }}</td>
          </tr>
          <tr v-if="carts.final_total !== carts.total">
            <td colspan="5" class="text-right text-success">折扣價: </td>
            <td class=" text-success">{{ carts.total | currency }}</td>
          </tr>
        </tfoot>
      </table>
      <div class="input-group my-3 input-group-sm">
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
            套用優惠碼
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.origin_price">{{ product.price | currency }} 元</div>
              <del class="h6" v-if="product.origin_price">原價 {{ product.origin_price | currency }} 元</del>
              <div class="h4" v-if="product.origin_price">現在只要 {{ product.price | currency }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} 份 (每份/{{product.unit}})
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.price*product.num }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="my-5 row justify-content-center" @submit.prevent="creatOrder">
      <form class="col-md-6" @submit.prevent="">
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
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Navbar',
  data() {
    return {
      products: [],
      product: {},
      carts: [],
      status: {
        loadingItem: '',
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
      isLoading: false,
      coupon_code: '',
    }
  },
  computed: {
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;
        vm.isLoading= false;
        console.log(response)
      })
    },
    getProduct( id ) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.isLoading = true;
      vm.status.loadingItem = id;
      this.$http.get(url).then((response) => {
        vm.product = response.data.product;
        vm.status.loadingItem = '';
        $('#productModal').modal('show');
        vm.isLoading= false;
        console.log(response)
      })
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      }
      this.$http.post(url, { data:cart }).then((response) => {
        $('#productModal').modal('hide');
        vm.status.loadingItem = '';
        vm.getCart();
        console.log(response)
      })
    },
    getCart() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.isLoading= false;
        vm.carts = response.data.data;
      })
    },
    delCartItem(id) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then(() => {
        vm.getCart();
        vm.isLoading= false;
      })
    },
    addCouponCode() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      }
      this.$http.post(url, { data:coupon }).then((response) => {
        vm.getCart();
        console.log(response)
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
            console.log('訂單已建立',response)
          })
        } else {
          console.log('欄位不完整')
        }
      })
      
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  },
}
</script>

<style lang="scss" scoped>
  
  
  .carts{
       
  }
</style>