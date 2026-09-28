<template>
	<label
		:for="props.id"
		:class="[
			'm-radio',
			`m-radio--${props.variant}`,
			{
				'm-radio--checked': is_checked,
				'm-radio--disabled': props.disabled,
			},
		]"
	>
		<input
			:id="props.id"
			type="radio"
			class="m-radio__input"
			:name="props.name"
			:value="props.value"
			:checked="is_checked"
			:disabled="props.disabled"
			@change="emit('update:modelValue', props.value)"
		>
		<span class="m-radio__dot" aria-hidden="true" />
		<span class="m-radio__text">
			<span class="m-radio__label"><slot /></span>
			<span v-if="$slots['description']" class="m-radio__description">
				<slot name="description" />
			</span>
		</span>
		<span v-if="$slots['meta']" class="m-radio__meta">
			<slot name="meta" />
		</span>
	</label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	id: string
	name: string
	value: string
	modelValue?: string
	disabled?: boolean
	// card: a bordered, selectable panel for choices that need a description
	variant?: 'default' | 'card'
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: '',
	disabled: false,
	variant: 'default',
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: string): void
}>()

const is_checked = computed(() => props.modelValue === props.value)
</script>
