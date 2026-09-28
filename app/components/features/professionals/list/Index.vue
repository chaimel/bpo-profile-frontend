<template>
	<div class="list">
		<div class="wrapper">
			<div class="list__con">
				<MText size="small" color="--text-muted" role="status" class="list__status">
					{{ pluralize(props.results.meta.total, 'sales pro') }}
				</MText>

				<Items :professionals="props.results.data" @clear="emit('clear')" />

				<MPagination
					:model-value="props.results.meta.current_page"
					:last-page="props.results.meta.last_page"
					:href-for="props.pageLink"
					label="Sales pro pages"
					class="list__pagination"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Paginated } from '~/types/api/common'
import type { ProfessionalCard } from '~/types/features/directory'
import { pluralize } from '~/utils/format'
import Items from './Items.vue'

interface Props {
	results: Paginated<ProfessionalCard>
	pageLink: (page: number) => RouteLocationRaw
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'clear'): void
}>()
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
