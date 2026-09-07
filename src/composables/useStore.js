import { reactive, watch } from 'vue'

const KEY = 'nc_data'

const defaults = {
  onboarded: false,
  name: '',
  mainGoal: '',
  startDate: new Date().toISOString().slice(0, 10),
  days: {},
  xp: 0,
  programAnswers: {}, // { 'day_1': 'user answer text' }
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { ...defaults } }
  catch { return { ...defaults } }
}

export const store = reactive(load())

watch(store, () => localStorage.setItem(KEY, JSON.stringify(store)), { deep: true })

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getDay(key = todayKey()) {
  if (!store.days[key]) {
    store.days[key] = { checks: {}, mood: 0, energy: 0, discipline: 0, reflection: '', intention: '', customTasks: [] }
  }
  if (!store.days[key].customTasks) store.days[key].customTasks = []
  if (store.days[key].intention === undefined) store.days[key].intention = ''
  return store.days[key]
}

export function dayNumber() {
  const start = new Date(store.startDate)
  return Math.floor((new Date() - start) / 86400000) + 1
}

export function addXP(amount) {
  store.xp += amount
}

export function levelInfo() {
  const levels = [
    [0, 'Starting Again'], [100, 'Building Discipline'],
    [300, 'Becoming Consistent'], [600, 'Stronger Mind'], [1000, 'New Chapter'],
  ]
  let cur = levels[0]
  for (const l of levels) { if (store.xp >= l[0]) cur = l }
  return cur[1]
}

export function consistencyFor(area) {
  const keys = Object.keys(store.days)
  if (!keys.length) return 0
  const done = keys.filter(k => {
    const checks = store.days[k].checks
    return Object.keys(checks).some(c => c.startsWith(area) && checks[c])
  })
  return Math.round((done.length / keys.length) * 100)
}

const AREAS = [
  { key: 'faith', icon: '🙏', label: 'Faith' },
  { key: 'mind', icon: '🧠', label: 'Mind' },
  { key: 'body', icon: '💪', label: 'Body' },
  { key: 'purpose', icon: '🎯', label: 'Purpose' },
  { key: 'relationships', icon: '❤️', label: 'Relationships' },
  { key: 'discipline', icon: '🔥', label: 'Discipline' },
  { key: 'happiness', icon: '😊', label: 'Happiness' },
]

// Returns date keys for a given week number (1-based)
export function weekDateKeys(weekNum) {
  const start = new Date(store.startDate)
  const keys = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + (weekNum - 1) * 7 + i)
    keys.push(d.toISOString().slice(0, 10))
  }
  return keys
}

// How many weeks have fully passed
export function completedWeeks() {
  return Math.floor((dayNumber() - 1) / 7)
}

export function generateWeeklyReport(weekNum) {
  const keys = weekDateKeys(weekNum)
  const weekDays = keys.map(k => store.days[k]).filter(Boolean)

  const areaStats = AREAS.map(a => {
    const daysWithArea = weekDays.filter(d =>
      Object.keys(d.checks || {}).some(c => c.startsWith(a.key) && d.checks[c])
    )
    return { ...a, pct: weekDays.length ? Math.round((daysWithArea.length / weekDays.length) * 100) : 0 }
  })

  const moodDays = weekDays.filter(d => d.mood > 0)
  const avgMood = moodDays.length ? (moodDays.reduce((s, d) => s + d.mood, 0) / moodDays.length).toFixed(1) : 'N/A'
  const avgEnergy = moodDays.length ? (moodDays.reduce((s, d) => s + d.energy, 0) / moodDays.length).toFixed(1) : 'N/A'
  const avgDiscipline = moodDays.length ? (moodDays.reduce((s, d) => s + d.discipline, 0) / moodDays.length).toFixed(1) : 'N/A'

  const customTotal = weekDays.reduce((s, d) => s + (d.customTasks?.length || 0), 0)
  const customDone = weekDays.reduce((s, d) => s + (d.customTasks?.filter(t => t.done).length || 0), 0)

  const reflections = keys
    .map((k, i) => ({ date: k, day: store.days[k] }))
    .filter(({ day }) => day?.reflection?.trim())

  const wins = keys
    .map(k => store.days[k])
    .filter(Boolean)
    .flatMap(d => (d.wins || []).filter(w => w.trim()))

  const strongest = [...areaStats].sort((a, b) => b.pct - a.pct)[0]
  const weakest = [...areaStats].sort((a, b) => a.pct - b.pct)[0]

  return { weekNum, keys, weekDays, areaStats, avgMood, avgEnergy, avgDiscipline, customTotal, customDone, reflections, wins, strongest, weakest }
}

