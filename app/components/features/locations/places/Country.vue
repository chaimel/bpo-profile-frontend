<template>
	<section :id="props.country.slug" class="country">
		<!-- no accessible name on purpose: ten region landmarks would be noise; the h2 carries it -->
		<header class="country__head">
			<span v-if="props.country.iso_code" class="country__code" aria-hidden="true">
				{{ props.country.iso_code }}
			</span>

			<MHeading variant="2" size="4" weight="semi-bold" class="country__name">
				{{ props.country.name }}
			</MHeading>

			<NuxtLink :to="`/find?country=${props.country.slug}`" class="country__all">
				<span class="sr-only">{{ props.country.name }}: </span>
				{{ all_label }}
				<MIcon name="light-arrow-right" size="xs" />
			</NuxtLink>
		</header>

		<div v-if="regions.length || direct_cities.length" class="country__groups">
			<div v-for="region in regions" :key="region.id" class="country__group">
				<MHeading variant="3" size="5" weight="semi-bold" class="country__region">
					<NuxtLink :to="`/find?location=${region.id}`" class="country__region-link">
						<span class="sr-only">BPOs in </span>{{ region.name }}
					</NuxtLink>
					<span class="country__num">
						{{ formatNumber(region.companies) }}
						<span class="sr-only">{{ noun(region.companies) }}</span>
					</span>
				</MHeading>

				<ul v-if="region.cities.length" class="country__cities">
					<li v-for="city in region.cities" :key="city.id" class="country__city">
						<NuxtLink :to="`/find?location=${city.id}`" class="country__city-link">
							<span class="sr-only">BPOs in </span>{{ city.name }}
						</NuxtLink>
						<span class="country__num">
							{{ formatNumber(city.companies) }}
							<span class="sr-only">{{ noun(city.companies) }}</span>
						</span>
					</li>
				</ul>
			</div>

			<!-- cities can sit directly under a country (docs/DATABASE.md §4.6) -->
			<div v-if="direct_cities.length" class="country__group">
				<MHeading variant="3" size="6" weight="semi-bold" color="--text-muted" class="country__region country__region--plain">
					{{ regions.length ? 'Other cities' : 'Cities' }}
				</MHeading>

				<ul class="country__cities">
					<li v-for="city in direct_cities" :key="city.id" class="country__city">
						<NuxtLink :to="`/find?location=${city.id}`" class="country__city-link">
							<span class="sr-only">BPOs in </span>{{ city.name }}
						</NuxtLink>
						<span class="country__num">
							{{ formatNumber(city.companies) }}
							<span class="sr-only">{{ noun(city.companies) }}</span>
						</span>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LocationItem } from '~/types/features/directory'
import { formatNumber } from '~/utils/format'

const { childrenOf } = useCatalogStore()
const { companyCountIn } = useDirectoryStore()

interface Props {
	country: LocationItem & { companies: number }
}

const props = defineProps<Props>()

interface Place extends LocationItem {
	companies: number
}

// Children with at least one provider, A–Z.
function placesUnder(id: number): Place[] {
	return childrenOf(id)
		.map(location => ({ ...location, companies: companyCountIn(location.id) }))
		.filter(location => location.companies > 0)
		.sort((a, b) => a.name.localeCompare(b.name))
}

const regions = computed(() =>
	placesUnder(props.country.id)
		.filter(place => place.type === 'region')
		.map(region => ({ ...region, cities: placesUnder(region.id).filter(place => place.type === 'city') })),
)

const direct_cities = computed(() => placesUnder(props.country.id).filter(place => place.type === 'city'))

const all_label = computed(() =>
	props.country.companies === 1 ? 'See 1 company' : `See all ${formatNumber(props.country.companies)} companies`,
)

function noun(count: number): string {
	return count === 1 ? 'company' : 'companies'
}
</script>

<style lang="scss" scoped>
.country {
	padding: 40px 0 8px;

	&__head {
		display: flex;
		align-items: center;
		gap: 14px;
		padding-bottom: 20px;
		border-bottom: var(--rule);
	}

	// the ISO code stands in for a flag: data, not decoration
	&__code {
		display: grid;
		place-items: center;
		min-width: 40px;
		height: 28px;
		padding: 0 6px;
		border-radius: var(--radius-xs);
		box-shadow: inset 0 0 0 1px var(--border-strong);
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
	}

	&__name {
		flex: 1 1 auto;
		min-width: 0;
	}

	&__all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex: 0 0 auto;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--brand-strong);

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__groups {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 28px 40px;
		padding-top: 24px;
	}

	&__region {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-family: var(--font-display);

		// the region headings' line height, so the city lists start level
		&--plain {
			font-family: var(--font-ui);
			line-height: 26px;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
	}

	&__region-link {
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__cities {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 8px;
		padding-left: 14px;
		border-left: 1px solid var(--border);
	}

	&__city {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: 16px;
		line-height: 24px;
	}

	&__city-link {
		color: var(--text-secondary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__num {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 500;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 600px) {
	.country {
		padding-top: 32px;

		&__head {
			flex-wrap: wrap;
			gap: 10px 12px;
		}

		&__all {
			width: 100%;
		}

		&__groups {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 24px;
		}
	}
}
</style>
