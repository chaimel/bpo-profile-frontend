<template>
	<section class="m-stats-panel" :aria-labelledby="title_id">
		<div class="m-stats-panel__head">
			<div>
				<MHeading :id="title_id" variant="2" size="4" weight="semi-bold" class="m-stats-panel__title">{{ props.title }}</MHeading>
				<MText size="xsmall" color="--text-muted" class="m-stats-panel__range">
					{{ formatDate(props.stats.from) }} – {{ formatDate(props.stats.to) }} (UTC)
				</MText>
			</div>

			<div class="m-stats-panel__controls">
				<MSelect
					:id="`${props.idPrefix}-range`"
					v-model="range"
					:name="`${props.idPrefix}-range`"
					:options="range_options"
					:height="40"
					aria-label="Date range"
					class="m-stats-panel__range-select"
				/>
				<template v-if="range === 'custom'">
					<MInput :id="`${props.idPrefix}-from`" v-model="custom_from" :name="`${props.idPrefix}-from`" type="date" :height="40" aria-label="From date" />
					<MInput :id="`${props.idPrefix}-to`" v-model="custom_to" :name="`${props.idPrefix}-to`" type="date" :height="40" aria-label="To date" />
				</template>
			</div>
		</div>

		<div class="m-stats-panel__grid">
			<MStat
				label="Search impressions"
				:value="formatNumber(props.stats.search_impressions)"
				icon="light-search"
				hint="Times a result card was shown"
			/>
			<MStat
				label="Profile views"
				:value="formatNumber(props.stats.profile_views)"
				icon="light-eye"
			>
				<template v-if="props.scope === 'company' && props.stats.company_profile_views !== null">
					{{ formatNumber(props.stats.company_profile_views) }} company ·
					{{ formatNumber(props.stats.sales_profile_views ?? 0) }} sales team
				</template>
				<template v-else>Displayed profile pages</template>
			</MStat>
			<MStat
				label="Contact clicks"
				:value="formatNumber(props.stats.cta_clicks)"
				icon="light-comment-lines"
				hint="Connect, Contact and Quote buttons"
			/>
			<MStat
				label="Website clicks"
				:value="formatNumber(props.stats.website_clicks)"
				icon="light-external-link"
				hint="Visits to your website from the profile"
			/>
		</div>

		<div class="m-stats-panel__split">
			<div class="m-stats-panel__inquiries">
				<div class="m-stats-panel__inquiries-head">
					<MHeading variant="3" size="6" weight="medium" color="--text-secondary" class="m-stats-panel__subtitle">Inquiries</MHeading>
					<span class="m-stats-panel__total">{{ formatNumber(inquiry_total) }}</span>
				</div>
				<ul class="m-stats-panel__bars">
					<li v-for="row in inquiry_rows" :key="row.label" class="m-stats-panel__bar-row">
						<span class="m-stats-panel__bar-label">{{ row.label }}</span>
						<span class="m-stats-panel__bar-track" aria-hidden="true">
							<span class="m-stats-panel__bar" :style="{ width: `${row.share}%` }" />
						</span>
						<span class="m-stats-panel__bar-value">{{ formatNumber(row.value) }}</span>
					</li>
				</ul>
			</div>

			<MStat
				label="Inquiries per profile view"
				:value="formatRate(props.stats.lead_conversion_rate)"
				icon="light-chart-increase"
				tone="slate"
				class="m-stats-panel__rate"
			>
				{{ props.stats.lead_conversion_rate === null
					? 'No profile views in this period yet.'
					: 'Accepted inquiries ÷ profile views, same period.' }}
			</MStat>
		</div>

		<details class="m-stats-panel__definitions">
			<summary class="m-stats-panel__summary">
				How these numbers are counted
				<MIcon name="light-angle-down" size="sm" class="m-stats-panel__caret" />
			</summary>
			<ul>
				<li>An impression is a result card that was actually shown in search — not every result fetched.</li>
				<li>A profile view is a displayed profile page. Counts are events, not unique people.</li>
				<li>Inquiries are accepted contact, question and quote requests. Spam and deleted inquiries are excluded, and platform messages never count.</li>
				<li>Inquiries per view can exceed 100%. It is an activity ratio, not a won-deal rate.</li>
				<li v-if="props.scope === 'company'">Company totals include your sales team; their profile views are also shown separately.</li>
			</ul>
		</details>
	</section>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import type { DashboardStats } from '~/types/features/dashboard'
