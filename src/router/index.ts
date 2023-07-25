import { createRouter, createWebHistory } from 'vue-router'
import ApartmentView from '../views/ApartmentView.vue'
import BuildingView from '../views/BuildingView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/apartment',
      name: 'apartment',
      component: ApartmentView,
    },
    {
      path: '/building',
      name: 'building',
      component: BuildingView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ]
})

export default router
