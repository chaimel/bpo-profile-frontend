<template>
	<div class="industries">
		<div class="wrapper">
			<div class="industries__con">
				<div class="industries__head">
					<MHeading variant="2">Browse by industry</MHeading>
					<MButton variant="text" to="/industries">
						All industries
						<template #suffix>
							<MIcon name="light-long-arrow-right" size="sm" />
						</template>
					</MButton>
				</div>

				<ul class="industries__grid">
					<li v-for="industry in rows" :key="industry.slug">
						<NuxtLink :to="`/find?industry=${industry.slug}`" class="industries__item">
							<MIcon :name="industry.icon" size="lg" class="industries__icon" />
							<span class="industries__name">{{ industry.name }}</span>
							<span class="industries__count">{{ industry.count }}</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { industryIcons } from '~/data/features/taxonomies'
import { pluralize } from '~/utils/format'

const { industries } = useCatalogStore()
const { companyCountBy } = useDirectoryStore()

const rows = industries.map(industry => ({
	...industry,
	icon: industryIcons[industry.slug] ?? 'light-building',
	count: pluralize(companyCountBy('industries', industry.id), 'company', 'companies'),
}))
</script>

<style lang="scss" scoped>
.industries {
	background: var(--canvas);

	&__con {
		padding: 80px 0 88px;
	}

	&__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		padding-bottom: 36px;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0 32px;
	}

	// Typographic tiles: a top rule instead of a box.
	&__item {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
		padding: 20px 0 28px;
		border-top: 2px solid var(--border-strong);
		transition: border-color 0.15s ease;

		&:hover {
			border-top-color: var(--brand);

			.industries__name {
				color: var(--brand-strong);
			}
		}
	}

	&__icon {
		margin-bottom: 8px;
		color: var(--brand);
	}

	&__name {
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 600;
		line-height: 26px;
		color: var(--text-primary);
		// long single words ("Telecommunications") break instead of overflowing
		overflow-wrap: anywhere;
		hyphens: auto;
		transition: color 0.15s ease;
	}

	&__count {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.industries {
		&__con {
			padding: 64px 0;
		}

		&__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
}

@media only screen and (max-width: 480px) {
	.industries {
		&__head {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		&__grid {
			column-gap: 20px;
		}

		&__name {
			font-size: 17px;
			line-height: 24px;
		}
	}
}
</style>