import { formatDate, formatNumber, formatRate } from '~/utils/format'

// Basic Phase 1 counts (docs/API.md §5 Dashboard statistics). Trends and
// breakdowns arrive with Phase 2 analytics.
interface Props {
	idPrefix: string
	stats: DashboardStats
	scope: 'company' | 'professional'
	title?: string
}

const props = withDefaults(defineProps<Props>(), {
	title: 'Performance',
})

const title_id = useId()

// Range controls are UI-only until the stats endpoint is wired up.
const range = ref('30')
const custom_from = ref(props.stats.from)
const custom_to = ref(props.stats.to)

const range_options: SelectOption[] = [
	{ label: 'Last 7 days', value: '7' },
	{ label: 'Last 30 days', value: '30' },
	{ label: 'Last 90 days', value: '90' },
	{ label: 'Custom range', value: 'custom' },
]

const inquiry_total = computed(() =>
	props.stats.inquiries.contact + props.stats.inquiries.question + props.stats.inquiries.quote,
)

const inquiry_rows = computed(() => {
	const total = Math.max(1, inquiry_total.value)
	return [
		{ label: 'Contact', value: props.stats.inquiries.contact },
		{ label: 'Questions', value: props.stats.inquiries.question },
		{ label: 'Quote requests', value: props.stats.inquiries.quote },
	].map(row => ({ ...row, share: Math.round((row.value / total) * 100) }))
})
</script>

<style lang="scss" scoped>
.m-stats-panel {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
	}

	&__title {
		font-family: var(--font-display);
	}

	&__range {
		font-family: var(--font-ui);
	}

	&__controls {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__range-select {
		width: 180px;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
	}

	&__split {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 16px;
	}

	&__inquiries {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__inquiries-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	&__subtitle {
		font-family: var(--font-ui);
	}

	&__total {
		font-family: var(--font-display);
		font-size: 30px;
		font-weight: 600;
		line-height: 38px;
	}

	&__bars {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__bar-row {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr) 48px;
		align-items: center;
		gap: 12px;
		font-family: var(--font-ui);
		font-size: 13px;
	}

	&__bar-label {
		color: var(--text-secondary);
	}

	&__bar-track {
		height: 10px;
		border-radius: var(--radius-xs);
		background: var(--surface-muted);
		overflow: hidden;
	}

	&__bar {
		display: block;
		height: 100%;
		background: var(--brand);
	}

	&__bar-value {
		font-weight: 600;
		text-align: right;
	}

	// a white card: the dashboards already sit on the canvas grey
	&__definitions {
		padding: 16px 20px;
		border: var(--rule);
		border-radius: var(--radius-md);
		background: var(--white);

		&[open] .m-stats-panel__caret {
			transform: rotate(180deg);
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-top: 12px;
			padding-left: 18px;
			list-style: disc;
		}

		li {
			font-size: 15px;
			line-height: 22px;
			color: var(--text-secondary);
		}
	}

	&__summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		list-style: none;
		cursor: pointer;

		&::-webkit-details-marker {
			display: none;
		}
	}

	&__caret {
		color: var(--text-muted);
		transition: transform 0.15s ease;
	}
}

@media only screen and (max-width: 1200px) {
	.m-stats-panel__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media only screen and (max-width: 768px) {
	.m-stats-panel {
		&__split {
			grid-template-columns: 1fr;
		}

		&__bar-row {
			grid-template-columns: 124px minmax(0, 1fr) 40px;
		}
	}
}

@media only screen and (max-width: 480px) {
	.m-stats-panel__grid {
		grid-template-columns: 1fr;
	}
}
</style>
