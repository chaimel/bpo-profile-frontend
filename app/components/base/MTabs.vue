<template>
	<div
		:class="['m-tabs', `m-tabs--${props.variant}`]"
		role="tablist"
		:aria-label="props.label"
	>
		<button
			v-for="(tab, index) in props.tabs"
			:id="tabId(tab.value)"
			:key="tab.value"
			ref="tab_refs"
			type="button"
			role="tab"
			:aria-selected="tab.value === props.modelValue"
			:aria-controls="props.panelPrefix ? `${props.panelPrefix}-${tab.value}` : undefined"
			:tabindex="tab.value === props.modelValue ? 0 : -1"
			:class="['m-tabs__tab', { 'm-tabs__tab--active': tab.value === props.modelValue }]"
			@click="select(tab.value)"
			@keydown="onKeydown($event, index)"
		>
			<MIcon v-if="tab.icon" :name="tab.icon" size="sm" />
			<span>{{ tab.label }}</span>
			<span v-if="tab.count !== undefined" class="m-tabs__count">{{ tab.count }}</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'
import type { TabItem } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	tabs: TabItem[]
	modelValue: string
	// the tab list's accessible name
	label: string
	// when set, each tab points at `${panelPrefix}-${value}`; give the
	// matching panel role="tabpanel" and aria-labelledby the tab id
	panelPrefix?: string
	variant?: 'underline' | 'segmented'
}

const props = withDefaults(defineProps<Props>(), {
	panelPrefix: undefined,
	variant: 'underline',
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: string): void
}>()

const id_prefix = useId()
const tab_refs = ref<HTMLButtonElement[]>([])

function tabId(value: string) {
	return props.panelPrefix ? `${props.panelPrefix}-tab-${value}` : `${id_prefix}-${value}`
}

function select(value: string) {
	emit('update:modelValue', value)
}

// Arrow keys move between tabs, Home/End jump to the ends (WAI-ARIA tabs).
function onKeydown(event: KeyboardEvent, index: number) {
	const count = props.tabs.length
	let next = -1

	if (event.key === 'ArrowRight') next = (index + 1) % count
	else if (event.key === 'ArrowLeft') next = (index - 1 + count) % count
	else if (event.key === 'Home') next = 0
	else if (event.key === 'End') next = count - 1
	if (next === -1) return

	event.preventDefault()
	const tab = props.tabs[next]
	if (!tab) return
	select(tab.value)
	tab_refs.value[next]?.focus()
}
</script>
