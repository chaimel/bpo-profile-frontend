<template>
	<div class="places">
		<div class="wrapper">
			<div class="places__con">
				<nav class="places__nav" aria-labelledby="places-nav-title">
					<MText id="places-nav-title" size="xsmall" weight="semi-bold" color="--text-muted" class="places__nav-title">Jump to a country</MText>
					<ul class="places__nav-list">
						<li v-for="country in country_rows" :key="country.id">
							<a :href="`#${country.slug}`" class="places__nav-link">
								{{ country.name }}
								<span class="places__nav-count">
									{{ formatNumber(country.companies) }}
									<span class="sr-only">{{ country.companies === 1 ? 'company' : 'companies' }}</span>
								</span>
							</a>
						</li>
					</ul>
				</nav>

				<div class="places__tree">
					<div class="places__global">
						<span class="places__global-mark">
							<MIcon name="light-globe" size="md" />
						</span>
						<MText color="--text-secondary" class="places__global-text">
							<span class="places__global-label">Global</span>
							{{ pluralize(total_companies, 'company', 'companies') }} across
							{{ pluralize(country_rows.length, 'country', 'countries') }}
						</MText>
						<NuxtLink to="/find" class="places__global-link">
							Browse all BPOs
							<MIcon name="light-arrow-right" size="xs" />
						</NuxtLink>
					</div>

					<Country v-for="country in country_rows" :key="country.id" :country="country" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { formatNumber, pluralize } from '~/utils/format'
import Country from './Country.vue'

const { companyCards, companyCountIn, locationsWithCompanies } = useDirectoryStore()

// Only places with providers — the index never links to an empty
// place (docs/PLAN.md §7). Countries read A–Z so no order implies rank.
const country_rows = locationsWithCompanies()
	.filter(location => location.type === 'country')
	.map(country => ({ ...country, companies: companyCountIn(country.id) }))
	.sort((a, b) => a.name.localeCompare(b.name))

const total_companies = companyCards.length
</script>

<style lang="scss" scoped>
.places {
	&__con {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		align-items: start;
		gap: 64px;
		padding: 8px 0 96px;
	}

	// --- Jump list ----------------------------------------------
	&__nav {
		position: sticky;
		top: calc(var(--header-height) + 32px);
	}

	&__nav-title {
		padding-bottom: 12px;
		font-family: var(--font-ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	&__nav-list {
		display: flex;
		flex-direction: column;
		border-top: var(--rule);
	}

	&__nav-link {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 9px 0;
		border-bottom: var(--rule);
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
		}
	}

	&__nav-count {
		font-size: 13px;
		font-weight: 400;
		color: var(--text-muted);
	}

	// --- Tree ----------------------------------------------------
	&__tree {
		min-width: 0;
	}

	&__global {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px 24px;
		border-radius: var(--radius-md);
		background: var(--canvas);
	}

	&__global-mark {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--white);
		color: var(--brand);
		flex: 0 0 auto;
	}

	&__global-text {
		flex: 1 1 auto;
	}

	&__global-label {
		display: block;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 600;
		line-height: 26px;
		color: var(--text-primary);
	}

	&__global-link {
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
}

@media only screen and (max-width: 1024px) {
	.places {
		&__con {
			grid-template-columns: 180px minmax(0, 1fr);
			gap: 40px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.places {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
			padding-bottom: 64px;
		}

		&__nav {
			position: static;
		}

		&__nav-list {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 8px;
			border-top: 0;
		}

		&__nav-link {
			gap: 8px;
			padding: 6px 10px;
			border-bottom: 0;
			border-radius: var(--radius-sm);
			box-shadow: inset 0 0 0 1px var(--border);
		}

		&__global {
			flex-wrap: wrap;
			padding: 16px;
		}

		&__global-link {
			width: 100%;
			padding-left: 56px;
		}
	}
}
</style>
