<template>
	<div class="m-checkbox-field">
		<label
			:for="props.id"
			:class="[
				'm-checkbox',
				{
					'm-checkbox--checked': is_checked,
					'm-checkbox--disabled': props.disabled,
					'm-checkbox--error': props.hasError,
				},
			]"
		>
			<input
				:id="props.id"
				type="checkbox"
				class="m-checkbox__input"
				:name="props.name"
				:value="props.value"
				:checked="is_checked"
				:disabled="props.disabled"
				:aria-invalid="props.hasError || undefined"
				:aria-describedby="props.hasError && $slots['error'] ? error_id : undefined"
				@change="onChange"
			>
			<span class="m-checkbox__box" aria-hidden="true">
				<MIcon name="light-check" size="xs" />
			</span>
			<span class="m-checkbox__text">
				<span class="m-checkbox__label"><slot /></span>
				<span v-if="$slots['description']" class="m-checkbox__description">
					<slot name="description" />
				</span>
			</span>
			<span v-if="$slots['meta']" class="m-checkbox__meta">
				<slot name="meta" />
			</span>
		</label>

		<!-- outside the label, so the error is the description, not part of the name -->
		<p v-if="props.hasError && $slots['error']" :id="error_id" class="m-field-error">
			<MIcon name="light-exclamation-circle" size="xs" />
			<slot name="error" />
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MIcon from './MIcon.vue'

type CheckboxValue = string | number

interface Props {
	id: string
	name?: string
	// boolean for a single toggle, an array for a group of values
	modelValue?: boolean | CheckboxValue[]
	value?: CheckboxValue
	disabled?: boolean
	hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	name: undefined,
	modelValue: false,
	value: undefined,
	disabled: false,
	hasError: false,
})

const error_id = computed(() => `${props.id}-error`)

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: boolean | CheckboxValue[]): void
}>()

const is_checked = computed(() => {
	if (Array.isArray(props.modelValue)) {
		return props.value !== undefined && props.modelValue.includes(props.value)
	}
	return props.modelValue
})

function onChange(event: Event) {
	const checked = (event.target as HTMLInputElement).checked

	if (!Array.isArray(props.modelValue)) {
		emit('update:modelValue', checked)
		return
	}

	if (props.value === undefined) return
	const next = props.modelValue.filter(item => item !== props.value)
	if (checked) next.push(props.value)
	emit('update:modelValue', next)
}
</script>
