<template>
	<div
		:class="[
			'm-code',
			{
				'm-code--error': props.hasError,
				'm-code--focused': is_focused,
				'm-code--disabled': props.disabled,
			},
		]"
	>
		<label v-if="$slots['label']" :for="props.id" class="m-input-label">
			<slot name="label" />
		</label>

		<!-- One real input for paste, autofill and screen readers; the
			cells are only its visual rendering. -->
		<div class="m-code__field">
			<input
				:id="props.id"
				class="m-code__input"
				:name="props.name"
				:value="props.modelValue"
				type="text"
				inputmode="numeric"
				autocomplete="one-time-code"
				pattern="[0-9]*"
				:maxlength="props.length"
				:disabled="props.disabled"
				:aria-invalid="props.hasError || undefined"
				:aria-describedby="described_by"
				@input="onInput"
				@focus="is_focused = true"
				@blur="is_focused = false"
			>
			<div class="m-code__cells" aria-hidden="true">
				<span
					v-for="(digit, index) in cells"
					:key="index"
					:class="[
						'm-code__cell',
						{
							'm-code__cell--filled': digit !== '',
							'm-code__cell--active': is_focused && index === active_index,
						},
					]"
				>{{ digit }}</span>
			</div>
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
import { computed, ref, useSlots } from 'vue'
import MIcon from './MIcon.vue'

interface Props {
	id: string
	name?: string
	// kept as a string so leading zeros survive (docs/API.md §1)
	modelValue?: string
	length?: number
	hasError?: boolean
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	name: 'code',
	modelValue: '',
	length: 6,
	hasError: false,
	disabled: false,
})

const emit = defineEmits<{
	(_e: 'update:modelValue' | 'complete', _value: string): void
}>()

const slots = useSlots()

const is_focused = ref(false)

const hint_id = computed(() => `${props.id}-hint`)
const error_id = computed(() => `${props.id}-error`)

const described_by = computed(() => {
	if (props.hasError && slots.error) return error_id.value
	if (slots.hint) return hint_id.value
	return undefined
})

const cells = computed(() =>
	Array.from({ length: props.length }, (_, index) => props.modelValue.charAt(index)),
)

const active_index = computed(() => Math.min(props.modelValue.length, props.length - 1))

function onInput(event: Event) {
	const input = event.target as HTMLInputElement
	const digits = input.value.replace(/\D/g, '').slice(0, props.length)

	// keep the DOM in step when non-digits were stripped
	if (input.value !== digits) input.value = digits

	emit('update:modelValue', digits)
	if (digits.length === props.length) emit('complete', digits)
}
</script>
