<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import shoppingAPI from '@/api/shopping'
import cartAPI from '@/api/cart'

// =================================================================
// 유틸리티 함수들
// =================================================================

/**
 * 별점 표시용 함수
 */
const getStarDisplay = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

/**
 * 닉네임 마스킹 함수 (현재는 사용되지 않음)
 */
const maskNickname = (nickname) => {
  if (!nickname) return '익명'
  if (nickname.length <= 2) return nickname
  return nickname[0] + '*'.repeat(nickname.length - 2) + nickname[nickname.length - 1]
}

// =================================================================
// 라우터 및 기본 설정
// =================================================================

const router = useRouter()
const route = useRoute()
const productId = computed(() => route.params.id)
const showCartModal = ref(false)

const closeModal = () => {
  showCartModal.value = false
}

const goToCart = () => {
  showCartModal.value = false
  router.push({ name: 'mypage-cart' })
}

const goToPayment = () => {
  if (!productState.data) {
    alert('상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  const checkoutItem = {
    idx: productState.data.id,
    product_id: productState.data.id,
    name: productState.data.title,
    main_image_url: productState.data.main_image_url,
    discount_rate: productState.data.discount_rate,
    original_price: productState.data.original_price,
    quantity: productState.quantity,
  }

  router.push({
    path: '/payment',
    state: { items: [checkoutItem] },
  })

  localStorage.setItem('checkoutItems', JSON.stringify([checkoutItem]))
}

// =================================================================
// 상품 데이터 상태 관리
// =================================================================

const productState = reactive({
  data: null,
  loading: true,
  error: null,
  quantity: 1,
})

const discountedPrice = computed(() => {
  if (!productState.data) return 0
  const original = productState.data.original_price
  const discount = productState.data.discount_rate || 0
  return Math.floor((original * (100 - discount)) / 100)
})

const categoryName = computed(() => {
  return productState.data?.category || '카테고리 없음'
})

const totalPrice = computed(() => {
  if (!productState.data) return 0
  return discountedPrice.value * productState.quantity
})

// =================================================================
// 리뷰 데이터 상태 관리
// =================================================================

const reviewState = reactive({
  reviews: [],
  statistics: {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [0, 0, 0, 0, 0], // [1점, 2점, 3점, 4점, 5점]
  },
  filters: {
    rating: null, // null=전체, 1-5=해당 별점만
    sortType: 'LATEST', // LATEST, OLDEST, RATING_HIGH, RATING_LOW
    period: null, // null, 'WEEK', 'MONTH', 'YEAR'
    imageFilter: null, // null, 'WITH_IMAGE', 'TEXT_ONLY'
    page: 0,
    size: 10,
  },
  loading: false,
  error: null,
  hasMore: true,
})

const openDropdown = ref(null) // 현재 열린 드롭다운 추적

// =================================================================
// 상품 관련 메서드
// =================================================================

/**
 * 상품 데이터 로딩
 */
const loadProduct = async () => {
  try {
    productState.loading = true
    productState.error = null

    const productData = await shoppingAPI.getProductDetail(productId.value)
    productState.data = productData

    console.log('상품 데이터 로딩 완료:', productData)
  } catch (err) {
    console.error('상품 로딩 실패:', err)
    productState.error = err.message || '상품 정보를 불러오는데 실패했습니다.'
  } finally {
    productState.loading = false
  }
}

/**
 * 수량 증가
 */
const increaseQuantity = () => {
  productState.quantity++
}

/**
 * 수량 감소
 */
const decreaseQuantity = () => {
  if (productState.quantity > 1) {
    productState.quantity--
  }
}

/**
 * 수량 직접 입력 처리
 */
const handleQuantityInput = (event) => {
  const value = parseInt(event.target.value) || 1
  productState.quantity = value > 0 ? value : 1
}

/**
 * 장바구니에 담기
 */
const addToCart = async () => {
  try {
    if (!productState.data) {
      alert('상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    const button = document.getElementById('shopping-cart-push')
    if (button) {
      button.disabled = true
      button.textContent = '담는 중...'
    }

    const response = await cartAPI.addToCart([productState.data.id], productState.quantity)

    if (response.success) {
      showCartModal.value = true
    } else {
      throw new Error(response.message || '장바구니 담기에 실패했습니다.')
    }
  } catch (error) {
    console.error('장바구니 추가 실패:', error)
  } finally {
    const button = document.getElementById('shopping-cart-push')
    if (button) {
      button.disabled = false
      button.textContent = '장바구니 담기'
    }
  }
}

// =================================================================
// 리뷰 이미지 갤러리 상태 관리
// =================================================================

const images = ref([
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoyjHFhvtls-4Q9CLAA-Flhfz5ZcP4gtiJjA&s',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop',
  'https://cdn.wikifoodie.co.kr/news/photo/202504/1902_5077_3628.jpg',
  'https://dimg.donga.com/wps/NEWS/IMAGE/2024/11/28/130529269.5.jpg',
  'https://wimg.heraldcorp.com/content/default/2017/10/30/20171030000469_0.jpg',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=120&h=120&fit=crop',
])

const groupedSlides = computed(() => {
  const perSlide = 6
  const result = []
  for (let i = 0; i < images.value.length; i += perSlide) {
    result.push(images.value.slice(i, i + perSlide))
  }
  return result
})

const currentIndex = ref(0)

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const next = () => {
  if (currentIndex.value < groupedSlides.value.length - 1) currentIndex.value++
}

// =================================================================
// 리뷰 관련 메서드
// =================================================================

/**
 * 리뷰 데이터 로딩
 */
const loadProductReviews = async (reset = true) => {
  try {
    if (reset) {
      reviewState.loading = true
      reviewState.error = null
    }

    const filterRequest = {
      rating: reviewState.filters.rating,
      sortType: reviewState.filters.sortType,
      period: reviewState.filters.period,
      imageFilter: reviewState.filters.imageFilter,
      page: reset ? 0 : reviewState.filters.page,
      size: reviewState.filters.size,
    }

    console.log('🔍 필터 전 reviews 길이:', reviewState.reviews.length) // 추가

    const response = await shoppingAPI.getProductReviews(productId.value, filterRequest)

    console.log('전송할 filterRequest:', filterRequest)

    if (response) {
      if (reset) {
        reviewState.reviews = response.reviews || []

        // 확인용 로그
        console.log('🔍 할당 후 reviews 길이:', reviewState.reviews.length) // 추가
        console.log('🔍 첫 번째 리뷰:', reviewState.reviews[0]) // 추가
      } else {
        reviewState.reviews.push(...(response.reviews || []))
      }

      // 통계 정보 업데이트
      if (response.statistics) {
        reviewState.statistics.totalReviews = response.statistics.totalReviews || 0
        reviewState.statistics.averageRating = response.statistics.averageRating || 0
        reviewState.statistics.ratingDistribution = response.statistics.ratingDistribution || [
          0, 0, 0, 0, 0,
        ]
      }

      reviewState.hasMore = response.pageInfo?.hasNext || false

      if (reset) reviewState.filters.page = 0
    } else {
      if (reset) {
        reviewState.reviews = []
        reviewState.statistics.totalReviews = 0
        reviewState.statistics.averageRating = 0
      }
    }
  } catch (err) {
    console.error('리뷰 로딩 실패:', err)
    reviewState.error = '리뷰를 불러오는데 실패했습니다.'
    if (reset) {
      reviewState.reviews = []
    }
  } finally {
    reviewState.loading = false
  }
}

/**
 * 더 보기 (페이징)
 */
const loadMoreReviews = () => {
  if (reviewState.hasMore && !reviewState.loading) {
    reviewState.filters.page++
    loadProductReviews(false)
  }
}

// =================================================================
// 리뷰 필터 관련 메서드
// =================================================================

/**
 * 드롭다운 토글
 */
const toggleDropdown = (dropdownName) => {
  if (openDropdown.value === dropdownName) {
    openDropdown.value = null
  } else {
    openDropdown.value = dropdownName
  }
}

/**
 * 필터 변경 처리
 */
const handleFilterChange = (filterType, value) => {
  reviewState.filters[filterType] = value
  openDropdown.value = null
  // 즉시 로딩 표시
  reviewState.loading = true
  loadProductReviews(true)
}

/**
 * 필터 텍스트 반환 메서드들
 */
const getRatingFilterText = () => {
  if (reviewState.filters.rating === null) return '전체 별점'
  return `${reviewState.filters.rating}점만`
}

const getPeriodFilterText = () => {
  const periodMap = {
    null: '전체',
    WEEK: '최근 일주일',
    MONTH: '최근 한달',
    YEAR: '최근 일년',
  }
  return periodMap[reviewState.filters.period] || '전체'
}

const getImageFilterText = () => {
  const imageMap = {
    null: '전체',
    WITH_IMAGE: '사진 리뷰만',
    TEXT_ONLY: '글 리뷰만',
  }
  return imageMap[reviewState.filters.imageFilter] || '전체'
}

const getSortFilterText = () => {
  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    RATING_HIGH: '별점 높은순',
    RATING_LOW: '별점 낮은순',
  }
  return sortMap[reviewState.filters.sortType] || '최신순'
}

/**
 * 외부 클릭 시 드롭다운 닫기
 */
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.filter-dropdown')
  if (!dropdown) {
    openDropdown.value = null
  }
}

// =================================================================
// 리뷰 액션 메서드 (향후 구현)
// =================================================================

/**
 * 리뷰 수정
 */
const editReview = (reviewId) => {
  console.log('리뷰 수정:', reviewId)
  // TODO: 리뷰 수정 페이지로 이동 또는 모달 열기
}

/**
 * 리뷰 삭제
 */
const deleteReview = (reviewId) => {
  console.log('리뷰 삭제:', reviewId)
  // TODO: 삭제 확인 다이얼로그 표시 후 삭제 API 호출
}

/**
 * 이미지 모달 열기
 */
const openImageModal = (imageUrl) => {
  console.log('이미지 확대:', imageUrl)
  // TODO: 이미지 확대 모달 구현
}

// =================================================================
// 탭 네비게이션 관련 메서드
// =================================================================

const gnbItems = ref([])
const sections = ref([])
const isTabSticky = ref(false)
const originalTabBarTop = ref(0)
const activeTabIndex = ref(0)
const sectionOffsets = ref([])

/**
 * 탭 네비게이션 초기화
 */
const initTabNavigation = () => {
  gnbItems.value = document.querySelectorAll('.shopping-product-mid-content-menu-items')

  sections.value = [
    document.querySelector('.required-notation-info'),
    document.querySelector('.shipping-information-container'),
    document.querySelector('.review-section'),
  ].filter((section) => section !== null)

  gnbItems.value.forEach((gnbItem, index) => {
    gnbItem.addEventListener('click', (e) => {
      e.preventDefault()
      if (sections.value[index]) {
        const sectionTop = sections.value[index].offsetTop - 250
        window.scroll({
          top: sectionTop,
          behavior: 'smooth',
        })
        updateActiveTabState(index)
        activeTabIndex.value = index
      }
    })
  })

  if (sections.value.length > 0) {
    calculateSectionOffsets()
    detectCurrentSection()

    if (window.scrollY < 100) {
      activeTabIndex.value = 0
      updateActiveTabState(0)
    }
  }
}

/**
 * 활성 탭 업데이트
 */
const updateActiveTabState = (activeIndex) => {
  gnbItems.value.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
}

/**
 * 스티키 상태 업데이트
 */
const updateStickyState = () => {
  if (originalTabBarTop.value > 0) {
    const headerHeight = 200
    const scrollY = window.scrollY

    const shouldBeSticky = scrollY >= originalTabBarTop.value - headerHeight

    if (isTabSticky.value !== shouldBeSticky) {
      isTabSticky.value = shouldBeSticky
    }
  }
}

/**
 * 현재 섹션 감지
 */
const detectCurrentSection = () => {
  if (sections.value.length === 0) {
    return
  }

  const headerHeight = 50
  const tabBarHeight = 50
  const scrollY = window.scrollY + headerHeight + tabBarHeight + 100

  let currentSection = 0

  if (window.scrollY < 200) {
    currentSection = 0
  } else {
    for (let i = sections.value.length - 1; i >= 0; i--) {
      const section = sections.value[i]
      if (section && scrollY >= section.offsetTop - 150) {
        currentSection = i
        break
      }
    }
  }

  if (activeTabIndex.value !== currentSection) {
    activeTabIndex.value = currentSection
    updateActiveTabState(currentSection)
  }
}

/**
 * 스크롤 이벤트 핸들러
 */
let scrollTimer = null
const handleScroll = () => {
  if (scrollTimer) clearTimeout(scrollTimer)

  scrollTimer = setTimeout(() => {
    updateStickyState()
    detectCurrentSection()
  }, 10)
}

/**
 * 섹션 오프셋 계산
 */
const calculateSectionOffsets = () => {
  sectionOffsets.value = sections.value.map((section) => (section ? section.offsetTop : 0))
}

// =================================================================
// 생명주기 메서드
// =================================================================

onMounted(() => {
  nextTick(() => {
    loadProduct()
    loadProductReviews()

    document.addEventListener('click', handleClickOutside)

    setTimeout(() => {
      initTabNavigation()

      const tabBar = document.querySelector('.shopping-product-mid-content-menu-bar')
      if (tabBar) {
        originalTabBarTop.value = tabBar.offsetTop
      }

      window.addEventListener('scroll', handleScroll)

      window.addEventListener('resize', () => {
        setTimeout(() => {
          calculateSectionOffsets()
          detectCurrentSection()
        }, 100)
      })
    }, 300)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', calculateSectionOffsets)
  document.removeEventListener('click', handleClickOutside)
  if (scrollTimer) clearTimeout(scrollTimer)
})
</script>

<template>
  <!-- 로딩 상태 -->
  <div v-if="productState.loading" class="loading-container">
    <div class="loading-spinner">상품 정보를 불러오는 중...</div>
  </div>

  <!-- 에러 상태 -->
  <div v-else-if="productState.error" class="error-container">
    <div class="error-message">{{ productState.error }}</div>
    <button @click="loadProduct" class="retry-button">다시 시도</button>
  </div>

  <!-- 정상 상태 - 기존 div에 v-else 추가 -->
  <div v-else class="shopping-detail-container">
    <div class="shopping-detail-top">
      <div class="shopping-detail-top-left">
        <img
          class="shopping-detail-main-product-image"
          :src="
            productState.data?.main_image_url ||
            'https://papamarket.kr/web/product/big/202302/6825f425ba4f2273acf9d9d088aeb927.jpg'
          "
          :alt="productState.data?.title || '상품 이미지'"
        />
      </div>
      <div class="shopping-detail-top-right">
        <span id="product-detail-category-badge">{{ categoryName }}</span>
        <h1 id="product-title-name-top">{{ productState.data?.title || '상품명' }}</h1>
        <p id="product-descript-text-top">{{ productState.data?.subtitle || '상품 설명' }}</p>

        <div class="product-price-info-container">
          <div class="product-price-discount-and-current-price">
            <h1>{{ productState.data?.discount_rate || 0 }}%</h1>
            <h2>{{ discountedPrice.toLocaleString() }}원</h2>
          </div>
          <h6>{{ productState.data?.original_price?.toLocaleString() }}원</h6>
        </div>

        <p id="product-origin-info">원산지: {{ productState.data?.origin || '미표기' }}</p>

        <div class="product-info-top-border-container">
          <div class="product-info-top-border-items-boxes">
            <div class="product-info-top-border-items-left">배송</div>
            <div class="product-info-top-border-items-right">
              샛별배송
              <span
                >23시 전 주문 시 수도권/충청 내일 아침 7시 전 도착 (그 외 지역 아침 8시 전
                도착)</span
              >
            </div>
          </div>

          <div class="product-info-top-border-items-boxes">
            <div class="product-info-top-border-items-left">판매단위</div>
            <div class="product-info-top-border-items-right">
              {{ productState.data?.unit || '1통' }}
            </div>
          </div>

          <div class="product-info-top-border-items-boxes">
            <div class="product-info-top-border-items-left">중량/용량</div>
            <div class="product-info-top-border-items-right">
              {{ productState.data?.weight_or_volume || '900g 내외' }}
            </div>
          </div>

          <div class="product-info-top-border-items-boxes">
            <div class="product-info-top-border-items-left">소비기한(또는 유통기한)</div>
            <div class="product-info-top-border-items-right">
              신선식품으로 별도의 소비기한은 없습니다.
            </div>
          </div>

          <div class="product-info-top-border-items-boxes">
            <div class="product-info-top-border-items-left">안내사항</div>
            <div class="product-info-top-border-items-right">
              신선식품의 특성상 상품의 중량의 3% 내외의 차이가 발생할 수 있습니다.
            </div>
          </div>

          <div class="product-info-top-border-items-boxes">
            <div class="product-info-top-border-items-left">상품선택</div>
            <div class="product-info-top-border-items-right">
              <div class="product-items-buy-count-container">
                <div class="product-buy-count-product-name">
                  {{ productState.data?.title || '상품명' }}
                </div>
                <div class="product-buy-count-info-bottom">
                  <div class="product-items-buy-count-button-container">
                    <p id="product-buy-count-down" @click="decreaseQuantity">-</p>
                    <input
                      id="product-buy-count"
                      type="number"
                      :value="productState.quantity"
                      @input="handleQuantityInput"
                      min="1"
                      style="width: 50px; text-align: center; border: none; background: transparent"
                    />
                    <p id="product-buy-count-up" @click="increaseQuantity">+</p>
                  </div>
                  <div class="product-buy-count-price-container">
                    <span>{{ productState.data?.original_price?.toLocaleString() }}원</span>
                    <p>{{ discountedPrice.toLocaleString() }}원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="product-price-big-font-size">
            <span>총 상품금액 : </span>
            <h1>{{ totalPrice.toLocaleString() }}</h1>
            <h3>원</h3>
          </div>

          <div class="product-buy-decide-button-or-cart-push">
            <button id="shopping-cart-push" @click="addToCart">장바구니 담기</button>
            <button id="shopping-product-right-now-buy" @click="goToPayment">바로 구매</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 장바구니 담기 성공 모달 -->
    <div v-if="showCartModal" class="modal-backdrop">
      <div class="modal-content">
        <img src="/assets/icons/ic-product-in-cart.png" alt="장바구니 담기 성공" />
        <h3>장바구니에 상품이 성공적으로 담겼습니다.</h3>
        <div>
          <button @click="goToCart">장바구니로 이동</button>
          <button @click="closeModal">쇼핑 계속하기</button>
        </div>
      </div>
    </div>

    <div class="shopping-product-mid-content-menu-bar" :class="{ 'sticky-tab-bar': isTabSticky }">
      <div class="shopping-product-mid-content-menu-items">상품설명</div>
      <div class="shopping-product-mid-content-menu-items">배송정보</div>
      <div class="shopping-product-mid-content-menu-items">
        상품후기
        <span v-if="reviewState.statistics.totalReviews > 0">
          ({{ reviewState.statistics.totalReviews.toLocaleString() }})
        </span>
        <span v-else>(0)</span>
      </div>
    </div>

    <!-- 필수 표기 정보 -->
    <div class="detail-info required-notation-info">
      <h5 class="product-info-position">필수 표기 정보</h5>
      <div class="required-notation-info-body">
        <div class="required-notation-info-body-row">
          <div class="required-notation-info-head-items">중량 (용량)</div>
          <div class="required-notation-info-child-items">
            {{ productState.data?.weight_or_volume || '900g 내외' }}
          </div>
          <div class="required-notation-info-head-items">제품 주요 사양</div>
          <div class="required-notation-info-child-items">
            {{ productState.data?.packaging || '-' }}
          </div>
        </div>

        <div class="required-notation-info-body-row">
          <div class="required-notation-info-head-items">권장 유통 기한</div>
          <div class="required-notation-info-child-items">
            {{ productState.data?.expiration_date || '수령 후 일주일' }}
          </div>
          <div class="required-notation-info-head-items">제조국</div>
          <div class="required-notation-info-child-items">
            {{ productState.data?.origin || '대한민국' }}
          </div>
        </div>

        <div class="required-notation-info-body-row">
          <div class="required-notation-info-head-items">사업자 명</div>
          <div class="required-notation-info-child-items">
            {{ productState.data?.seller || 'PickCook' }}
          </div>
          <div class="required-notation-info-head-items">제품 사용 방법</div>
          <div class="required-notation-info-child-items">취식</div>
        </div>
      </div>
    </div>

    <div class="very-big-mid-title-and-image-and-description">
      <img
        :src="
          productState.data?.detail_image_url ||
          'https://cdnweb01.wikitree.co.kr/webdata/editor/202507/07/img_20250707171857_abeb8057.webp'
        "
        alt="중간 대표 이미지"
      />
      <h4>{{ productState.data?.subtitle || '상품 부제목' }}</h4>
      <h1>{{ productState.data?.title || '상품명' }}</h1>
    </div>

    <div class="shopping-product-mid-description-text-box">
      <p>{{ productState.data?.description || '상품 상세 설명이 여기에 표시됩니다.' }}</p>
    </div>

    <div class="shopping-product-mid-description-add-images-container">
      <img
        :src="
          productState.data?.detail_image_url ||
          'https://homeabs.kr/wp-content/uploads/2025/01/IMG_9686.jpg'
        "
        alt="상품사진1"
      />
      <!-- <img
        src="https://recipe1.ezmember.co.kr/cache/recipe/2022/04/06/51f02b4c6475fea0ef12f727604cd2e21.jpg"
        lt="상품사진2"
      /> -->
    </div>

    <div class="shipping-information-container">
      <h5 class="delivery-info">배송 정보</h5>
      <div class="shipping-information-container-body">
        <div class="shipping-information-container-body-row">
          <div class="shipping-information-container-head-items">배송 방법</div>
          <div class="shipping-information-container-items">
            {{ productState.data?.shipping_info || '샛별배송' }}
          </div>
          <div class="shipping-information-container-head-items">배송기간</div>
          <div class="shipping-information-container-items">새벽</div>
        </div>

        <div class="shipping-information-container-body-row">
          <div class="required-notation-info-head-items">배송사</div>
          <div class="shipping-information-container-items">
            {{ productState.data?.seller || 'PickCook' }}
          </div>
          <div class="shipping-information-container-head-items">배송비</div>
          <div class="shipping-information-container-items">0원</div>
        </div>

        <div class="shipping-information-container-body-row">
          <div class="shipping-information-container-head-items">교환 / 반품비용</div>
          <div class="shipping-information-container-items">전액</div>
          <div class="shipping-information-container-head-items">환불 정책</div>
          <div class="shipping-information-container-items">고객센터 문의</div>
        </div>

        <div class="shipping-information-container-body-row">
          <div class="shipping-information-container-head-items">지정 교환일 / 반품일</div>
          <div class="shipping-information-container-items">수령 후 3일 이내</div>
        </div>
      </div>
    </div>

    <div class="review-section">
      <!-- 리뷰 통계 섹션 (그대로 유지) -->
      <div v-if="reviewState.statistics.totalReviews > 0" class="review-statistics">
        <div class="review-summary">
          <div class="average-rating">
            <span class="rating-score">{{ reviewState.statistics.averageRating.toFixed(1) }}</span>
            <span class="rating-stars">{{
              getStarDisplay(Math.round(reviewState.statistics.averageRating))
            }}</span>
            <span class="total-count"
              >총 {{ reviewState.statistics.totalReviews.toLocaleString() }}개 후기</span
            >
          </div>

          <!-- 별점별 분포 차트 (그대로 유지) -->
          <div class="rating-distribution">
            <div
              v-for="(count, index) in [...reviewState.statistics.ratingDistribution].reverse()"
              :key="`rating-${5 - index}`"
              class="rating-bar"
            >
              <span class="rating-label">{{ 5 - index }}점</span>
              <div class="bar-container">
                <div
                  class="bar-fill"
                  :style="{
                    width:
                      reviewState.statistics.totalReviews > 0
                        ? (count / reviewState.statistics.totalReviews) * 100 + '%'
                        : '0%',
                  }"
                ></div>
              </div>
              <span class="rating-count">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 리뷰 이미지 갤러리 섹션 -->
      <div class="slider-container">
        <button class="nav-button left" @click="prev" :disabled="currentIndex === 0">
          <img src="/assets/icons/ic-banner-left.png" alt="left" />
        </button>

        <div class="slider-wrapper">
          <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div class="slide" v-for="(slide, index) in groupedSlides" :key="index">
              <img
                v-for="(img, i) in slide"
                :key="i"
                :src="img"
                alt="리뷰 이미지"
                class="review-image"
              />
            </div>
          </div>
        </div>

        <button
          class="nav-button right"
          @click="next"
          :disabled="currentIndex === groupedSlides.length - 1"
        >
          <img src="/assets/icons/ic-banner-right.png" alt="오른쪽" />
        </button>
      </div>

      <!-- ⬇️ 위 코드를 아래 코드로 교체 -->
      <div class="review-filters">
        <!-- 별점 필터 -->
        <div class="filter-dropdown">
          <button class="filter-button" @click="toggleDropdown('rating')">
            {{ getRatingFilterText() }} ▼
          </button>
          <div v-show="openDropdown === 'rating'" class="dropdown-menu">
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.rating === null }"
              @click="handleFilterChange('rating', null)"
            >
              전체 별점
            </div>
            <div
              v-for="star in [5, 4, 3, 2, 1]"
              :key="star"
              class="dropdown-item"
              :class="{ active: reviewState.filters.rating === star }"
              @click="handleFilterChange('rating', star)"
            >
              {{ star }}점만
            </div>
          </div>
        </div>

        <!-- 기간 필터 -->
        <div class="filter-dropdown">
          <button class="filter-button" @click="toggleDropdown('period')">
            {{ getPeriodFilterText() }} ▼
          </button>
          <div v-show="openDropdown === 'period'" class="dropdown-menu">
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.period === null }"
              @click="handleFilterChange('period', null)"
            >
              전체
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.period === 'WEEK' }"
              @click="handleFilterChange('period', 'WEEK')"
            >
              최근 일주일
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.period === 'MONTH' }"
              @click="handleFilterChange('period', 'MONTH')"
            >
              최근 한달
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.period === 'YEAR' }"
              @click="handleFilterChange('period', 'YEAR')"
            >
              최근 일년
            </div>
          </div>
        </div>

        <!-- 이미지 필터 -->
        <div class="filter-dropdown">
          <button class="filter-button" @click="toggleDropdown('image')">
            {{ getImageFilterText() }} ▼
          </button>
          <div v-show="openDropdown === 'image'" class="dropdown-menu">
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.imageFilter === null }"
              @click="handleFilterChange('imageFilter', null)"
            >
              전체
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.imageFilter === 'WITH_IMAGE' }"
              @click="handleFilterChange('imageFilter', 'WITH_IMAGE')"
            >
              사진 리뷰만
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.imageFilter === 'TEXT_ONLY' }"
              @click="handleFilterChange('imageFilter', 'TEXT_ONLY')"
            >
              글 리뷰만
            </div>
          </div>
        </div>

        <!-- 정렬 필터 -->
        <div class="filter-dropdown">
          <button class="filter-button" @click="toggleDropdown('sort')">
            {{ getSortFilterText() }} ▼
          </button>
          <div v-show="openDropdown === 'sort'" class="dropdown-menu">
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.sortType === 'LATEST' }"
              @click="handleFilterChange('sortType', 'LATEST')"
            >
              최신순
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.sortType === 'OLDEST' }"
              @click="handleFilterChange('sortType', 'OLDEST')"
            >
              오래된순
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.sortType === 'RATING_HIGH' }"
              @click="handleFilterChange('sortType', 'RATING_HIGH')"
            >
              별점 높은순
            </div>
            <div
              class="dropdown-item"
              :class="{ active: reviewState.filters.sortType === 'RATING_LOW' }"
              @click="handleFilterChange('sortType', 'RATING_LOW')"
            >
              별점 낮은순
            </div>
          </div>
        </div>
      </div>

      <!-- 리뷰 로딩 상태 -->
      <div v-if="reviewState.loading" class="review-loading">
        <div class="loading-spinner"></div>
        <p>리뷰를 불러오는 중...</p>
      </div>

      <!-- 🚨 수정: 리뷰 목록 - 새로운 디자인으로 교체 -->
      <!-- 리뷰 목록 - 기존 CSS 클래스 그대로 사용 -->
      <div v-else-if="reviewState.reviews.length > 0">
        <p>{{ reviewState.reviews.length }}개의 리뷰가 있습니다.</p>
        <!-- 확인용 -->
        <div
          v-for="review in reviewState.reviews"
          :key="review.reviewId"
          class="shopping-product-reviews-items-container"
        >
          <div class="shopping-product-reviews-items-container-left">
            {{ review.author?.maskedNickname || '익명' }}

            <!-- 🚨 추가: 내 리뷰 표시 (기존 스타일 활용) -->
            <div v-if="review.isMyReview" style="color: #e14345; font-size: 12px; margin-top: 4px">
              내 리뷰
            </div>
          </div>

          <div class="shopping-product-reviews-items-container-right">
            <div class="review-rating">{{ getStarDisplay(review.rating) }}</div>
            <h5>{{ review.title }}</h5>
            <p>{{ review.content }}</p>

            <!-- 🚨 수정: 날짜 처리 -->
            <span>{{ review.createdAt }}</span>

            <!-- 🚨 추가: 이미지 표시 (기존 review-image 클래스 활용) -->
            <div v-if="review.images && review.images.length > 0" style="margin-top: 10px">
              <img
                v-for="image in review.images"
                :key="image.imageId"
                :src="image.thumbnailUrl || image.imageUrl"
                :alt="`리뷰 이미지 ${image.imageOrder}`"
                class="review-image"
                @click="openImageModal(image.imageUrl)"
                style="width: 80px; height: 80px; margin-right: 8px; cursor: pointer"
              />
            </div>

            <!-- 🚨 추가: 수정/삭제 버튼 (기존 버튼 스타일 활용) -->
            <div v-if="review.isMyReview" style="margin-top: 10px">
              <button
                v-if="review.canModify"
                @click="editReview(review.reviewId)"
                style="
                  padding: 4px 8px;
                  margin-right: 5px;
                  border: 1px solid #e14345;
                  background: white;
                  color: #e14345;
                  border-radius: 3px;
                  cursor: pointer;
                  font-size: 12px;
                "
              >
                수정
              </button>
              <button
                @click="deleteReview(review.reviewId)"
                style="
                  padding: 4px 8px;
                  border: 1px solid #dc3545;
                  background: white;
                  color: #dc3545;
                  border-radius: 3px;
                  cursor: pointer;
                  font-size: 12px;
                "
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 더보기 버튼 - 기존 클래스 그대로 -->
        <div v-if="reviewState.hasMore" class="load-more-container">
          <button @click="loadMoreReviews" :disabled="reviewState.loading">
            {{ reviewState.loading ? '로딩 중...' : '더 많은 리뷰 보기' }}
          </button>
        </div>
      </div>

      <!-- 리뷰가 없는 경우 - 기존 클래스 사용 -->
      <div v-else class="no-reviews-message">
        <p>작성된 리뷰가 없습니다.</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="reviewState.error" class="error-message">
        <p>{{ reviewState.error }}</p>
        <button @click="loadProductReviews(true)" class="retry-btn">다시 시도</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =================================================================
   레이아웃 및 네비게이션 스타일
   ================================================================= */

