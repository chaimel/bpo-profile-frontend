<template>
	<MFormSection
		id="ownership"
		class="ownership"
		title="Ownership"
		description="Owners come from company registration or a reviewed claim that the claimant accepts. You can’t assign an owner here."
	>
		<dl class="ownership__facts">
			<div class="ownership__fact">
				<dt class="ownership__label">Claimed</dt>
				<dd class="ownership__value">
					<YesNo :value="Boolean(props.company.claimed_at)" />
					<span v-if="props.company.claimed_at" class="ownership__muted">
						since {{ formatDate(props.company.claimed_at) }}
					</span>
				</dd>
			</div>

			<div class="ownership__fact">
				<dt class="ownership__label">Owners</dt>
				<dd class="ownership__value">
					<ul v-if="props.company.owners.length" class="ownership__owners">
						<li v-for="owner in props.company.owners" :key="owner" class="ownership__owner">
							<MAvatar :name="owner" size="xs" decorative />
							{{ owner }}
						</li>
					</ul>
					<span v-else class="ownership__muted">No owners</span>
				</dd>
			</div>
		</dl>

		<MAlert v-if="waiting_name" tone="info">
			An approved claim is waiting for {{ waiting_name }} to accept the emailed link. They become an
			owner only when they do.
		</MAlert>

		<div class="ownership__claims">
			<MHeading variant="3" size="6" weight="semi-bold" class="ownership__title">Claims for this company</MHeading>

			<ul v-if="sorted_claims.length" class="ownership__list">
				<li v-for="claim in sorted_claims" :key="claim.id" class="ownership__claim">
					<span class="ownership__claimant">{{ claim.claimant.name }}</span>
					<span class="ownership__muted">{{ formatDate(claim.created_at) }}</span>
					<MStatusBadge kind="claim" :status="claim.status" size="sm" class="ownership__status" />
				</li>
			</ul>
			<MText v-else size="small" class="ownership__muted">No one has asked to claim this listing.</MText>

			<div>
				<MButton variant="neutral" size="sm" :to="`/admin/claims?company=${props.company.id}`">
					Review claims for this company
				</MButton>
			</div>
		</div>

		<MText size="small" color="--text-muted" class="ownership__note">
			If the last owner leaves or is removed, the listing becomes unclaimed again and the next claimant
			needs a new review.
		</MText>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { AdminClaim, AdminCompanyDetail } from '~/types/features/admin'
import { formatDate } from '~/utils/format'
import YesNo from '../shared/YesNo.vue'

// Read-only: ownership changes only through claims (docs/API.md §7).
interface Props {
	company: AdminCompanyDetail
	claims: AdminClaim[]
}

const props = withDefaults(defineProps<Props>(), {})

const sorted_claims = computed(() =>
	[...props.claims].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
)

// an approved claimant who hasn't accepted their link yet
const waiting_name = computed(() => {
	if (props.company.claimed_at || props.company.deleted_at) return ''
	return props.claims.find(claim => claim.status === 'approved')?.claimant.name ?? ''
})
</script>

<style lang="scss" scoped>
.ownership {
	&__facts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	&__fact {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__value {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px 10px;
		font-family: var(--font-ui);
		font-size: 14px;
	}

	&__owners {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__owner {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	&__muted {
		font-family: var(--font-ui);
		color: var(--text-muted);

		// raw meta spans; MText sizes the empty state
		&:not(.m-text) {
			font-size: 13px;
		}
	}

	&__claims {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 16px;
		border-top: var(--rule);
	}

	&__title {
		font-family: var(--font-ui);
	}

	&__list {
		display: flex;
		flex-direction: column;
	}

	&__claim {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 12px;
		padding: 10px 0;
		border-bottom: var(--rule);

		&:first-child {
			padding-top: 0;
		}
	}

	&__claimant {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
	}

	&__status {
		justify-self: end;
	}
}

@media only screen and (max-width: 600px) {
	.ownership {
		&__facts {
			grid-template-columns: 1fr;
		}

		&__claim {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		&__status {
			grid-column: 1 / -1;
			justify-self: start;
		}
	}
}
</style>
