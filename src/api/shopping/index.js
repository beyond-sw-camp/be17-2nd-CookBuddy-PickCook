import api from '@/plugins/axiosinterceptor'

const getAllProducts = async () => {
    const response = await api.get('/api/allProducts.json')
    return response.data
}


const getProductDetail = async (productId) => {
    const response = await api.get('/api/allProducts.json')
    const product = response.data.find(item => item.id == productId)

    if (!product) {
        throw new Error('상품을 찾을 수 없습니다.')
    }

    return product
}

const shoppingAPI = {
    getAllProducts,
    getProductDetail
}



export default shoppingAPI