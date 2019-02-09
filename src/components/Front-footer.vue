<template>
  <div class="footer">
    <a href="https://github.com/Pei-Qun/vue-ci-test" target="_blank"><i class="fab fa-github-alt"></i></a>
    <p>僅個人練習使用．不做商業用途</p>
  </div>
</template>

<style lang="scss" scoped>
  $pink:#ff6670;
  $red:#fe878f;
  $yellow:#ffe26d;
  $blue: #50c3de;
  .footer{
    background-color: $red;
    padding: 30px 0;
    color: #fff;
    font-size: 16px;
    border-top: 6px solid $yellow;
    text-align: center;
    a{
      font-size: 36px;
      transition: color 0.2s ease-in-out;
      color: #ffe587;
      &:hover{
        color: $blue;
      }
    }
  }
</style>