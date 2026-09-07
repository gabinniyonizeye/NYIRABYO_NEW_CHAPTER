<script setup>
import { computed, ref } from 'vue'
import { dayNumber, store } from '../composables/useStore'

const weeks = [
  {
    week: 1, title: 'Know Yourself', icon: '🔍',
    theme: 'Understanding your thoughts, emotions and habits.',
    days: [
      { title: 'What do I really want?', prompt: 'Forget what others expect. If nothing could fail, what would you want your life to look like in 3 years?' },
      { title: 'My current habits — honest look', prompt: 'List 3 habits that are helping you and 3 that are hurting you. Be honest — no one else will read this.' },
      { title: 'What drains my energy?', prompt: 'What people, situations or habits consistently leave you feeling empty or exhausted?' },
      { title: 'What gives me energy?', prompt: 'When do you feel most alive? What activities, people or moments make you feel like yourself?' },
      { title: 'My biggest fear', prompt: 'What is the fear that most holds you back? Write it down. Naming a fear reduces its power over you.' },
      { title: 'My biggest strength', prompt: 'What do people come to you for? What do you do better than most people around you?' },
      { title: 'Week 1 reflection', prompt: 'What is the most important thing you learned about yourself this week? What surprised you?' },
    ],
  },
  {
    week: 2, title: 'Self-Respect', icon: '🛡️',
    theme: 'Keeping promises, discipline, personal standards.',
    days: [
      { title: 'Make one promise and keep it', prompt: 'Write one specific promise to yourself for today. Small is fine. The point is to keep it. What is it?' },
      { title: 'Say no to one thing', prompt: "What is one thing you will say no to today — a distraction, a request, a habit — that doesn't serve who you're becoming?" },
      { title: 'Clean your space', prompt: 'Your environment shapes your mind. What is one area of your life (physical or mental) you will clean up today?' },
      { title: 'No phone first 30 min', prompt: 'How did it feel to start the day without your phone? What did you notice about your mind in that quiet?' },
      { title: 'Do the hard thing first', prompt: "What is the one thing you've been avoiding? Write it down. Then do it before anything else today." },
      { title: 'Review your standards', prompt: "What standard do you hold yourself to? Write 3 personal rules you want to live by — things you won't compromise on." },
      { title: 'Week 2 reflection', prompt: 'Where did you keep your word to yourself this week? Where did you break it? What does that tell you?' },
    ],
  },
  {
    week: 3, title: 'Confidence & Connection', icon: '🤝',
    theme: 'Social confidence, comparison, validation.',
    days: [
      { title: 'Reach out to someone', prompt: "Who have you been meaning to contact but haven't? Message or call them today. Write what you said or plan to say." },
      { title: 'Give a genuine compliment', prompt: 'Who in your life deserves to hear something good? Write what you said and how it felt to say it.' },
      { title: 'Stop comparing for one day', prompt: 'Comparison steals joy. Who do you compare yourself to most? Write why their path is not your path.' },
      { title: 'Share something real', prompt: 'Vulnerability builds real connection. What is something true about you that you rarely share? Write it here first.' },
      { title: 'Do something that scares you slightly', prompt: 'Confidence is built by doing, not waiting. What small scary thing did you do today? How did it feel after?' },
      { title: 'Forgive someone', prompt: "Unforgiveness hurts you more than them. Who do you need to forgive — even silently? Write what you're releasing." },
      { title: 'Week 3 reflection', prompt: 'How did your relationship with other people shift this week? What did you learn about yourself in social situations?' },
    ],
  },
  {
    week: 4, title: 'Purpose', icon: '🎯',
    theme: 'Goals, future, values, direction.',
    days: [
      { title: 'Write your 1-year vision', prompt: "It's one year from today. You did the work. What does your life look like? Be specific — where are you, what are you doing, who are you?" },
      { title: 'What would you regret NOT doing?', prompt: 'Imagine yourself at 80 looking back. What would you regret not trying? Let that answer guide you.' },
      { title: 'Your top 3 values', prompt: 'What 3 values do you want to build your life around? Not what sounds good — what actually matters to you?' },
      { title: 'One step toward your goal', prompt: 'What is the single next step toward your most important goal? Not the whole plan — just the next step. Write it and do it.' },
      { title: 'Who do you want to become?', prompt: "Describe the person you are becoming. Not what you want to have — who you want to BE. Write in present tense as if it's already true." },
      { title: 'Letter to future you', prompt: 'Write a short letter to yourself 1 year from now. Tell them what you started, what you hope they kept going, and what you believe about them.' },
      { title: 'Your New Chapter Report', prompt: 'You made it to the end. What changed in you over these 30 days? What is the most important thing you are taking forward?' },
    ],
  },
]

