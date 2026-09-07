<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const nav = [
  { to: '/', icon: '☀️', label: 'Today' },
  { to: '/journal', icon: '📓', label: 'Journal' },
  { to: '/progress', icon: '📈', label: 'Progress' },
  { to: '/program', icon: '🗓️', label: 'Program' },
  { to: '/struggling', icon: '🆘', label: 'Help' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col max-w-md mx-auto">
    <main class="flex-1 overflow-y-auto" :class="route.path !== '/onboarding' ? 'pb-20' : ''">
      <router-view />
    </main>

    <nav
      v-if="route.path !== '/onboarding'"
      class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900 border-t border-gray-800 flex"
    >
      <router-link
        v-for="n in nav" :key="n.to" :to="n.to"
        class="flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors"
        :class="route.path === n.to
          ? (n.to === '/struggling' ? 'text-red-400' : 'text-amber-400')
          : 'text-gray-500'"
      >
        <span class="text-xl">{{ n.icon }}</span>
        {{ n.label }}
      </router-link>
    </nav>
  </div>
</template>
