<template>
	<MFormSection
		:id="props.idPrefix"
		class="sessions"
		title="Sessions"
		description="Signed in on a device you no longer use, or one you don’t recognize? Sign out everywhere at once."
	>
		<MText color="--text-secondary" class="sessions__text">
			This signs you out on every device, including this one. You’ll need your password or Google, then an emailed code, to sign back in.
		</MText>

		<div class="sessions__actions">
			<MButton variant="neutral" :is-loading="status === 'saving'" @click="openModal(modal_name)">
				<template #prefix>
					<MIcon name="light-sign-out" size="xs" />
				</template>
				Sign out of all sessions
			</MButton>
		</div>

		<MAlert v-if="status === 'saved'" tone="success" live>
			<template #title>You’re signed out everywhere</template>
			Every device, including this one, now needs a fresh sign-in and an emailed code.
			<template #actions>
				<MButton variant="text" size="sm" to="/login">Go to sign in</MButton>
			</template>
		</MAlert>
		<MAlert v-else-if="status === 'failed'" tone="danger" live>
			We couldn’t sign you out everywhere. Please try again.
		</MAlert>

		<MModal :name="modal_name" variant="alert" tone="warning">
			<template #icon>
				<MIcon name="light-sign-out" size="md" />
			</template>
			<template #header>Sign out of all sessions?</template>

			You’ll be signed out on every device, including this one.

			<template #footer>
				<MButton variant="neutral" @click="closeModal(modal_name)">Stay signed in</MButton>
				<MButton @click="confirm">Sign out everywhere</MButton>
			</template>
		</MModal>
	</MFormSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'

interface Props {
	idPrefix: string
	// previews a failed request (?state=error)
	fails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	fails: false,
})

const { openModal, closeModal } = useModal()

const modal_name = `${props.idPrefix}-confirm`
const status = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')

function confirm() {
	closeModal(modal_name)
	status.value = 'saving'
	// Static stand-in: the real request bumps the account's auth version,
	// which ends every session, then returns to sign-in.
	setTimeout(() => {
		status.value = props.fails ? 'failed' : 'saved'
	}, 600)
}
</script>

<style lang="scss" scoped>
.sessions {
	&__text {
		max-width: 560px;
	}

	&__actions {
		display: flex;
	}
}
</style>
