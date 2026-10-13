<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<MHeading variant="1" class="banner__title">{{ guideIntro.title }}</MHeading>

				<div class="banner__grid">
					<div class="banner__text">
						<MText size="xlarge" color="--text-secondary" class="banner__lede">{{ guideIntro.lede }}</MText>

						<div class="banner__actions">
							<MButton :href="`#${first_tour?.id ?? 'tours'}`" size="lg">
								<template #prefix>
									<MIcon name="light-directions" size="sm" />
								</template>
								Start the first tour
							</MButton>
							<MButton to="/static/sitemap" size="lg" variant="neutral">Open the sitemap</MButton>
						</div>
					</div>

					<Totals :totals="totals" class="banner__totals" />
				</div>

				<nav class="banner__toc" aria-label="On this page">
					<div v-for="part in parts" :key="part.label" class="banner__part">
						<span class="banner__part-label">{{ part.label }}</span>
						<div class="banner__links">
							<a v-for="link in part.links" :key="link.href" :href="link.href" class="banner__link">{{ link.label }}</a>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	analyticsIntro,
	areasIntro,
	audiencesIntro,
	demoIntro,
	factsIntro,
	goalIntro,
	growthIntro,
	guideIntro,
	guideTours,
	modelIntro,
	risksIntro,
	roadmapIntro,
	statesIntro,
	toursIntro,
} from '~/data/features/guide'
import { sitemapScreens } from '~/data/features/sitemap'
import type { BreadcrumbItem } from '~/types/base/ui'
import Totals from '../shared/Totals.vue'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Guide' },
]

const first_tour = guideTours[0]

const totals = [
	{ label: 'Product screens', value: sitemapScreens.length },
	{ label: 'States to preview', value: sitemapScreens.reduce((sum, screen) => sum + (screen.states?.length ?? 0), 0) },
	{ label: 'Guided tours', value: guideTours.length },
]

// the sections below, in page order, by part
const parts = [
	{
		label: goalIntro.label,
		links: [
			{ label: goalIntro.title, href: '#goal' },
			{ label: audiencesIntro.title, href: '#audiences' },
			{ label: modelIntro.title, href: '#model' },
			{ label: analyticsIntro.title, href: '#analytics' },
			{ label: growthIntro.title, href: '#growth' },
			{ label: roadmapIntro.title, href: '#roadmap' },
			{ label: risksIntro.title, href: '#risks' },
		],
	},
	{
		label: demoIntro.label,
		links: [
			{ label: factsIntro.title, href: '#demo' },
			{ label: areasIntro.title, href: '#areas' },
			{ label: toursIntro.title, href: '#tours' },
			{ label: statesIntro.title, href: '#states' },
		],
	},
]
</script>

<style lang="scss" scoped>
.banner {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		padding: 32px 0 40px;
	}

	&__title {
		padding-top: 40px;
		text-wrap: balance;
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		align-items: end;
		gap: 64px;
		padding-top: 16px;
	}

	&__lede {
		max-width: 680px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding-top: 32px;
	}

	// --- On this page -------------------------------------------
	&__toc {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 48px;
		padding-top: 20px;
		border-top: var(--rule);
	}

	&__part {
		display: grid;
		grid-template-columns: 180px minmax(0, 1fr);
		align-items: baseline;
		gap: 8px 24px;
	}

	&__part-label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 28px;
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--brand-strong);

		&:hover {
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}
}

@media only screen and (max-width: 1024px) {
	.banner {
		&__title {
			padding-top: 32px;
		}

		&__grid {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
			gap: 40px;
		}

		&__totals {
			max-width: 520px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 32px;
		}

		&__toc {
			gap: 20px;
			margin-top: 32px;
		}

		&__part {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>
