<template>
	<span :class="['m-logo', `m-logo--${tone}`, { 'm-logo--image': props.src }]" :style="size_style">
		<img
			v-if="props.src"
			:src="props.src"
			:alt="props.decorative ? '' : (props.alt || `${props.name} logo`)"
			class="m-logo__img"
			loading="lazy"
		>
		<span
			v-else
			class="m-logo__mark"
			:role="props.decorative ? undefined : 'img'"
			:aria-label="props.decorative ? undefined : (props.alt || `${props.name} logo`)"
			:aria-hidden="props.decorative ? 'true' : undefined"
		>{{ monogram }}</span>
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initials } from '~/utils/format'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
	name: string
	src?: string | null
	alt?: string | null
	size?: LogoSize | number
	decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	src: null,
	alt: null,
	size: 'md',
	decorative: false,
})

const size_map: Record<LogoSize, number> = {
	sm: 32,
	md: 48,
	lg: 72,
	xl: 104,
}

// Monogram tiles stand in until a company uploads its logo. The tone
// comes from the name, so a company always gets the same tile.
const tones = ['slate', 'brand', 'deep', 'ink'] as const

const tone = computed(() => {
	const sum = [...props.name].reduce((total, char) => total + char.charCodeAt(0), 0)
	return tones[sum % tones.length]
})

const pixels = computed(() => (typeof props.size === 'number' ? props.size : size_map[props.size]))

const size_style = computed(() => ({
	width: `${pixels.value}px`,
	height: `${pixels.value}px`,
	fontSize: `${Math.round(pixels.value * 0.34)}px`,
}))

const monogram = computed(() => initials(props.name))
</script>
