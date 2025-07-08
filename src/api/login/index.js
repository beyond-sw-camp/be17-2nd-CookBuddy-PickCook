import api from '@/plugins/axiosinterceptor'

const getUsers = async () => {
    try {
        // const response = await api.get('http://192.168.88.100/api/users.json')
        const response = await api.get('/api/users.json')
        return response.data
    } catch (error) {
        console.error('사용자 목록 조회 실패:', error)
        throw error
    }
}

const login = async (email, password) => {
    try {
        const users = await getUsers()

        // 이메일이 존재하는지 먼저 확인
        const emailExists = users.find(u => u.email === email)

        if (!emailExists) {
            // 이메일이 등록되지 않은 경우
            return { success: false, type: 'email_not_found', message: '등록되지 않은 이메일입니다.' }
        }

        // 이메일은 있는데 비밀번호가 틀린 경우
        const user = users.find(u => u.email === email && u.password === password)

        if (user) {
            return { success: true, user }
        } else {
            return { success: false, type: 'wrong_password', message: '비밀번호가 올바르지 않습니다.' }
        }
    } catch (error) {
        console.error('로그인 요청 실패:', error)
        throw error
    }
}

export default { getUsers, login }