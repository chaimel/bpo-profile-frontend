<template>
	<span :class="['m-badge', `m-badge--${props.tone}`, `m-badge--${props.size}`, `m-badge--${props.variant}`]">
		<MIcon v-if="props.icon" :name="props.icon" size="xs" />
		<slot />
	</span>
</template>

<script setup lang="ts">
import type { MIconName, Tone } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	tone?: Tone
	// pair the tone with an icon so status never rests on color alone
	icon?: MIconName
	size?: 'sm' | 'md'
	variant?: 'soft' | 'outline'
}

const props = withDefaults(defineProps<Props>(), {
	tone: 'neutral',
	icon: undefined,
	size: 'md',
	variant: 'soft',
})
</script>
