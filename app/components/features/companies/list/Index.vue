<template>
	<div class="list">
		<div class="wrapper">
			<div class="list__con">
				<MText size="small" color="--text-muted" role="status" class="list__status">
					Showing {{ range_label }} of {{ pluralize(props.results.meta.total, 'company', 'companies') }}
				</MText>

				<Items :companies="props.results.data" @clear="emit('clear')" />

				<MPagination
					:model-value="props.results.meta.current_page"
					:last-page="props.results.meta.last_page"
					:href-for="props.pageLink"
					label="BPO company pages"
					class="list__pagination"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { Paginated } from '~/types/api/common'
import type { CompanyCard } from '~/types/features/directory'
import { pluralize } from '~/utils/format'
import Items from './Items.vue'

interface Props {
	results: Paginated<CompanyCard>
	pageLink: (page: number) => RouteLocationRaw
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'clear'): void
}>()

const range_label = computed(() => {
	const { current_page, per_page, total } = props.results.meta
	if (!total) return '0'
	const start = (current_page - 1) * per_page + 1
	return `${start}–${Math.min(start + per_page - 1, total)}`
})
</script>

<style lang="scss" scoped>
.list {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 28px 0 72px;
	}

	&__status {
		font-family: var(--font-ui);
	}

	&__pagination {
		padding-top: 24px;
	}
}
</style>
