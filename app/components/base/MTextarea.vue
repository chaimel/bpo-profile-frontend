<template>
	<div
		:class="['m-textarea-container', { 'm-textarea-container--disabled': props.disabled }, root_class]"
		:style="root_style"
	>
		<label v-if="$slots['label']" :for="props.id" class="m-textarea-label">
			<slot name="label" />
			<span v-if="props.optional" class="m-field-optional">Optional</span>
		</label>

		<div
			:class="[
				'm-textarea-inner',
				{
					'm-textarea-inner--error': props.hasError,
					'm-textarea-inner--focused': is_focused && !props.readonly,
					'm-textarea-inner--readonly': props.readonly,
				},
			]"
		>
			<textarea
				:id="props.id"
				v-bind="input_attrs"
				:value="model"
				class="m-textarea"
				:name="props.name"
				:rows="props.rows"
				:placeholder="props.placeholder"
				:required="props.required"
				:readonly="props.readonly"
				:disabled="props.disabled"
				:maxlength="props.maxLength"
				:aria-invalid="props.hasError || undefined"
				:aria-describedby="described_by"
				@input="onInput"
				@focus="is_focused = true"
				@blur="is_focused = false"
			/>
		</div>

		<div v-if="(props.maxLength || $slots['hint']) && !props.hasError" class="m-textarea-foot">
			<span :id="hint_id" class="m-field-hint"><slot name="hint" /></span>
			<span v-if="props.maxLength" class="m-textarea-count" aria-live="polite">
				{{ model.length }} / {{ props.maxLength }}
			</span>
		</div>

		<p v-if="props.hasError && $slots['error']" :id="error_id" class="m-field-error">
			<MIcon name="light-exclamation-circle" size="xs" />
			<slot name="error" />
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import MIcon from './MIcon.vue'

defineOptions({
	inheritAttrs: false,
})

interface Props {
	id: string
	name: string
	modelValue?: string | null
	placeholder?: string
	rows?: number
	hasError?: boolean
	required?: boolean
	optional?: boolean
	readonly?: boolean
	disabled?: boolean
	maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: '',
	placeholder: '',
	rows: 5,
	hasError: false,
	required: false,
	optional: false,
	readonly: false,
	disabled: false,
	maxLength: undefined,
})

const emit = defineEmits<{
	(_e: 'update:modelValue' | 'input', _value: string): void
}>()

const attrs = useAttrs()
const slots = useSlots()

const is_focused = ref(false)

const hint_id = computed(() => `${props.id}-hint`)
const error_id = computed(() => `${props.id}-error`)

const root_class = computed(() => attrs.class)
const root_style = computed(() => attrs.style as string | Record<string, string> | undefined)
const input_attrs = computed(() => {
	const { class: _class, style: _style, ...rest } = attrs
	return rest
})

const described_by = computed(() => {
	if (props.hasError && slots.error) return error_id.value
	if (slots.hint) return hint_id.value
	return undefined
})

const model = computed({
	get: () => props.modelValue ?? '',
	set: (value: string) => emit('update:modelValue', value),
})

function onInput(event: Event) {
	const value = (event.target as HTMLTextAreaElement).value
	model.value = value
	emit('input', value)
}
</script>
