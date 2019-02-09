<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="banner"></div>
    <div class="news">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-7 text-con">
            <div class="con">
              <h3 class="text-primary">最新消息 News</h3>
              <ul>
                <li>
                  <p>2019 <b>01/29</b></p>
                  豬事如意，過年期間全館八折起～
                </li>
                <li>
                  <p>2019 <b>01/21</b></p>
                  店長生日！輸入此優惠碼即可享六折：coupon
                </li>
                <li>
                  <p>2019 <b>01/15</b></p>
                  想不到梗了，就這樣吧，這是最新消息
                </li>
                <li>
                  <p>2019 <b>01/01</b></p>
                  新年快樂！全台實體店面店休一天
                </li>
                <li>
                  <p>2018 <b>12/01</b></p>
                  belusa 店商網站開店啦~
                </li>
              </ul>
            </div>
          </div>
          <div class="col-lg-5 pic-con"></div>
        </div>
      </div>
    </div> 
    <div class="hot-sell">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-sm-12 col-md-12">
            <h3>熱銷產品</h3>
          </div>
          <div class="col-sm-8 col-md-12">
            <swiper :options="swiperOption">
              <swiper-slide v-for="item in products" :key="item.id" v-if="item.is_enabled">
                <div class="card border-0 shadow-sm mb-5">
                  <div class="pro-pic"
                    :style="{backgroundImage: `url(${item.imageUrl})`}"  >
                    <span class="badge badge-warning float-right ml-2">{{ item.category }}</span>
                  </div>
                  <div class="card-body">
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
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="">
                      查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem"></i>
                      加到購物車
                    </button>
                  </div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
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
      status: {
        loadingItem: '',
      },
      isLoading: false,
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        breakpoints: {
          1024: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 30
          }
        }
      }
    }
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
  },
}
</script>

<style lang="scss" scoped>
  $pink:#ff6670;
  $red:#fe878f;
  $yellow:#ffe26d;
  $blue: #50c3de;
  .banner{
    height: 35vw;
    min-height: 350px;
    background-image: url('../../assets/img/banner.jpg');
    background-size: cover;
    background-position: center center;
  }
  .news{
    padding: 80px 0;
    background-image: url('../../assets/img/news-bg.jpg');
    background-size: contain;
    background-position: center right;
    background-repeat: no-repeat;
    .text-con{
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      .con{
        min-width: 80%;
        ul{
          list-style-type: none;
          padding: 0;
          margin-top: 30px;
          li{
            display: flex;
            font-size: 16px;
            align-items: center;
            border-bottom: 2px dashed #e6e6e6;
            padding: 5px 0;
            p{
              font-size: 14px;
              margin-right: 15px;
              margin-bottom: 0;
              flex: 0 0 55px;
              color: #aaa;
              b{
                font-size: 20px;
                display: block;
                margin-top: -7px;
                color: $blue;
              }
            }
          }
        }
      }
    }
    @media (max-width: 991px){
      /* background-size: 100% auto; */
      padding-top: 0;
      background-position: center bottom;
      .pic-con{
        height: 52vw;        
      }
    }
    
  }
  .hot-sell{
    padding: 60px 0 40px 0;
    background-image: url('../../assets/img/hot-bg.jpg');
    background-size: cover;
    background-position: bottom center;
    h3{
      text-align: center;
      color: $red;
      font-weight: bold;
      margin-bottom: 30px;
    }
  }
  .pro-pic{
    position: relative;
    .badge{
      color: #333;
      position: absolute;
      top: 0;
      right: 15px;
      font-size: 14px;
      border-radius: 0px 0px 5px 5px;
    }
  }
</style>