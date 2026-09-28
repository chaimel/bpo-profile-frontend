<template>
	<section class="recent-inquiries" aria-labelledby="overview-inquiries-title">
		<div class="recent-inquiries__head">
			<MHeading id="overview-inquiries-title" variant="2" size="4" weight="semi-bold" class="recent-inquiries__title">
				Recent inquiries
			</MHeading>
			<MButton variant="text" size="sm" :to="props.inboxPath">
				Open inbox
				<template #suffix>
					<MIcon name="light-long-arrow-right" size="xs" />
				</template>
			</MButton>
		</div>

		<ul v-if="recent.length" class="recent-inquiries__list">
			<li v-for="inquiry in recent" :key="inquiry.id" class="recent-inquiries__item">
				<div class="recent-inquiries__top">
					<!-- the name is the link; the whole row is its hit area -->
					<NuxtLink :to="props.inboxPath" class="recent-inquiries__sender">
						{{ inquiry.sender_name }}<span v-if="inquiry.sender_company" class="recent-inquiries__company">, {{ inquiry.sender_company }}</span>
						<span class="sr-only"> — open in the inbox</span>
					</NuxtLink>
					<span class="recent-inquiries__date">{{ formatDate(inquiry.created_at) }}</span>
				</div>

				<MText size="small" color="--text-secondary" class="recent-inquiries__excerpt">{{ inquiry.message }}</MText>

				<div class="recent-inquiries__meta">
					<MStatusBadge kind="inquiry" :status="inquiry.status" size="sm" />
					<MBadge :tone="type_tones[inquiry.type]" size="sm">{{ inquiryTypeLabels[inquiry.type] }}</MBadge>
					<span class="recent-inquiries__to">To {{ inquiry.professional?.name ?? 'your sales inbox' }}</span>
				</div>
			</li>
		</ul>

		<MEmptyState v-else icon="light-envelope" variant="plain" heading-level="3" class="recent-inquiries__empty">
			<template #title>No inquiries yet</template>
			When buyers contact your company or your sales team, their messages appear here.
		</MEmptyState>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { Tone } from '~/types/base/ui'
import type { Inquiry, InquiryType } from '~/types/features/inquiry'
import { formatDate } from '~/utils/format'
import { inquiryTypeLabels } from '~/utils/labels'

interface Props {
	inquiries: Inquiry[]
	inboxPath: string
	limit?: number
}

const props = withDefaults(defineProps<Props>(), {
	limit: 3,
})

// same tones as the inbox, so a type reads the same everywhere
const type_tones: Record<InquiryType, Tone> = {
	contact: 'slate',
	question: 'neutral',
	quote: 'brand',
	platform: 'warning',
}

// Spam never surfaces on the overview. filter() copies, so sort() is safe.
const recent = computed(() =>
	props.inquiries
		.filter(inquiry => inquiry.status !== 'spam')
		.sort((a, b) => b.created_at.localeCompare(a.created_at))
		.slice(0, props.limit),
)
</script>

<style lang="scss" scoped>
.recent-inquiries {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 20px 24px 8px;
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	&__item {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 16px 0;
		border-top: var(--rule);

		&:hover .recent-inquiries__sender {
			color: var(--brand-strong);
		}
	}

	&__top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	&__sender {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);

		&::after {
			content: '';
			position: absolute;
			inset: 0;
		}
	}

	&__company {
		font-weight: 400;
		color: var(--text-secondary);
	}

	&__date {
		flex: 0 0 auto;
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-muted);
	}

	&__excerpt {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 8px;
	}

	&__to {
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-muted);
	}

	&__empty {
		border-top: var(--rule);
	}
}

@media only screen and (max-width: 768px) {
	.recent-inquiries {
		padding: 16px 16px 4px;
	}
}
</style>