const currentDay = computed(() => Math.min(dayNumber(), 30))
const openDay = ref(null)

function dayStatus(weekIdx, dayIdx) {
  const d = weekIdx * 7 + dayIdx + 1
  if (d < currentDay.value) return 'done'
  if (d === currentDay.value) return 'current'
  return 'future'
}

function toggleDay(key) {
  openDay.value = openDay.value === key ? null : key
}

function answerKey(wi, di) { return `day_${wi * 7 + di + 1}` }

function saveAnswer(wi, di, val) {
  if (!store.programAnswers) store.programAnswers = {}
  store.programAnswers[answerKey(wi, di)] = val
}
</script>

<template>
  <div class="p-5">
    <p class="text-gray-400 text-sm uppercase tracking-widest mb-1">30-Day Program</p>
    <h1 class="text-2xl font-bold text-amber-400 mb-1">New Chapter</h1>
    <p class="text-gray-400 text-sm mb-4">Day {{ currentDay }} of 30</p>

    <div class="h-2 bg-gray-800 rounded-full overflow-hidden mb-8">
      <div
        class="h-full bg-amber-400 rounded-full transition-all duration-700"
        :style="{ width: (currentDay / 30 * 100) + '%' }"
      />
    </div>

    <div v-for="(w, wi) in weeks" :key="w.week" class="mb-8">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xl">{{ w.icon }}</span>
        <h2 class="font-bold text-lg">Week {{ w.week }} — {{ w.title }}</h2>
      </div>
      <p class="text-gray-500 text-sm mb-3 ml-8">{{ w.theme }}</p>

      <div class="space-y-2">
        <div v-for="(d, di) in w.days" :key="di">
          <!-- Day row button -->
          <button
            @click="dayStatus(wi, di) !== 'future' && toggleDay(`${wi}_${di}`)"
            class="w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left"
            :class="{
              'bg-amber-400/10 border-amber-400/30 text-amber-300': dayStatus(wi, di) === 'done',
              'bg-amber-500/20 border-amber-400 text-white font-semibold': dayStatus(wi, di) === 'current',
              'bg-gray-900 border-gray-800 text-gray-600 cursor-default': dayStatus(wi, di) === 'future',
            }"
          >
            <span class="shrink-0">
              {{ dayStatus(wi, di) === 'done' ? '✅' : dayStatus(wi, di) === 'current' ? '🔥' : '⬜' }}
            </span>
            <span class="flex-1">Day {{ wi * 7 + di + 1 }} — {{ d.title }}</span>
            <span v-if="dayStatus(wi, di) !== 'future'" class="text-xs opacity-50">
              {{ openDay === `${wi}_${di}` ? '▲' : '▼' }}
            </span>
          </button>

          <!-- Expanded prompt + answer -->
          <div
            v-if="openDay === `${wi}_${di}`"
            class="bg-gray-900 border border-gray-800 rounded-b-xl px-4 py-4 -mt-1"
          >
            <p class="text-sm text-gray-300 leading-relaxed mb-3 italic">{{ d.prompt }}</p>
            <textarea
              :value="store.programAnswers?.[answerKey(wi, di)] || ''"
              @input="e => saveAnswer(wi, di, e.target.value)"
              rows="4"
              placeholder="Write your answer here..."
              class="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
