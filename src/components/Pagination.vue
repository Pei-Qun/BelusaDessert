<template>
  <div class="pagination-area">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pageData.has_pre}">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" 
          v-for="page in pageData.total_pages" :key="page"
          :class="{'active': page === pageData.current_page}">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !pageData.has_next}">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: ['pageData'],
  methods: {
    changePage(page) {
      //被點擊時執行這個自訂事件，帶入 page
      this.$emit('changepage', page);
    },
  },
  created() {
    const vm = this;
    
  },
}
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>