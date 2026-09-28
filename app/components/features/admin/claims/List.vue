<template>
	<div class="list">
		<ul v-if="props.claims.length" class="list__items" aria-label="Claims">
			<li v-for="claim in props.claims" :key="claim.id">
				<button
					type="button"
					:class="['list__item', { 'list__item--active': claim.id === props.selectedId }]"
					:aria-current="claim.id === props.selectedId ? 'true' : undefined"
					@click="emit('select', claim.id)"
				>
					<span class="list__head">
						<span class="list__company">{{ claim.company.name }}</span>
						<span class="list__date">{{ formatDate(claim.created_at) }}</span>
					</span>
					<span class="list__claimant">{{ claim.claimant.name }}</span>
					<span class="list__email">{{ claim.claimant.email }}</span>
					<span v-if="rivals(claim) > 0 && is_open" class="list__flag">
						<MIcon name="light-exclamation-triangle" size="xs" />
						{{ rivals(claim) === 1 ? 'Another open claim for this company' : `${rivals(claim)} other open claims for this company` }}
					</span>
				</button>
			</li>
		</ul>

		<MEmptyState v-else icon="light-shield" variant="plain" heading-level="2">
			<template #title>{{ empty.title }}</template>
			{{ empty.text }}
		</MEmptyState>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdminClaim } from '~/types/features/admin'
import { formatDate } from '~/utils/format'

interface Props {
	// the claims on the current tab
	claims: AdminClaim[]
	// every claim, to spot competing requests
	allClaims: AdminClaim[]
	selectedId?: number | null
	// the current tab, for the empty state
	status?: string
}

const props = withDefaults(defineProps<Props>(), {
	selectedId: null,
	status: 'pending',
})

const emit = defineEmits<{
	(_e: 'select', _id: number): void
}>()

const empties: Record<string, { title: string, text: string }> = {
	pending: { title: 'No claims waiting', text: 'New requests to take over a listing will appear here.' },
	approved: { title: 'No approved claims', text: 'Claims you approve wait here until the claimant accepts the emailed link.' },
	rejected: { title: 'No rejected claims', text: 'Claims you reject are kept here as history.' },
	fulfilled: { title: 'No fulfilled claims', text: 'Claims whose link was accepted, making the claimant an owner, are kept here.' },
}

const empty = computed(() => empties[props.status] ?? { title: 'No claims here', text: 'Try another status.' })

// competition only matters while a claim can still be decided or accepted
const is_open = computed(() => props.status === 'pending' || props.status === 'approved')

function rivals(claim: AdminClaim): number {
	return props.allClaims.filter(other =>
		other.company.id === claim.company.id
		&& other.id !== claim.id
		&& (other.status === 'pending' || other.status === 'approved'),
	).length
}
</script>

<style lang="scss" scoped>
.list {
	overflow: hidden;
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	&__item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		padding: 16px;
		border-bottom: var(--rule);
		text-align: left;
		cursor: pointer;
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--canvas);
		}

		&--active,
		&--active:hover {
			background: var(--brand-tint);
			box-shadow: inset 3px 0 0 var(--brand);
		}

		&:focus-visible {
			outline-offset: -2px;
		}
	}

	li:last-child .list__item {
		border-bottom: 0;
	}

	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	&__company {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	&__date {
		flex: 0 0 auto;
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-muted);
	}

	&__claimant {
		font-size: 15px;
		line-height: 21px;
		color: var(--text-primary);
	}

	&__email {
		overflow: hidden;
		font-size: 14px;
		line-height: 20px;
		color: var(--text-secondary);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__flag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 4px;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		color: var(--warning);
	}
}
</style>
