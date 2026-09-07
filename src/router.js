import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from './composables/useStore'
import OnboardingView from './views/OnboardingView.vue'
import TodayView from './views/TodayView.vue'
import JournalView from './views/JournalView.vue'
import ProgressView from './views/ProgressView.vue'
import StrugglingView from './views/StrugglingView.vue'
import ProgramView from './views/ProgramView.vue'
import BreathingView from './views/BreathingView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/onboarding', component: OnboardingView },
    { path: '/', component: TodayView },
    { path: '/journal', component: JournalView },
    { path: '/progress', component: ProgressView },
    { path: '/struggling', component: StrugglingView },
    { path: '/program', component: ProgramView },
    { path: '/breathing', component: BreathingView },
  ],
})

router.beforeEach((to) => {
  if (!store.onboarded && to.path !== '/onboarding') return '/onboarding'
})

export default router
