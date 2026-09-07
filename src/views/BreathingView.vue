<script setup>
import { ref, computed, onUnmounted } from 'vue'

// Box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold (Navy SEALs / clinical anxiety research)
// 4-7-8 breathing also included as option (Dr. Andrew Weil)
const modes = [
  { key: 'box', label: 'Box Breathing', desc: 'Reduces stress & resets nervous system (used by Navy SEALs)', phases: [
    { label: 'Breathe in', duration: 4 },
    { label: 'Hold', duration: 4 },
    { label: 'Breathe out', duration: 4 },
    { label: 'Hold', duration: 4 },
  ]},
  { key: '478', label: '4-7-8 Breathing', desc: 'Activates parasympathetic system — calms anxiety fast (Dr. Andrew Weil)', phases: [
    { label: 'Breathe in', duration: 4 },
    { label: 'Hold', duration: 7 },
    { label: 'Breathe out', duration: 8 },
  ]},
  { key: 'calm', label: 'Calm Breathing', desc: 'Simple slow breathing — lowers heart rate within 2 minutes', phases: [
    { label: 'Breathe in', duration: 5 },
    { label: 'Breathe out', duration: 5 },
  ]},
]

const selectedMode = ref(modes[0])
const running = ref(false)
const phaseIdx = ref(0)
const secondsLeft = ref(0)
const cycleCount = ref(0)
let timer = null

const currentPhase = computed(() => selectedMode.value.phases[phaseIdx.value])

const circleScale = computed(() => {
  if (!running.value) return 1
  const label = currentPhase.value.label
  if (label === 'Breathe in') return 1 + (1 - secondsLeft.value / currentPhase.value.duration) * 0.5
  if (label === 'Breathe out') return 1.5 - (1 - secondsLeft.value / currentPhase.value.duration) * 0.5
  return phaseIdx.value === 1 ? 1.5 : 1
})

function start() {
  running.value = true
  phaseIdx.value = 0
  cycleCount.value = 0
  secondsLeft.value = selectedMode.value.phases[0].duration
  tick()
}

function tick() {
  timer = setInterval(() => {
    secondsLeft.value--
    if (secondsLeft.value <= 0) {
      const phases = selectedMode.value.phases
      phaseIdx.value = (phaseIdx.value + 1) % phases.length
      if (phaseIdx.value === 0) cycleCount.value++
      secondsLeft.value = phases[phaseIdx.value].duration
    }
  }, 1000)
}

function stop() {
  clearInterval(timer)
  running.value = false
  phaseIdx.value = 0
  secondsLeft.value = 0
}

function selectMode(m) {
  if (running.value) stop()
  selectedMode.value = m
}

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="p-5">
    <p class="text-gray-400 text-sm uppercase tracking-widest mb-1">Breathe</p>
    <h1 class="text-2xl font-bold text-white mb-1">Breathing Exercise</h1>
    <p class="text-xs text-gray-500 mb-6">Controlled breathing activates your parasympathetic nervous system — it physically calms your body within minutes.</p>

    <!-- Mode selector -->
    <div class="space-y-2 mb-8">
      <button
        v-for="m in modes" :key="m.key"
        @click="selectMode(m)"
        class="w-full text-left p-4 rounded-2xl border transition-all"
        :class="selectedMode.key === m.key
          ? 'bg-blue-500/10 border-blue-400/50 text-blue-300'
          : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'"
      >
        <p class="font-semibold text-sm">{{ m.label }}</p>
        <p class="text-xs opacity-70 mt-0.5">{{ m.desc }}</p>
      </button>
    </div>

    <!-- Breathing visual -->
    <div class="flex flex-col items-center mb-8">
      <div class="relative flex items-center justify-center mb-6" style="width:200px;height:200px">
        <!-- Outer ring -->
        <div
          class="absolute rounded-full border-2 border-blue-400/20 transition-all duration-1000"
          style="width:200px;height:200px"
        />
        <!-- Animated circle -->
        <div
          class="rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center transition-all duration-1000"
          :style="{
            width: (80 * circleScale) + 'px',
            height: (80 * circleScale) + 'px',
          }"
        >
          <span class="text-2xl">{{ running ? '🫁' : '💨' }}</span>
        </div>
      </div>

      <!-- Phase label -->
      <div class="text-center mb-2 h-12 flex flex-col items-center justify-center">
        <p v-if="running" class="text-xl font-bold text-blue-300">{{ currentPhase.label }}</p>
        <p v-if="running" class="text-4xl font-bold text-white">{{ secondsLeft }}</p>
        <p v-else class="text-gray-500 text-sm">Press start when you're ready</p>
      </div>

      <p v-if="running && cycleCount > 0" class="text-xs text-gray-500 mb-4">
        {{ cycleCount }} cycle{{ cycleCount > 1 ? 's' : '' }} complete
      </p>
    </div>

    <!-- Controls -->
    <button
      v-if="!running"
      @click="start"
      class="w-full py-4 rounded-2xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-400 transition-all mb-3"
    >
      Start breathing
    </button>
    <button
      v-else
      @click="stop"
      class="w-full py-4 rounded-2xl border border-gray-700 text-gray-400 hover:border-red-400/50 hover:text-red-400 transition-all"
    >
      Stop
    </button>

    <p class="text-center text-xs text-gray-600 mt-4">
      Even 2–3 minutes makes a measurable difference in anxiety levels.
    </p>
  </div>
</template>
