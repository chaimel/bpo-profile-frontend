<template>
	<div class="comparison" :style="{ '--plan-count': props.plans.length }">
		<div class="wrapper">
			<div class="comparison__con">
				<div class="comparison__head">
					<MHeading id="compare-plans-title" variant="2" size="3">Compare plans</MHeading>
					<MText size="large" color="--text-secondary" class="comparison__lede">
						What each plan includes today, and what arrives later.
					</MText>
				</div>

				<!-- focusable so keyboard users can scroll the table on small screens -->
				<div class="comparison__scroll" role="region" aria-labelledby="compare-plans-title" tabindex="0">
					<table class="comparison__table" role="table">
						<caption class="sr-only">
							Listing plan features by plan: included, coming later, not included, or ask us
						</caption>
						<thead role="rowgroup">
							<tr role="row">
								<th scope="col" role="columnheader" class="comparison__col comparison__col--feature">Feature</th>
								<th v-for="plan in props.plans" :key="plan.slug" scope="col" role="columnheader" class="comparison__col">
									{{ plan.name }}
								</th>
							</tr>
						</thead>
						<tbody role="rowgroup">
							<tr v-for="row in planComparison" :key="row.label" role="row" class="comparison__row">
								<th scope="row" role="rowheader" class="comparison__feature">{{ row.label }}</th>
								<td v-for="plan in props.plans" :key="plan.slug" role="cell" class="comparison__cell">
									<span :class="['comparison__value', `comparison__value--${comparisonValue(row, plan.slug)}`]">
										<MIcon :name="value_meta[comparisonValue(row, plan.slug)].icon" size="sm" />
										{{ value_meta[comparisonValue(row, plan.slug)].label }}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<MText size="small" color="--text-secondary" class="comparison__note">
					<MIcon name="light-info-circle" size="sm" class="comparison__note-icon" />
					<span>{{ comparisonNote }}</span>
				</MText>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { comparisonNote, planComparison } from '~/data/features/pricing'
import type { MIconName } from '~/types/base/ui'
import type { ComparisonValue } from '~/types/features/content'
import type { Plan } from '~/types/features/directory'
import { comparisonValue } from '~/utils/plans'

const props = defineProps<{ plans: Plan[] }>()

// Always a word and an icon — never color alone.
const value_meta: Record<ComparisonValue, { label: string, icon: MIconName }> = {
	yes: { label: 'Included', icon: 'light-check-circle' },
	later: { label: 'Coming later', icon: 'light-alarm-clock' },
	no: { label: 'Not included', icon: 'light-minus' },
	unspecified: { label: 'Ask us', icon: 'light-info-circle' },
}
</script>

<style lang="scss" scoped>
.comparison {
	background: var(--canvas);

	&__con {
		padding: 96px 0;
	}

	&__head {
		max-width: 640px;
		padding-bottom: 40px;
	}

	&__lede {
		padding-top: 12px;
	}

	&__scroll {
		overflow-x: auto;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__table {
		width: 100%;
		min-width: max(760px, calc(280px + var(--plan-count) * 150px));
		border-collapse: collapse;
		font-family: var(--font-ui);
		text-align: left;
	}

	&__col {
		width: 150px;
		padding: 20px 20px 16px;
		border-bottom: 2px solid var(--text-primary);
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);

		&--feature {
			width: auto;
			font-family: var(--font-ui);
			font-size: 12px;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-muted);
		}
	}

	&__row {
		&:not(:last-child) {
			.comparison__feature,
			.comparison__cell {
				border-bottom: var(--rule);
			}
		}
	}

	&__feature {
		padding: 16px 20px;
		font-family: var(--font-base);
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
		color: var(--text-primary);
	}

	&__cell {
		padding: 16px 20px;
		vertical-align: middle;
	}

	&__value {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		white-space: nowrap;
		color: var(--text-primary);

		&--yes {
			.m-icon {
				color: var(--success);
			}
		}

		&--later {
			color: var(--text-secondary);

			.m-icon {
				color: var(--warning);
			}
		}

		&--no {
			color: var(--text-muted);
		}
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		max-width: 720px;
		padding-top: 20px;
	}

	&__note-icon {
		margin-top: 3px;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 768px) {
	.comparison {
		&__con {
			padding: 64px 0;
		}

		&__head {
			padding-bottom: 28px;
		}
	}
}

// Phones: each feature takes a full row, with the plans side by side
// beneath it. Three plans fit the narrowest screen; extra plans scroll
// inside the comparison region while the feature name stays in view.
@media only screen and (max-width: 600px) {
	.comparison {
		&__scroll {
			container-type: inline-size;
		}

		&__table,
		&__table thead,
		&__table tbody {
			display: block;
			min-width: calc(var(--plan-count) * 96px);
		}

		&__table thead tr,
		&__row {
			display: grid;
			grid-template-columns: repeat(var(--plan-count), minmax(0, 1fr));
		}

		&__col {
			width: auto;
			padding: 14px 6px 12px;
			font-size: 14px;
			line-height: 20px;
			text-align: center;

			&--feature {
				display: none;
			}
		}

		&__row:not(:last-child) {
			border-bottom: var(--rule);

			.comparison__feature,
			.comparison__cell {
				border-bottom: 0;
			}
		}

		// as wide as the visible region, and held there while it scrolls
		&__feature {
			position: sticky;
			left: 0;
			grid-column: 1 / -1;
			max-width: 100cqi;
			padding: 14px 14px 4px;
			font-size: 15px;
			line-height: 22px;
		}

		&__cell {
			padding: 6px 4px 14px;
			text-align: center;
		}

		&__value {
			flex-direction: column;
			gap: 4px;
			font-size: 12px;
			line-height: 16px;
			white-space: normal;
		}
	}
}
</style>
