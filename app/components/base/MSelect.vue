<template>
	<div
		:class="['m-select-container', { 'm-select-container--disabled': props.disabled }, root_class]"
		:style="root_style"
	>
		<label v-if="$slots['label']" :for="props.id" class="m-select-label">
			<slot name="label" />
			<span v-if="props.optional" class="m-field-optional">Optional</span>
		</label>

		<div
			:class="[
				'm-select-inner',
				{
					'm-select-inner--error': props.hasError,
					'm-select-inner--focused': is_focused,
					'm-select-inner--placeholder': !model,
				},
			]"
			:style="{ '--select-height': `${props.height}px` }"
		>
			<span v-if="$slots['inner-left']" class="m-inner m-inner-left">
				<slot name="inner-left" />
			</span>

			<select
				:id="props.id"
				v-bind="input_attrs"
				v-model="model"
				class="m-select"
				:name="props.name"
				:required="props.required"
				:disabled="props.disabled"
				:aria-invalid="props.hasError || undefined"
				:aria-describedby="described_by"
				@focus="is_focused = true"
				@blur="is_focused = false"
			>
				<!-- the placeholder doubles as "any", so filters can reset to it -->
				<option v-if="props.placeholder" value="">{{ props.placeholder }}</option>
				<option
					v-for="option in normalised_options"
					:key="option.value"
					:value="option.value"
					:disabled="option.disabled"
				>
					{{ option.label }}
				</option>
			</select>

			<MIcon name="light-angle-down" size="xs" class="m-select-caret" />
		</div>

		<p v-if="$slots['hint'] && !props.hasError" :id="hint_id" class="m-field-hint">
			<slot name="hint" />
		</p>

		<p v-if="props.hasError && $slots['error']" :id="error_id" class="m-field-error">
			<MIcon name="light-exclamation-circle" size="xs" />
			<slot name="error" />
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import MIcon from './MIcon.vue'

defineOptions({
	inheritAttrs: false,
})

interface Props {
	id: string
	name: string
	// plain strings or {label, value} pairs
	options: (string | SelectOption)[]
	modelValue?: string
	placeholder?: string
	height?: number
	hasError?: boolean
	required?: boolean
	optional?: boolean
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: '',
	placeholder: '',
	height: 44,
	hasError: false,
	required: false,
	optional: false,
	disabled: false,
})

const emit = defineEmits<{
	(_e: 'update:modelValue' | 'change', _value: string): void
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
	get: () => props.modelValue,
	set: (value: string) => {
		emit('update:modelValue', value)
		emit('change', value)
	},
})

const normalised_options = computed<SelectOption[]>(() =>
	props.options.map(option =>
		typeof option === 'string' ? { label: option, value: option } : option,
	),
)
</script>
