<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div v-if="props.company" class="banner__identity">
					<MLogo
						:name="props.company.name"
						:src="props.company.logo_url"
						:alt="props.company.logo_alt_text"
						size="lg"
						decorative
					/>

					<div class="banner__identity-text">
						<MHeading id="claim-title" variant="1" size="2" tabindex="-1" class="banner__title">{{ title }}</MHeading>

						<div class="banner__meta">
							<span v-if="props.company.hq" class="banner__location">
								<MIcon name="light-map-marker" size="xs" />
								{{ locationLabel(props.company.hq) }}
							</span>
							<MBadge v-if="props.company.claimed" tone="slate" icon="light-shield" size="sm">Claimed</MBadge>
							<MBadge v-else tone="neutral" icon="light-circle" size="sm">Not yet claimed</MBadge>
							<NuxtLink :to="`/companies/${props.company.slug}`" class="banner__link">View listing</NuxtLink>
						</div>
					</div>
				</div>

				<MHeading v-else id="claim-title" variant="1" size="2" tabindex="-1" class="banner__title banner__title--solo">
					{{ title }}
				</MHeading>

				<MText size="xlarge" color="--text-secondary" class="banner__lede">{{ lede }}</MText>

				<MAlert v-if="props.missing" tone="warning" class="banner__alert">
					<template #title>We couldn’t find that listing</template>
					The link may be out of date, or the listing is no longer available. Search for your company below.
				</MAlert>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '~/types/base/ui'
import type { CompanyCard } from '~/types/features/directory'
import { locationLabel } from '~/utils/format'

interface Props {
	company: CompanyCard | null
	// a ?company= slug was given but matched no listing
	missing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	missing: false,
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
	const items: BreadcrumbItem[] = [
		{ label: 'Home', to: '/' },
		{ label: 'Claim your profile', to: '/claim' },
	]
	if (props.company) items.push({ label: props.company.name })
	return items
})

const title = computed(() => {
	if (!props.company) return 'Claim your company profile'
	return props.company.claimed ? `${props.company.name} is already claimed` : `Claim ${props.company.name}`
})

const lede = computed(() => {
	if (!props.company) {
		return 'Your company may already have a listing on BPO Profile. Claim it to keep it accurate, add your sales team and receive inquiries in your dashboard.'
	}
	if (props.company.claimed) {
		return 'Someone authorized by the company already manages this listing, so it can’t be claimed again.'
	}
	return `If you’re authorized to represent ${props.company.name}, ask to take over its listing. Once it’s yours, you can keep it accurate, add your sales team and receive inquiries in your dashboard.`
})
</script>

<style lang="scss" scoped>
.banner {
	background: var(--canvas);

	&__con {
		max-width: 720px;
		padding: 40px 0 64px;
	}

	&__identity {
		display: flex;
		align-items: center;
		gap: 20px;
		padding-top: 40px;
	}

	&__identity-text {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	&__title {
		&:focus {
			outline: none;
		}

		&--solo {
			padding-top: 40px;
		}
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 16px;
	}

	&__location {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--text-secondary);
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}

	&__lede {
		padding-top: 20px;
	}

	&__alert {
		margin-top: 24px;
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 48px;
		}

		&__identity {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
			padding-top: 32px;
		}

		&__title--solo {
			padding-top: 32px;
		}
	}
}
</style>
