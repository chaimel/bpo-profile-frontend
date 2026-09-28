<template>
	<NuxtLink v-if="props.to" :to="props.to" :class="classes">
		<MIcon v-if="props.icon" :name="props.icon" size="xs" />
		<slot />
	</NuxtLink>

	<!-- a removable chip is one button, so it has one clear name -->
	<button
		v-else-if="props.removable"
		type="button"
		:class="classes"
		:aria-label="props.removeLabel"
		@click="emit('remove')"
	>
		<MIcon v-if="props.icon" :name="props.icon" size="xs" />
		<slot />
		<MIcon name="light-times" size="xs" class="m-tag__remove" />
	</button>

	<span v-else :class="classes">
		<MIcon v-if="props.icon" :name="props.icon" size="xs" />
		<slot />
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MIconName } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	to?: RouteLocationRaw
	removable?: boolean
	// accessible name for the remove action, e.g. "Remove filter: Healthcare"
	removeLabel?: string
	icon?: MIconName
	variant?: 'default' | 'brand' | 'outline'
	size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
	to: undefined,
	removable: false,
	removeLabel: 'Remove',
	icon: undefined,
	variant: 'default',
	size: 'md',
})

const emit = defineEmits<{
	(_e: 'remove'): void
}>()

const classes = computed(() => [
	'm-tag',
	`m-tag--${props.variant}`,
	`m-tag--${props.size}`,
	{
		'm-tag--link': Boolean(props.to),
		'm-tag--removable': props.removable,
	},
])
</script>
