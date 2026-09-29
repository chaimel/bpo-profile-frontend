<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__grid">
					<div class="banner__text">
						<MHeading variant="1">{{ sitemapIntro.title }}</MHeading>
						<MText size="xlarge" color="--text-secondary" class="banner__lede">{{ sitemapIntro.lede }}</MText>
					</div>

					<Totals :totals="totals" class="banner__totals" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { sitemapAreas, sitemapIntro, sitemapScreens } from '~/data/features/sitemap'
import type { BreadcrumbItem } from '~/types/base/ui'
import Totals from '../shared/Totals.vue'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Guide', to: '/static/guide' },
	{ label: 'Sitemap' },
]

const totals = [
	{ label: 'Product screens', value: sitemapScreens.length },
	{ label: 'States to preview', value: sitemapScreens.reduce((sum, screen) => sum + (screen.states?.length ?? 0), 0) },
	{ label: 'Areas', value: sitemapAreas.length },
]
</script>

<style lang="scss" scoped>
.banner {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		padding: 32px 0 56px;
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		align-items: end;
		gap: 64px;
		padding-top: 40px;
	}

	&__lede {
		max-width: 680px;
		padding-top: 16px;
	}
}

@media only screen and (max-width: 1024px) {
	.banner {
		&__grid {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
			gap: 40px;
			padding-top: 32px;
		}

		&__totals {
			max-width: 520px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 40px;
		}
	}
}
</style>
