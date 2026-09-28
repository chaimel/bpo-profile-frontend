<template>
	<svg
		v-if="icon_meta"
		class="m-icon"
		:width="resolved_size"
		:height="resolved_size"
		:viewBox="icon_meta.viewBox"
		:style="icon_style"
		:role="accessible_label ? 'img' : undefined"
		:aria-label="accessible_label || undefined"
		:aria-hidden="accessible_label ? undefined : 'true'"
		focusable="false"
	>
		<title v-if="props.title">{{ props.title }}</title>
		<use :href="sprite_href" />
	</svg>
	<span
		v-else
		class="m-icon m-icon--missing"
		:style="{ width: resolved_size, height: resolved_size }"
		aria-hidden="true"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSpriteVersion, icons } from '~/data/ui/icons'
import type { MIconName, MIconSize } from '~/types/base/ui'

interface Props {
	name: MIconName
	size?: MIconSize
	// Token name ("brand"), custom property ("--text-muted"), or raw CSS color.
	// Leave empty to inherit, so a parent class can still set the color.
	color?: string
	// Gives the icon an accessible name. Leave empty for decorative icons.
	label?: string
	title?: string
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
	color: undefined,
	label: '',
	title: '',
})

const size_map = {
	xs: '0.875rem',
	sm: '1rem',
	md: '1.25rem',
	lg: '1.5rem',
	xl: '2rem',
} as const

const icon_meta = computed(() => icons[props.name])
const resolved_size = computed(() => {
	if (typeof props.size === 'number') return `${props.size}px`
	return size_map[props.size as keyof typeof size_map] ?? props.size
})
const accessible_label = computed(() => props.label || props.title)
const sprite_href = computed(() => `/icons/sprite.svg?v=${iconSpriteVersion}#${icon_meta.value.id}`)
// An inline color would beat every stylesheet rule, so only set one when asked.
const icon_style = computed(() => {
	const color = resolveColor(props.color)
	return color ? { color } : undefined
})

function resolveColor(value: string | undefined): string {
	const color = value?.trim() ?? ''
	if (!color || color.toLowerCase() === 'currentcolor') return ''
	if (color.startsWith('--')) return `var(${color})`
	if (/^(#|rgb|hsl|oklch|var\()/i.test(color)) return color
	return `var(--${color})`
}
</script>
