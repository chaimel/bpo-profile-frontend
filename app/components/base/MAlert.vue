<template>
	<div
		:class="['m-alert', `m-alert--${props.tone}`]"
		:role="live_role"
	>
		<MIcon :name="resolved_icon" size="sm" class="m-alert__icon" />

		<div class="m-alert__body">
			<p v-if="$slots['title']" class="m-alert__title">
				<slot name="title" />
			</p>
			<div v-if="$slots['default']" class="m-alert__text">
				<slot />
			</div>
			<div v-if="$slots['actions']" class="m-alert__actions">
				<slot name="actions" />
			</div>
		</div>

		<MButtonIcon
			v-if="props.dismissible"
			class="m-alert__dismiss"
			name="light-times"
			title="Dismiss"
			variant="ghost"
			size="sm"
			radius="full"
			@click="emit('dismiss')"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName } from '~/types/base/ui'
import MButtonIcon from './MButtonIcon.vue'
import MIcon from './MIcon.vue'

interface Props {
	tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral'
	icon?: MIconName
	// announce when it appears (form results); static notices stay quiet
	live?: boolean
	dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	tone: 'info',
	icon: undefined,
	live: false,
	dismissible: false,
})

const emit = defineEmits<{
	(_e: 'dismiss'): void
}>()

const tone_icons: Record<NonNullable<Props['tone']>, MIconName> = {
	info: 'light-info-circle',
	success: 'light-check-circle',
	warning: 'light-exclamation-triangle',
	danger: 'light-exclamation-circle',
	neutral: 'light-info-circle',
}

const resolved_icon = computed(() => props.icon ?? tone_icons[props.tone])

const live_role = computed(() => {
	if (!props.live) return undefined
	return props.tone === 'danger' ? 'alert' : 'status'
})
</script>
