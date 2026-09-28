<template>
	<NuxtLink
		v-if="has_to"
		:to="resolved_to"
		:target="props.target || undefined"
		:rel="resolved_rel"
		:aria-disabled="is_inert || undefined"
		:aria-busy="props.isLoading || undefined"
		:tabindex="is_inert ? -1 : undefined"
		:class="button_class"
		@click="handleClick"
	>
		<slot name="prefix" />
		<span v-if="props.isLoading" class="m-button-loader" aria-hidden="true" />
		<slot />
		<slot name="suffix" />
	</NuxtLink>

	<a
		v-else-if="has_href"
		:href="resolved_href"
		:target="props.target || undefined"
		:rel="resolved_rel"
		:aria-disabled="is_inert || undefined"
		:aria-busy="props.isLoading || undefined"
		:tabindex="is_inert ? -1 : undefined"
		:class="button_class"
		@click="handleClick"
	>
		<slot name="prefix" />
		<span v-if="props.isLoading" class="m-button-loader" aria-hidden="true" />
		<slot />
		<slot name="suffix" />
	</a>

	<button
		v-else
		:type="props.type"
		:disabled="props.disabled"
		:aria-busy="props.isLoading || undefined"
		:class="button_class"
		@click="handleClick"
	>
		<slot name="prefix" />
		<span v-if="props.isLoading" class="m-button-loader" aria-hidden="true" />
		<slot />
		<slot name="suffix" />
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

// primary: BPO Blue action · secondary: slate · outline: blue rule
// neutral: quiet bordered · text: inline link · ghost: toolbar
// destructive: irreversible actions · inverse: white on dark bands
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'neutral' | 'text' | 'ghost' | 'destructive' | 'inverse'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'
type ButtonTarget = '_self' | '_blank' | '_parent' | '_top'

interface Props {
	type?: ButtonType
	disabled?: boolean
	size?: ButtonSize
	variant?: ButtonVariant
	isLoading?: boolean
	// stretch to the container width
	block?: boolean
	to?: RouteLocationRaw
	href?: string
	target?: ButtonTarget
	rel?: string
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
	type: 'button',
	variant: 'primary',
	disabled: false,
	isLoading: false,
	block: false,
	to: undefined,
	href: '',
	target: undefined,
	rel: '',
})

const emit = defineEmits<{
	(_e: 'click', _event: MouseEvent): void
}>()

const is_inert = computed(() => props.disabled || props.isLoading)

const button_class = computed(() => [
	'm-button',
	`m-button--${props.size}`,
	`m-button--${props.variant}`,
	{
		'm-button--loading': props.isLoading,
		'm-button--block': props.block,
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

function handleClick(event: MouseEvent) {
	if (is_inert.value) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	emit('click', event)
}
</script>
