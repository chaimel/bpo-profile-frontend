<template>
	<div class="m-search" :style="root_style">
		<MInput
			:id="props.id"
			:name="props.name"
			type="search"
			:model-value="props.modelValue"
			:placeholder="props.placeholder"
			:autocomplete="props.autocomplete"
			:required="props.required"
			:has-error="props.hasError"
			:height="resolved_height"
			:radius="props.radius"
			:align="props.align"
			:aria-label="$slots['label'] ? undefined : props.label"
			@update:model-value="onModelUpdate"
			@enter="emit('enter')"
		>
			<template v-if="$slots['label']" #label>
				<slot name="label" />
			</template>

			<template #inner-left>
				<slot name="left">
					<MIcon :name="props.icon" size="sm" class="m-search__icon" />
				</slot>
			</template>

			<template v-if="has_right_content" #inner-right>
				<slot name="right" />

				<button
					v-if="props.clearable && has_value"
					type="button"
					class="m-search__clear"
					aria-label="Clear search"
					@click="clearSearch"
				>
					<MIcon name="light-times" size="xs" />
				</button>
			</template>
		</MInput>
	</div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import MIcon from '~/components/base/MIcon.vue'
import MInput from '~/components/base/MInput.vue'
import type { SearchProps, SearchValue } from '~/types/base/search'
import type { MIconName } from '~/types/base/ui'

const props = withDefaults(defineProps<SearchProps & { icon?: MIconName }>(), {
	id: 'search-input',
	name: 'q',
	modelValue: '',
	placeholder: 'Search',
	autocomplete: 'off',
	required: false,
	hasError: false,
	size: 'md',
	height: undefined,
	align: 'left',
	radius: 'sm',
	clearable: true,
	width: null,
	label: 'Search',
	icon: 'light-search',
})

const emit = defineEmits<{
	(_e: 'update:modelValue' | 'search', _value: SearchValue): void
	(_e: 'clear' | 'enter'): void
}>()

const slots = useSlots()

// Height falls back to the size scale so callers can pass either.
const size_height = {
	sm: 36,
	md: 44,
	lg: 52,
} as const

const has_value = computed(() => Boolean(props.modelValue && props.modelValue.trim()))
const has_right_content = computed(() => Boolean(slots.right) || (props.clearable && has_value.value))
const resolved_height = computed(() => props.height ?? size_height[props.size ?? 'md'])
const root_style = computed(() => {
	if (props.width === null || props.width === undefined) return undefined
	return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
})

function onModelUpdate(value: SearchValue) {
	emit('update:modelValue', value)
	emit('search', value)
}

function clearSearch() {
	emit('update:modelValue', '')
	emit('clear')
}
</script>
