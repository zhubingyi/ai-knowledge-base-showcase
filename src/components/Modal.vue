<template>
  <div class="modal-overlay">
    <div
      class="modal-content"
      :class="size"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <header class="modal-header">
        <h2 :id="titleId">{{ title }}</h2>
        <button type="button" class="icon-button" aria-label="关闭" @click="$emit('close')">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  title: { type: String, required: true },
  size: { type: String, default: '' },
})

const emit = defineEmits(['close'])
const titleId = `modal-title-${Math.random().toString(36).slice(2, 8)}`

function onKey(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  const field = document.querySelector('.modal-body input, .modal-body textarea, .modal-body select')
  field?.focus()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>
