<template>
	<nav v-if="props.lastPage > 1" class="m-pagination" :aria-label="props.label">
		<component
			:is="props.hrefFor ? NuxtLink : 'button'"
			v-bind="controlAttrs(props.modelValue - 1)"
			class="m-pagination__step"
			:class="{ 'm-pagination__step--disabled': props.modelValue <= 1 }"
			:aria-disabled="props.modelValue <= 1 || undefined"
			@click="go(props.modelValue - 1, $event)"
		>
			<MIcon name="light-angle-left" size="sm" />
			<span>Previous</span>
		</component>

		<ol class="m-pagination__pages">
			<li v-for="(entry, index) in pages" :key="`${index}-${entry}`">
				<span v-if="entry === 'gap'" class="m-pagination__gap" aria-hidden="true">…</span>
				<component
					:is="props.hrefFor ? NuxtLink : 'button'"
					v-else
					v-bind="controlAttrs(entry)"
					class="m-pagination__page"
					:class="{ 'm-pagination__page--active': entry === props.modelValue }"
					:aria-label="`Page ${entry}`"
					:aria-current="entry === props.modelValue ? 'page' : undefined"
					@click="go(entry, $event)"
				>
					{{ entry }}
				</component>
			</li>
		</ol>

		<span class="m-pagination__summary">Page {{ props.modelValue }} of {{ props.lastPage }}</span>

		<component
			:is="props.hrefFor ? NuxtLink : 'button'"
			v-bind="controlAttrs(props.modelValue + 1)"
			class="m-pagination__step"
			:class="{ 'm-pagination__step--disabled': props.modelValue >= props.lastPage }"
			:aria-disabled="props.modelValue >= props.lastPage || undefined"
			@click="go(props.modelValue + 1, $event)"
		>
			<span>Next</span>
			<MIcon name="light-angle-right" size="sm" />
		</component>
	</nav>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import MIcon from './MIcon.vue'

interface Props {
	modelValue: number
	lastPage: number
	label?: string
	// render crawlable links (e.g. ?page=2) instead of buttons
	hrefFor?: (page: number) => RouteLocationRaw
}

const props = withDefaults(defineProps<Props>(), {
	label: 'Pagination',
	hrefFor: undefined,
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: number): void
}>()

const NuxtLink = resolveComponent('NuxtLink')

// 1 … 4 5 6 … 12 — first, last, and the current page's neighbours.
const pages = computed<(number | 'gap')[]>(() => {
	const last = props.lastPage
	const current = props.modelValue
	const wanted = new Set([1, last, current - 1, current, current + 1])
	const list = [...wanted].filter(page => page >= 1 && page <= last).sort((a, b) => a - b)

	const result: (number | 'gap')[] = []
	list.forEach((page, index) => {
		const previous = list[index - 1]
		if (previous !== undefined && page - previous > 1) result.push('gap')
		result.push(page)
	})
	return result
})

function controlAttrs(page: number) {
	if (props.hrefFor) return { to: props.hrefFor(Math.min(Math.max(page, 1), props.lastPage)) }
	return { type: 'button' }
}

function go(page: number, event: Event) {
	if (page < 1 || page > props.lastPage) {
		event.preventDefault()
		return
	}
	emit('update:modelValue', page)
}
</script>
