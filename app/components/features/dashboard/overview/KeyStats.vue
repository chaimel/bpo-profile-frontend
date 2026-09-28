<template>
	<section class="key-stats" aria-labelledby="overview-stats-title">
		<div class="key-stats__head">
			<div class="key-stats__heading">
				<MHeading id="overview-stats-title" variant="2" size="4" weight="semi-bold" class="key-stats__title">Last 30 days</MHeading>
				<MText size="xsmall" color="--text-muted" class="key-stats__range">
					{{ props.companyName }}, including your sales team · {{ formatDate(props.stats.from) }} – {{ formatDate(props.stats.to) }} (UTC)
				</MText>
			</div>

			<MButton variant="text" size="sm" :to="props.statsPath">
				View all stats
				<template #suffix>
					<MIcon name="light-long-arrow-right" size="xs" />
				</template>
			</MButton>
		</div>

		<ul class="key-stats__grid">
			<li>
				<MStat label="Profile views" :value="formatNumber(props.stats.profile_views)" icon="light-eye" />
			</li>
			<li>
				<MStat label="Search impressions" :value="formatNumber(props.stats.search_impressions)" icon="light-search" />
			</li>
			<li>
				<MStat label="Inquiries" :value="formatNumber(inquiry_total)" icon="light-envelope" />
			</li>
			<li>
				<MStat
					label="Inquiries per view"
					:value="formatRate(props.stats.lead_conversion_rate)"
					icon="light-chart-increase"
					:hint="props.stats.lead_conversion_rate === null ? 'Needs at least one profile view' : undefined"
				/>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardStats } from '~/types/features/dashboard'
import { formatDate, formatNumber, formatRate } from '~/utils/format'

interface Props {
	stats: DashboardStats
	companyName: string
	statsPath: string
}

const props = defineProps<Props>()

const inquiry_total = computed(() =>
	props.stats.inquiries.contact + props.stats.inquiries.question + props.stats.inquiries.quote,
)
</script>

<style lang="scss" scoped>
.key-stats {
	display: flex;
	flex-direction: column;
	gap: 16px;
	container-type: inline-size;

	&__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px 16px;
	}

	&__heading {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__range {
		font-family: var(--font-ui);
	}

	// four stats: one row when the column is wide enough, else two by two
	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;

		> li {
			display: flex;
			flex-direction: column;
		}

		// each stat is a child component's root, so the scoped rule reaches it
		.m-stat {
			flex: 1 1 auto;
		}
	}
}

@container (min-width: 680px) {
	.key-stats__grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}
</style>
