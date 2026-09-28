<template>
	<div class="services">
		<div class="wrapper">
			<div class="services__con">
				<div class="services__intro">
					<MHeading variant="2" class="services__title">Start with the service you need</MHeading>
					<MText size="large" color="--text-secondary">
						Every core outsourcing category, with the companies that deliver it and the people who sell it.
					</MText>
					<MButton variant="text" to="/services" class="services__all">
						Explore services
						<template #suffix>
							<MIcon name="light-long-arrow-right" size="sm" />
						</template>
					</MButton>
				</div>

				<ul class="services__list">
					<li v-for="service in rows" :key="service.slug">
						<NuxtLink :to="`/find?service=${service.slug}`" class="services__item">
							<span class="services__icon">
								<MIcon :name="service.icon" size="md" />
							</span>
							<span class="services__body">
								<span class="services__name">{{ service.name }}</span>
								<span class="services__description">{{ service.description }}</span>
							</span>
							<span class="services__count">{{ service.count }}</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { serviceIcons } from '~/data/features/taxonomies'
import { pluralize } from '~/utils/format'

const { services } = useCatalogStore()
const { companyCountBy } = useDirectoryStore()

const rows = services.map(service => ({
	...service,
	icon: serviceIcons[service.slug] ?? 'light-tag',
	count: pluralize(companyCountBy('services', service.id), 'company', 'companies'),
}))
</script>

<style lang="scss" scoped>
.services {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		gap: 64px;
		padding: 88px 0;
		border-top: var(--rule);
	}

	&__intro {
		position: sticky;
		top: calc(var(--header-height) + 32px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		align-self: start;
	}

	&__all {
		margin-top: 8px;
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 32px;
	}

	&__item {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		height: 100%;
		padding: 20px 0;
		border-bottom: var(--rule);

		&:hover {
			.services__name {
				color: var(--brand-strong);
			}

			.services__icon {
				background: var(--brand-soft);
				color: var(--brand-deep);
			}
		}
	}

	&__icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-sm);
		background: var(--surface-muted);
		color: var(--slate);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);
		transition: color 0.15s ease;
	}

	&__description {
		font-size: 15px;
		line-height: 21px;
		color: var(--text-secondary);
	}

	&__count {
		flex: 0 0 auto;
		padding-top: 3px;
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-muted);
		white-space: nowrap;
	}
}

@media only screen and (max-width: 1024px) {
	.services {
		&__con {
			grid-template-columns: 1fr;
			gap: 32px;
			padding: 64px 0;
		}

		&__intro {
			position: static;
		}
	}
}

@media only screen and (max-width: 640px) {
	.services {
		&__list {
			grid-template-columns: 1fr;
		}
	}
}
</style>
