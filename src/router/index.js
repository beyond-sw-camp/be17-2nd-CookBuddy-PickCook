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
import CommunityWrite from '@/views/CommunityWrite.vue'
import Shopping from '@/views/Shopping.vue'
import Shopping_detail from '@/views/Shopping_detail.vue'
import Refrigerator from '@/views/Refrigerator.vue'
import Login from '@/views/Login.vue'
import SignupTypeSelect from '@/views/SignupTypeSelect.vue'
import Signup from '@/views/Signup.vue'
import { useUserStore } from '@/store/useUserStore'
import AddressList from '@/components/AddressList.vue'
import AddressFormPage from '@/components/AddressFormPage.vue'
import ShoppingDetailPage from '@/views/Shopping_detail.vue'
import PaymentMethodList from '@/components/PaymentMethodList.vue'
import RecipeWrite from '@/views/RecipeWrite.vue'
import Payment from '@/views/Payment.vue'
import PaymentComplete from '@/views/PaymentComplete.vue'
import OrderDetailInfo from '@/views/OrderDetailInfo.vue'
import CommunityEdit from '@/views/CommunityEdit.vue'
import Review from '@/views/Review.vue'
import RecipeWriteList from '@/components/RecipeWriteList.vue'
import RecipeEdit from '@/views/RecipeEdit.vue'
import RecipeLikeList from '@/components/RecipeLikeList.vue'
import RecipeScrapList from '@/components/RecipeScrapList.vue'
import RecipeReplyList from '@/components/RecipeReplyList.vue'
import ReviewList from '@/components/ReviewList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/recipe/edit/:recipeId',
      name: 'recipe-edit',
      component: RecipeEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/product/review/:productId/:orderId',
      name: 'product-review',
      component: Review,
      meta: { requiresAuth: true },
    },
    {
      path: '/community/edit/:communityId',
      name: 'community-edit',
      component: CommunityEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/order/details/:orderId',
      name: 'order-detail',
      component: OrderDetailInfo,
      meta: { requiresAuth: true },
    },
    {
      path: '/payment/complete/:orderId',
      name: 'payment-complete',
      component: PaymentComplete,
      meta: { requiresAuth: true },
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta: { requiresAuth: true },
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: Recipe,
      meta: { requiresAuth: true },
    },
    {
      path: '/recipe/write',
      name: 'recipeWrite',
      component: RecipeWrite,
      meta: { requiresAuth: true },
    },
    {
      path: '/recipe/detail/:id',
      name: 'recipedetail',
      component: RecipeDetail,
      meta: { requiresAuth: true },
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
      meta: { requiresAuth: true },
    },
    {
      path: '/community/write',
      name: 'communityWrite',
      component: CommunityWrite,
      meta: { requiresAuth: true },
    },
    {
      path: '/products',
      name: 'shopping',
      component: Shopping,
    },
    {
      path: '/products/detail/:id',
      name: 'shoppingdetail',
      component: Shopping_detail,
      meta: { requiresAuth: true },
    },
    {
      path: '/mypage',
      component: Mypage,
      children: [
        { path: '', redirect: '/mypage/user_info' },
        { path: 'cart', name: 'mypage-cart', component: Cart },
        { path: 'order_list', name: 'mypage-order', component: OrderList },
        { path: 'scrap_list', name: 'mypage-scrap', component: ScrapList },
        { path: 'like_list', name: 'mypage-like', component: LikeList },
        { path: 'reply_list', name: 'mypage-reply', component: ReplyList },
        { path: 'user_info', name: 'mypage-info', component: UserInfo },
        { path: 'write_list', name: 'mypage-write', component: WriteList },
        { path: 'my_recipe_list', name: 'mypage-recipe-write', component: RecipeWriteList },
        { path: 'recipe_like_list', name: 'mypage-recipe-like', component: RecipeLikeList },
        { path: 'recipe_scrap_list', name: 'mypage-recipe-scrap', component: RecipeScrapList },
        { path: 'recipe_reply_list', name: 'mypage-recipe-reply', component: RecipeReplyList },
        { path: 'address_list', name: 'mypage-address', component: AddressList },
        { path: 'payment_method', name: 'mypage-payment', component: PaymentMethodList },
        { path: 'my_review_list', name: 'mypage-review', component: ReviewList },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/refrigerator',
      name: 'refrigerator',
      component: Refrigerator,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hideLayout: true },
    },
    {
      path: '/find-id',
      name: 'FindId',
      component: () => import('@/components/FindIdCard.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/find-password',
      name: 'FindPassword',
      component: () => import('@/components/FindPasswordCard.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/reset-password',
      name: 'PasswordReset',
      component: () => import('@/views/PasswordReset.vue'),
      meta: { hideLayout: true, requiresAuth: false },
    },
    {
      path: '/address/search',
      name: 'AddressSearch',
      component: () => import('@/components/AddressSearchCard.vue'),
      meta: { hideLayout: true },
    },
    {
      path: '/user/signup',
      name: 'user_signup',
      component: Signup,
      meta: { hideLayout: true },
    },
    {
      path: '/signup/write',
      name: 'signup_write',
      component: Signup,
      meta: { hideLayout: true },
    },
    {
      path: '/mypage/address/new',
      name: 'address_create',
      component: AddressFormPage,
      meta: { hideLayout: true },
    },
    {
      path: '/mypage/address/edit/:id',
      name: 'address_edit',
      component: AddressFormPage,
      meta: { hideLayout: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 항상 맨 위로 스크롤
    return { top: 0 }
  },
})

// 인증 헬퍼 함수
const ensureInitialized = async (auth) => {
  if (!auth.state.initialized) {
    await auth.initialize()
  }
}

// 라우터 가드
router.beforeEach(async (to, from, next) => {
  console.log('Router guard: checking route', to.path)

  const auth = useUserStore()

  console.log('Authentication state:', {
    isLogin: auth.state.isLogin,
    hasUser: !!auth.state.user,
    userNickname: auth.state.user?.nickname,
    initialized: auth.state.initialized,
  })

  // 사용자 상태 초기화 확인
  await ensureInitialized(auth)

  // 인증이 필요한 페이지인데 로그인되지 않은 경우
  if (to.meta.requiresAuth && !auth.state.isLogin) {
    console.log('Authentication required but user not logged in, redirecting to login')
    return next('/login')
  }

  // 이미 로그인된 상태에서 로그인 페이지 접근 시
  if (to.name === 'login' && auth.state.isLogin) {
    console.log('User already logged in, redirecting to main')
    return next('/')
  }

  console.log('Router guard passed, proceeding to route')
  next()
})

export default router
