<template>
	<NuxtLink
		v-if="has_to"
		:to="resolved_to"
		:target="props.target || undefined"
		:rel="resolved_rel"
		:aria-label="props.title"
		:aria-disabled="props.disabled || undefined"
		:tabindex="props.disabled ? -1 : undefined"
		:class="classes"
		:title="props.title"
		@click="onClick"
	>
		<MIcon :name="props.name" :size="props.iconSize" />
		<slot />
	</NuxtLink>

	<a
		v-else-if="has_href"
		:href="resolved_href"
		:target="props.target || undefined"
		:rel="resolved_rel"
		:aria-label="props.title"
		:aria-disabled="props.disabled || undefined"
		:tabindex="props.disabled ? -1 : undefined"
		:class="classes"
		:title="props.title"
		@click="onClick"
	>
		<MIcon :name="props.name" :size="props.iconSize" />
		<slot />
	</a>

	<button
		v-else
		:type="props.type"
		:disabled="props.disabled"
		:aria-label="props.title"
		:aria-pressed="props.pressed"
		:class="classes"
		:title="props.title"
		@click="onClick"
	>
		<MIcon :name="props.name" :size="props.iconSize" />
		<slot />
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MIconName, MIconSize } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	name: MIconName
	// Required: the only accessible name an icon-only control has.
	title: string
	iconSize?: MIconSize
	variant?: 'default' | 'ghost' | 'outline' | 'inverse'
	size?: 'sm' | 'md' | 'lg'
	radius?: 'sm' | 'md' | 'lg' | 'full'
	active?: boolean
	// toggle buttons announce their state
	pressed?: boolean
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
	to?: RouteLocationRaw
	href?: string
	target?: '_self' | '_blank' | '_parent' | '_top'
	rel?: string
}

const props = withDefaults(defineProps<Props>(), {
	iconSize: 'sm',
	variant: 'default',
	size: 'md',
	radius: 'md',
	active: false,
	pressed: undefined,
	disabled: false,
	type: 'button',
	to: undefined,
	href: '',
	target: undefined,
	rel: '',
})

const emit = defineEmits<{
	(_e: 'click', _event: MouseEvent): void
}>()

const classes = computed(() => [
	'm-button-icon',
	`m-button-icon--${props.variant}`,
	`m-button-icon--${props.size}`,
	`m-button-icon--radius-${props.radius}`,
	{
		'm-button-icon--active': props.active,
		'm-button-icon--disabled': props.disabled,
	},
])

const has_to = computed(() => Boolean(props.to))
const has_href = computed(() => !has_to.value && Boolean(props.href))
const resolved_to = computed<RouteLocationRaw>(() => props.to || '/')
const resolved_href = computed(() => props.href || '#')
const resolved_rel = computed(() => {
	if (props.target !== '_blank') return props.rel || undefined

	const rel_parts = new Set((props.rel || '').split(/\s+/).filter(Boolean))
	rel_parts.add('noopener')
	rel_parts.add('noreferrer')
	return Array.from(rel_parts).join(' ')
})

function onClick(event: MouseEvent) {
	if (props.disabled) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	emit('click', event)
}
</script>
