<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDay, dayNumber, addXP, store, levelInfo } from '../composables/useStore'

const router = useRouter()

const day = computed(() => getDay())

// ── Research-backed "why" for each area (Self-Determination Theory) ──────────
const areas = [
  {
    key: 'faith', icon: '🙏', label: 'Faith',
    why: 'Spiritual practice reduces anxiety and increases resilience (APA, 2023).',
    tasks: ['Pray', 'Bible reading', 'Gratitude'],
  },
  {
    key: 'mind', icon: '🧠', label: 'Mind',
    why: 'Daily learning builds cognitive reserve and long-term confidence (Dweck, Growth Mindset).',
    tasks: ['Read / study', 'Journaled thoughts', 'Learned something new'],
  },
  {
    key: 'body', icon: '💪', label: 'Body',
    why: 'Exercise is the single most evidence-backed mood booster — equal to antidepressants in mild cases (Harvard Medical School).',
    tasks: ['Exercise', 'Drank enough water', 'Slept well'],
  },
  {
    key: 'purpose', icon: '🎯', label: 'Purpose',
    why: 'People with clear goals are 42% more likely to achieve them when written down (Dominican University study).',
    tasks: ['Worked on my goal', 'Avoided distraction', 'Planned tomorrow'],
  },
  {
    key: 'relationships', icon: '❤️', label: 'Relationships',
    why: 'The Harvard Study of Adult Development (80 yrs) found relationships are the #1 predictor of happiness and health.',
    tasks: ['Reached out to someone', 'Was kind today', 'Quality time'],
  },
  {
    key: 'discipline', icon: '🔥', label: 'Discipline',
    why: 'Self-control is a skill, not a trait — it strengthens with daily practice (Baumeister, Willpower research).',
    tasks: ['Kept my main promise', 'Controlled scrolling', 'Finished something I postponed'],
  },
  {
    key: 'happiness', icon: '😊', label: 'Happiness',
    why: 'Positive emotions broaden thinking and build lasting resources — joy is a practice, not a destination (Fredrickson, Broaden-and-Build theory).',
    tasks: ['Did something I enjoy', 'Smiled / laughed', 'Felt present'],
  },
]

// ── Toggle built-in task ─────────────────────────────────────────────────────
function toggle(key) {
  const prev = day.value.checks[key]
  day.value.checks[key] = !prev
  if (!prev) addXP(10)
  else store.xp = Math.max(0, store.xp - 10)
}

// ── Toggle custom task ───────────────────────────────────────────────────────
function toggleCustom(task) {
  task.done = !task.done
  if (task.done) addXP(10)
  else store.xp = Math.max(0, store.xp - 10)
}

// ── Add custom task ──────────────────────────────────────────────────────────
const newTaskText = ref('')

function addTask() {
  const text = newTaskText.value.trim()
  if (!text) return
  day.value.customTasks.push({ id: Date.now(), text, done: false })
  newTaskText.value = ''
}

function removeCustomTask(id) {
  const idx = day.value.customTasks.findIndex(t => t.id === id)
  if (idx !== -1) {
    if (day.value.customTasks[idx].done) store.xp = Math.max(0, store.xp - 10)
    day.value.customTasks.splice(idx, 1)
  }
}

// ── Progress ─────────────────────────────────────────────────────────────────
const builtInChecks = computed(() =>
  areas.reduce((s, a) => s + a.tasks.filter(t => day.value.checks[`${a.key}_${t}`]).length, 0)
)
const builtInTotal = computed(() => areas.reduce((s, a) => s + a.tasks.length, 0))
const customDone = computed(() => day.value.customTasks.filter(t => t.done).length)
const totalChecks = computed(() => builtInChecks.value + customDone.value)
const totalTasks = computed(() => builtInTotal.value + day.value.customTasks.length)

// ── Expanded why panels ───────────────────────────────────────────────────────
const openWhy = ref(null)
function toggleWhy(key) { openWhy.value = openWhy.value === key ? null : key }

// ── Greeting ─────────────────────────────────────────────────────────────────
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
</script>

