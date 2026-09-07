<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../composables/useStore'

const router = useRouter()
const step = ref(0)
const name = ref('')
const goal = ref('')
const why = ref('')

const goals = [
  { key: 'discipline', icon: '🔥', label: 'Build discipline' },
  { key: 'confidence', icon: '💪', label: 'Grow confidence' },
  { key: 'peace', icon: '🕊️', label: 'Find inner peace' },
  { key: 'purpose', icon: '🎯', label: 'Discover my purpose' },
  { key: 'relationships', icon: '❤️', label: 'Improve relationships' },
  { key: 'faith', icon: '🙏', label: 'Deepen my faith' },
]

function finish() {
  store.name = name.value.trim() || 'Friend'
  store.mainGoal = goal.value
  store.onboarded = true
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">

    <!-- Step 0: Welcome -->
    <div v-if="step === 0" class="w-full max-w-sm text-center">
      <p class="text-6xl mb-6">🌅</p>
      <h1 class="text-3xl font-bold text-amber-400 mb-3">New Chapter</h1>
      <p class="text-gray-400 mb-2 leading-relaxed">
        This isn't another motivational app.
      </p>
      <p class="text-gray-300 mb-8 leading-relaxed">
        It's a daily system for becoming the person you actually want to be — one honest day at a time.
      </p>
      <button @click="step = 1" class="w-full py-4 rounded-2xl bg-amber-400 text-gray-950 font-bold text-lg hover:bg-amber-300 transition-all">
        I'm ready to start
      </button>
    </div>

    <!-- Step 1: Name -->
    <div v-else-if="step === 1" class="w-full max-w-sm">
      <p class="text-gray-400 text-sm mb-2">Step 1 of 3</p>
      <h2 class="text-2xl font-bold mb-2">What's your name?</h2>
      <p class="text-gray-500 text-sm mb-6">This app is personal. It should feel like it knows you.</p>
      <input
        v-model="name"
        type="text"
        placeholder="Your first name..."
        maxlength="30"
        autofocus
        class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400 mb-6"
      />
      <button
        @click="step = 2"
        :disabled="!name.trim()"
        class="w-full py-4 rounded-2xl bg-amber-400 text-gray-950 font-bold disabled:opacity-30 hover:bg-amber-300 transition-all"
      >
        Continue →
      </button>
    </div>

    <!-- Step 2: Main goal -->
    <div v-else-if="step === 2" class="w-full max-w-sm">
      <p class="text-gray-400 text-sm mb-2">Step 2 of 3</p>
      <h2 class="text-2xl font-bold mb-2">What do you want most?</h2>
      <p class="text-gray-500 text-sm mb-6">
        Pick the one thing you want to work on most right now. You can work on everything — but having a focus changes how you show up.
      </p>
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
          v-for="g in goals" :key="g.key"
          @click="goal = g.key"
          class="p-4 rounded-2xl border text-left transition-all"
          :class="goal === g.key
            ? 'bg-amber-400/15 border-amber-400 text-amber-300'
            : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-600'"
        >
          <span class="text-2xl block mb-1">{{ g.icon }}</span>
          <span class="text-sm font-medium">{{ g.label }}</span>
        </button>
      </div>
      <button
        @click="step = 3"
        :disabled="!goal"
        class="w-full py-4 rounded-2xl bg-amber-400 text-gray-950 font-bold disabled:opacity-30 hover:bg-amber-300 transition-all"
      >
        Continue →
      </button>
    </div>

    <!-- Step 3: Why -->
    <div v-else-if="step === 3" class="w-full max-w-sm">
      <p class="text-gray-400 text-sm mb-2">Step 3 of 3</p>
      <h2 class="text-2xl font-bold mb-2">Why does this matter to you?</h2>
      <p class="text-gray-500 text-sm mb-6">
        Research shows people who know their "why" are 3× more likely to follow through. Write one honest sentence — even if it's messy.
      </p>
      <textarea
        v-model="why"
        rows="4"
        placeholder="I want to change because..."
        maxlength="200"
        class="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-amber-400 mb-6 text-sm leading-relaxed"
      />
      <button
        @click="finish"
        :disabled="!why.trim()"
        class="w-full py-4 rounded-2xl bg-amber-400 text-gray-950 font-bold text-lg disabled:opacity-30 hover:bg-amber-300 transition-all"
      >
        Start my New Chapter 🌅
      </button>
    </div>

  </div>
</template>
