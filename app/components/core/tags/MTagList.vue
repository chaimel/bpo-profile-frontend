<template>
	<ul v-if="props.items.length" class="m-tag-list" :aria-label="props.label">
		<li v-for="item in visible_items" :key="item.slug">
			<MTag :to="props.linkTo ? props.linkTo(item) : undefined" :variant="props.variant" :size="props.size">
				{{ item.name }}
			</MTag>
		</li>
		<li v-if="hidden_count > 0">
			<MTag variant="outline" :size="props.size">+{{ hidden_count }} more</MTag>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

interface TagItem {
	name: string
	slug: string
}

interface Props {
	items: TagItem[]
	// accessible name for the list, e.g. "Services"
	label?: string
	// show this many, then "+N more"
	max?: number
	linkTo?: (item: TagItem) => RouteLocationRaw
	variant?: 'default' | 'brand' | 'outline'
	size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
	label: undefined,
	max: undefined,
	linkTo: undefined,
	variant: 'default',
	size: 'md',
})

const visible_items = computed(() => (props.max ? props.items.slice(0, props.max) : props.items))
const hidden_count = computed(() => props.items.length - visible_items.value.length)
</script>

<style lang="scss" scoped>
.m-tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}
</style>
