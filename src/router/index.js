import Cart from '@/components/Cart.vue'
import UserInfo from '@/components/UserInfo.vue'
import LikeList from '@/components/LikeList.vue'
import OrderList from '@/components/OrderList.vue'
import ReplyList from '@/components/ReplyList.vue'
import ScrapList from '@/components/ScrapList.vue'
import WriteList from '@/components/WriteList.vue'
import Main from '@/views/Main.vue'
import Mypage from '@/views/Mypage.vue'
import Recipe from '@/views/Recipe.vue'
import RecipeDetail from '@/views/RecipeDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Community from '@/views/Community.vue'
import CommunityDetail from '@/views/CommunityDetail.vue'
import Shopping from '@/views/Shopping.vue'
import Shopping_detail from '@/views/Shopping_detail.vue'
import Refrigerator from '@/views/Refrigerator.vue'

import Login from '@/views/Login.vue'
import SignupTypeSelect from '@/views/SignupTypeSelect.vue'
import Signup from '@/views/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/recipe',
      name: 'recipe',
      component: Recipe
    },
    {
      path: '/recipe/detail',
      name: 'recipedetail',
      component: RecipeDetail
    },
    {
      path: '/community',
      name: 'community',
      component: Community,
    },
    {
      path: '/community/:id',
      name: 'communityDetail',
      component: CommunityDetail,
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: Shopping
    },
    {
      path: '/shopping/detail/:id',
      name: 'shoppingdetail',
      component: Shopping_detail
    },
    {
      path: '/mypage',
      component: Mypage,
      children: [
        { path: 'cart', name: 'mypage-cart', component: Cart },
        { path: 'order_list', name: 'mypage-order', component: OrderList },
        { path: 'scrap_list', name: 'mypage-scrap', component: ScrapList },
        { path: 'like_list', name: 'mypage-like', component: LikeList },
        { path: 'reply_list', name: 'mypage-reply', component: ReplyList },
        { path: 'user_info', name: 'mypage-info', component: UserInfo },
        { path: 'write_list', name: 'mypage-write', component: WriteList },
      ],
    },
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/refrigerator',
      name: 'refrigerator',
      component: Refrigerator
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hideLayout: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupTypeSelect,
      meta: { hideLayout: true },
    },
    {
      path: '/signup/write',
      name: 'signup_write',
      component: Signup,
      meta: { hideLayout: true },
    },
  ],
})

export default router
