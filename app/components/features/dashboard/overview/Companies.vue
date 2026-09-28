<template>
	<section class="companies" aria-labelledby="overview-companies-title">
		<MHeading id="overview-companies-title" variant="2" size="4" weight="semi-bold" class="companies__title">
			{{ props.companies.length > 1 ? 'Your companies' : 'Your company' }}
		</MHeading>

		<ul v-if="props.companies.length" class="companies__list">
			<li v-for="entry in props.companies" :key="entry.company.id" class="companies__card">
				<div class="companies__head">
					<MLogo :name="entry.company.name" :src="entry.company.logo_url" size="lg" decorative />

					<div class="companies__identity">
						<MHeading variant="3" size="4" weight="semi-bold" class="companies__name">{{ entry.company.name }}</MHeading>
						<MText size="small" color="--text-secondary" class="companies__meta">
							{{ companyRoleLabels[entry.membership.role] }} · {{ planLabels[entry.company.plan.slug] }} plan
						</MText>
					</div>

					<MStatusBadge kind="publication" :status="entry.company.status" class="companies__status" />
				</div>

				<MTrustBadges
					kind="company"
					:claimed="entry.company.claimed_at !== null"
					:verified="entry.company.verified_at !== null"
					:completeness="entry.company.completeness_score"
					:threshold="profileCompleteThreshold"
					size="sm"
				/>

				<MProgress
					:value="entry.company.completeness_score"
					:threshold="profileCompleteThreshold"
					label="Profile completeness"
					size="sm"
				/>

				<ul class="companies__links" :aria-label="`Manage ${entry.company.name}`">
					<li v-for="link in linksFor(entry)" :key="link.label">
						<NuxtLink :to="link.to" class="companies__link">
							<MIcon :name="link.icon" size="sm" class="companies__link-icon" />
							<span class="companies__link-label">{{ link.label }}</span>
							<span v-if="link.count" class="companies__link-count">{{ link.count }}</span>
							<MIcon name="light-angle-right" size="xs" class="companies__link-arrow" />
						</NuxtLink>
					</li>
				</ul>
			</li>
		</ul>

		<MEmptyState v-else icon="light-building" heading-level="3">
			<template #title>No company to manage yet</template>
			Claim your company’s existing listing to manage its profile, team and inquiries.
			<template #actions>
				<MButton to="/claim" variant="neutral" size="sm">Claim your company</MButton>
			</template>
		</MEmptyState>
	</section>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { MIconName } from '~/types/base/ui'
import { pluralize } from '~/utils/format'
import { companyRoleLabels, planLabels } from '~/utils/labels'
import type { CompanyDashboard } from '~/types/features/dashboard'

const { profileCompleteThreshold } = useDashboardStore()

interface Props {
	companies: CompanyDashboard[]
}

const props = defineProps<Props>()

interface QuickLink {
	label: string
	to: string
	icon: MIconName
	// what needs attention, in words
	count?: string
}

function linksFor(entry: CompanyDashboard): QuickLink[] {
	const base = `/dashboard/companies/${entry.company.id}`
	const requests = entry.team.requests.length
	const unread = entry.inquiries.filter(inquiry => inquiry.status === 'new').length

	return [
		{ label: 'Edit profile', to: base, icon: 'light-edit' },
		{
			label: 'Team',
			to: requests ? `${base}/team?tab=requests` : `${base}/team`,
			icon: 'light-users',
			// short, so every link keeps to one line
			count: requests ? pluralize(requests, 'request') : undefined,
		},
		{
			label: 'Inquiries',
			to: `${base}/inquiries`,
			icon: 'light-envelope',
			count: unread ? `${unread} new` : undefined,
		},
	]
}
</script>

<style lang="scss" scoped>
.companies {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__card {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 24px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__head {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	&__identity {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__meta {
		font-family: var(--font-ui);
	}

	&__status {
		align-self: flex-start;
	}

	// --- Quick links -------------------------------------------
	&__links {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		padding-top: 16px;
		border-top: var(--rule);
	}

	// one line each, so the arrows line up across the three links
	&__link {
		display: flex;
		align-items: center;
		gap: 10px;
		height: 100%;
		min-height: 48px;
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--text-primary);
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--surface-muted);
		}
	}

	&__link-icon {
		color: var(--brand-strong);
	}

	&__link-label {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__link-count {
		flex: 0 0 auto;
		padding: 2px 8px;
		border-radius: var(--radius-xs);
		background: var(--brand-soft);
		font-size: 12px;
		font-weight: 600;
		line-height: 18px;
		color: var(--brand-deep);
		white-space: nowrap;
	}

	&__link-arrow {
		flex: 0 0 auto;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 768px) {
	.companies {
		&__card {
			padding: 20px 16px;
		}

		&__head {
			flex-wrap: wrap;
		}

		&__links {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>
