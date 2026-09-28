<template>
	<MFormSection
		:id="`${props.idPrefix}-status`"
		class="status"
		title="Listing status"
		description="Who can see your listing, and what BPO Profile has confirmed about it."
	>
		<div class="status__current">
			<MStatusBadge kind="publication" :status="props.savedStatus" />
			<MText color="--text-secondary" class="status__meaning">{{ meanings[props.savedStatus] }}</MText>
		</div>

		<MAlert v-if="props.savedStatus === 'suspended'" tone="danger">
			<template #title>Only the BPO Profile team can lift a suspension</template>
			You can keep editing your profile, but the listing stays hidden until the suspension is resolved.
			<template #actions>
				<MButton variant="text" size="sm" to="/contact">Contact BPO Profile</MButton>
			</template>
		</MAlert>

		<fieldset v-else class="status__choice">
			<legend class="status__legend">Visibility</legend>
			<div class="status__options">
				<MRadio
					v-for="option in options"
					:id="`${props.idPrefix}-status-${option.value}`"
					:key="option.value"
					:name="`${props.idPrefix}-status`"
					:value="option.value"
					:model-value="props.status"
					variant="card"
					@update:model-value="emit('update:status', option.value)"
				>
					{{ option.label }}
					<template #description>{{ option.description }}</template>
				</MRadio>
			</div>
			<MText size="small" color="--text-muted" class="status__rule">{{ rule }}</MText>
		</fieldset>

		<MAlert v-if="show_inbox_warning" tone="warning">
			<template #title>Add an inquiry email first</template>
			Listings need one before they can be reviewed or stay live. It’s where inquiries go when they’re sent to the company, or when a team member can’t receive them. Add it under Contact and links.
		</MAlert>

		<dl class="status__facts">
			<div class="status__fact">
				<dt class="status__term">Ownership</dt>
				<dd class="status__detail">
					<MBadge v-if="props.claimedAt" tone="slate" icon="light-shield" size="sm">Claimed</MBadge>
					<MBadge v-else tone="neutral" icon="light-minus-circle" size="sm">Not claimed</MBadge>
					<span>
						{{ props.claimedAt
							? `You’ve controlled this listing since ${formatDate(props.claimedAt)}.`
							: 'No company admin controls this listing yet.' }}
					</span>
				</dd>
			</div>

			<div class="status__fact">
				<dt class="status__term">Verification</dt>
				<dd class="status__detail">
					<MBadge v-if="props.verifiedAt" tone="brand" icon="light-check-circle" size="sm">Verified company</MBadge>
					<MBadge v-else tone="neutral" icon="light-minus-circle" size="sm">Not verified yet</MBadge>
					<span>
						{{ props.verifiedAt
							? `BPO Profile reviewed your legal and website identity on ${formatDate(props.verifiedAt)}.`
							: 'Our team reviews each company’s legal and website identity by hand before adding the Verified badge.' }}
					</span>
				</dd>
			</div>

			<div class="status__fact">
				<dt class="status__term">Plan</dt>
				<dd class="status__detail">
					<MBadge tone="neutral" icon="light-tag" size="sm">{{ props.planName }}</MBadge>
					<span>
						Plans are assigned by the BPO Profile team until billing launches.
						<NuxtLink to="/pricing" class="status__link">Compare plans</NuxtLink>
					</span>
				</dd>
			</div>
		</dl>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { PublicationStatus } from '~/types/features/directory'
import { formatDate } from '~/utils/format'

// Company users may only request draft or pending_review; publishing,
// suspension and verification belong to platform admins (docs/API.md §5).
interface Props {
	idPrefix: string
	// the status this form will save
	status: PublicationStatus
	// the stored status, which decides the choices on offer
	savedStatus: PublicationStatus
	claimedAt: string | null
	verifiedAt: string | null
	planName: string
	missingInbox?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	missingInbox: false,
})

const emit = defineEmits<{
	(_e: 'update:status', _value: PublicationStatus): void
}>()

interface StatusOption {
	value: PublicationStatus
	label: string
	description: string
}

const meanings: Record<PublicationStatus, string> = {
	draft: 'Only your team can see this listing. Submit it for review when it’s ready.',
	pending_review: 'Our team is reviewing your listing. It isn’t public yet, and you can keep editing.',
	published: 'Live in the directory. Buyers can find you, meet your sales team and send inquiries.',
	suspended: 'Hidden from the directory by the BPO Profile team.',
}

// A live listing shows as live; otherwise the choice is draft or review.
const options = computed<StatusOption[]>(() => {
	if (props.savedStatus === 'published') {
		return [
			{
				value: 'published',
				label: 'Live',
				description: 'Buyers can find your listing and your sales team in the directory.',
			},
			{
				value: 'draft',
				label: 'Move to draft',
				description: 'Hides your listing and sales team from the directory. Going live again needs another review.',
			},
		]
	}

	return [
		{
			value: 'draft',
			label: 'Draft',
			description: 'Only your team can see it. Keep editing until it’s ready.',
		},
		{
			value: 'pending_review',
			label: 'Submit for review',
			description: 'Our team checks your listing before it goes live in the directory.',
		},
	]
})

const rule = computed(() =>
	props.savedStatus === 'published'
		? 'Only the BPO Profile team publishes listings, so a listing moved to draft goes through review again.'
		: 'Only the BPO Profile team publishes listings. Keep yours as a draft, or submit it when it’s ready.',
)

const show_inbox_warning = computed(() =>
	props.missingInbox && (props.status === 'pending_review' || props.status === 'published'),
)
</script>

<style lang="scss" scoped>
.status {
	&__current {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	&__choice {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}

	&__legend {
		margin-bottom: 8px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
	}

	&__options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	// --- Trust and plan facts ------------------------------------
	&__facts {
		display: flex;
		flex-direction: column;
		border-top: var(--rule);
	}

	// the next form section draws its own top rule
	&__fact {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr);
		gap: 16px;
		padding: 14px 0;
		border-bottom: var(--rule);

		&:last-child {
			border-bottom: 0;
		}
	}

	&__term {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__detail {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}
}

@media only screen and (max-width: 768px) {
	.status {
		&__options {
			grid-template-columns: minmax(0, 1fr);
		}

		&__fact {
			grid-template-columns: minmax(0, 1fr);
			gap: 6px;
		}
	}
}
</style>
