import Vue from 'vue'
import Router from 'vue-router'

// fornt
import Front from '@/components/Front'
import Home from '@/components/pages/Front-Home'
import Front_product from '@/components/pages/Front-Product'
import Front_item from '@/components/pages/Front-Item'
import Front_cart from '@/components/pages/Front-Cart'
import Front_order from '@/components/pages/Front-Order'
import Front_checkout from '@/components/pages/Front-Checkout'

// back
import Back from '@/components/Back'
import Back_Login from '@/components/pages/Back-Login'
import Back_Products from '@/components/pages/Back-Products'
import Back_coupon from '@/components/pages/Back-coupon'
import CustomerOrders from '@/components/pages/CustomerOrders'
import Back_orderlist from '@/components/pages/Back-Orderlist'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/',
      name: 'Front',
      component: Front,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home,
        },{
          path: 'product',
          name: 'Front_product',
          component: Front_product,
        },{
          path: 'item/:itemId',
          name: 'Front_item',
          component: Front_item,
        },{
          path: 'cart',
          name: 'Front_cart',
          component: Front_cart,
        },{
          path: 'order',
          name: 'Front_order',
          component: Front_order,
        },{
          path: 'customer_checkout/:orderId',
          name: 'Front_checkout',
          component: Front_checkout,
        },
      ]
    },
    {
      path: '/login',
      name: 'Back_Login',
      component: Back_Login,
    },{
      path: '/admin',
      name: 'Back',
      component: Back,
      children: [
        {
          path: 'products',
          name: 'Back_Products',
          component: Back_Products,
          meta: { requiresAuth: true },
        },{
          path: 'coupon',
          name: 'Back_coupon',
          component: Back_coupon,
          meta: { requiresAuth: true },
        },{
          path: 'orderlist',
          name: 'Back_orderlist',
          component: Back_orderlist,
          meta: { requiresAuth: true },
        },
      ]
    },
    
  ]
})
