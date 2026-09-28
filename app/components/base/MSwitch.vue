<template>
	<button
		:id="props.id"
		type="button"
		role="switch"
		:aria-checked="props.modelValue"
		:aria-label="$slots['default'] ? undefined : props.label"
		:disabled="props.disabled"
		:class="[
			'm-switch',
			{
				'm-switch--on': props.modelValue,
				'm-switch--disabled': props.disabled,
			},
		]"
		@click="emit('update:modelValue', !props.modelValue)"
	>
		<span class="m-switch__track" aria-hidden="true">
			<span class="m-switch__thumb" />
		</span>
		<span v-if="$slots['default']" class="m-switch__label">
			<slot />
		</span>
	</button>
</template>

<script setup lang="ts">
interface Props {
	id?: string
	modelValue?: boolean
	// accessible name when there is no visible label
	label?: string
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	id: undefined,
	modelValue: false,
	label: '',
	disabled: false,
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: boolean): void
}>()
</script>
