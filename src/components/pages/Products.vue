<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    
    <button class="btn btn-outline-success" @click="openModel(true)">建立新產品</button>
    <div class="product-edit">
      <div class="detail-area">
        <p class="category">分類</p>
        <p class="title">產品名稱</p>
        <p class="price">原價</p>
        <p class="price">售價</p>
        <p class="price">上架</p>
        <div class="edit-delet">編輯/刪除</div>
      </div>
      <div class="detail-area" v-for="(item, key) in products" :key="item.id">
        <p class="category">{{ item.category }}</p>
        <p class="title">{{ item.title }}</p>
        <p class="price">{{ item.origin_price | currency }}</p>
        <p class="price" v-if="item.price">{{ item.price | currency }}</p>
        <p class="price" v-else>無</p>
        <p class="price">
          <b class="onshelves" v-if="item.is_enabled">已上架</b>
          <b class="out_stock" v-else>未上架</b>
        </p>
        <div class="edit-delet">
            <button class="btn btn-outline-primary mr-1" @click="openModel(false, item)">編輯</button>
            <button class="btn btn-outline-secondary " @click="deletData(item.id)">刪除</button>
        </div>
      </div>
    </div>
    <pagination :page-data="pagination" @changepage="getProducts"></pagination>
    <!-- Modal -->
    <div class="modal fade" id="modal-add" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">建立新產品</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mt-2">
                <label>產品名稱</label>
                <input type="text" class="form-control" placeholder="請輸入標題" v-model="tempData.title">
              </div>
              <div class="col-md-6 mt-2">
                <label>分類</label>
                <select class="form-control" v-model="tempData.category">
                  <option value="">-- 請選擇 --</option>
                  <option value="巧克力">巧克力</option>
                  <option value="糕點區">糕點區</option>
                  <option value="糖果類">甜品區</option>
                  <option value="禮盒區">禮盒區</option>
                </select>
              </div>
              <div class="col-md-6 mt-2">
                <div class="form-group">
                  <label>單位</label>
                  <input type="text" class="form-control" placeholder="請輸入單位" v-model="tempData.unit">
                </div>
              </div>
              <div class="col-md-6 mt-2">
                <div class="form-group">
                  <label>原價</label>
                  <input type="text" class="form-control" placeholder="請輸入原價" v-model="tempData.origin_price">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>售價</label>
                  <input type="text" class="form-control" placeholder="請輸入售價" v-model="tempData.price">
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group">
                  <label>產品描述</label>
                  <textarea rows="5" class="form-control" placeholder="請輸入產品描述" v-model="tempData.description"></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group">
                  <label>說明內容</label>
                  <textarea rows="5" class="form-control" placeholder="請輸入說明內容" v-model="tempData.content"></textarea>
                </div>
              </div>
              <div class="col-md-5 mt-2">
                <img :src="tempData.imageUrl" width="90%" alt="">
              </div>
              <div class="col-md-7 mt-2">
                <div class="form-group">
                  <label>圖片網址</label>
                  <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempData.imageUrl">
                </div>
                <div class="form-group">
                  <label>或上傳圖片 
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" class="form-control" @change="uploadImg" ref="files">
                </div>
              </div>
              <div class="col-md-6 mt-3">
                <label>
                  <input type="checkbox" value="0" v-model="tempData.is_enabled"> 上架/取消上架
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button> 
            <button type="button" class="btn btn-primary" @click="updateData">確認</button>
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
      pagination: {},
      tempData: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
      },
    }
  },
  methods: {
    getProducts(num = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${num}`;
      const vm = this;
      vm.isLoading= true;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        vm.isLoading= false;
        vm.pagination = response.data.pagination;
        console.log(response)
      })
    },
    openModel(isNew, item) {
      if (isNew) {
        this.tempData = {}; // 如果是新增功能，清空欄位
        this.isNew = true;  // isNew=true (新增功能)
      }else{
        this.tempData = Object.assign({},item); // 如果是編輯功能，將值透過非參考方式傳入欄位
        this.isNew = false; // isNew=false (編輯功能)
      }
      $('#modal-add').modal('show');
    },
    updateData() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      let httpMethods = 'post';
      const vm = this;
      
      // 如果不是新增功能，修改api和傳送方式
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempData.id}`;
        httpMethods = 'put';
      }
      
      this.$http[httpMethods](api, {data : vm.tempData}).then((response) => {
        if (response.data.success) {
          // 如果新增成功
          $('#modal-add').modal('hide');
          vm.getProducts();
        }else{
          $('#modal-add').modal('hide');
          vm.getProducts();
          console.log('失敗'+response.data)
        }
      })
    },
    deletData(product_id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${product_id}`;
      const vm = this;
      const confirmDelet = confirm("確定要刪除?");
      if (confirmDelet == true) {
        this.$http.delete(api).then((response) => {
          vm.getProducts();
        })
      }      
    },
    uploadImg() {
      const vm = this;
      const uploadedFile = this.$refs.files.files[0];
      const formdata = new FormData();
      formdata.append('file-to-upload',uploadedFile);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;

      vm.status.fileUploading = true; //上傳loading效果
      this.$http.post(api, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then((response) => {
        vm.status.fileUploading = false;
        if(response.data.success){
          vm.$set(vm.tempData, 'imageUrl', response.data.imageUrl);
        }else{
          // 如果上傳失敗，發出自訂事件 msg:push
          this.$bus.$emit('msg:push', response.data.message, 'danger');
        }     
      })
    },

  },
  created() {
    this.getProducts();
  },
}
</script>

<style lang="scss" scoped>
.product-edit{
  margin-top: 20px;
  .detail-area{
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-bottom: 10px;
    p{
      padding: 6px 0;
      margin: 0;
      font-size: 16px;
    }
    .category{
      flex: 0 0 120px;
    }
    .title{
      flex: 1;
      font-weight: bold;
    }
    .price{
      flex: 0 0 80px;
      .onshelves{
        color: #28a745;
      }
      .out_stock{
        color: #999;
      }
    }
    .edit-delet{
      flex: 0 0 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
  }
}
</style>