<template>
	<div class="glance">
		<MAlert v-if="props.professional.deleted_at" tone="danger" icon="light-trash">
			<template #title>Deleted {{ formatDate(props.professional.deleted_at) }}</template>
			Hidden from the directory and from {{ props.professional.company.name }}’s team. Restore it from the
			danger zone to bring it back as a draft.
		</MAlert>

		<dl class="glance__facts">
			<div class="glance__fact">
				<dt class="glance__label">Status</dt>
				<dd class="glance__value">
					<MStatusBadge kind="publication" :status="props.professional.status" size="sm" />
				</dd>
			</div>

			<div class="glance__fact">
				<dt class="glance__label">Affiliation</dt>
				<dd class="glance__value">
					<MStatusBadge kind="affiliation" :status="props.professional.affiliation_status" size="sm" />
				</dd>
			</div>

			<div class="glance__fact">
				<dt class="glance__label">Verified</dt>
				<dd class="glance__value">
					<YesNo :value="Boolean(props.professional.verified_at)" />
				</dd>
			</div>

			<div class="glance__fact">
				<dt class="glance__label">Account</dt>
				<dd class="glance__value">
					<YesNo :value="props.professional.has_account" yes="Linked" no="No login" />
				</dd>
			</div>

			<div class="glance__fact glance__fact--wide">
				<dt class="glance__label">Completeness</dt>
				<dd class="glance__value">
					<MProgress
						:value="props.professional.completeness_score"
						:threshold="80"
						size="sm"
						aria-label="Profile completeness"
						class="glance__progress"
					/>
					<span class="glance__score" aria-hidden="true">{{ props.professional.completeness_score }}%</span>
				</dd>
			</div>
		</dl>
	</div>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import { formatDate } from '~/utils/format'
import YesNo from '../shared/YesNo.vue'
import type { AdminProfessionalDetail } from '~/types/features/admin'

// The profile's state at a glance, above the editable sections.
interface Props {
	professional: AdminProfessionalDetail
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped>
.glance {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__facts {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, auto)) minmax(200px, 1fr);
		border-top: var(--rule);
		border-bottom: var(--rule);
	}

	&__fact {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px 24px 14px 0;
		margin-right: 24px;
		border-right: var(--rule);

		&--wide {
			margin-right: 0;
			border-right: 0;
		}
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
		gap: 4px 8px;
		min-height: 24px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--text-primary);
	}

	&__progress {
		flex: 1 1 120px;
		max-width: 220px;
	}

	&__score {
		font-size: 13px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
}

@media only screen and (max-width: 1024px) {
	.glance {
		&__facts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		&__fact {
			margin-right: 0;
			padding: 12px 16px 12px 0;
			border-right: 0;
			border-bottom: var(--rule);

			&--wide {
				grid-column: 1 / -1;
				border-bottom: 0;
			}
		}
	}
}
</style>
