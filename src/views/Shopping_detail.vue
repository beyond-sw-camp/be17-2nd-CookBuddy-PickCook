<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import shoppingAPI from '@/api/shopping'
import cartAPI from '@/api/cart'

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
  router.push({ name: 'mypage-cart' })  // 장바구니 페이지로 이동
}

const goToPayment = () => {
  if (!productState.data) {
    alert('상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  // 결제에 필요한 데이터 생성
  const checkoutItem = {
    idx: productState.data.id,         
    product_id: productState.data.id,
    name: productState.data.title,
    main_image_url: productState.data.main_image_url,
    discount_rate: productState.data.discount_rate,
    original_price: productState.data.original_price,
    quantity: productState.quantity,
  }

  // state로 전달
  router.push({
    path: '/payment',
    state: { items: [checkoutItem] }, // 배열 형태로 넘김
  })

  // 새로고침 대비 localStorage에도 저장
  localStorage.setItem('checkoutItems', JSON.stringify([checkoutItem]))
}

// =================================================================
// 상품 데이터 상태 관리 (reactive)
// =================================================================

// reactive 상태 객체들
const productState = reactive({
  data: null,
  loading: true,
  error: null,
  quantity: 1,
})

// 계산된 속성들
const discountedPrice = computed(() => {
  if (!productState.data) return 0
  const original = productState.data.original_price
  const discount = productState.data.discount_rate || 0
  return Math.floor((original * (100 - discount)) / 100)
})

const categoryName = computed(() => {
  return productState.data?.category || '카테고리 없음'
})

// 🆕 총 상품 금액 계산
const totalPrice = computed(() => {
  if (!productState.data) return 0
  return discountedPrice.value * productState.quantity
})

// =================================================================
// 리뷰 슬라이더 상태 관리
// =================================================================

// ✅ 테스트용 이미지 18개 (3슬라이드)
const images = ref([
  'data:image/jpeg;base64,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',
  'https://img.daily.co.kr/@files/www.daily.co.kr/content/food/2020/20200730/40d0fb3794229958bdd1e36520a4440f.jpg',
  'https://cdn.wikifoodie.co.kr/news/photo/202504/1902_5077_3628.jpg',
  'https://dimg.donga.com/wps/NEWS/IMAGE/2024/11/28/130529269.5.jpg',
  'https://wimg.heraldcorp.com/content/default/2017/10/30/20171030000469_0.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP6C1AEqKnKDD-VTxAculivMG3u0nKsbyfw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoyjHFhvtls-4Q9CLAA-Flhfz5ZcP4gtiJjA&s',
  'https://picsum.photos/id/1085/120/120',
  'https://picsum.photos/id/1095/120/120',
  'https://picsum.photos/id/1105/120/120',
  'https://picsum.photos/id/1115/120/120',
  'https://picsum.photos/id/1125/120/120',
  'https://picsum.photos/id/1135/120/120',
  'https://picsum.photos/id/1145/120/120',
  'https://picsum.photos/id/1155/120/120',
  'https://picsum.photos/id/1165/120/120',
  'https://picsum.photos/id/1175/120/120',
  'https://picsum.photos/id/1185/120/120',
])

// ✅ 6개씩 나누기 (한 슬라이드당 6장)
const groupedSlides = computed(() => {
  const perSlide = 6
  const result = []
  for (let i = 0; i < images.value.length; i += perSlide) {
    result.push(images.value.slice(i, i + perSlide))
  }
  return result
})

const currentIndex = ref(0)

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < groupedSlides.value.length - 1) currentIndex.value++
}

// =================================================================
// 상품 데이터 관련 메서드
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
 * 장바구니에 담기 (단순한 방식)
 */
