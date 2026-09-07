<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selected = ref(null)

const emotions = [
  { key: 'sad', icon: '😔', label: 'Sad' },
  { key: 'stressed', icon: '😩', label: 'Stressed' },
  { key: 'lonely', icon: '🧍', label: 'Lonely' },
  { key: 'angry', icon: '😡', label: 'Angry' },
  { key: 'exhausted', icon: '😴', label: 'Exhausted' },
  { key: 'overthinking', icon: '🤯', label: 'Overthinking' },
  { key: 'past', icon: '💔', label: 'Thinking about the past' },
]

const interventions = {
  sad: {
    title: "It's okay to feel sad.",
    steps: ['Sit with the feeling — don\'t fight it.', 'Take 5 slow deep breaths.', 'Write one sentence about what you feel.', 'Pray or talk to someone you trust.', 'Do one small kind thing for yourself.'],
    closing: "Sadness passes. You are not stuck here forever.",
  },
  stressed: {
    title: "Stress is a signal, not a sentence.",
    steps: ['Stop. Put the phone down for 5 minutes.', 'Write down the ONE thing stressing you most.', 'Ask: can I control this right now?', 'Take 10 slow breaths.', 'Do the next smallest step only.'],
    closing: "You don't have to solve everything tonight.",
  },
  lonely: {
    title: "Loneliness is real. You are not weak.",
    steps: ['Put your phone down for 5 minutes.', 'Take 10 slow breaths.', 'Pray.', 'Message or call someone you trust.', 'Write one sentence about what you\'re feeling.'],
    closing: "You don't have to solve your whole life tonight.",
  },
  angry: {
    title: "Anger is energy. Direct it wisely.",
    steps: ['Leave the situation if you can.', 'Take 10 deep breaths — slowly.', 'Write what made you angry without sending it.', 'Wait 10 minutes before responding to anyone.', 'Ask: what do I actually need right now?'],
    closing: "Responding from anger rarely helps. You are stronger than this moment.",
  },
  exhausted: {
    title: "Rest is not laziness. It is wisdom.",
    steps: ['Give yourself permission to stop.', 'Drink a glass of water.', 'Lie down — even for 20 minutes.', 'Turn off notifications.', 'Tomorrow is a new start.'],
    closing: "You cannot pour from an empty cup. Rest.",
  },
  overthinking: {
    title: "Your mind is working overtime.",
    steps: ['Name 5 things you can see right now.', 'Take 5 slow breaths.', 'Write the thought down — get it out of your head.', 'Ask: is this true, or is this fear?', 'Do one physical thing — walk, stretch, drink water.'],
    closing: "Most of what we fear never happens. Come back to now.",
  },
  past: {
    title: "The past cannot be changed. You can.",
    steps: ['Acknowledge the pain — it was real.', 'Write one thing you learned from it.', 'Pray for peace about it.', 'Remind yourself: that chapter is closed.', 'Do one thing that belongs to your future.'],
    closing: "You are not your past. You are what you choose next.",
  },
}
</script>

<template>
  <div class="p-5">
    <p class="text-gray-400 text-sm uppercase tracking-widest mb-1">Support</p>
    <h1 class="text-2xl font-bold text-white mb-2">I'm struggling</h1>
    <p class="text-gray-400 text-sm mb-6">What are you feeling right now?</p>

    <!-- Emotion grid -->
    <div v-if="!selected" class="grid grid-cols-2 gap-3">
      <button
        v-for="e in emotions" :key="e.key"
        @click="selected = e.key"
        class="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 text-left hover:border-amber-400/50 transition-all"
      >
        <span class="text-2xl">{{ e.icon }}</span>
        <span class="text-sm font-medium">{{ e.label }}</span>
      </button>
    </div>

    <!-- Intervention -->
    <div v-else>
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <h2 class="text-lg font-bold text-amber-400 mb-4">{{ interventions[selected].title }}</h2>
        <ol class="space-y-3">
          <li
            v-for="(step, i) in interventions[selected].steps" :key="i"
            class="flex gap-3 text-sm text-gray-300"
          >
            <span class="text-amber-400 font-bold shrink-0">{{ i + 1 }}.</span>
            {{ step }}
          </li>
        </ol>
      </div>

      <p class="text-center text-gray-400 italic text-sm mb-4 px-4">
        "{{ interventions[selected].closing }}"
      </p>

      <!-- Breathing shortcut -->
      <button
        @click="router.push('/breathing')"
        class="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300 text-sm mb-3 hover:bg-blue-500/20 transition-all"
      >
        💨 Try a guided breathing exercise
      </button>

      <button
        @click="selected = null"
        class="w-full py-3 rounded-xl border border-gray-700 text-gray-400 text-sm hover:border-amber-400/50 transition-all"
      >
        ← Back
      </button>
    </div>
  </div>
</template>
