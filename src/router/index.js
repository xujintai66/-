import { createRouter, createWebHistory } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/indexPage.vue') },
    { path: '/login', component: () => import('@/views/loginPage.vue') },
    { path: '/teacher', component: () => import('@/views/teacherPage.vue') },
    { path: '/fact', component: () => import('@/views/factInfoPage.vue') },
  ],
})
router.beforeEach((to, from, next) => {
  const counterStore = useCounterStore()
  // 判断用户是否已经登录
  const isLoggedIn = counterStore.count

  if (!isLoggedIn && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
  //防止学生账号访问老师的页面
  if (isLoggedIn != 2 && to.path === '/teacher') {
    next('/login')
  }
})
export default router
