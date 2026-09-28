<template>
	<section class="claims" aria-labelledby="recent-claims-title">
		<div class="claims__head">
			<MHeading id="recent-claims-title" variant="2" size="5">Recent claims</MHeading>
			<MButton variant="text" size="sm" to="/admin/claims">
				All claims
				<template #suffix>
					<MIcon name="light-long-arrow-right" size="xs" />
				</template>
			</MButton>
		</div>

		<ul v-if="recent.length" class="claims__list">
			<li v-for="claim in recent" :key="claim.id">
				<NuxtLink :to="`/admin/claims?claim=${claim.id}`" class="claims__item">
					<span class="claims__company">{{ claim.company.name }}</span>
					<span class="claims__meta">{{ claim.claimant.name }} · <span class="claims__date">{{ formatDate(claim.created_at) }}</span></span>
					<MStatusBadge kind="claim" :status="claim.status" size="sm" class="claims__status" />
				</NuxtLink>
			</li>
		</ul>

		<MEmptyState v-else icon="light-shield" variant="plain" heading-level="3">
			<template #title>No claims yet</template>
			Requests to take over an unclaimed listing will appear here.
		</MEmptyState>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { AdminClaim } from '~/types/features/admin'
import { formatDate } from '~/utils/format'

interface Props {
	claims: AdminClaim[]
}

const props = withDefaults(defineProps<Props>(), {})

const recent = computed(() =>
	[...props.claims]
		.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
		.slice(0, 4),
)
</script>

<style lang="scss" scoped>
.claims {
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	// the same header rhythm as the "Needs review" panel beside it
	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 18px 20px 14px;
		border-bottom: var(--rule);
	}

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 4px 12px;
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

	li:last-child .claims__item {
		border-bottom: 0;
	}

	&__company {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		color: var(--text-primary);
	}

	&__meta {
		grid-column: 1;
		font-size: 15px;
		line-height: 21px;
		color: var(--text-secondary);
	}

	// a date never breaks in the middle
	&__date {
		white-space: nowrap;
	}

	&__status {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
	}
}
</style>
