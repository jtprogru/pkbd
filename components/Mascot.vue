<script setup lang="ts">
import mascotSvg from '../assets/mascot-tinted.svg?raw'

// Перекрывает Mascot из slidev-theme-bear: тема отдаёт маскота двухтоновым
// <img> с зашитыми заливками светлой темы (#9a3f0a + #eff1f5), из-за чего он
// не следует за темой и остаётся рыжим на Macchiato.
//
// Здесь SVG инлайнится, ink наследует currentColor, бумага — var(--bg).
// Цвет берём тот же, что у знака в футере (BearMark): var(--fg-muted).
// Файл готовит scripts/sync-theme-assets.mjs из ассета темы, руками не править.
//
// Пропсы повторяют темовые: layouts зовут <Mascot :size="200" />, а `src`
// принимаем ради совместимости с frontmatter `mascot: /path.svg`.
const props = withDefaults(defineProps<{
  size?: number | string
  src?: string
}>(), {
  size: 220,
  src: '',
})

const px = typeof props.size === 'number' ? `${props.size}px` : props.size
</script>

<template>
  <figure class="bear-mascot m-0 select-none" :style="{ color: 'var(--fg-muted)' }">
    <img
      v-if="props.src"
      :src="props.src"
      alt="Маскот «Мишка на сервере»"
      class="block"
      :style="{ width: px, height: 'auto' }"
      draggable="false"
    >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span
      v-else
      class="bear-mascot-svg block"
      role="img"
      aria-label="Маскот «Мишка на сервере»"
      :style="{ width: px }"
      v-html="mascotSvg"
    />
    <figcaption v-if="$slots.default" class="mt-2 text-sm" :style="{ color: 'var(--fg-muted)' }">
      <slot />
    </figcaption>
  </figure>
</template>

<style scoped>
.bear-mascot-svg :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}
</style>
