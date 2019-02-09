<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    
    <div class="list-con">
      <div class="container">
        <div class="scroll-area">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">建立日期</th>
              <th scope="col">訂單編號</th>
              <th scope="col">總金額</th>
              <th scope="col">客戶資訊</th>
              <th scope="col">產品資訊</th>
              <th scope="col">付款狀態</th>
              <th scope="col">備註</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in list" :key="item.id">
              <td scope="row">
                <button class="btn btn-outline-danger btn-sm ml-auto" @click="openModel(item)">                  
                  <i class="fas fa-pen"></i>
                </button> 
              </td>
              <td>{{ item.create_at | timestamp }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.total | currency }}</td>
              <td>
                姓名: {{ item.user.name }} <br>
                電子信箱: {{ item.user.email }} <br>
                連絡電話: {{ item.user.tel }}
              </td>
              <td>
                名稱/數量 <br>
                {{ productKey(key) }}
              </td>
              <td>
                <b v-if="item.is_paid" class="text-success d-block">已付款</b>
                <b v-if="item.is_paid" class="text-success">付款日期: {{ item.paid_date | timestamp }}</b>
                <b v-if="!item.is_paid" class="text-danger">未付款</b>
              </td>
              <td>
                <button v-if="item.message" type="button" class="btn btn-outline-success"
                data-toggle="modal" @click="openMsg(item.message)">
                  <i class="fas fa-comment"></i>
                </button>
                <span v-else>無</span>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>  
    
    
    <div class="modal fade" id="message" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            {{ temp.msg }}
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="modal-edit" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">備註填寫</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea cols="30" rows="10" class="form-control"
            v-model="tempData.message"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button> 
            <button type="button" class="btn btn-primary" @click="updateData()">確認</button>
          </div>
        </div>
      </div>
    </div>
    <pagination :page-data="pagination" @changepage="getOrderlist"></pagination>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      list: [],
      pagination: {},
      tempData: {},
      temp: {
        msg: '',
      },
      status: {
        loadingItem: '',
      },
      isLoading: false,
    }
  },
  methods: {
    getOrderlist(num = 1){
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${num}`;
      const vm = this;
      vm.isLoading= true;
      this.$http.get(api).then((response) => {
        vm.list = response.data.orders;
        vm.isLoading= false;
        vm.pagination = response.data.pagination;
        console.log(response)
      })
    },
    productKey(i){
      const vm = this;
      let productId = Object.keys(vm.list[i].products)[0];
      let data = vm.list[i].products[productId];
      let str = `${data.product.title} * ${data.qty}`;
      return str;
    },
    openMsg(item) {
      const vm = this;
      vm.temp.msg = item;
      $('#message').modal('show');
    },
    openModel(item) {
      const vm = this;
      this.tempData = Object.assign({},item)
      $('#modal-edit').modal('show');
    },
    updateData() {
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.tempData.id}`;

      
      this.$http.put(api, {data : vm.tempData}).then((response) => {
        if (response.data.success) {
          // 如果新增成功
          $('#modal-add').modal('hide');
          vm.getOrderlist();
        }else{
          $('#modal-add').modal('hide');
          vm.getOrderlist();
          console.log('失敗'+response.data)
        }
        $('#modal-edit').modal('hide');
      })
      
    },
  },
  created() {
    this.getOrderlist();
  },
}
</script>

<style lang="scss" scoped>
.scroll-area{
  width: 100%;
  @media (max-width: 1200px){
    overflow: overlay;
    .table{
      /* min-width: 1200px; */
      thead{display: none;}
      tr{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        position: relative;
        &:nth-child(odd) {
          background-color: #f6f6f6;         
        }
        td{
          display: flex;
          align-items: center;
          &::before{
            flex: 0 0 80px;
          }
          &:nth-child(1) {
            padding: 0;
            button{
              position: absolute;
              right: 8px;
              top: 8px;  
            }            
          }
          &:nth-child(2){
            &::before{
              content: '建立日期: ';
            }
          }
          &:nth-child(3){
            &::before{
              content: '訂單編號: ';
            }
          }
          &:nth-child(4){
            &::before{
              content: '總金額: ';
            }
          }
          &:nth-child(5){
            &::before{
              content: '客戶資訊: ';
            }
          }
          &:nth-child(6){
            &::before{
              content: '產品資訊: ';
            }
          }
          &:nth-child(7){
            &::before{
              content: '付款狀態: ';
            }
          }
          &:nth-child(8){
            &::before{
              content: '留言: ';
            }
          }
        }
      }
    }
  }
}
</style>
