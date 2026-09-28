<template>
	<section class="sales-profile" aria-labelledby="overview-sales-title">
		<MHeading id="overview-sales-title" variant="2" size="5" weight="semi-bold" class="sales-profile__title">
			Your sales profile
		</MHeading>

		<div class="sales-profile__person">
			<MAvatar :name="full_name" :src="props.professional.photo_url" size="lg" decorative />
			<div class="sales-profile__who">
				<MText weight="semi-bold" class="sales-profile__name">{{ full_name }}</MText>
				<MText size="small" color="--text-secondary" class="sales-profile__role">
					{{ props.professional.job_title }}, {{ props.professional.company.name }}
				</MText>
			</div>
		</div>

		<ul class="sales-profile__badges" aria-label="Profile status">
			<li>
				<MStatusBadge kind="publication" :status="props.professional.status" size="sm" />
			</li>
			<li>
				<MStatusBadge kind="affiliation" :status="props.professional.affiliation_status" size="sm" />
			</li>
		</ul>

		<MTrustBadges
			kind="professional"
			:verified="props.professional.verified_at !== null"
			:completeness="props.professional.completeness_score"
			:threshold="profileCompleteThreshold"
			size="sm"
		/>

		<MProgress
			:value="props.professional.completeness_score"
			:threshold="profileCompleteThreshold"
			label="Profile completeness"
			size="sm"
		/>

		<MText v-if="props.stats" size="small" color="--text-secondary" class="sales-profile__activity">
			{{ pluralize(props.stats.profile_views, 'profile view') }} and
			{{ pluralize(inquiry_total, 'inquiry', 'inquiries') }} in the last 30 days.
		</MText>

		<ul class="sales-profile__links">
			<li>
				<NuxtLink to="/dashboard/profile" class="sales-profile__link">
					<MIcon name="light-id-card" size="sm" class="sales-profile__link-icon" />
					<span class="sales-profile__link-label">Edit profile</span>
				</NuxtLink>
			</li>
			<li>
				<NuxtLink to="/dashboard/inquiries" class="sales-profile__link">
					<MIcon name="light-comments" size="sm" class="sales-profile__link-icon" />
					<span class="sales-profile__link-label">My inquiries</span>
					<span v-if="unread" class="sales-profile__count">{{ unread }} new</span>
				</NuxtLink>
			</li>
			<li>
				<NuxtLink to="/dashboard/stats" class="sales-profile__link">
					<MIcon name="light-chart-increase" size="sm" class="sales-profile__link-icon" />
					<span class="sales-profile__link-label">My stats</span>
				</NuxtLink>
			</li>
			<li v-if="props.professional.status === 'published'">
				<NuxtLink :to="`/professionals/${props.professional.slug}`" target="_blank" class="sales-profile__link">
					<MIcon name="light-external-link" size="sm" class="sales-profile__link-icon" />
					<span class="sales-profile__link-label">View public profile</span>
					<span class="sr-only">(opens in a new tab)</span>
				</NuxtLink>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { DashboardStats, EditableProfessional } from '~/types/features/dashboard'
import type { Inquiry } from '~/types/features/inquiry'
import { fullName, pluralize } from '~/utils/format'

const { profileCompleteThreshold } = useDashboardStore()

interface Props {
	professional: EditableProfessional
	inquiries?: Inquiry[]
	stats?: DashboardStats | null
}

const props = withDefaults(defineProps<Props>(), {
	inquiries: () => [],
	stats: null,
})

const full_name = computed(() => fullName(props.professional))
const unread = computed(() => props.inquiries.filter(inquiry => inquiry.status === 'new').length)

const inquiry_total = computed(() => {
	if (!props.stats) return 0
	const { contact, question, quote } = props.stats.inquiries
	return contact + question + quote
})
</script>

<style lang="scss" scoped>
.sales-profile {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 24px;
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	&__person {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	&__who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-display);
	}

	&__badges {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__links {
		display: flex;
		flex-direction: column;
		margin: 0 -12px;
		padding-top: 8px;
		border-top: var(--rule);
	}

	&__link {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 8px 12px;
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
	}

	&__count {
		padding: 2px 8px;
		border-radius: var(--radius-xs);
		background: var(--brand-soft);
		font-size: 12px;
		font-weight: 600;
		line-height: 18px;
		color: var(--brand-deep);
	}
}

@media only screen and (max-width: 768px) {
	.sales-profile {
		padding: 20px 16px;

		&__links {
			margin: 0 -8px;
		}
	}
}
</style>
