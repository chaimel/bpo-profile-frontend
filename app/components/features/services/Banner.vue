<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__grid">
					<div class="banner__text">
						<MHeading variant="1">BPO services</MHeading>
						<MText size="xlarge" color="--text-secondary" class="banner__lede">
							Browse outsourcing services, then go straight to the companies that offer them — or to the
							sales professionals who represent them.
						</MText>
					</div>

					<dl class="banner__facts">
						<div v-for="fact in facts" :key="fact.label" class="banner__fact">
							<dt class="banner__fact-label">{{ fact.label }}</dt>
							<dd class="banner__fact-value">{{ fact.value }}</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/base/ui'
import { formatNumber } from '~/utils/format'

const { services } = useCatalogStore()
const { companyCards, professionalCards } = useDirectoryStore()

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Services' },
]

// Counted from the directory data, never typed in.
const facts = [
	{ label: 'Services', value: formatNumber(services.length) },
	{ label: 'BPO companies', value: formatNumber(companyCards.length) },
	{ label: 'Sales pros', value: formatNumber(professionalCards.length) },
]
</script>

<style lang="scss" scoped>
.banner {
	&__con {
		padding: 32px 0 56px;
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 48px;
		padding-top: 40px;
	}

	&__text {
		max-width: 700px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__facts {
		display: flex;
		gap: 40px;
		padding-bottom: 6px;
	}

	// value above label visually; the label stays first for screen readers
	&__fact {
		display: flex;
		flex-direction: column-reverse;
		gap: 6px;
		padding-left: 16px;
		border-left: 2px solid var(--brand);
	}

	&__fact-value {
		font-family: var(--font-display);
		font-size: 36px;
		font-weight: 600;
		line-height: 1;
		color: var(--text-primary);
	}

	&__fact-label {
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 18px;
		color: var(--text-muted);
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
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 40px;
		}

		&__facts {
			gap: 24px;
		}

		&__fact {
			padding-left: 12px;
		}

		&__fact-value {
			font-size: 28px;
		}
	}
}
</style>
