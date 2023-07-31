import { createRouter, createWebHistory } from 'vue-router'
import ApartmentView from '@/views/ApartmentView.vue'
import BuildingView from '@/views/BuildingView.vue'
import HomeView from '@/views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'

// Route-level code-splitting has not been used here, because the app is fairly
// small and self contained. If the app grows, consider using something like:
//      component: () => import('../views/BuildingView.vue')
// which will generate a chunk like assets/BuildingView.[hash].js, lazy-loaded
// when the route is visited.

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: ApartmentView,
      meta: { title: 'Apartment' },
      name: 'apartment',
      path: '/apartment',
    },
    {
      component: BuildingView,
      meta: { title: 'Building' },
      name: 'building',
      path: '/building',
    },
    {
      component: HomeView,
      meta: { title: 'Cluster Viewer' },
      name: 'home',
      path: '/',
    },
    {
      component: NotFound,
      meta: { title: 'Not Found' },
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  // @ts-ignore
  if (typeof document === 'object') document.title = to.meta.title
  next()
})

export default router
