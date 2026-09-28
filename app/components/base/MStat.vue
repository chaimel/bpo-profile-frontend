<template>
	<div :class="['m-stat', `m-stat--${props.tone}`]">
		<div class="m-stat__head">
			<span class="m-stat__label">{{ props.label }}</span>
			<span v-if="props.icon" class="m-stat__icon">
				<MIcon :name="props.icon" size="sm" />
			</span>
		</div>
		<span class="m-stat__value">{{ props.value }}</span>
		<span v-if="$slots['default'] || props.hint" class="m-stat__hint">
			<slot>{{ props.hint }}</slot>
		</span>
	</div>
</template>

<script setup lang="ts">
import type { MIconName } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	label: string
	// pre-formatted, so "Unavailable" and "3.2%" read as written
	value: string | number
	hint?: string
	icon?: MIconName
	tone?: 'default' | 'brand' | 'slate'
}

const props = withDefaults(defineProps<Props>(), {
	hint: undefined,
	icon: undefined,
	tone: 'default',
})
</script>
