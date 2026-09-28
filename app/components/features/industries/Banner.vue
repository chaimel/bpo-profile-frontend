<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__grid">
					<div class="banner__text">
						<MHeading variant="1">BPO companies by industry</MHeading>
						<MText size="xlarge" color="--text-secondary" class="banner__lede">
							Find outsourcing providers with experience in your industry, and the sales professionals
							who already know how it works.
						</MText>
					</div>

					<div class="banner__tip">
						<MIcon name="light-filter-lines" size="md" class="banner__tip-icon" />
						<MText color="--text-secondary" class="banner__tip-text">
							Industry and service work together. On Find a BPO, choose both to see providers that match
							your whole brief.
						</MText>
						<NuxtLink to="/services" class="banner__tip-link">
							Browse services
							<MIcon name="light-arrow-right" size="xs" />
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/base/ui'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Industries' },
]
</script>

<style lang="scss" scoped>
.banner {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		padding: 32px 0 64px;
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
		align-items: end;
		gap: 64px;
		padding-top: 40px;
	}

	&__text {
		max-width: 720px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__tip {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 4px 0 4px 20px;
		border-left: 2px solid var(--slate);
	}

	&__tip-icon {
		color: var(--slate);
	}

	&__tip-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
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
	.banner {
		&__grid {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
			gap: 32px;
			padding-top: 32px;
		}

		&__tip {
			max-width: 520px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 48px;
		}
	}
}
</style>
