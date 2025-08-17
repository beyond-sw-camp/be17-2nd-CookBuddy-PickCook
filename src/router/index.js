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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/recipe',
      name: 'recipe',
      component: Recipe,
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
      path: '/shopping',
      name: 'shopping',
      component: Shopping,
    },
    {
      path: '/shopping/detail/:id',
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
        { path: 'address_list', name: 'mypage-address', component: AddressList },
        { path: 'payment_method', name: 'mypage-payment', component: PaymentMethodList },
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
      meta: { hideLayout: true }
    },
    {
      path: '/find-password',
      name: 'FindPassword',
      component: () => import('@/components/FindPasswordCard.vue'),
      meta: { hideLayout: true }  // 🔧 추가: 레이아웃 숨기기
    },
    {
      path: '/address/search',
      name: 'AddressSearch',
      component: () => import('@/components/AddressSearchCard.vue'),
      meta: { hideLayout: true }
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
})

// 🔧 수정: useUserStore의 initialize 메서드 사용하도록 변경
router.beforeEach(async (to, from, next) => {
  console.log('🔄 라우터 가드 실행:', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    fromPath: from.path
  })
  
  const auth = useUserStore()
  
  console.log('🔍 현재 인증 상태:', {
    isLogin: auth.state.isLogin,
    hasUser: !!auth.state.user,
    userNickname: auth.state.user?.nickname,
    initialized: auth.state.initialized // 🔧 추가: 초기화 상태 확인
  })

  // 🔧 수정: 초기화되지 않았으면 initialize 호출
  if (!auth.state.initialized) {
    console.log('❌ 아직 초기화되지 않음 - initialize 호출...')
    
    try {
      const isLoggedIn = await auth.initialize()
      console.log('🔄 초기화 결과:', isLoggedIn)
      
      // 인증이 필요한 페이지에서만 리다이렉트 처리
      if (to.meta.requiresAuth && !isLoggedIn) {
        console.log('❌ 인증 필요한 페이지인데 로그인 안됨 - 로그인 페이지로 이동')
        return next('/login')
      }
    } catch (error) {
      console.error('❌ 초기화 중 오류:', error)
      if (to.meta.requiresAuth) {
        return next('/login')
      }
    }
  } else {
    console.log('✅ 이미 초기화됨')
    
    // 인증이 필요한 페이지인데 로그인 안된 경우
    if (to.meta.requiresAuth && !auth.state.isLogin) {
      console.log('❌ 인증 필요한 페이지인데 로그인 안됨 - 로그인 페이지로 이동')
      return next('/login')
    }
  }

  // 🔧 추가: 로그인 페이지인데 이미 로그인된 경우 메인으로 리다이렉트
  if (to.name === 'login' && auth.state.isLogin) {
    console.log('🔄 이미 로그인됨 - 메인 페이지로 리다이렉트')
    return next('/')
  }
  
  console.log('✅ 라우터 가드 통과 - 페이지 이동 허용')
  next()
})

export default router
