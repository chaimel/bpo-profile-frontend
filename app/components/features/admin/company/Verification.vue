<template>
	<MFormSection
		id="verification"
		class="verification"
		title="Verification"
		description="The Verified company badge tells buyers the platform checked who this company is. Claiming and publishing never verify a listing."
	>
		<div class="verification__control">
			<MSwitch
				id="verification-switch"
				:model-value="is_verified"
				:disabled="is_deleted"
				aria-describedby="verification-meaning"
				@update:model-value="toggle"
			>
				Verified company
			</MSwitch>
			<MText id="verification-meaning" size="small" color="--text-secondary" class="verification__meaning">
				Platform reviewed legal/website identity.
			</MText>
			<MText size="xsmall" weight="medium" color="--text-primary" class="verification__state">
				<MIcon
					:name="is_verified ? 'light-check-circle' : 'light-minus-circle'"
					size="xs"
					:color="is_verified ? 'success' : 'text-muted'"
				/>
				{{ props.company.verified_at ? `Verified ${formatDate(props.company.verified_at)}` : 'Not verified' }}
			</MText>
		</div>

		<div class="verification__steps">
			<MHeading variant="3" size="6" weight="semi-bold" class="verification__steps-title">
				Before you switch it on
			</MHeading>
			<ul class="verification__list">
				<li>Check the business registration matches the company’s name.</li>
				<li>Confirm the website domain belongs to the company.</li>
				<li>Keep what you checked in your records. The badge says the platform did it.</li>
			</ul>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import { formatDate } from '~/utils/format'
import type { AdminCompanyDetail } from '~/types/features/admin'

// `verified` is the admin request boolean; the server sets or clears
// verified_at after identity review (docs/API.md §8).
interface Props {
	company: AdminCompanyDetail
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminCompanyDetail>, _message: string): void
}>()

const is_verified = computed(() => Boolean(props.company.verified_at))
const is_deleted = computed(() => Boolean(props.company.deleted_at))

function toggle(value: boolean) {
	emit(
		'update',
		{ verified_at: value ? new Date().toISOString() : null },
		value
			? `${props.company.name} is verified. The badge shows on its public profile.`
			: `Verification was removed from ${props.company.name}.`,
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
