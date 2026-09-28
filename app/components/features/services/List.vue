<template>
	<div class="list">
		<div class="wrapper">
			<div class="list__con">
				<ul class="list__items">
					<li v-for="service in service_rows" :key="service.slug" class="list__item">
						<span class="list__icon">
							<MIcon :name="service.icon" size="lg" />
						</span>

						<div class="list__body">
							<MHeading variant="2" size="5" weight="semi-bold" class="list__name">
								{{ service.name }}
							</MHeading>

							<MText v-if="service.description" color="--text-secondary" class="list__text">
								{{ service.description }}
							</MText>

							<div class="list__links">
								<NuxtLink
									v-if="service.companies"
									:to="`/find?service=${service.slug}`"
									class="list__link"
								>
									{{ pluralize(service.companies, 'company', 'companies') }}
									<span class="sr-only">offering {{ service.name }}</span>
									<MIcon name="light-arrow-right" size="xs" />
								</NuxtLink>
								<span v-else class="list__empty">No companies yet</span>

								<NuxtLink
									v-if="service.professionals"
									:to="`/professionals?service=${service.slug}`"
									class="list__link"
								>
									{{ pluralize(service.professionals, 'sales pro') }}
									<span class="sr-only">for {{ service.name }}</span>
									<MIcon name="light-arrow-right" size="xs" />
								</NuxtLink>
								<span v-else class="list__empty">No sales pros yet</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { serviceIcons } from '~/data/features/taxonomies'
import type { MIconName } from '~/types/base/ui'
import type { TaxonomyItem } from '~/types/features/directory'
import { pluralize } from '~/utils/format'

const { services } = useCatalogStore()
const { companyCountBy, professionalCountBy } = useDirectoryStore()

interface ServiceRow extends TaxonomyItem {
	icon: MIconName
	companies: number
	professionals: number
}

// Counts come from the directory; an empty service is shown but never
// linked, so no one lands on an empty result page.
const service_rows: ServiceRow[] = services.map(service => ({
	...service,
	icon: serviceIcons[service.slug] ?? 'light-tag',
	companies: companyCountBy('services', service.id),
	professionals: professionalCountBy('services', service.id),
}))
</script>

<style lang="scss" scoped>
.list {
	&__con {
		padding: 8px 0 96px;
	}

	&__items {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 72px;
	}

	&__item {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 20px;
		padding: 32px 0 36px;
		border-top: var(--rule);
	}

	&__icon {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px var(--border);
		color: var(--brand);
	}

	&__body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		min-width: 0;
	}

	// optically centres the first line on the 48px icon
	&__name {
		padding-top: 11px;
	}

	&__text {
		max-width: 460px;
	}

	&__links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 28px;
		padding-top: 10px;
	}

	&__link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		color: var(--brand-strong);

		.m-icon {
			transition: transform 0.15s ease;
		}

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;

			.m-icon {
				transform: translateX(2px);
			}
		}
	}

	&__empty {
		font-family: var(--font-ui);
		font-size: 14px;
		line-height: 20px;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.list {
		&__items {
			column-gap: 40px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.list {
		&__con {
			padding-bottom: 64px;
		}

		&__items {
			grid-template-columns: minmax(0, 1fr);
		}

		&__item {
			grid-template-columns: 40px minmax(0, 1fr);
			gap: 16px;
			padding: 24px 0 28px;
		}

		&__icon {
			width: 40px;
			height: 40px;
		}

		&__name {
			padding-top: 7px;
		}
	}
}
</style>
