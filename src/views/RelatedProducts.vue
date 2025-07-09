<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MiniProductCard from '@/components/MiniProductCard.vue'

const props = defineProps({
  title: String,
  ingredients: Object,
})

const showLeftButton = ref(false)
const showRightButton = ref(false)
const carousel = ref(null)

const products = [
  {
    id: 1,
    name: '양배추',
    price: '5,800원',
    image:
      'https://oasisprodproduct.edge.naverncp.com/83235/detail/1_3bd41c27-77ff-47a2-a207-d41012a70c70.jpg',
  },
  {
    id: 2,
    name: '오이',
    price: '3,200원',
    image:
      'https://cdn.oasis.co.kr:48581/product/55081/thumb/thumb_55081406c06a0-7c8b-4f36-a23a-c750356f50f3.jpg',
  },
  {
    id: 3,
    name: '당근',
    price: '4,000원',
    image: 'https://www.costco.co.kr/medias/sys_master/images/h42/ha3/293335976935454.jpg',
  },
  {
    id: 4,
    name: '단호박',
    price: '6,500원',
    image: 'https://cdn.imweb.me/thumbnail/20210709/bc655da7d2f96.jpg',
  },
  {
    id: 5,
    name: '계란',
    price: '2,900원',
    image: 'https://static.megamart.com/product/image/1163/11634928/11634928_6_960.jpg',
  },
  {
    id: 6,
    name: '소고기 채끝',
    price: '15,900원',
    image:
      'https://img-cf.kurly.com/hdims/resize/%5E%3E720x%3E936/cropcenter/720x936/quality/85/src/shop/data/goods/1598344872969l0.jpg',
  },
  {
    id: 7,
    name: '대파',
    price: '1,500원',
    image:
      'https://cdn.oasis.co.kr:48581/product/55080/thumb/thumb_550800968b645-6d12-4af8-a86e-f387e03efd83.jpg',
  },
  {
    id: 8,
    name: '김치',
    price: '8,800원',
    image:
      'https://cafe24.poxo.com/ec01/gochoochongak/+iUmvvrlGKqOMTmJ/Wak53ziScfIl+GvRgneViecSHqyEfv5ZzGURLm8NAT45ATLl7oxdDsvHDmPHwYWn4376A==/_/web/product/big/202111/4aeab72ac42c4b8c9e48cba7b1bbd754.jpg',
  },
  {
    id: 9,
    name: '두부',
    price: '2,200원',
    image:
      'https://sahubconn001.blob.core.windows.net/ct-sahubconn001/img/newshop/goods/026947/026947_1.jpg',
  },
  {
    id: 10,
    name: '쌀 10kg',
    price: '27,000원',
    image: 'https://www.costco.co.kr/medias/sys_master/images/h1e/h28/16297242722334.jpg',
  },
]

const scrollLeft = () => {
  carousel.value.scrollLeft -= 200
  checkScroll()
}
const scrollRight = () => {
  carousel.value.scrollLeft += 200
  checkScroll()
}
const checkScroll = () => {
  const el = carousel.value
  if (!el) return
  showLeftButton.value = el.scrollLeft > 0
  showRightButton.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

onMounted(() => {
  checkScroll()
  window.addEventListener('resize', checkScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>
<template>
  <section class="related-products">
    <h3>
      <span class="highlight">{{ title }}</span> 관련 상품
    </h3>

    <div class="carousel-wrapper">
      <button class="nav-button left" v-if="showLeftButton" @click="scrollLeft">‹</button>

      <div class="product-carousel" ref="carousel" @scroll="checkScroll">
        <MiniProductCard
          v-for="product in products"
          :key="product.id"
          :name="product.name"
          :price="product.price"
          :image="product.image"
        />
      </div>

      <button class="nav-button right" v-if="showRightButton" @click="scrollRight">›</button>
    </div>
  </section>
</template>

<style scoped>
.related-products {
  margin-bottom: 40px;
}
.related-products h3 .highlight {
  color: var(--color-primary);
  font-weight: bold;
}
.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.product-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;
  width: 100%;
}
.product-carousel::-webkit-scrollbar {
  display: none;
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.nav-button.left {
  left: -18px;
}
.nav-button.right {
  right: -18px;
}
</style>
