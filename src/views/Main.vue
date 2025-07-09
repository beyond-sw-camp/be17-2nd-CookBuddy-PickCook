<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeBanner from '@/components/HomeBanner.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import api from '@/api/main'
import HomeCommunityCard from '@/components/HomeCommunityCard.vue'

const state = reactive({
  recipes: [],
  communities: [],
})

const getHomeData = async () => {
  const [recipeData, communityData] = await Promise.all([api.recipeList(), api.communityList()])

  if (recipeData?.success && recipeData.results) {
    state.recipes.push(...recipeData.results)
  }

  if (communityData?.success && communityData.results) {
    state.communities.push(...communityData.results)
  }
}

onMounted(() => {
  getHomeData()
})
</script>

<template>
  <!-- 배너 섹션 -->
  <HomeBanner />

  <!-- 레시피 추천 섹션 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🍳 냉장고 재료로 만들 수 있는 레시피</h2>
      <RouterLink to="/recipe" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <RecipeCard
        v-for="(item, idx) in Array.isArray(state.recipes) ? state.recipes.slice(0, 4) : []"
        :key="idx"
        :recipe="item"
      />
    </div>
  </div>

  <!-- 커뮤니티 추천 섹션 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">👥 실시간 인기 커뮤니티</h2>
      <RouterLink to="/community" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <HomeCommunityCard
        v-for="(item, idx) in state.communities.slice(0, 4)"
        :key="idx"
        :community="item"
      />
    </div>
  </div>

  <!-- 식재료 판매 추천 섹션 1 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🛒 신선 식재료 특가</h2>
      <a href="/shopping.html" class="section-more">더보기 ></a>
    </div>
    <div class="content-grid">
      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://semie.cooking/image/contents/wn/cv/solcqifp/149437687iajp.jpg"
            alt="유기농채소"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">[오늘특가] 유기농 채소 모음전</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>

      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://hanwooeats.com/web/product/big/202309/ada3197cfe28224be20528f73aca6bb9.jpg"
            alt="한우"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">프리미엄 한우 정육 세트</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>

      <div class="ingredients-card content-card">
        <div class="card-image">
          <img src="https://img.siksinhot.com/place/1631603394086170.jpg?c=Y" alt="해산물" />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">산지직송 해산물 모듬</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>

      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://ecimg.cafe24img.com/pg1293b82084384039/allfresh777/web/product/medium/20250624/73fd1337dc3cb390836738cd565a4ee1.png"
            alt="과일"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">제철 과일 선물세트</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 식재료 판매 추천 섹션 2 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🥘 밀키트 & 간편식</h2>
      <a href="shopping.html" class="section-more">더보기 ></a>
    </div>
    <div class="content-grid">
      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://www.foodbank.co.kr/news/photo/202201/62407_19908_1226.jpg"
            alt="부대찌개"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">2인분 부대찌개 밀키트</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>

      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://cdn-dantats.stunning.kr/prod/portfolios/c66aaf60-74e0-4814-b552-cd3020d43afd/covers/order_sub_2865765_1_211012212956.png.small?s=800x800&t=crop&q=80&f=webp"
            alt="한식 밀키트"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">한식키트 2종 (떡볶이 & 부대찌개)</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>

      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://newsimg.hankookilbo.com/cms/articlerelease/2021/07/31/f24809e6-ed0d-486e-a3cf-2cf42c103c56.jpg"
            alt="곰탕"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">곰탕 밀키트 1인분</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>

      <div class="ingredients-card content-card">
        <div class="card-image">
          <img
            src="https://halicrty8541.edge.naverncp.com/data/mall_data/images/product/00/00/00/21/33/m_0000002133.gif"
            alt="닭갈비"
          />
        </div>
        <div class="card-content">
          <div class="ingredients-title-container">
            <h3 class="card-title">닭갈비 2종 택 1</h3>
            <img
              class="shopping-cart-js"
              src="/assets/icons/ic-empty-shopping-cart.png"
              alt="장바구니"
            />
          </div>
          <div class="card-price">
            <span class="card-discount">30%</span>
            <span>15,900원</span>
            <div class="card-original-price">22,900원</div>
          </div>
          <div class="ingredients-stats card-stats">
            <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.8</span>
            <span><img src="/assets/icons/ic-review.png" alt="리뷰" />1,234</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
