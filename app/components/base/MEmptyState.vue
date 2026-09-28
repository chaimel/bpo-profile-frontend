<template>
	<div :class="['m-empty', `m-empty--${props.variant}`, `m-empty--${props.tone}`]">
		<span class="m-empty__icon">
			<MIcon :name="props.icon" size="lg" />
		</span>

		<MHeading :variant="props.headingLevel" size="5" class="m-empty__title">
			<slot name="title" />
		</MHeading>

		<MText v-if="$slots['default']" size="medium" color="--text-secondary" class="m-empty__text">
			<slot />
		</MText>

		<div v-if="$slots['actions']" class="m-empty__actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { MIconName } from '~/types/base/ui'
import MHeading from './MHeading.vue'
import MIcon from './MIcon.vue'
import MText from './MText.vue'

// Neutral, non-blaming copy with a way forward (PDF p. 39):
// "No BPOs found. Try adjusting your search."
interface Props {
	icon?: MIconName
	headingLevel?: '2' | '3' | '4'
	variant?: 'boxed' | 'plain'
	tone?: 'neutral' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
	icon: 'light-search',
	headingLevel: '3',
	variant: 'boxed',
	tone: 'neutral',
})
</script>
