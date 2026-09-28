<template>
	<div v-if="props.chips.length" class="m-filter-chips">
		<span class="m-filter-chips__label" :id="label_id">Filtered by</span>
		<ul class="m-filter-chips__list" :aria-labelledby="label_id">
			<li v-for="chip in props.chips" :key="chip.key">
				<MTag
					removable
					variant="brand"
					size="sm"
					:remove-label="`Remove filter: ${chip.label}`"
					@remove="emit('remove', chip.key)"
				>
					{{ chip.label }}
				</MTag>
			</li>
		</ul>
		<MButton variant="text" size="sm" class="m-filter-chips__clear" @click="emit('clear')">
			Clear all
		</MButton>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

interface FilterChip {
	// the query key the chip removes, e.g. "service"
	key: string
	label: string
}

interface Props {
	chips: FilterChip[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'remove', _key: string): void
	(_e: 'clear'): void
}>()

const label_id = useId()
</script>

<style lang="scss" scoped>
.m-filter-chips {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px 12px;

	&__label {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-muted);
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__clear {
		font-size: 13px;
	}
}
</style>
