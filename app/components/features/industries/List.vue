<template>
	<div class="list">
		<div class="wrapper">
			<div class="list__con">
				<ul class="list__items">
					<li v-for="industry in industry_rows" :key="industry.slug" class="list__item">
						<div class="list__title">
							<MIcon :name="industry.icon" size="lg" class="list__icon" />
							<MHeading variant="2" size="4" class="list__name">{{ industry.name }}</MHeading>
						</div>

						<MText v-if="industry.description" size="large" color="--text-secondary" class="list__text">
							{{ industry.description }}
						</MText>

						<div class="list__links">
							<NuxtLink
								v-if="industry.companies"
								:to="`/find?industry=${industry.slug}`"
								class="list__link"
							>
								<span class="list__count">{{ formatNumber(industry.companies) }}</span>
								<span class="list__label">
									{{ industry.companies === 1 ? 'company' : 'companies' }}
									<span class="sr-only">serving {{ industry.name }}</span>
								</span>
								<MIcon name="light-arrow-right" size="sm" class="list__arrow" />
							</NuxtLink>
							<span v-else class="list__empty">No companies yet</span>

							<NuxtLink
								v-if="industry.professionals"
								:to="`/professionals?industry=${industry.slug}`"
								class="list__link"
							>
								<span class="list__count">{{ formatNumber(industry.professionals) }}</span>
								<span class="list__label">
									{{ industry.professionals === 1 ? 'sales pro' : 'sales pros' }}
									<span class="sr-only">for {{ industry.name }}</span>
								</span>
								<MIcon name="light-arrow-right" size="sm" class="list__arrow" />
							</NuxtLink>
							<span v-else class="list__empty">No sales pros yet</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { industryIcons } from '~/data/features/taxonomies'
import type { MIconName } from '~/types/base/ui'
import type { TaxonomyItem } from '~/types/features/directory'
import { formatNumber } from '~/utils/format'

const { industries } = useCatalogStore()
const { companyCountBy, professionalCountBy } = useDirectoryStore()

interface IndustryRow extends TaxonomyItem {
	icon: MIconName
	companies: number
	professionals: number
}

// Counts come from the directory; an empty industry is shown but never
// linked, so no one lands on an empty result page.
const industry_rows: IndustryRow[] = industries.map(industry => ({
	...industry,
	icon: industryIcons[industry.slug] ?? 'light-building',
	companies: companyCountBy('industries', industry.id),
	professionals: professionalCountBy('industries', industry.id),
}))
</script>

<style lang="scss" scoped>
.list {
	&__con {
		padding: 24px 0 96px;
	}

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 5fr) minmax(0, 3fr);
		align-items: start;
		gap: 40px;
		padding: 36px 0;
		border-bottom: var(--rule);
	}

	&__title {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	&__icon {
		color: var(--slate);
	}

	&__text {
		max-width: 480px;
	}

	&__links {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__link {
		display: grid;
		grid-template-columns: minmax(56px, auto) minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 8px;
		padding-bottom: 12px;
		border-bottom: 1px dashed var(--border-strong);
		color: var(--text-primary);

		&:hover {
			border-bottom-color: var(--brand-strong);

			.list__label {
				color: var(--brand-deep);
				text-decoration: underline;
				text-underline-offset: 3px;
			}

			.list__arrow {
				transform: translateX(2px);
			}
		}
	}

	&__count {
		font-family: var(--font-display);
		font-size: 28px;
		font-weight: 600;
		line-height: 1;
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--brand-strong);
	}

	&__arrow {
		align-self: center;
		color: var(--brand-strong);
		transition: transform 0.15s ease;
	}

	&__empty {
		padding-bottom: 12px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.list {
		&__item {
			grid-template-columns: minmax(0, 1fr) minmax(0, 220px);
			gap: 16px 40px;
		}

		&__title {
			grid-column: 1 / -1;
		}
	}
}

@media only screen and (max-width: 768px) {
	.list {
		&__con {
			padding: 8px 0 64px;
		}

		&__item {
			grid-template-columns: minmax(0, 1fr);
			gap: 12px;
			padding: 28px 0;
		}

		&__links {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 12px 32px;
			padding-top: 8px;
		}

		&__link {
			grid-template-columns: auto auto auto;
			padding-bottom: 8px;
		}
	}
}
</style>
