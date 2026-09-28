<template>
	<section id="overlays" class="overlays" aria-labelledby="overlays-title">
		<div class="wrapper">
			<div class="overlays__con">
				<MHeading id="overlays-title" variant="2" size="3">Overlays</MHeading>

				<Specimen title="Dialogs and drawer" component="MModal · MDrawer" description="Opened through useModal(). Focus moves in on open and returns on close; Escape closes.">
					<MButton variant="neutral" @click="openModal('sg-basic')">Open dialog</MButton>
					<MButton variant="neutral" @click="openModal('sg-alert')">Open confirmation</MButton>
					<MButton variant="neutral" @click="openModal('sg-drawer')">Open drawer</MButton>
				</Specimen>
			</div>
		</div>

		<MModal name="sg-basic">
			<template #header>Add team member</template>
			<template #content>
				<div class="overlays__form">
					<MInput id="sg-modal-first" v-model="first_name" name="first_name">
						<template #label>First name</template>
					</MInput>
					<MInput id="sg-modal-title" v-model="job_title" name="job_title">
						<template #label>Job title</template>
					</MInput>
				</div>
			</template>
			<template #footer>
				<MButton variant="neutral" @click="closeModal('sg-basic')">Cancel</MButton>
				<MButton @click="closeModal('sg-basic')">Add member</MButton>
			</template>
		</MModal>

		<MModal name="sg-alert" variant="alert" tone="danger" :max-width="480">
			<template #icon>
				<MIcon name="light-trash" size="md" />
			</template>
			<template #header>Remove Miguel Ramos from the team?</template>
			Their profile leaves your public team list and any unused invitation is revoked.
			<template #footer>
				<MButton variant="neutral" @click="closeModal('sg-alert')">Keep</MButton>
				<MButton variant="destructive" @click="closeModal('sg-alert')">Remove</MButton>
			</template>
		</MModal>

		<MDrawer name="sg-drawer" side="right">
			<template #header>Filters</template>
			<MText>Drawers hold mobile navigation and search filters.</MText>
			<template #footer>
				<MButton block @click="closeModal('sg-drawer')">Show results</MButton>
			</template>
		</MDrawer>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Specimen from './Specimen.vue'

const { openModal, closeModal } = useModal()

const first_name = ref('')
const job_title = ref('')
</script>

<style lang="scss" scoped>
.overlays {
	background: var(--canvas);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}

	&__form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
}
</style>
