<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    
    <button class="btn btn-outline-info" @click="openModel(true)">建立優惠券</button>
    
    <table class="table table-hover mt-4">
      <thead>
        <tr>
          <th scope="col">優惠標題</th>
          <th scope="col">編碼</th>
          <th scope="col">折扣 % 數</th>
          <th scope="col">使用期限</th>
          <th scope="col">是否啟用</th>
          <th scope="col">修改 / 刪除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="item.id">
          <th scope="row">{{ item.title }}</th>
          <td>{{ item.code }}</td>
          <td>{{ item.percent }}</td>
          <td>{{ item.due_date | timestamp }}</td>
          <td>
            <b class="text-success" v-if="item.is_enabled">啟用</b>
            <b class="text-danger" v-else>未啟用</b>
          </td>
          <td>
            <button class="btn btn-outline-primary mr-1" @click="openModel(false, item)">編輯</button>
            <button class="btn btn-outline-secondary " @click="deletData(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal fade" id="modal-add" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <form class="modal-content" @submit.prevent="updateData(true)">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">建立優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mt-2">
                <label>優惠標題</label>
                <input type="text" class="form-control" placeholder="請輸入優惠標題" v-model="tempData.title">
              </div>
              <div class="col-md-6 mt-2">
                <label>折扣(%)</label>
                  <input type="text" class="form-control" placeholder="填寫 80 即為打八折" v-model="tempData.percent">
              </div>
              <div class="col-md-6 mt-2">
                <div class="form-group">
                  <label>截止日期</label>
                  <input type="date" class="form-control" name="end-date" 
                  :class="{'is-invalid': errors.has('end-date')}"
                  v-model="due_date" v-validate="'required'">
                </div>
              </div>
              <div class="col-md-12 mt-2">
                <div class="form-group">
                  <label for="coupon-code">優惠券編碼</label>
                  <input type="text" class="form-control" name="coupon-code" id="coupon-code"
                  :class="{'is-invalid': errors.has('coupon-code')}"
                  placeholder="優惠券編碼" v-model="tempData.code" v-validate="'required'">
                </div>
              </div>
              <div class="col-md-12 mt-3">
                <label>
                  <input type="checkbox" value="0" v-model="tempData.is_enabled"> 啟用/關閉
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button> 
            <button type="submit" class="btn btn-primary">確認</button>
          </div>
        </form>
      </div>
    </div>
    <pagination :page-data="pagination" @changepage="getCoupon"></pagination>
  </div>
</template>

<script>
import $ from 'jquery';
export default {
  data() {
    return {
      coupons:[],
      pagination: {},
      tempData: {
        title: '',
        percent: 100,
      },
      status: {
        fileUploading: false,
      },
      due_date: '',
      isLoading: false,
      isNew: false,
    }
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempData.due_date = timestamp;
    },
  },
  methods: {
    getCoupon(num = 1){
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${num}`;
      const vm = this;
      vm.isLoading= true;
      this.$http.get(api).then((response) => {
        vm.coupons = response.data.coupons;
        vm.isLoading= false;
        vm.pagination = response.data.pagination;
        console.log(response)
      })
    },
    openModel(isNew, item) {
      const vm = this;
      if (isNew) {
        this.tempData = {}; // 如果是新增功能，清空欄位
        this.due_date = '';
        this.isNew = true;  // isNew=true (新增功能)
      }else{
        vm.due_date = new Date(item.due_date * 1000).toISOString().split('T')[0];
        this.tempData = Object.assign({},item); // 如果是編輯功能，將值透過非參考方式傳入欄位
        this.isNew = false; // isNew=false (編輯功能)
      }
      $('#modal-add').modal('show');
    },
    updateData() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpMethods = 'post';
      const vm = this;
      
      // 如果不是新增功能，修改api和傳送方式
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempData.id}`;
        httpMethods = 'put';
      }
      
      this.$validator.validate().then((result) => {
        if(result) {
          this.$http[httpMethods](api, {data : vm.tempData}).then((response) => {
            if (response.data.success) {
              // 如果新增成功
              $('#modal-add').modal('hide');
              vm.getCoupon();
            }else{
              $('#modal-add').modal('hide');
              vm.getCoupon();
              console.log('失敗'+response.data)
            }
          })
        } else {
          console.log('欄位不完整')
          vm.isLoading= false;
        }
      })
      
    },
    deletData(coupon_id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${coupon_id}`;
      const vm = this;
      const confirmDelet = confirm("確定要刪除?");
      if (confirmDelet == true) {
        this.$http.delete(api).then((response) => {
          vm.getCoupon();
        })
      }      
    },
  },
  created() {
    this.getCoupon();
  },
}
</script>