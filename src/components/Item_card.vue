<script setup>
//props 정의
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})
</script>

<template>
<router-link :to="`/shopping/detail/${product.id}`">
    <div class="content-card">
        <div class="card-image">
            <img :src="product.image" :alt="product.title">
        </div>
        <div class="card-content">
            <h3 class="card-title">{{product.title}}</h3>
            <div class="card-price">
                <span class="card-discount">{{product.discount}}%</span>
                <span>{{product.price}}</span>
            </div>
            <div class="card-original-price">{{product.originalPrice}}</div>
            <div class="card-stats">
                <span>⭐ {{product.rating}}</span>
                <span>리뷰 {{product.reviewCount}}</span>
            </div>
        </div>
    </div>
</router-link>
</template>

<style scoped>

</style>