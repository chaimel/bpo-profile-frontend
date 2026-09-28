<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__text">
					<MHeading variant="1">BPO locations</MHeading>
					<MText size="xlarge" color="--text-secondary" class="banner__lede">
						Explore BPO companies by country, then narrow to a region or city. Only places where listed
						providers operate appear here.
					</MText>
				</div>

				<ol class="banner__path" aria-label="How locations are organized">
					<!-- the separator trails its chip, so a wrapped line starts with a chip -->
					<li v-for="(step, index) in steps" :key="step.label" class="banner__step">
						<span class="banner__label">
							<MIcon :name="step.icon" size="sm" class="banner__icon" />
							{{ step.label }}
						</span>
						<MIcon v-if="index < steps.length - 1" name="light-angle-right" size="xs" class="banner__sep" />
					</li>
				</ol>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem, MIconName } from '~/types/base/ui'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Locations' },
]

// Global → Country → Region/City (PDF p. 20, docs/DATABASE.md §4.6).
const steps: { label: string, icon: MIconName }[] = [
	{ label: 'Global', icon: 'light-globe' },
	{ label: 'Country', icon: 'light-flag' },
	{ label: 'Region or city', icon: 'light-map-marker' },
]
</script>

<style lang="scss" scoped>
.banner {
	&__con {
		padding: 32px 0 56px;
	}

	&__text {
		max-width: 720px;
		padding-top: 40px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__path {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 0;
		padding-top: 32px;
		list-style: none;
	}

	&__step {
		display: inline-flex;
		align-items: center;
	}

	&__sep {
		margin: 0 12px;
		color: var(--text-muted);
	}

	&__label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: var(--radius-sm);
		box-shadow: inset 0 0 0 1px var(--border);
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
	}

	&__icon {
		color: var(--brand);
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

		&__sep {
			margin: 0 6px;
		}
	}
}
</style>
