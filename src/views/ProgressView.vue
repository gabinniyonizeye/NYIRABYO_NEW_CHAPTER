<script setup>
import { computed } from 'vue'
import { store, consistencyFor, dayNumber, levelInfo, completedWeeks, generateWeeklyReport, downloadWeeklyReport } from '../composables/useStore'

const areas = [
  { key: 'faith', icon: '🙏', label: 'Faith' },
  { key: 'mind', icon: '🧠', label: 'Mind' },
  { key: 'body', icon: '💪', label: 'Body' },
  { key: 'purpose', icon: '🎯', label: 'Purpose' },
  { key: 'relationships', icon: '❤️', label: 'Relationships' },
  { key: 'discipline', icon: '🔥', label: 'Discipline' },
  { key: 'happiness', icon: '😊', label: 'Happiness' },
]

const stats = computed(() =>
  areas.map(a => ({ ...a, pct: consistencyFor(a.key) }))
    .sort((a, b) => b.pct - a.pct)
)

const avgMood = computed(() => {
  const days = Object.values(store.days).filter(d => d.mood > 0)
  if (!days.length) return 0
  return (days.reduce((s, d) => s + d.mood, 0) / days.length).toFixed(1)
})

const totalDays = computed(() => Object.keys(store.days).length)

// Custom task completion rate across all days
const customRate = computed(() => {
  const allDays = Object.values(store.days)
  const daysWithCustom = allDays.filter(d => d.customTasks?.length)
  if (!daysWithCustom.length) return null
  const total = daysWithCustom.reduce((s, d) => s + d.customTasks.length, 0)
  const done = daysWithCustom.reduce((s, d) => s + d.customTasks.filter(t => t.done).length, 0)
  return Math.round((done / total) * 100)
})

// Streak: consecutive days with at least 1 check
const streak = computed(() => {
  let count = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const day = store.days[key]
    if (day && (Object.values(day.checks).some(Boolean) || day.customTasks?.some(t => t.done))) count++
    else break
  }
  return count
})

const completedWeeksList = computed(() => {
  const count = completedWeeks()
  return Array.from({ length: count }, (_, i) => i + 1)
})

const weekTitles = ['Know Yourself', 'Self-Respect', 'Confidence & Connection', 'Purpose']
const weekIcons = ['🔍', '🛡️', '🤝', '🎯']

function weekSummary(weekNum) {
  const r = generateWeeklyReport(weekNum)
  return {
    daysLogged: r.weekDays.length,
    avgMood: r.avgMood,
    strongest: r.strongest,
    weakest: r.weakest,
  }
}

function barColor(pct) {
  if (pct >= 80) return 'bg-green-400'
  if (pct >= 50) return 'bg-amber-400'
  return 'bg-red-400'
}
</script>

<template>
  <div class="p-5">
    <p class="text-gray-400 text-sm uppercase tracking-widest mb-1">Your Progress</p>
    <h1 class="text-2xl font-bold text-amber-400 mb-1">Day {{ dayNumber() }} / 30</h1>
    <p class="text-gray-400 text-sm mb-6">{{ levelInfo() }} · ⚡ {{ store.xp }} XP</p>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 gap-3 mb-8">
      <div class="bg-gray-900 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-amber-400">{{ totalDays }}</p>
        <p class="text-xs text-gray-400 mt-1">Days tracked</p>
      </div>
      <div class="bg-gray-900 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-amber-400">{{ avgMood }}</p>
        <p class="text-xs text-gray-400 mt-1">Avg mood</p>
      </div>
      <div class="bg-gray-900 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-amber-400">🔥 {{ streak }}</p>
        <p class="text-xs text-gray-400 mt-1">Day streak</p>
      </div>
      <div class="bg-gray-900 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold" :class="customRate !== null ? 'text-amber-400' : 'text-gray-700'">
          {{ customRate !== null ? customRate + '%' : '—' }}
        </p>
        <p class="text-xs text-gray-400 mt-1">My tasks done</p>
      </div>
    </div>

    <!-- Consistency bars -->
    <h2 class="font-semibold text-gray-300 mb-4">Consistency by area</h2>
    <div class="space-y-4">
      <div v-for="s in stats" :key="s.key">
        <div class="flex justify-between text-sm mb-1">
          <span>{{ s.icon }} {{ s.label }}</span>
          <span class="font-bold" :class="s.pct >= 80 ? 'text-green-400' : s.pct >= 50 ? 'text-amber-400' : 'text-red-400'">
            {{ s.pct }}%
          </span>
        </div>
        <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="barColor(s.pct)"
            :style="{ width: s.pct + '%' }"
          />
        </div>
      </div>
    </div>

    <p v-if="!totalDays" class="text-center text-gray-600 mt-10 text-sm">
      Complete your first day to see progress here.
    </p>

    <!-- ── Weekly Reports ── -->
    <div class="mt-10">
      <h2 class="font-semibold text-gray-300 mb-1">📥 Weekly Reports</h2>
      <p class="text-xs text-gray-600 mb-4">Available once a full week is complete. Download as a .txt file.</p>

      <div v-if="completedWeeksList.length" class="space-y-3">
        <div
          v-for="w in completedWeeksList" :key="w"
          class="bg-gray-900 border border-gray-800 rounded-2xl p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <p class="font-semibold text-sm text-white">
                {{ weekIcons[w - 1] }} Week {{ w }} — {{ weekTitles[w - 1] }}
              </p>
              <div class="flex gap-4 mt-2 text-xs text-gray-500">
                <span>📅 {{ weekSummary(w).daysLogged }}/7 days</span>
                <span>😊 Mood {{ weekSummary(w).avgMood }}/10</span>
              </div>
              <div class="flex gap-3 mt-1 text-xs">
                <span class="text-green-400">⭐ {{ weekSummary(w).strongest?.label }}</span>
                <span class="text-red-400">⚠️ {{ weekSummary(w).weakest?.label }}</span>
              </div>
            </div>
            <button
              @click="downloadWeeklyReport(w)"
              class="shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-all"
            >
              <span class="text-xl">⬇️</span>
              <span class="text-xs font-semibold">Download</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 border border-dashed border-gray-800 rounded-2xl">
        <p class="text-gray-600 text-sm">Complete your first 7 days</p>
        <p class="text-gray-700 text-xs mt-1">to unlock your Week 1 report.</p>
      </div>
    </div>

  </div>
</template>
