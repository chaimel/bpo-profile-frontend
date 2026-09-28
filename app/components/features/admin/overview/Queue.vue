<template>
	<section class="queue" aria-labelledby="queue-title">
		<h2 id="queue-title" class="sr-only">Review queues</h2>

		<ul class="queue__grid">
			<li v-for="tile in tiles" :key="tile.key" class="queue__cell">
				<NuxtLink :to="tile.to" :class="['queue__tile', { 'queue__tile--waiting': tile.count > 0 }]">
					<span class="queue__label">
						<MIcon :name="tile.icon" size="sm" />
						{{ tile.label }}
					</span>
					<span class="queue__count">{{ tile.count }}</span>
					<span class="queue__state">
						{{ tile.count > 0 ? tile.action : 'Nothing waiting' }}
						<MIcon v-if="tile.count > 0" name="light-long-arrow-right" size="xs" />
					</span>
				</NuxtLink>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName } from '~/types/base/ui'
import type { AdminClaim, AdminCompanyRow, AdminProfessionalRow } from '~/types/features/admin'
import type { Inquiry } from '~/types/features/inquiry'

// Six queues, each linking to the filtered list it counts.
interface Props {
	companies: AdminCompanyRow[]
	professionals: AdminProfessionalRow[]
	claims: AdminClaim[]
	inquiries: Inquiry[]
}

interface QueueTile {
	key: string
	label: string
	count: number
	action: string
	to: string
	icon: MIconName
}

const props = withDefaults(defineProps<Props>(), {})

const live_companies = computed(() => props.companies.filter(company => !company.deleted_at))
const live_professionals = computed(() => props.professionals.filter(professional => !professional.deleted_at))

const tiles = computed<QueueTile[]>(() => [
	{
		key: 'companies',
		label: 'Companies to review',
		count: live_companies.value.filter(company => company.status === 'pending_review').length,
		action: 'Review companies',
		to: '/admin/companies?status=pending_review',
		icon: 'light-building',
	},
	{
		key: 'professionals',
		label: 'Profiles to review',
		count: live_professionals.value.filter(professional => professional.status === 'pending_review').length,
		action: 'Review profiles',
		to: '/admin/professionals?status=pending_review',
		icon: 'light-id-card',
	},
	{
		key: 'claims',
		label: 'Claims pending',
		count: props.claims.filter(claim => claim.status === 'pending').length,
		action: 'Review claims',
		to: '/admin/claims?status=pending',
		icon: 'light-shield',
	},
	{
		key: 'affiliations',
		label: 'Affiliation requests',
		count: live_professionals.value.filter(professional => professional.affiliation_status === 'pending').length,
		action: 'Review requests',
		to: '/admin/professionals?status=affiliation_pending',
		icon: 'light-user-plus',
	},
	{
		key: 'messages',
		label: 'New platform messages',
		count: props.inquiries.filter(inquiry => inquiry.type === 'platform' && inquiry.status === 'new').length,
		action: 'Read messages',
		to: '/admin/inquiries',
		icon: 'light-envelope',
	},
	{
		key: 'suspended',
		label: 'Suspended listings',
		count: live_companies.value.filter(company => company.status === 'suspended').length,
		action: 'See suspended',
		to: '/admin/companies?status=suspended',
		icon: 'light-exclamation-triangle',
	},
])
</script>

<style lang="scss" scoped>
.queue {
	&__grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 1px;
		overflow: hidden;
		border-radius: var(--radius-md);
		background: var(--border);
		box-shadow: 0 0 0 1px var(--border);
	}

	&__cell {
		display: flex;
	}

	&__tile {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		padding: 18px 20px 20px;
		background: var(--white);
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--brand-tint);
		}

		&:focus-visible {
			outline-offset: -2px;
		}
	}

	// two lines reserved, so every count sits at the same height
	&__label {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		min-height: 36px;
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
		color: var(--text-secondary);
	}

	&__count {
		font-family: var(--font-display);
		font-size: 34px;
		font-weight: 600;
		line-height: 40px;
		letter-spacing: -0.01em;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	// inline, so a wrapped label keeps its arrow after the last word
	&__state {
		display: block;
		margin-top: auto;
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
	}

	&__tile--waiting .queue__count {
		color: var(--text-primary);
	}

	&__tile--waiting .queue__state {
		color: var(--brand-strong);
	}
}

@media only screen and (max-width: 1280px) {
	.queue {
		&__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
}

@media only screen and (max-width: 600px) {
	.queue {
		&__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		&__tile {
			padding: 14px 16px 16px;
		}

		&__count {
			font-size: 28px;
			line-height: 34px;
		}
	}
}
</style>
