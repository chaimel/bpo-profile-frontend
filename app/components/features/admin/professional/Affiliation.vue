<template>
	<MFormSection
		id="affiliation"
		class="affiliation"
		title="Affiliation review"
		description="Whether this person belongs to the company. The company’s owners and admins can decide too; the same rules apply to both."
	>
		<div class="affiliation__status">
			<MStatusBadge kind="affiliation" :status="props.professional.affiliation_status" />
			<MText size="medium" color="--text-primary" class="affiliation__summary">{{ summary }}</MText>
		</div>

		<template v-if="is_pending">
			<ul class="affiliation__checks">
				<li class="affiliation__check">
					<MIcon
						:name="email_verified ? 'light-check-circle' : 'light-times-circle'"
						size="sm"
						:color="email_verified ? 'success' : 'danger'"
					/>
					<span>
						{{ email_verified ? 'Their email is verified' : 'Their email isn’t verified yet' }}
						<span class="affiliation__muted">
							{{ props.professional.account?.email ?? '' }}
						</span>
					</span>
				</li>
			</ul>

			<div class="affiliation__explain">
				<MText size="small" color="--text-secondary">
					Approving adds {{ props.professional.first_name }} to {{ props.professional.company.name }}’s team with a
					company membership. It doesn’t publish the profile or verify them; those stay separate decisions.
				</MText>
				<MText size="small" color="--text-secondary">
					Rejecting keeps their draft private. They keep access to it, but get no company membership or inbox.
				</MText>
			</div>

			<MText v-if="!email_verified" size="small" color="--text-secondary" class="affiliation__blocked">
				<MIcon name="light-info-circle" size="sm" color="text-muted" />
				Approval needs a verified email. It unlocks after {{ props.professional.first_name }} signs in with the
				emailed code for the first time.
			</MText>

			<div class="affiliation__actions">
				<MButton :disabled="!email_verified || is_deleted" @click="decide('approved')">
					<template #prefix>
						<MIcon name="light-user-check" size="xs" />
					</template>
					Approve affiliation
				</MButton>
				<MButton variant="neutral" :disabled="is_deleted" @click="decide('rejected')">
					Reject affiliation
				</MButton>
			</div>
		</template>

		<dl v-else-if="props.professional.affiliation_reviewed_at" class="affiliation__review">
			<div>
				<dt>Decided by</dt>
				<dd>{{ props.professional.affiliation_reviewed_by ?? 'Unknown' }}</dd>
			</div>
			<div>
				<dt>On</dt>
				<dd>{{ formatDateTime(props.professional.affiliation_reviewed_at) }}</dd>
			</div>
		</dl>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { AffiliationStatus } from '~/types/features/directory'
import { formatDateTime } from '~/utils/format'
import type { AdminProfessionalDetail } from '~/types/features/admin'

// PATCH /api/admin/professionals/{id}/affiliation. Approving a
// self-registered applicant needs their verified email and creates an
// accepted membership; it never publishes or verifies (docs/API.md §5).
interface Props {
	professional: AdminProfessionalDetail
	// the admin recorded as reviewer
	reviewer?: string
}

const props = withDefaults(defineProps<Props>(), {
	reviewer: 'Platform admin',
})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminProfessionalDetail>, _message: string): void
}>()

const is_pending = computed(() => props.professional.affiliation_status === 'pending')
const is_deleted = computed(() => Boolean(props.professional.deleted_at))

// a roster row has no login to verify; its company created it
const email_verified = computed(() =>
	props.professional.account ? Boolean(props.professional.account.email_verified_at) : true,
)

const summary = computed(() => {
	const company = props.professional.company.name

	if (props.professional.affiliation_status === 'pending') {
		return `${props.professional.first_name} registered as part of ${company} and is waiting for a decision.`
	}
	if (props.professional.affiliation_status === 'rejected') {
		return `${props.professional.first_name} isn’t part of ${company}. Their draft stays private.`
	}
	if (props.professional.source === 'roster') {
		return `${company} created this roster profile, so the affiliation was approved when it was added.`
	}
	return `${props.professional.first_name} is part of ${company}’s team.`
})

function decide(decision: Exclude<AffiliationStatus, 'pending'>) {
	const name = `${props.professional.first_name} ${props.professional.last_name}`
	const company = props.professional.company.name
	const reviewed = {
		affiliation_status: decision,
		affiliation_reviewed_by: props.reviewer,
		affiliation_reviewed_at: new Date().toISOString(),
	}

	if (decision === 'approved') {
		emit(
			'update',
			// an existing owner or admin role is kept
			{ ...reviewed, membership_role: props.professional.membership_role ?? 'professional' },
			`${name} is now part of ${company}’s team. The profile stays a draft until it’s published.`,
		)
		return
	}

	emit('update', reviewed, `${name}’s affiliation with ${company} was rejected. Their draft stays private.`)
}
</script>

<style lang="scss" scoped>
.affiliation {
	&__status {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	&__checks {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__check {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;

		.m-icon {
			margin-top: 2px;
		}
	}

	&__muted {
		display: block;
		font-weight: 400;
		color: var(--text-muted);
	}

	&__explain {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px 16px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
	}

	&__blocked {
		display: flex;
		align-items: flex-start;
		gap: 8px;

		.m-icon {
			margin-top: 3px;
		}
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__review {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;

		dt {
			font-family: var(--font-ui);
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--text-muted);
		}

		dd {
			margin-top: 4px;
			font-size: 16px;
			line-height: 24px;
		}
	}
}
</style>