<template>
  <div class="p-5">

    <!-- ── Header ── -->
    <div class="mb-6">
      <p class="text-gray-400 text-sm">{{ greeting }}, {{ store.name }} 👋</p>
      <h1 class="text-3xl font-bold text-amber-400">Day {{ dayNumber() }} / 30</h1>
      <div class="flex items-center gap-3 mt-1">
        <span class="text-sm text-gray-400">⚡ {{ store.xp }} XP</span>
        <span class="text-sm text-amber-300">{{ levelInfo() }}</span>
      </div>
      <div class="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-amber-400 rounded-full transition-all duration-500"
          :style="{ width: totalTasks ? (totalChecks / totalTasks * 100) + '%' : '0%' }"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ totalChecks }} / {{ totalTasks }} tasks complete</p>
    </div>

    <!-- ── To Do ── -->
    <div class="mb-7 bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <h2 class="text-base font-bold text-white mb-3">📋 To Do</h2>

      <!-- Task list -->
      <div v-if="day.customTasks.length" class="space-y-2 mb-3">
        <div
          v-for="task in day.customTasks" :key="task.id"
          class="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0"
        >
          <button @click="toggleCustom(task)" class="text-xl shrink-0">
            {{ task.done ? '✅' : '⬜' }}
          </button>
          <span class="flex-1 text-sm" :class="task.done ? 'line-through text-gray-600' : 'text-gray-200'">
            {{ task.text }}
          </span>
          <button @click="removeCustomTask(task.id)" class="text-gray-700 hover:text-red-400 transition-colors text-lg shrink-0 leading-none">
            ✕
          </button>
        </div>
      </div>

      <!-- Inline add input -->
      <div class="flex gap-2">
        <input
          v-model="newTaskText"
          @keyup.enter="addTask"
          type="text"
          placeholder="Add a task..."
          maxlength="80"
          class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400"
        />
        <button
          @click="addTask"
          :disabled="!newTaskText.trim()"
          class="px-4 py-2.5 rounded-xl bg-amber-400 text-gray-950 font-bold text-sm disabled:opacity-30 hover:bg-amber-300 transition-all"
        >
          Add
        </button>
      </div>
    </div>

    <!-- ── Quick actions ── -->
    <div class="flex gap-2 mb-7">
      <button
        @click="router.push('/struggling')"
        class="flex-1 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400 hover:border-red-400/40 hover:text-red-400 transition-all"
      >
        🆘 Struggling
      </button>
      <button
        @click="router.push('/breathing')"
        class="flex-1 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400 hover:border-blue-400/40 hover:text-blue-400 transition-all"
      >
        💨 Breathe
      </button>
    </div>

    <!-- ── Morning Intention ── -->
    <div class="mb-7 bg-gray-900 border border-amber-400/20 rounded-2xl p-4">
      <p class="text-xs text-amber-400 uppercase tracking-widest mb-2">🌅 Morning Intention</p>
      <p class="text-xs text-gray-500 mb-3">
        Research shows writing a specific intention ("I will do X at Y time") increases follow-through by up to 3×.
      </p>
      <input
        v-model="day.intention"
        type="text"
        placeholder="Today I will focus on..."
        maxlength="120"
        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400"
      />
    </div>

    <!-- ── Built-in Areas ── -->
    <h2 class="text-lg font-bold text-white mb-4">🗂️ Daily Areas</h2>
    <div v-for="area in areas" :key="area.key" class="mb-5">

      <!-- Area header -->
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-base font-semibold">{{ area.icon }} {{ area.label }}</h3>
        <button
          @click="toggleWhy(area.key)"
          class="text-xs text-gray-500 hover:text-amber-400 transition-colors px-2 py-1 rounded-lg border border-gray-800 hover:border-amber-400/30"
        >
          {{ openWhy === area.key ? 'Hide' : 'Why?' }}
        </button>
      </div>

      <!-- Why panel -->
      <div
        v-if="openWhy === area.key"
        class="mb-3 bg-gray-900 border-l-2 border-amber-400 rounded-r-xl px-4 py-3 text-xs text-gray-400 leading-relaxed"
      >
        💡 {{ area.why }}
      </div>

      <!-- Tasks -->
      <div class="space-y-2">
        <button
          v-for="task in area.tasks" :key="task"
          @click="toggle(`${area.key}_${task}`)"
          class="w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
          :class="day.checks[`${area.key}_${task}`]
            ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
            : 'bg-gray-900 border-gray-800 text-gray-300'"
        >
          <span class="text-lg shrink-0">{{ day.checks[`${area.key}_${task}`] ? '✅' : '⬜' }}</span>
          <span class="text-sm">{{ task }}</span>
          <span class="ml-auto text-xs text-gray-600">+10 XP</span>
        </button>
      </div>
    </div>

  </div>
</template>
