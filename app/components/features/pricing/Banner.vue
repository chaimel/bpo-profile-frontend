<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__text">
					<MHeading variant="1">{{ pricingIntro.title }}</MHeading>
					<MText size="xlarge" color="--text-secondary" class="banner__lede">
						{{ pricingIntro.lede }}
					</MText>
				</div>

				<MText color="--text-secondary" class="banner__note">
					<MIcon name="light-info-circle" size="sm" class="banner__note-icon" />
					<span>{{ pricingIntro.note }}</span>
				</MText>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { pricingIntro } from '~/data/features/pricing'
import type { BreadcrumbItem } from '~/types/base/ui'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Pricing' },
]
</script>

<style lang="scss" scoped>
.banner {
	&__con {
		padding: 32px 0 48px;
	}

	&__text {
		max-width: 760px;
		padding-top: 40px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__note {
		display: inline-flex;
		align-items: flex-start;
		gap: 10px;
		margin-top: 28px;
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		background: var(--brand-tint);
	}

	&__note-icon {
		margin-top: 4px;
		color: var(--brand-strong);
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 40px;
		}

		&__text {
			padding-top: 32px;
		}
	}
}
</style>
