<template>
	<MModal
		:name="props.name"
		variant="alert"
		:tone="props.action === 'delete' ? 'danger' : 'brand'"
		:max-width="540"
	>
		<template #icon>
			<MIcon :name="props.action === 'delete' ? 'light-trash' : 'light-undo'" size="md" />
		</template>

		<template #header>
			{{ props.action === 'delete' ? 'Delete' : 'Restore' }} {{ props.subject }}?
		</template>

		<template #content>
			<div class="lifecycle-modal">
				<MText size="medium" color="--text-secondary" class="lifecycle-modal__lede">{{ copy.lede }}</MText>

				<ul class="lifecycle-modal__effects">
					<li v-for="effect in copy.effects" :key="effect" class="lifecycle-modal__effect">
						<MIcon
							:name="props.action === 'delete' ? 'light-minus-circle' : 'light-info-circle'"
							size="xs"
							:color="props.action === 'delete' ? 'danger' : 'brand-strong'"
						/>
						<span>{{ effect }}</span>
					</li>
				</ul>

				<MText v-if="props.note" size="small" color="--text-secondary" class="lifecycle-modal__note">
					{{ props.note }}
				</MText>
			</div>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.name)">Cancel</MButton>
			<MButton :variant="props.action === 'delete' ? 'destructive' : 'primary'" @click="confirm">
				{{ props.action === 'delete' ? 'Delete' : 'Restore' }} {{ nouns[props.kind] }}
			</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Soft delete and restore for every admin record. Each list states the
// side effects the API applies (docs/API.md §8, docs/DATABASE.md §5),
// so nobody deletes a company without knowing its claims close too.
type LifecycleKind = 'company' | 'professional' | 'user' | 'term' | 'location'
type LifecycleAction = 'delete' | 'restore'

interface LifecycleCopy {
	lede: string
	effects: string[]
}

interface Props {
	// the MModal name to open with useModal()
	name: string
	kind: LifecycleKind
	action: LifecycleAction
	// what is being deleted or restored, e.g. "Northshore CX"
	subject: string
	// an extra line, e.g. how many profiles use a term
	note?: string
}

const props = withDefaults(defineProps<Props>(), {
	note: '',
})

const emit = defineEmits<{
	(_e: 'confirm'): void
}>()

const { closeModal } = useModal()

const nouns: Record<LifecycleKind, string> = {
	company: 'company',
	professional: 'profile',
	user: 'account',
	term: 'term',
	location: 'location',
}

const copies: Record<LifecycleKind, Record<LifecycleAction, LifecycleCopy>> = {
	company: {
		delete: {
			lede: 'The listing leaves BPO Profile straight away. You can restore it later, but none of this comes back:',
			effects: [
				'Its whole team is hidden from search and profiles.',
				'Every company membership is removed, owners included.',
				'Pending and approved claims are rejected, with a note on each.',
				'Unused team invitations and claim links are revoked.',
			],
		},
		restore: {
			lede: 'The listing comes back hidden, and nobody can manage it yet:',
			effects: [
				'It returns as a draft. Publish it again when it’s ready.',
				'It stays unclaimed. The company needs a new claim and review.',
				'No memberships, invitations or claim links are restored.',
				'Its public URL is checked first. A taken URL needs a new slug.',
			],
		},
	},
	professional: {
		delete: {
			lede: 'The profile leaves the directory straight away:',
			effects: [
				'It disappears from search and stops receiving personal inquiries.',
				'Unused invitations for this profile are revoked.',
				'Their professional membership is removed. An owner or admin role stays.',
			],
		},
		restore: {
			lede: 'The profile comes back private, as if it were new:',
			effects: [
				'It returns as a draft with its affiliation pending.',
				'Verification and review history are cleared.',
				'No membership or invitation is restored. Approval and publication happen again.',
			],
		},
	},
	user: {
		delete: {
			lede: 'The account is closed straight away:',
			effects: [
				'They’re signed out everywhere and their sessions are revoked.',
				'Every company membership is removed.',
				'Their pending and approved claims are rejected.',
				'Unused claim links and team invitations sent to them are revoked.',
				'Profiles linked to them keep their history. New inquiries go to the company’s fallback inbox.',
			],
		},
		restore: {
			lede: 'The account can sign in again, and that’s all:',
			effects: [
				'They sign in with their password and a fresh email code.',
				'Memberships, claims and links removed at deletion don’t come back.',
				'A company has to invite them again, or they submit a new claim.',
			],
		},
	},
	term: {
		delete: {
			lede: 'The term is hidden everywhere buyers and providers see it:',
			effects: [
				'It leaves search filters, profile editors and public catalog pages.',
				'You can restore it later if no active term has taken its slug.',
			],
		},
		restore: {
			lede: 'The term comes back with its slug, if that slug is still free:',
			effects: [
				'Profiles that used it show it again once it’s active.',
				'Check it’s marked active if providers should pick it.',
			],
		},
	},
	location: {
		delete: {
			lede: 'The place is hidden everywhere buyers and providers see it:',
			effects: [
				'It leaves search filters, landing pages and profile editors.',
				'Places inside it can’t be restored until it’s back.',
			],
		},
		restore: {
			lede: 'The place comes back only if it still fits the tree:',
			effects: [
				'Its parent has to exist and not be deleted.',
				'No sibling can be using the same slug.',
			],
		},
	},
}

const copy = computed(() => copies[props.kind][props.action])

function confirm() {
	emit('confirm')
	closeModal(props.name)
}
</script>

<style lang="scss" scoped>
.lifecycle-modal {
	display: flex;
	flex-direction: column;
	gap: 12px;

	&__effects {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__effect {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 15px;
		line-height: 22px;
		color: var(--text-primary);

		.m-icon {
			margin-top: 4px;
		}
	}

	&__note {
		padding-top: 12px;
		border-top: var(--rule);
	}
}
</style>
