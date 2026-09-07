<script setup>
import { computed } from 'vue'
import { getDay, addXP, store } from '../composables/useStore'

const day = computed(() => getDay())

// Ensure wins array exists (backward compat)
if (!day.value.wins) day.value.wins = ['', '', '']

const sliders = [
  { key: 'mood', label: 'Mood', icon: '😊' },
  { key: 'energy', label: 'Energy', icon: '⚡' },
  { key: 'discipline', label: 'Discipline', icon: '🔥' },
]

function moodEmoji(val) {
  if (val <= 2) return '😞'
  if (val <= 4) return '😐'
  if (val <= 6) return '🙂'
  if (val <= 8) return '😄'
  return '🤩'
}

let xpGiven = false
function onReflectionInput() {
  if (!xpGiven && day.value.reflection.length > 10) { addXP(5); xpGiven = true }
}

// Custom tasks summary
const customDone = computed(() => day.value.customTasks?.filter(t => t.done) ?? [])
const customPending = computed(() => day.value.customTasks?.filter(t => !t.done) ?? [])
</script>

<template>
  <div class="p-5">
    <p class="text-gray-400 text-sm uppercase tracking-widest mb-1">Evening Check-in</p>
    <h1 class="text-2xl font-bold text-amber-400 mb-1">How was today?</h1>
    <p class="text-xs text-gray-500 mb-6">Honest reflection rewires the brain toward growth (neuroplasticity research).</p>

    <!-- ── Today's intention recap ── -->
    <div v-if="day.intention" class="mb-6 bg-gray-900 border border-amber-400/20 rounded-2xl p-4">
      <p class="text-xs text-amber-400 uppercase tracking-widest mb-1">Your intention today was</p>
      <p class="text-sm text-gray-300 italic">"{{ day.intention }}"</p>
    </div>

    <!-- ── Custom tasks review ── -->
    <div v-if="day.customTasks?.length" class="mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <p class="text-xs text-gray-400 uppercase tracking-widest mb-3">Your tasks today</p>
      <div class="space-y-2">
        <div v-for="t in day.customTasks" :key="t.id" class="flex items-center gap-2 text-sm">
          <span>{{ t.done ? '✅' : '⬜' }}</span>
          <span :class="t.done ? 'text-amber-300 line-through opacity-60' : 'text-gray-400'">{{ t.text }}</span>
        </div>
      </div>
      <p class="text-xs text-gray-600 mt-3">
        {{ customDone.length }} / {{ day.customTasks.length }} completed
        <span v-if="customPending.length"> · {{ customPending.length }} left for tomorrow</span>
      </p>
    </div>

    <!-- ── Mood sliders ── -->
    <div class="space-y-6 mb-8">
      <div v-for="s in sliders" :key="s.key">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">{{ s.icon }} {{ s.label }}</span>
          <span class="text-amber-400 font-bold text-lg">
            {{ day[s.key] || 0 }}{{ s.key === 'mood' ? ' ' + moodEmoji(day[s.key]) : '' }}
          </span>
        </div>
        <input
          type="range" min="1" max="10" step="1"
          v-model.number="day[s.key]"
          class="w-full accent-amber-400"
        />
        <div class="flex justify-between text-xs text-gray-600 mt-1">
          <span>1 — Low</span><span>10 — High</span>
        </div>
      </div>
    </div>

    <!-- ── 3 Wins (Seligman positive psychology — raises wellbeing scores) ── -->
    <div class="mb-6">
      <label class="block font-medium mb-1">🏆 3 Wins Today</label>
      <p class="text-xs text-gray-500 mb-3">
        Writing 3 specific wins daily increases happiness scores by 2–5% per week (Seligman, Positive Psychology).
      </p>
      <div class="space-y-2">
        <input
          v-for="(_, i) in day.wins" :key="i"
          v-model="day.wins[i]"
          type="text"
          :placeholder="`Win ${i + 1}...`"
          maxlength="100"
          class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400"
        />
      </div>
    </div>

    <!-- ── Reflection ── -->
    <div class="mb-6">
      <label class="block font-medium mb-1">📝 Reflection</label>
      <p class="text-xs text-gray-500 mb-3">One honest sentence is enough. Journaling reduces cortisol and improves clarity.</p>
      <textarea
        v-model="day.reflection"
        @input="onReflectionInput"
        rows="4"
        placeholder="What did today teach me?"
        class="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-amber-400 text-sm"
      />
    </div>

    <p class="text-center text-gray-600 text-xs italic">"You don't have to be perfect. You just have to keep going."</p>
  </div>
</template>
