import api from '@/plugins/axiosinterceptor'

const getBanners = async () => {
    try {
        const response = await api.get('/api/banners.json')
        return response.data
    } catch (error) {
        console.error('베너 로딩 실패:', error)
        throw error
    }
}

export default {
    getBanners
}