<template>
	<MFormSection
		:id="props.idPrefix"
		class="delete"
		title="Danger zone"
		description="Deleting your account can’t be undone from your dashboard."
	>
		<MText>If you delete your account:</MText>
		<ul class="delete__effects">
			<li>You’re signed out everywhere, and any sign-in codes stop working.</li>
			<li v-if="props.companyNames.length">
				You lose access to {{ companies_label }}. If you’re the last owner, the listing becomes unclaimed until someone claims it again.
			</li>
			<li v-if="props.hasSalesProfile">
				Your sales profile stays on your company’s team, but new inquiries to you go to the company inbox instead.
			</li>
			<li>Pending claim requests, and unused claim or invitation links sent to you, stop working.</li>
		</ul>

		<div class="delete__actions">
			<MButton variant="destructive" :is-loading="status === 'saving'" @click="openModal(modal_name)">
				<template #prefix>
					<MIcon name="light-trash" size="xs" />
				</template>
				Delete account
			</MButton>
		</div>

		<MAlert v-if="status === 'saved'" tone="success" live>
			<template #title>Your account is deleted</template>
			You’ve been signed out on every device.
			<template #actions>
				<MButton variant="text" size="sm" to="/">Go to the home page</MButton>
			</template>
		</MAlert>
		<MAlert v-else-if="status === 'failed'" tone="danger" live>
			We couldn’t delete your account. Nothing has changed — please try again.
		</MAlert>

		<MModal :name="modal_name" variant="alert" tone="danger">
			<template #icon>
				<MIcon name="light-exclamation-triangle" size="md" />
			</template>
			<template #header>Delete your account?</template>

			<template #content>
				<div class="delete__confirm">
					<MText color="--text-secondary">
						Only the BPO Profile team can restore a deleted account, and restoring it doesn’t bring back company access.
					</MText>
					<MInput
						:id="`${props.idPrefix}-confirm`"
						v-model="confirmation"
						name="confirm_delete"
						autocomplete="off"
						:has-error="Boolean(confirm_error)"
					>
						<template #label>Type DELETE to confirm</template>
						<template #error>{{ confirm_error }}</template>
					</MInput>
				</div>
			</template>

			<template #footer>
				<MButton variant="neutral" @click="closeModal(modal_name)">Keep my account</MButton>
				<MButton variant="destructive" @click="confirm">Delete account</MButton>
			</template>
		</MModal>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'

// Account deletion ends sessions, removes memberships, closes open
// claims and onboarding links, and reroutes inquiries (docs/DATABASE.md §5).
interface Props {
	idPrefix: string
	companyNames: string[]
	hasSalesProfile?: boolean
	// previews a failed request (?state=error)
	fails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	hasSalesProfile: false,
	fails: false,
})

const { openModal, closeModal, isOpen } = useModal()

const modal_name = `${props.idPrefix}-modal`
const confirmation = ref('')
const confirm_error = ref('')
const status = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')

const companies_label = computed(() => props.companyNames.join(', '))

// Ask again every time the dialog opens.
watch(() => isOpen(modal_name), (open) => {
	if (!open) return
	confirmation.value = ''
	confirm_error.value = ''
})

watch(confirmation, () => {
	confirm_error.value = ''
})

function confirm() {
	if (confirmation.value.trim() !== 'DELETE') {
		confirm_error.value = 'Type DELETE, in capital letters, to confirm.'
		document.getElementById(`${props.idPrefix}-confirm`)?.focus()
		return
	}

	closeModal(modal_name)
	status.value = 'saving'
	// Static stand-in for the deletion request.
	setTimeout(() => {
		status.value = props.fails ? 'failed' : 'saved'
	}, 600)
}
</script>

<style lang="scss" scoped>
.delete {
	&__effects {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 620px;
		padding-left: 20px;
		list-style: disc;

		li {
			font-size: 16px;
			line-height: 24px;
			color: var(--text-secondary);
		}
	}

	&__actions {
		display: flex;
	}

	&__confirm {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-top: 4px;
	}
}
</style>