.sticky-tab-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shopping-product-mid-content-menu-items {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 50px;
}

.shopping-product-mid-content-menu-items:hover {
  color: #e14345;
}

.shopping-product-mid-content-menu-items.active {
  color: #e14345;
  border-bottom: 2px solid #e14345;
  font-weight: 600;
}

.required-notation-info {
  margin-top: 60px;
}

/* =================================================================
   로딩 및 에러 상태 스타일
   ================================================================= */

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
  gap: 20px;
}

.loading-spinner {
  font-size: 18px;
  color: #666;
  text-align: center;
}

.error-message {
  font-size: 16px;
  color: #e14345;
  text-align: center;
  margin-bottom: 10px;
}

.retry-button {
  padding: 10px 20px;
  background-color: #e14345;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: #d63031;
}

/* =================================================================
   상품 입력 및 모달 스타일
   ================================================================= */

#product-buy-count {
  font-weight: bold;
  font-size: 16px;
  outline: none;
}

#product-buy-count:focus {
  border: 1px solid #e14345 !important;
  border-radius: 2px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  padding: 35px 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-content > img {
  width: 35px;
}

.modal-content h3 {
  font-size: 15px;
  font-weight: 500;
  margin-top: 20px;
}

.modal-content > div {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.modal-content button {
  width: 135px;
  padding: 10px 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:first-child {
  background-color: var(--color-primary);
  color: white;
}

.modal-content button:first-child:hover {
  background-color: var(--color-primary-dark);
}

.modal-content button:last-child:hover {
  background-color: #eaeaea;
}

/* =================================================================
   리뷰 통계 스타일
   ================================================================= */

/* .review-section {
  display: flex;
  flex-direction: column;
  align-items: center;
} */

.review-statistics {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.rating-score {
  font-size: 28px;
  font-weight: bold;
  color: #e14345;
}

.rating-stars {
  font-size: 20px;
  color: #ffa500;
}

.total-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.rating-distribution {
  margin-top: 20px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.rating-label {
  min-width: 35px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.bar-container {
  flex: 1;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #e14345, #ff6b6b);
  transition: width 0.5s ease;
  border-radius: 5px;
}

.rating-count {
  min-width: 25px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* =================================================================
   리뷰 필터 스타일
   ================================================================= */

.review-filters {
  display: flex;
  gap: 12px;
  margin: 25px 0;
  flex-wrap: wrap;
}

.filter-dropdown {
  position: relative;
}

.filter-button {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 130px;
  text-align: left;
  transition: all 0.2s ease;
}

.filter-button:hover {
  border-color: #e14345;
  color: #e14345;
  box-shadow: 0 2px 4px rgba(225, 67, 69, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f8f8;
}

.dropdown-item.active {
  background-color: #e14345;
  color: white;
}

/* =================================================================
   리뷰 목록 및 상태 스타일
   ================================================================= */

.review-rating {
  color: #ffa500;
  margin-bottom: 5px;
  font-size: 16px;
}

.review-loading,
.no-reviews-message {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.review-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.review-loading .loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #e14345;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-reviews-message {
  background: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;
}

.no-reviews-message p {
  margin: 8px 0;
  line-height: 1.5;
}

.load-more-container {
  text-align: center;
  margin: 30px 0;
}

.load-more-container button {
  padding: 12px 24px;
  border: 2px solid #e14345;
  background: white;
  color: #e14345;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.load-more-container button:hover {
  background: #e14345;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(225, 67, 69, 0.2);
}

.load-more-container button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* =================================================================
   반응형 스타일
   ================================================================= */

@media (max-width: 768px) {
  .review-filters {
    gap: 8px;
  }

  .filter-button {
    min-width: 110px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .average-rating {
    flex-wrap: wrap;
    gap: 10px;
  }

  .rating-score {
    font-size: 24px;
  }

  .rating-stars {
    font-size: 18px;
  }

  .review-statistics {
    padding: 15px;
    margin: 20px 0;
  }
}

@media (max-width: 480px) {
  .review-filters {
    flex-direction: column;
  }

  .filter-button {
    min-width: 100%;
  }

  .modal-content {
    margin: 0 20px;
    padding: 25px 15px;
  }

  .modal-content button {
    width: 120px;
    padding: 8px 0;
  }
}

/* =================================================================
   리뷰 이미지 갤러리 슬라이더 스타일
   ================================================================= */

.slider-container {
  position: relative;
  width: 100%;
  margin: 20px 0;
  overflow: hidden;
  border-radius: 8px;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-button.left {
  left: 10px;
}

.nav-button.right {
  right: 10px;
}

.nav-button img {
  width: 16px;
  height: 16px;
}

.slider-wrapper {
  overflow: hidden;
  width: 100%;
}

.slider {
  display: flex;
  transition: transform 0.3s ease;
}

.slide {
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  padding: 10px;
}

.review-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.review-image:hover {
  transform: scale(1.05);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .slide {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .review-image {
    height: 80px;
  }
}

@media (max-width: 480px) {
  .slide {
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
  }

  .review-image {
    height: 70px;
  }

  .nav-button {
    width: 35px;
    height: 35px;
  }

  .nav-button img {
    width: 14px;
    height: 14px;
  }
}
</style>
