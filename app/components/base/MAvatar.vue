<template>
	<span :class="['m-avatar', `m-avatar--${props.shape}`]" :style="size_style">
		<img
			v-if="props.src"
			:src="props.src"
			:alt="props.decorative ? '' : (props.alt || props.name)"
			class="m-avatar__img"
			loading="lazy"
		>
		<span
			v-else
			class="m-avatar__initials"
			:role="props.decorative ? undefined : 'img'"
			:aria-label="props.decorative ? undefined : (props.alt || props.name)"
			:aria-hidden="props.decorative ? 'true' : undefined"
		>{{ monogram }}</span>
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initials } from '~/utils/format'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

interface Props {
	name: string
	src?: string | null
	alt?: string | null
	size?: AvatarSize | number
	shape?: 'circle' | 'rounded'
	// the name is already printed beside it, so hide it from screen readers
	decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	src: null,
	alt: null,
	size: 'md',
	shape: 'circle',
	decorative: false,
})

const size_map: Record<AvatarSize, number> = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 56,
	xl: 80,
	xxl: 128,
}

const pixels = computed(() => (typeof props.size === 'number' ? props.size : size_map[props.size]))

const size_style = computed(() => ({
	width: `${pixels.value}px`,
	height: `${pixels.value}px`,
	fontSize: `${Math.round(pixels.value * 0.38)}px`,
}))

const monogram = computed(() => initials(props.name))
</script>
