<template>
	<section class="review" aria-labelledby="review-title">
		<div class="review__head">
			<MHeading id="review-title" variant="2" size="5">Needs review</MHeading>
			<span class="review__total">{{ pluralize(items.length, 'item') }}</span>
		</div>

		<ul v-if="visible_items.length" class="review__list">
			<li v-for="item in visible_items" :key="item.key">
				<NuxtLink :to="item.to" class="review__item">
					<MBadge :tone="kinds[item.kind].tone" :icon="kinds[item.kind].icon" size="sm" class="review__kind">
						{{ kinds[item.kind].label }}
					</MBadge>
					<span class="review__text">
						<span class="review__title">{{ item.title }}</span>
						<span class="review__detail">{{ item.detail }}</span>
					</span>
					<span class="review__date">{{ formatDate(item.date) }}</span>
					<MIcon name="light-angle-right" size="sm" color="text-muted" class="review__chevron" />
				</NuxtLink>
			</li>
		</ul>

		<MEmptyState v-else icon="light-check-circle" variant="plain" heading-level="3">
			<template #title>You’re all caught up</template>
			New submissions, claims and messages will show up here.
		</MEmptyState>

		<MText v-if="items.length > visible_items.length" size="small" color="--text-muted" class="review__more">
			Showing the {{ visible_items.length }} most recent. The queues above link to everything.
		</MText>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName, Tone } from '~/types/base/ui'
import type { AdminClaim, AdminCompanyRow, AdminProfessionalRow } from '~/types/features/admin'
import type { Inquiry } from '~/types/features/inquiry'
import { formatDate, fullName, pluralize } from '~/utils/format'

// One list of concrete things waiting on an admin, newest first.
interface Props {
	companies: AdminCompanyRow[]
	professionals: AdminProfessionalRow[]
	claims: AdminClaim[]
	inquiries: Inquiry[]
}

type ReviewKind = 'company' | 'profile' | 'affiliation' | 'claim' | 'message'

interface ReviewItem {
	key: string
	kind: ReviewKind
	title: string
	detail: string
	date: string
	to: string
}

const props = withDefaults(defineProps<Props>(), {})

const kinds: Record<ReviewKind, { label: string, tone: Tone, icon: MIconName }> = {
	company: { label: 'Company', tone: 'warning', icon: 'light-building' },
	profile: { label: 'Profile', tone: 'warning', icon: 'light-id-card' },
	affiliation: { label: 'Affiliation', tone: 'brand', icon: 'light-user-plus' },
	claim: { label: 'Claim', tone: 'slate', icon: 'light-shield' },
	message: { label: 'Message', tone: 'neutral', icon: 'light-envelope' },
}

const max_items = 8

const items = computed<ReviewItem[]>(() => {
	const list: ReviewItem[] = []

	for (const company of props.companies) {
		if (company.deleted_at || company.status !== 'pending_review') continue
		list.push({
			key: `company-${company.id}`,
			kind: 'company',
			title: company.name,
			detail: 'Submitted for review',
			date: company.updated_at,
			to: `/admin/companies/${company.id}#moderation`,
		})
	}

	for (const professional of props.professionals) {
		if (professional.deleted_at) continue

		if (professional.status === 'pending_review') {
			list.push({
				key: `profile-${professional.id}`,
				kind: 'profile',
				title: fullName(professional),
				detail: `${professional.company.name} · submitted for review`,
				date: professional.updated_at,
				to: `/admin/professionals/${professional.id}#moderation`,
			})
		}

		if (professional.affiliation_status === 'pending') {
			list.push({
				key: `affiliation-${professional.id}`,
				kind: 'affiliation',
				title: `${fullName(professional)} wants to join ${professional.company.name}`,
				detail: professional.job_title,
				date: professional.updated_at,
				to: `/admin/professionals/${professional.id}#affiliation`,
			})
		}
	}

	for (const claim of props.claims) {
		if (claim.status !== 'pending') continue
		list.push({
			key: `claim-${claim.id}`,
			kind: 'claim',
			title: `${claim.claimant.name} is claiming ${claim.company.name}`,
			detail: claim.claimant.email,
			date: claim.created_at,
			to: `/admin/claims?claim=${claim.id}`,
		})
	}

	for (const inquiry of props.inquiries) {
		if (inquiry.type !== 'platform' || inquiry.status !== 'new') continue
		list.push({
			key: `message-${inquiry.id}`,
			kind: 'message',
			title: `Message from ${inquiry.sender_name}`,
			detail: inquiry.message,
			date: inquiry.created_at,
			to: '/admin/inquiries',
		})
	}

	return list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

const visible_items = computed(() => items.value.slice(0, max_items))
</script>

<style lang="scss" scoped>
.review {
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 18px 20px 14px;
		border-bottom: var(--rule);
	}

	&__total {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-muted);
	}

	&__item {
		display: grid;
		grid-template-columns: 112px minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 14px;
		padding: 14px 20px;
		border-bottom: var(--rule);
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--brand-tint);
		}

		&:focus-visible {
			outline-offset: -2px;
		}
	}

	li:last-child .review__item {
		border-bottom: 0;
	}

	&__kind {
		justify-self: start;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__title {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		color: var(--text-primary);
	}

	&__detail {
		overflow: hidden;
		font-size: 15px;
		line-height: 21px;
		color: var(--text-secondary);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__date {
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-muted);
		white-space: nowrap;
	}

	&__more {
		padding: 12px 20px 16px;
		border-top: var(--rule);
	}
}

@media only screen and (max-width: 600px) {
	.review {
		&__item {
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 6px 12px;
			padding: 14px 16px;
		}

		&__kind {
			grid-column: 1 / -1;
		}

		&__chevron {
			display: none;
		}
	}
}
</style>