const addToCart = async () => {
  try {
    if (!productState.data) {
      alert('상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    // 버튼 비활성화
    const button = document.getElementById('shopping-cart-push')
    if (button) {
      button.disabled = true
      button.textContent = '담는 중...'
    }

    const response = await cartAPI.addToCart([productState.data.id], productState.quantity)

    if (response.success) {
      showCartModal.value = true // 모달 표시
    } else {
      throw new Error(response.message || '장바구니 담기에 실패했습니다.')
    }
  } catch (error) {
    console.error('장바구니 추가 실패:', error)
  } finally {
    // 버튼 다시 활성화
    const button = document.getElementById('shopping-cart-push')
    if (button) {
      button.disabled = false
      button.textContent = '장바구니 담기'
    }
  }
}

// =================================================================
// 탭 네비게이션 관련 메서드 (CodePen 방식)
// =================================================================

// 1. 네비게이션 메뉴들을 querySelectorAll을 통해 변수에 담는다.
const gnbItems = ref([])
// 2. 섹션들을 전부 querySelectorAll을 통해 변수에 담는다.
const sections = ref([])

const isTabSticky = ref(false)
const originalTabBarTop = ref(0)

const activeTabIndex = ref(0) // 현재 활성화된 탭 인덱스
const sectionOffsets = ref([]) // 각 섹션의 offset 값들

/**
 * 탭 네비게이션 초기화 (기존 코드 + 초기 활성화 추가)
 */
const initTabNavigation = () => {
  // 기존 코드 모두 유지...
  gnbItems.value = document.querySelectorAll('.shopping-product-mid-content-menu-items')

  sections.value = [
    document.querySelector('.required-notation-info'),
    document.querySelector('.shipping-information-container'),
    document.querySelector('.review-section'),
  ].filter((section) => section !== null)

  console.log('섹션 찾기 결과:', sections.value)

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

    // 🆕 초기 로딩 시 첫 번째 탭 강제 활성화
    if (window.scrollY < 100) {
      activeTabIndex.value = 0
      updateActiveTabState(0)
      console.log('초기 로딩: 첫 번째 탭 활성화')
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
 * 현재 스크롤 위치에서 어떤 섹션이 화면에 보이는지 감지 (수정된 버전)
 */
const detectCurrentSection = () => {
  if (sections.value.length === 0) {
    console.log('섹션이 아직 로드되지 않음')
    return
  }

  const headerHeight = 50
  const tabBarHeight = 50
  const scrollY = window.scrollY + headerHeight + tabBarHeight + 100

  console.log('현재 스크롤 위치:', scrollY)

  let currentSection = 0

  // 🆕 페이지 최상단에 있을 때는 무조건 첫 번째 탭
  if (window.scrollY < 200) {
    currentSection = 0
    console.log('페이지 최상단: 첫 번째 탭 활성화')
  } else {
    // 기존 로직
    for (let i = sections.value.length - 1; i >= 0; i--) {
      const section = sections.value[i]
      if (section && scrollY >= section.offsetTop - 150) {
        currentSection = i
        console.log('감지된 섹션:', i, section.className)
        break
      }
    }
  }

  // 활성 탭이 변경되었을 때만 업데이트
  if (activeTabIndex.value !== currentSection) {
    activeTabIndex.value = currentSection
    updateActiveTabState(currentSection)
    console.log('탭 활성화:', currentSection)
  }
}

/**
 * 스크롤 이벤트 핸들러 (기존 메서드 수정)
 */
let scrollTimer = null
const handleScroll = () => {
  if (scrollTimer) clearTimeout(scrollTimer)

  scrollTimer = setTimeout(() => {
    updateStickyState()
    detectCurrentSection() // 🆕 추가된 부분
  }, 10)
}

/**
 * 각 섹션의 offset 값들을 저장
 */
const calculateSectionOffsets = () => {
  sectionOffsets.value = sections.value.map((section) => (section ? section.offsetTop : 0))
}

// =================================================================
// 생명주기 메서드
// =================================================================

onMounted(() => {
  nextTick(() => {
    // 🆕 상품 데이터 먼저 로딩
    loadProduct()

    // 기존 탭 네비게이션 초기화는 그대로 유지
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
  // ⬇️ 수정
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', calculateSectionOffsets)
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
        <img src="/assets/icons/ic-product-in-cart.png" alt="장바구니 담기 성공"/>
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
      <div class="shopping-product-mid-content-menu-items">상품후기 <span>(20,417)</span></div>
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
      <div class="slider-container">
        <button class="nav-button left" @click="prev" :disabled="currentIndex === 0">
          <img src="/public/assets/icons/ic-banner-left.png" alt="left" />
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
          <img src="/public/assets/icons/ic-banner-right.png" alt="오른쪽" />
        </button>
      </div>
    </div>

    <div class="shopping-product-reviews-filter-container">
      <div class="shopping-product-reviews-filter-items">최신순 &nbsp;▼</div>
      <div class="shopping-product-reviews-filter-items">별점순 &nbsp;▼</div>
      <div class="shopping-product-reviews-filter-items">베스트순 &nbsp;▼</div>
    </div>

    <!-- 댓글 컴포넌트 -->
    <div class="shopping-product-reviews-items-container">
      <div class="shopping-product-reviews-items-container-left">아**</div>
      <div class="shopping-product-reviews-items-container-right">
        <h5>한통 양배추</h5>
        <p>찌는 법도 쉽고 맛도 좋아서 이번여름 벌써 두번 시켜먹었네요 또 살 것 같아요</p>
        <span>2025.07.08</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  margin: auto;
  overflow: hidden;
}

.slider-wrapper {
  overflow: hidden;
  width: 100%;
}

.slider {
  display: flex;
  transition: transform 0.4s ease;
}

.slide {
  display: flex;
  justify-content: space-between;
  flex: 0 0 100%;
  gap: 10px;
  padding: 10px;
  margin-top: 60px;
  margin-bottom: 30px;
}

.review-image {
  width: auto;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.nav-button {
  position: absolute;
  top: 56%;
  transform: translateY(-50%);
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 100%;
  padding: 5px 10px;
  font-size: 24px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 1;
}

.nav-button.left {
  left: 0;
}
.nav-button.right {
  right: 0;
}

.nav-button.right,
.nav-button.left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-button.right img,
.nav-button.left img {
  width: 20px;
  height: 20px;
}

.sticky-tab-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 활성 탭 스타일 */
.shopping-product-mid-content-menu-items.active {
  color: #e14345;
  border-bottom: 2px solid #e14345;
  font-weight: 600;
}

/* 탭 호버 효과 */
.shopping-product-mid-content-menu-items {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 50px;
}

.shopping-product-mid-content-menu-items:hover {
  color: #e14345;
}

.required-notation-info {
  margin-top: 60px; /* 헤더 높이만큼 */
}

/* 로딩/에러 상태 스타일 추가 */
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

/* 수량 입력 스타일 개선 */
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
</style>
