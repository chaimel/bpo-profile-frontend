<template>
	<MFormSection
		id="verification"
		class="verification"
		title="Verification"
		description="The Verified professional badge tells buyers the platform confirmed this person really works where they say. Affiliation approval alone never sets it."
	>
		<div class="verification__control">
			<MSwitch
				id="verification-switch"
				:model-value="is_verified"
				:disabled="is_locked"
				aria-describedby="verification-meaning"
				@update:model-value="toggle"
			>
				Verified professional
			</MSwitch>
			<MText id="verification-meaning" size="small" color="--text-secondary" class="verification__meaning">
				Platform confirmed the person belongs to the affiliated company.
			</MText>
			<MText size="xsmall" weight="medium" color="--text-primary" class="verification__state">
				<MIcon
					:name="is_verified ? 'light-check-circle' : 'light-minus-circle'"
					size="xs"
					:color="is_verified ? 'success' : 'text-muted'"
				/>
				{{ props.professional.verified_at ? `Verified ${formatDate(props.professional.verified_at)}` : 'Not verified' }}
			</MText>
		</div>

		<MText
			v-if="!is_verified && props.professional.affiliation_status !== 'approved' && !is_deleted"
			size="small"
			color="--text-secondary"
			class="verification__locked"
		>
			<MIcon name="light-info-circle" size="sm" color="text-muted" />
			Approve the affiliation first. Verification confirms an affiliation that’s already approved.
		</MText>

		<div class="verification__steps">
			<MHeading variant="3" size="6" weight="semi-bold" class="verification__steps-title">
				Before you switch it on
			</MHeading>
			<ul class="verification__list">
				<li>Confirm their role with the company’s owner or admin, not only with the person.</li>
				<li>Check the job title matches what the company says.</li>
				<li>Keep what you checked in your records. The badge says the platform did it.</li>
			</ul>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import { formatDate } from '~/utils/format'
import type { AdminProfessionalDetail } from '~/types/features/admin'

// `verified` is the admin request boolean; the server sets or clears
// verified_at (docs/API.md §8).
interface Props {
	professional: AdminProfessionalDetail
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminProfessionalDetail>, _message: string): void
}>()

const is_verified = computed(() => Boolean(props.professional.verified_at))
const is_deleted = computed(() => Boolean(props.professional.deleted_at))

// removing a badge is always allowed; granting one needs an approved affiliation
const is_locked = computed(() =>
	is_deleted.value || (!is_verified.value && props.professional.affiliation_status !== 'approved'),
)

function toggle(value: boolean) {
	const name = `${props.professional.first_name} ${props.professional.last_name}`
	emit(
		'update',
		{ verified_at: value ? new Date().toISOString() : null },
		value
			? `${name} is verified. The badge shows on their public profile.`
			: `Verification was removed from ${name}.`,
	)
}
</script>

<style lang="scss" scoped>
.verification {
	&__control {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}

	&__state {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
	}

	&__locked {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	&__steps {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 16px;
		border-top: var(--rule);
	}

	&__steps-title {
		font-family: var(--font-ui);
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-left: 18px;
		list-style: disc;
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}
}
</style>
