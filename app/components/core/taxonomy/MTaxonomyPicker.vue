<template>
	<fieldset class="m-taxonomy-picker">
		<legend class="m-taxonomy-picker__legend">
			{{ props.legend }}
			<span class="m-taxonomy-picker__count">{{ props.modelValue.length }} selected</span>
		</legend>
		<MText v-if="props.description" size="small" color="--text-secondary" class="m-taxonomy-picker__description">{{ props.description }}</MText>

		<ul v-if="selected_items.length" class="m-taxonomy-picker__selected" aria-label="Selected">
			<li v-for="item in selected_items" :key="item.id">
				<MTag removable variant="brand" size="sm" :remove-label="`Remove ${item.name}`" @remove="toggle(item.id)">
					{{ item.name }}
				</MTag>
			</li>
		</ul>

		<MSearch
			v-if="props.items.length > 8"
			:id="`${props.id}-search`"
			v-model="term"
			:name="`${props.id}-search`"
			size="sm"
			:label="`Filter ${props.legend.toLowerCase()}`"
			:placeholder="`Filter ${props.legend.toLowerCase()}…`"
			class="m-taxonomy-picker__search"
		/>

		<div class="m-taxonomy-picker__options">
			<MCheckbox
				v-for="item in visible_items"
				:id="`${props.id}-${item.id}`"
				:key="item.id"
				:model-value="props.modelValue"
				:name="props.id"
				:value="item.id"
				:disabled="is_at_limit && !props.modelValue.includes(item.id)"
				@update:model-value="emit('update:modelValue', ($event as number[]))"
			>
				{{ item.name }}
			</MCheckbox>
			<MText v-if="!visible_items.length" size="small" color="--text-muted" class="m-taxonomy-picker__none">No matches for “{{ term }}”.</MText>
		</div>

		<MText v-if="props.max" size="small" color="--text-muted" class="m-taxonomy-picker__limit">Choose up to {{ props.max }}.</MText>
	</fieldset>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'

interface PickerItem {
	id: number
	name: string
}

interface Props {
	id: string
	legend: string
	items: PickerItem[]
	modelValue: number[]
	description?: string
	max?: number
}

const props = withDefaults(defineProps<Props>(), {
	description: undefined,
	max: undefined,
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: number[]): void
}>()

const term = ref('')

const selected_items = computed(() => props.items.filter(item => props.modelValue.includes(item.id)))

const visible_items = computed(() => {
	const query = term.value.trim().toLowerCase()
	if (!query) return props.items
	return props.items.filter(item => item.name.toLowerCase().includes(query))
})

const is_at_limit = computed(() => props.max !== undefined && props.modelValue.length >= props.max)

function toggle(id: number) {
	const next = props.modelValue.includes(id)
		? props.modelValue.filter(value => value !== id)
		: [...props.modelValue, id]
	emit('update:modelValue', next)
}
</script>

<style lang="scss" scoped>
.m-taxonomy-picker {
	display: flex;
	flex-direction: column;
	gap: 12px;
	min-width: 0;

	&__legend {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 4px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
	}

	&__count {
		font-size: 12px;
		font-weight: 400;
		color: var(--text-muted);
	}

	&__selected {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__search {
		max-width: 320px;
	}

	&__options {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px 16px;
		max-height: 260px;
		overflow-y: auto;
		padding: 14px 16px;
		border-radius: var(--radius-sm);
		box-shadow: inset 0 0 0 1px var(--border);
	}
}
</style>
