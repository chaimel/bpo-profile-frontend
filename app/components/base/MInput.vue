<template>
	<div
		:class="['m-input-container', { 'm-input-container--disabled': props.disabled }, root_class]"
		:style="root_style"
	>
		<label v-if="$slots['label']" :for="props.id" class="m-input-label">
			<slot name="label" />
			<span v-if="props.optional" class="m-field-optional">Optional</span>
		</label>

		<!-- input inner -->
		<div
			:class="[
				'm-input-inner',
				`m-input-inner--radius-${props.radius}`,
				{
					'm-input-inner--error': props.hasError,
					'm-input-inner--focused': is_focused && !props.readonly,
					'm-input-inner--readonly': props.readonly,
				},
			]"
			:style="{ height: `${props.height}px` }"
		>
			<span v-if="$slots['inner-left']" class="m-inner m-inner-left">
				<slot name="inner-left" />
			</span>

			<slot name="prefix" />

			<input
				:id="props.id"
				v-bind="input_attrs"
				:value="model"
				:class="['m-input', `text-${props.align}`]"
				:type="resolved_type"
				:name="props.name"
				:placeholder="props.placeholder"
				:autocomplete="props.autocomplete"
				:required="props.required"
				:readonly="props.readonly"
				:disabled="props.disabled"
				:maxlength="props.maxLength"
				:aria-invalid="props.hasError || undefined"
				:aria-describedby="described_by"
				@input="onInput"
				@change="onNativeChange"
				@keyup.enter="emit('enter')"
				@focus="is_focused = true"
				@blur="is_focused = false"
			>

			<slot name="suffix" />

			<button
				v-if="props.type === 'password' && props.revealable"
				type="button"
				class="m-input-reveal"
				:aria-label="is_revealed ? 'Hide password' : 'Show password'"
				:aria-pressed="is_revealed"
				@click="is_revealed = !is_revealed"
			>
				<MIcon :name="is_revealed ? 'light-eye-slash' : 'light-eye'" size="sm" />
			</button>

			<span v-if="$slots['inner-right']" class="m-inner m-inner-right">
				<slot name="inner-right" />
			</span>
		</div>

		<p v-if="$slots['hint'] && !props.hasError" :id="hint_id" class="m-field-hint">
			<slot name="hint" />
		</p>

		<!-- error -->
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
	type?: 'text' | 'email' | 'search' | 'password' | 'url' | 'tel' | 'number' | 'date'
	placeholder?: string
	autocomplete?: string
	modelValue?: string | null
	hasError?: boolean
	required?: boolean
	// labels the field "Optional" — forms mark the exception, not the rule
	optional?: boolean
	align?: 'left' | 'right' | 'center'
	radius?: 'sm' | 'md' | 'full'
	height?: number
	readonly?: boolean
	disabled?: boolean
	maxLength?: number
	// adds a show/hide toggle to password fields
	revealable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
	placeholder: '',
	autocomplete: 'on',
	modelValue: '',
	hasError: false,
	required: false,
	optional: false,
	align: 'left',
	radius: 'sm',
	height: 44,
	readonly: false,
	disabled: false,
	maxLength: undefined,
	revealable: false,
})

const emit = defineEmits<{
	(_e: 'update:modelValue' | 'change' | 'input', _value: string): void
	(_e: 'enter'): void
}>()

const attrs = useAttrs()
const slots = useSlots()

const is_focused = ref(false)
const is_revealed = ref(false)

const hint_id = computed(() => `${props.id}-hint`)
const error_id = computed(() => `${props.id}-error`)

// class/style style the container; everything else (inputmode, min,
// aria-*) belongs on the native input.
const root_class = computed(() => attrs.class)
const root_style = computed(() => attrs.style as string | Record<string, string> | undefined)
const input_attrs = computed(() => {
	const { class: _class, style: _style, ...rest } = attrs
	return rest
})

const resolved_type = computed(() => (props.type === 'password' && is_revealed.value ? 'text' : props.type))

const described_by = computed(() => {
	const ids: string[] = []
	if (props.hasError && slots.error) ids.push(error_id.value)
	else if (slots.hint) ids.push(hint_id.value)
	return ids.length ? ids.join(' ') : undefined
})

const model = computed({
	get: () => props.modelValue ?? '',
	set: (value: string) => emit('update:modelValue', value),
})

function onInput(event: Event) {
	const value = (event.target as HTMLInputElement).value
	model.value = value
	emit('input', value)
}

function onNativeChange(event: Event) {
	emit('change', (event.target as HTMLInputElement).value)
}
</script>
