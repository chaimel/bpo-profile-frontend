<template>
	<div class="locations">
		<div class="wrapper">
			<div class="locations__con">
				<div class="locations__intro">
					<MHeading variant="2">Browse by location</MHeading>
					<MText size="large" color="--text-secondary">
						From country down to region and city. Search a country and you’ll see every company operating anywhere inside it.
					</MText>
					<MButton variant="text" to="/locations">
						All locations
						<template #suffix>
							<MIcon name="light-long-arrow-right" size="sm" />
						</template>
					</MButton>
				</div>

				<ul class="locations__list">
					<li v-for="country in rows" :key="country.id" class="locations__row">
						<NuxtLink :to="`/find?country=${country.slug}`" class="locations__country">
							{{ country.name }}
						</NuxtLink>
						<span class="locations__count">{{ country.count }}</span>
						<ul class="locations__cities" :aria-label="`Cities in ${country.name}`">
							<li v-for="city in country.cities" :key="city.id">
								<NuxtLink :to="`/find?location=${city.id}`" class="locations__city">{{ city.name }}</NuxtLink>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { pluralize } from '~/utils/format'

const { countryOf } = useCatalogStore()
const { companyCountIn, locationsWithCompanies } = useDirectoryStore()

const with_companies = locationsWithCompanies()

const rows = with_companies
	.filter(location => location.type === 'country')
	.map(country => ({
		...country,
		count: pluralize(companyCountIn(country.id), 'company', 'companies'),
		cities: with_companies.filter(location => location.type === 'city' && countryOf(location).id === country.id),
	}))
	.sort((a, b) => companyCountIn(b.id) - companyCountIn(a.id) || a.name.localeCompare(b.name))
</script>

<style lang="scss" scoped>
.locations {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
		gap: 64px;
		padding: 88px 0;
	}

	&__intro {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		order: 2;
	}

	&__list {
		display: flex;
		flex-direction: column;
	}

	&__row {
		display: grid;
		grid-template-columns: minmax(160px, 220px) 120px minmax(0, 1fr);
		align-items: baseline;
		gap: 16px;
		padding: 16px 0;
		border-bottom: var(--rule);

		&:first-child {
			border-top: var(--rule);
		}
	}

	&__country {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
		}
	}

	&__count {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-muted);
	}

	&__cities {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
	}

	&__city {
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--brand-strong);

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}
}

@media only screen and (max-width: 1024px) {
	.locations {
		&__con {
			grid-template-columns: 1fr;
			gap: 32px;
			padding: 64px 0;
		}

		&__intro {
			order: 0;
		}
	}
}

@media only screen and (max-width: 640px) {
	.locations {
		&__row {
			grid-template-columns: 1fr auto;
			gap: 4px 12px;
		}

		&__cities {
			grid-column: 1 / -1;
		}
	}
}
</style>
