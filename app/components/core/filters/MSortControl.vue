<template>
	<div class="m-sort-control">
		<label :for="props.id" class="m-sort-control__label">Sort by</label>
		<MSelect
			:id="props.id"
			name="sort"
			:model-value="props.modelValue"
			:options="props.options"
			:height="40"
			class="m-sort-control__select"
			@update:model-value="emit('update:modelValue', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import type { SelectOption } from '~/types/base/ui'
import { sortOptions } from '~/utils/labels'

interface Props {
	id?: string
	modelValue: string
	options?: SelectOption[]
}

const props = withDefaults(defineProps<Props>(), {
	id: 'sort',
	options: () => sortOptions,
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: string): void
}>()
</script>

<style lang="scss" scoped>
.m-sort-control {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;

	&__label {
		flex: 0 0 auto;
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-secondary);
	}

	// 168px, but it gives way on narrow toolbars
	&__select {
		flex: 0 1 168px;
		min-width: 0;
	}
}
</style>
