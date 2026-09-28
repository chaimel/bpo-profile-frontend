<template>
	<div
		ref="root"
		:class="['row-menu', { 'row-menu--up': opens_up }]"
		:style="position_style"
		@click.capture="place"
		@keydown.down.capture="place"
	>
		<MDropdown
			:label="props.label"
			:items="props.items"
			icon="light-dots-horizontal"
			icon-only
			variant="ghost"
			@select="emit('select', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { DropdownItem } from '~/types/base/ui'

// Row actions for admin tables and trees. MTable scrolls sideways on
// narrow screens, which clips an absolutely positioned menu, so the
// menu is pinned to the viewport beside its trigger instead and flips
// upward when there's no room below.
interface Props {
	// the menu's accessible name, e.g. "Actions for Northshore CX"
	label: string
	items: DropdownItem[]
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'select', _item: DropdownItem): void
}>()

// room the menu needs below its trigger before it opens upward
const menu_room = 300

const root = ref<HTMLElement | null>(null)
const opens_up = ref(false)
const position_style = ref<Record<string, string>>({})

function place() {
	if (!root.value) return
	const rect = root.value.getBoundingClientRect()

	opens_up.value = window.innerHeight - rect.bottom < menu_room && rect.top > menu_room
	position_style.value = {
		'--menu-top': `${rect.bottom + 6}px`,
		'--menu-bottom': `${window.innerHeight - rect.top + 6}px`,
		'--menu-right': `${Math.max(8, document.documentElement.clientWidth - rect.right)}px`,
	}
}

// keep an open menu attached to its trigger while the page scrolls
function follow() {
	if (root.value?.querySelector('[aria-expanded="true"]')) place()
}

onMounted(() => {
	window.addEventListener('scroll', follow, { passive: true, capture: true })
	window.addEventListener('resize', follow, { passive: true })
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', follow, { capture: true })
	window.removeEventListener('resize', follow)
})
</script>

<style lang="scss" scoped>
.row-menu {
	display: inline-flex;

	:deep(.m-dropdown__menu) {
		position: fixed;
		top: var(--menu-top);
		right: var(--menu-right);
		bottom: auto;
	}

	&--up :deep(.m-dropdown__menu) {
		top: auto;
		bottom: var(--menu-bottom);
	}
}
</style>
