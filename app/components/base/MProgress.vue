<template>
	<div :class="['m-progress', `m-progress--${resolved_tone}`, `m-progress--${props.size}`]">
		<div v-if="props.label || $slots['label']" class="m-progress__head">
			<span :id="label_id" class="m-progress__label">
				<slot name="label">{{ props.label }}</slot>
			</span>
			<span class="m-progress__value">{{ clamped }}%</span>
		</div>
		<div
			class="m-progress__track"
			role="progressbar"
			:aria-valuenow="clamped"
			aria-valuemin="0"
			aria-valuemax="100"
			:aria-labelledby="props.label || $slots['label'] ? label_id : undefined"
			:aria-label="props.label || $slots['label'] ? undefined : props.ariaLabel"
		>
			<span class="m-progress__bar" :style="{ width: `${clamped}%` }" />
			<span
				v-if="props.threshold !== undefined"
				class="m-progress__threshold"
				:style="{ left: `${props.threshold}%` }"
				aria-hidden="true"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
	value: number
	label?: string
	// accessible name when no visible label is shown
	ariaLabel?: string
	// marks a target on the track, e.g. the 80% "Profile complete" line
	threshold?: number
	tone?: 'auto' | 'brand' | 'success' | 'warning'
	size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	ariaLabel: 'Progress',
	threshold: undefined,
	tone: 'auto',
	size: 'md',
})

const label_id = useId()

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.value))))

// auto: success once the threshold is met, brand otherwise
const resolved_tone = computed(() => {
	if (props.tone !== 'auto') return props.tone
	if (props.threshold !== undefined && clamped.value >= props.threshold) return 'success'
	return 'brand'
})
</script>