export function downloadWeeklyReport(weekNum) {
  const r = generateWeeklyReport(weekNum)
  const weekTitles = ['Know Yourself', 'Self-Respect', 'Confidence & Connection', 'Purpose']
  const title = weekTitles[weekNum - 1] || `Week ${weekNum}`
  const bar = (pct) => '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10))

  const lines = [
    '╔══════════════════════════════════════════╗',
    `║     NYIRABYO — NEW CHAPTER               ║`,
    `║     Week ${weekNum} Report: ${title.padEnd(30)}║`,
    '╚══════════════════════════════════════════╝',
    '',
    `Name       : ${store.name}`,
    `Week       : ${weekNum} of 4  (Days ${(weekNum - 1) * 7 + 1}–${weekNum * 7})`,
    `Period     : ${r.keys[0]}  →  ${r.keys[6]}`,
    `Days logged: ${r.weekDays.length} / 7`,
    '',
    '──────────────────────────────────────────',
    '  MOOD & ENERGY',
    '──────────────────────────────────────────',
    `  Average Mood       : ${r.avgMood} / 10`,
    `  Average Energy     : ${r.avgEnergy} / 10`,
    `  Average Discipline : ${r.avgDiscipline} / 10`,
    '',
    '──────────────────────────────────────────',
    '  CONSISTENCY BY AREA',
    '──────────────────────────────────────────',
    ...r.areaStats.map(a => `  ${a.icon} ${a.label.padEnd(14)} ${bar(a.pct)} ${String(a.pct).padStart(3)}%`),
    '',
    `  ⭐ Strongest : ${r.strongest?.icon} ${r.strongest?.label} (${r.strongest?.pct}%)`,
    `  ⚠️  Needs work: ${r.weakest?.icon} ${r.weakest?.label} (${r.weakest?.pct}%)`,
    '',
    '──────────────────────────────────────────',
    '  MY PERSONAL TASKS',
    '──────────────────────────────────────────',
    `  Completed: ${r.customDone} / ${r.customTotal}${r.customTotal ? ' (' + Math.round(r.customDone / r.customTotal * 100) + '%)' : ' (none added)'}`,
    '',
  ]

  if (r.wins.length) {
    lines.push('──────────────────────────────────────────')
    lines.push('  WINS THIS WEEK')
    lines.push('──────────────────────────────────────────')
    r.wins.forEach((w, i) => lines.push(`  ${i + 1}. ${w}`))
    lines.push('')
  }

  if (r.reflections.length) {
    lines.push('──────────────────────────────────────────')
    lines.push('  DAILY REFLECTIONS')
    lines.push('──────────────────────────────────────────')
    r.reflections.forEach(({ date, day }) => {
      lines.push(`  [${date}]`)
      lines.push(`  ${day.reflection.trim()}`)
      lines.push('')
    })
  }

  lines.push('──────────────────────────────────────────')
  lines.push('  "You don\'t have to be perfect.')
  lines.push('   You just have to keep going."')
  lines.push('──────────────────────────────────────────')
  lines.push('')
  lines.push('  Generated by NYIRABYO — New Chapter')

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `NewChapter_Week${weekNum}_Report.txt`
  a.click()
  URL.revokeObjectURL(url)
}
