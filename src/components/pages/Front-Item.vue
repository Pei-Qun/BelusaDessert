<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="page-banner">
      <h1>產品介紹</h1>
    </div>
    <div class="all">
      <div class="container">
        <div class="row">
          <div class="col-md-12 d-flex justify-content-end">
              <router-link class="btn btn-outline-secondary btn-sm mb-4" to="/product">
                <i class="fas fa-arrow-left"></i> 返回列表
              </router-link>
          </div>
          <div class="col-lg-6 col-md-7 pic-con mx-3 mx-sm-0" 
            :style="{ 'background-image': 'url(' + product.imageUrl + ')' }">
            <img src="../../assets/img/transparent.png" width="100%" alt="">
          </div>
          <div class="col-lg-6 col-md-5 content my-sm-3 px-md-5">
            <ul>
              <li><b>商品名稱</b>{{product.title}}</li>
              <li><b>單位</b>每份 / {{product.unit}}</li>
              <li><b>剩餘現貨</b>100 份</li>
              <li><b>付款方式</b><i class="far fa-credit-card"></i> 模擬付款</li>
            </ul>
            <div class="pay">
              <div class="d-flex justify-content-between">
                <span class="text-secondary">小計 {{ temp.num*product.price | currency }}</span>
                <div class="price">
                  <div class="h5" v-if="!product.origin_price">{{ product.price | currency }} 元</div>
                  <del class="h6 text-secondary" v-if="product.origin_price">原價 {{ product.origin_price | currency }}</del>
                  <div class="h5" v-if="product.origin_price">特價 {{ product.price | currency }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6 mb-2">
                  <select name="" class="form-control mr-3" v-model="temp.num">
                    <option :value="num" v-for="num in 10" :key="num">
                      選購 {{num}} 份
                    </option>
                  </select>
                </div>
                <div class="col-sm-6 cart mb-2">
                  <button type="button" class="btn btn-danger btn-sm" @click="addtoCart(product.id,temp.num)">
                    <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                    <i class="fas fa-cart-plus" v-else></i>
                    加到購物車
                  </button>
                </div>
              </div>
              
            </div>            
          </div>
          <div class="col-md-12 mt-5">
            <h4 class="text-secondary" v-if="product.content">商品描述</h4>
            <p>{{product.content}}</p>
            <hr>
            <h4 class="text-secondary" v-if="product.description">商品介紹</h4>
            <p>{{product.description}}</p>
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import $ from 'jquery';
export default {
  data() {
    return {
      product:{},
      itemId: '',
      temp:{
        num:1,
      },
      status: {
        loadingItem: '',
      },
      isLoading: false,
    }
  },
  methods: {
    getItem() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${vm.itemId}`;
      vm.isLoading = true;
      this.$http.get(url).then((re) => {
        vm.product = re.data.product;
        vm.isLoading= false;
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
        vm.status.loadingItem = '';
        vm.getCartVal();
        console.log(response)
      })
    },
    getCartVal() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.isLoading= false;
        this.$bus.$emit('get:cartval', response.data.data.carts.length);
      })
    },
  },
  created() {
    this.itemId = this.$route.params.itemId; //取得路徑的 itemId 名稱
    this.getItem();
  },
}
</script>

<style lang="scss" scoped>
  $pink:#ff6670;
  $red:#fe878f;
  $yellow:#ffe26d;
  $blue: #50c3de;
  .all{
    padding: 50px 0 80px 0;
    .pic-con{
      background-size: cover;
      background-position: center center;
    }
  }
  .page-banner{
    background-image: url('../../assets/img/banner3.jpg');
  }
  .content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    ul{
      list-style: none;
      padding: 0;
      li{
        padding: 15px 0;
        font-size: 16px;
        border-bottom: 1px dashed #aaa;
        b{
          display: inline-block;
          width: 100px;
          color: #999;
        }
      }
    }
    .pay{
      .price{
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        .h5{
          color: $blue;
          font-weight: bold;
          margin-left: 15px;
        }
      }
      .cart .btn{
        height: 100%;
        width: 100%;
      }
    }
  }
</style>