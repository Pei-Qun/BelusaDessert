<template>
  <div>
    <div class="marquee">
      <span><i class="fas fa-bullhorn"></i> 特價報告</span>
      <marquee>店長生日! 優惠碼大開放~ 輸入優惠碼: coupon 即可享有全館六折優惠!!</marquee>
    </div>
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <div class="logo-area">
          <a class="navbar-brand" href="#">
            <img src="../assets/logo.png" alt="">
          </a>
        </div>
        
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0 ml-lg-3">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                首頁
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/product">
                產品列表
              </router-link>
            </li>
          </ul>
          <ul class="account-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/cart">
                <i class="fas fa-shopping-cart"></i> 購物車({{cartVal}})
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">
                <i class="fas fa-cog"></i> 後台管理
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      cartVal: 0,
    }
  },
  created() {
    //選單效果
    $(window).on('scroll', function (event) {
        var scrollValue = $(window).scrollTop();
        var offset = 1;
        if (scrollValue > offset) {
          $('.navbar').addClass('scrolled');
          
        } else{
          $('.navbar').removeClass('scrolled');
        }
    });
    //購物車數值
    const vm = this;
    vm.$bus.$on('get:cartval',(val) => {
      vm.cartVal = val;
    })
  },
}

</script>

<style lang="scss" scoped>
  .marquee{
    background: #333;
    color: #fff;
    padding: 2px 5%;
    display: flex;
    marquee{
      
    }
    span{
      display: inline-block;
      padding: 0px 10px;
      font-size: 12px;
      border-radius: 3px;
      white-space: nowrap;
    }
  }
  .logo-area{
    width: 150px;
    position: relative;
    transition: all 0.3s ease-in-out;
    .navbar-brand{
      height: 5vw;
      min-height: 35px;
      background-color: transparent;
      background-image: url('../assets/logo-s.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: 100%;
      box-shadow: none;
      img{
        display: none;
      }
    }
    
    @media (min-width: 991px) {
      .navbar-brand{
        background: #fcf3d7;
        background-image: none;
        position: absolute;
        border-radius: 0 0 10px 10px;
        top: -30px;
        padding: 20px;
        height: auto;
        img{
          display: block;
          width: 100%;
        }
      }
    }
  }
  .navbar-nav{
    font-size: 16px;
    .nav-link{
      color: #fff;
      transition: all 0.2s;
      padding: 8px 15px;
      text-align: center;
      &.router-link-exact-active{
        color: #555;
        font-weight: bold;
      }
      @media (max-width: 992px) {
        border-bottom: 1px solid rgba(255,255,255,0.3);
      }
    }    
  }
  .navbar-dark .navbar-toggler {
    border: none;
    color: #fff;
    &:focus{
      outline: none;
    }
  }
  .account-nav{
    display: flex;
    justify-content: center;
    margin-bottom: 0;
    padding: 0;
    li{
      list-style: none;
      &::before{
        content: '/';
        display: inline;
        color: rgba(255,255,255,0.3)
      }
      &:nth-child(1)::before{
        content:'';
      }
      .nav-link{
        color: rgba(255,255,255,0.8);
        padding: 10px;
        font-size: 15px;
        display: inline-block;
        transition: all 0.2s ease-in-out;
        &:hover{
          color: #ffe26d;
        }
      }
    }
  }
  .fixed-top{
    top: 25px;
    transition: top 0.1s ease-in-out;
  }
  .scrolled{
    top: 0 !important;
    @media (min-width: 992px){
      .logo-area{
        width: 100px;
        .navbar-brand{
          padding: 10px;
        }
      }
    }
  }
</style>

