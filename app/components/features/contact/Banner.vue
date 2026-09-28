<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__text">
					<MHeading variant="1">Contact BPO Profile</MHeading>
					<MText size="xlarge" color="--text-secondary" class="banner__lede">
						Questions about listings, claims, plans, or the directory itself? Send the BPO Profile team a
						message.
					</MText>
				</div>

				<!-- platform inbox only (docs/API.md §4) — say so before anyone writes -->
				<MAlert tone="info" icon="light-envelope" class="banner__notice">
					<template #title>This form reaches the BPO Profile team, not a BPO</template>
					To contact a BPO company or one of its sales pros, use the form on their profile — it goes
					straight to them.
					<template #actions>
						<NuxtLink to="/find" class="banner__notice-link">
							Find a BPO
							<MIcon name="light-arrow-right" size="xs" />
						</NuxtLink>
					</template>
				</MAlert>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/base/ui'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'Contact' },
]
</script>

<style lang="scss" scoped>
.banner {
	&__con {
		padding: 32px 0 40px;
	}

	&__text {
		max-width: 720px;
		padding-top: 40px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__notice {
		max-width: 720px;
		margin-top: 32px;
	}

	&__notice-link {
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

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 32px;
		}

		&__text {
			padding-top: 32px;
		}

		&__notice {
			margin-top: 24px;
		}
	}
}
</style>
