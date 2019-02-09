<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="page-banner"></div>
    <div class="content">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 menu-area">
            <div class="menu">
              <h3>商品分類</h3>
              <ul>
                <li v-for="(item, key) in filter.list" :key="key">
                  <a href="#" @click.prevent="changeCategory(item)">{{item}}</a>
                </li>
              </ul>
            </div>            
          </div>
          <div class="col-lg-9">
            <div class="row">
              <div class="col-xl-4 col-lg-6 col-md-6" v-for="item in products" :key="item.id" v-if="item.is_enabled">
                <div class="card border-0 shadow-sm mb-5">
                  <div class="pro-pic"
                    :style="{backgroundImage: `url(${item.imageUrl})`}"  >
                    <span class="badge badge-warning float-right ml-2">{{ item.category }}</span>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">
                      <a href="#" class="text-dark">{{ item.title }}</a>
                    </h5>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <div class="h5" v-if="!item.origin_price">{{ item.price | currency }} 元</div>
                      <del class="h6" v-if="item.origin_price">原價 {{ item.origin_price | currency }}</del>
                      <div class="h5" v-if="item.origin_price">特價 {{ item.price | currency }}</div>
                    </div>
                  </div>
                  <div class="card-footer d-flex">
                    <router-link class="btn btn-outline-secondary btn-sm" :to="'/item/'+item.id">
                      查看更多
                    </router-link>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem"></i>
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
      products: [],
      filter:{
        list: ['全部商品', '巧克力', '糕點區', '糖果類', '禮盒區'],
        str: '全部商品'
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
        if (vm.filter.str !== '全部商品') {
          let proData = response.data.products.filter(function(item, index, array){
            return item.category == vm.filter.str; 
          });
          vm.products = proData;
        } else {
          vm.products = response.data.products;
        }
      })
    },
    changeCategory(str) {
      const vm = this;
      vm.filter.str = str;
      vm.getProducts()
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
    this.getProducts();
    this.getCartVal();
    // 左選單效果
    var affix = function() {
      var scrollValue = $(window).scrollTop();
      var offset = $('.page-banner').height()+85;
      var screenW = document.body.clientWidth;
      if (screenW > 974 && scrollValue > offset) {
        var width = $('.menu').parent().width();
        $('.menu').addClass('fixed');
        $('.menu').css('width', width);
      } else {
        $('.menu').removeClass('fixed');
        $('.menu').css('width', '100%');
      }
    }
    
    $(window).on('scroll', function () {
      affix();
    }).resize(function() {
      affix();
    });;
  },
}
</script>

<style lang="scss" scoped>
  $pink:#ff6670;
  $red:#fe878f;
  $yellow:#ffe26d;
  $blue: #50c3de;
  .text-right{
    text-align: right;
  }
  .fixed{
    position: fixed;
    top: 150px;
  }
  .content{
    padding: 80px 0;
    .menu{
      h3{
        color: #ddd;
        font-weight: bold;
        font-size: 18px;
      }
      ul{
        list-style: none;
        padding: 0;
        li a{
          display: block;
          border-radius: 24px;
          text-align: center;
          border: 3px solid;
          border-color: $pink $yellow $yellow $pink;
          margin-bottom: 8px;
          padding: 10px;
          color: #333;
          transition: all 0.2s ease-in;
          &:hover{
            text-decoration: none;
            border-color: $blue $yellow $yellow $blue;
          }
        }
      }
      @media (max-width: 992px){
        ul{
          display: flex;
          justify-content: space-between;
          li{
            width: 20%;
            margin: 0 5px;
          }
        }
      }
      @media (max-width: 576px){
        width: 100%;
        overflow: overlay;
        h3{
          display: none;
        }
        ul{
          width: max-content;
          li{
            width: 22vw;
            &:nth-child(1), &:last-child{
              position: relative;
              z-index: 1;
            }
            
          }
        }
      }
      @media (max-width: 372px){
        ul li{
          width: 82px;  
        }
      }
    }
  }
  .page-banner{
    background-image: url('../../assets/img/banner2.jpg');
    height: 30vw;
  }
  .menu-area{
    position: relative;
    @media (max-width: 576px) {
      &::after, &::before{
        content: '';
        background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
        position: absolute;
        top: 0;
        right: 15px;
        width: 15vw;
        height: 100%;
      }
      &::before{
        background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
        right: auto;
        left: 15px;
      }
    }
  }

</style>