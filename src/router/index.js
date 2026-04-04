import { createRouter, createWebHistory } from 'vue-router'
import NavHomeView from '../views/NavHomeView.vue'
import TestView from '../views/TestView.vue'

const FALLBACK_SITE_TITLE = 'HZ路标'

function getSiteTitle() {
  try {
    return localStorage.getItem('site_title') || FALLBACK_SITE_TITLE
  } catch {
    return FALLBACK_SITE_TITLE
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NavHomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: {
        title: '管理后台',
        requiresAuth: true,
      },
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: {
        title: '环境变量测试',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const siteTitle = getSiteTitle()

  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${siteTitle}`
  } else {
    document.title = siteTitle
  }

  next()
})

export default router
