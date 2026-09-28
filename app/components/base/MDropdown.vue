<template>
	<div ref="root" :class="['m-dropdown', `m-dropdown--${props.align}`]">
		<button
			ref="trigger"
			type="button"
			:class="['m-dropdown__trigger', `m-dropdown__trigger--${props.variant}`, { 'm-dropdown__trigger--open': is_open }]"
			:aria-expanded="is_open"
			aria-haspopup="menu"
			:aria-controls="menu_id"
			:aria-label="props.iconOnly ? props.label : undefined"
			:title="props.iconOnly ? props.label : undefined"
			@click="toggle"
			@keydown.down.prevent="openAndFocus(0)"
		>
			<slot name="trigger">
				<MIcon v-if="props.icon" :name="props.icon" size="sm" />
				<span v-if="!props.iconOnly">{{ props.label }}</span>
				<MIcon v-if="!props.iconOnly" name="light-angle-down" size="xs" class="m-dropdown__caret" />
			</slot>
		</button>

		<div
			v-show="is_open"
			:id="menu_id"
			ref="menu"
			class="m-dropdown__menu"
			role="menu"
			:aria-label="props.label"
			@keydown.esc.prevent="closeAndReturn"
			@keydown.down.prevent="move(1)"
			@keydown.up.prevent="move(-1)"
			@keydown.tab="close"
		>
			<slot :close="close">
				<template v-for="item in props.items" :key="item.value">
					<div v-if="item.divided" class="m-dropdown__divider" role="separator" />

					<NuxtLink
						v-if="item.to"
						:to="item.to"
						role="menuitem"
						tabindex="-1"
						:class="item_class(item)"
						@click="select(item)"
					>
						<MIcon v-if="item.icon" :name="item.icon" size="sm" />
						{{ item.label }}
					</NuxtLink>

					<button
						v-else
						type="button"
						role="menuitem"
						tabindex="-1"
						:disabled="item.disabled"
						:class="item_class(item)"
						@click="select(item)"
					>
						<MIcon v-if="item.icon" :name="item.icon" size="sm" />
						{{ item.label }}
					</button>
				</template>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { DropdownItem, MIconName } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	// the menu's accessible name; also the trigger text unless iconOnly
	label: string
	items?: DropdownItem[]
	icon?: MIconName
	iconOnly?: boolean
	align?: 'left' | 'right'
	variant?: 'neutral' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), {
	items: () => [],
	icon: undefined,
	iconOnly: false,
	align: 'right',
	variant: 'neutral',
})

const emit = defineEmits<{
	(_e: 'select', _item: DropdownItem): void
}>()

const menu_id = useId()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const is_open = ref(false)

function item_class(item: DropdownItem) {
	return ['m-dropdown__item', { 'm-dropdown__item--danger': item.tone === 'danger' }]
}

function menuItems(): HTMLElement[] {
	return Array.from(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [])
}

function focusItem(index: number) {
	const items = menuItems()
	if (!items.length) return
	const next = (index + items.length) % items.length
	items[next]?.focus()
}

function move(step: number) {
	const items = menuItems()
	const current = items.indexOf(document.activeElement as HTMLElement)
	focusItem(current === -1 ? 0 : current + step)
}

function toggle() {
	is_open.value = !is_open.value
}

async function openAndFocus(index: number) {
	is_open.value = true
	await nextTick()
	focusItem(index)
}

function close() {
	is_open.value = false
}

function closeAndReturn() {
	close()
	trigger.value?.focus()
}

function select(item: DropdownItem) {
	emit('select', item)
	closeAndReturn()
}

function onDocumentPointer(event: PointerEvent) {
	if (root.value && !root.value.contains(event.target as Node)) close()
}

watch(is_open, (open) => {
	if (!import.meta.client) return
	if (open) document.addEventListener('pointerdown', onDocumentPointer)
	else document.removeEventListener('pointerdown', onDocumentPointer)
})

onBeforeUnmount(() => {
	if (import.meta.client) document.removeEventListener('pointerdown', onDocumentPointer)
})
</script>
