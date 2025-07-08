import './assets/main.css'
import './assets/community.css'
import './assets/community_detail.css'
import './assets/find-id.css'
import './assets/find-password.css'
import './assets/header.css'
import './assets/login.css'
import './assets/mypage.css'
import './assets/recipe.css'
import './assets/refrigerator.css'
import './assets/shopping_detail.css'
import './assets/signup.css'
import './assets/style_optimized.css'
import './assets/variables.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
