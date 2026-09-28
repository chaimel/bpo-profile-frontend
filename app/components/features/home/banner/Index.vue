<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<div class="banner__intro">
					<div class="banner__text">
						<MHeading variant="1" class="banner__title">
							{{ hero.title }}
							<span class="banner__accent">{{ hero.accent }}</span>
						</MHeading>
						<MText size="xlarge" color="--text-secondary" class="banner__lede">
							{{ hero.lede }}
						</MText>
						<ul class="banner__proof">
							<li v-for="point in proof" :key="point.text">
								<MIcon :name="point.icon" size="sm" />
								{{ point.text }}
							</li>
						</ul>
					</div>

					<Connection class="banner__art" />
				</div>

				<div class="banner__search">
					<MText size="xlarge" weight="medium" color="--text-primary" class="banner__prompt">{{ hero.prompt }}</MText>
					<MDirectorySearch id-prefix="hero-search" label="Find a BPO or a sales pro" @submit="search" />

					<div class="banner__below">
						<MText size="small" class="banner__popular">
							<span class="banner__popular-label">Popular:</span>
							<NuxtLink
								v-for="service in popular"
								:key="service.slug"
								:to="`/find?service=${service.slug}`"
								class="banner__popular-link"
							>
								{{ service.name }}
							</NuxtLink>
						</MText>
						<NuxtLink to="/register?type=company" class="banner__listed">
							Are you a BPO? <strong>Get Listed</strong>
							<MIcon name="light-long-arrow-right" size="sm" />
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import MDirectorySearch from '~/components/core/search/MDirectorySearch.vue'
import { hero } from '~/data/features/home'
import type { MIconName } from '~/types/base/ui'
import Connection from './Connection.vue'

const { services } = useCatalogStore()

const proof: { icon: MIconName, text: string }[] = [
	{ icon: 'light-user-friends', text: 'Meet the sales team behind every company' },
	{ icon: 'light-shield', text: 'Badges that say exactly what was checked' },
	{ icon: 'light-envelope', text: 'No account needed to send an inquiry' },
]

const popular = services.filter(service =>
	['customer-support', 'contact-center', 'healthcare-bpo', 'it-outsourcing'].includes(service.slug),
)

function search(value: { mode: string, q: string, service: string, country: string }) {
	const query: Record<string, string> = {}
	if (value.q) query.q = value.q
	if (value.service) query.service = value.service
	if (value.country) query.country = value.country

	navigateTo({ path: value.mode === 'professionals' ? '/professionals' : '/find', query })
}
</script>

<style lang="scss" scoped>
.banner {
	background: var(--white);

	&__con {
		padding: 64px 0 72px;
	}

	&__intro {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		align-items: center;
		gap: 56px;
	}

	&__title {
		display: flex;
		flex-direction: column;
		font-size: clamp(38px, 4.6vw, 58px);
		line-height: 1.08;
		letter-spacing: -0.03em;
	}

	// BPO Blue at display size clears the 3:1 large-text contrast bar.
	&__accent {
		color: var(--brand);
	}

	&__lede {
		max-width: 560px;
		padding-top: 20px;
	}

	&__proof {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 28px;

		li {
			display: flex;
			align-items: center;
			gap: 10px;
			font-family: var(--font-ui);
			font-size: 14px;
			color: var(--text-primary);
		}

		.m-icon {
			color: var(--brand);
		}
	}

	// --- Search -----------------------------------------------
	&__search {
		padding-top: 48px;
	}

	&__prompt {
		padding-bottom: 14px;
		font-family: var(--font-display);
	}

	&__below {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px 24px;
		padding-top: 18px;
	}

	&__popular {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 16px;
		font-family: var(--font-ui);
	}

	&__popular-label {
		color: var(--text-muted);
	}

	&__popular-link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-decoration-color: var(--brand-soft);
		text-underline-offset: 4px;

		&:hover {
			color: var(--brand-deep);
			text-decoration-color: currentColor;
		}
	}

	&__listed {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--text-secondary);

		strong {
			font-weight: 600;
			color: var(--brand-strong);
		}

		&:hover strong {
			color: var(--brand-deep);
		}
	}
}

@media only screen and (max-width: 1024px) {
	.banner {
		&__con {
			padding: 40px 0 56px;
		}

		&__intro {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		&__search {
			padding-top: 40px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__art {
			display: none;
		}
	}
}
</style>
