<template>
	<section id="contact" class="contact" aria-labelledby="contact-title">
		<div class="contact__head">
			<MHeading id="contact-title" variant="2" size="3">Connect with {{ props.professional.first_name }}</MHeading>
			<MText size="large" color="--text-secondary">
				Send a message, ask a question, or request a quote. It goes straight to {{ props.professional.first_name }} at
				{{ props.professional.company.name }}.
			</MText>
		</div>

		<div class="contact__panel">
			<MInquiryForm
				id-prefix="professional-inquiry"
				:company="{ id: props.professional.company.id, name: props.professional.company.name }"
				:professional="{ id: props.professional.id, name: name, job_title: props.professional.job_title }"
				:services="props.professional.services"
				:actions="props.professional.inquiry_actions"
				:initial-type="props.inquiryType"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MInquiryForm from '~/components/core/inquiry/MInquiryForm.vue'
import type { InquiryAction, ProfessionalProfile } from '~/types/features/directory'
import { fullName } from '~/utils/format'

interface Props {
	professional: ProfessionalProfile
	inquiryType: InquiryAction
}

const props = defineProps<Props>()

const name = computed(() => fullName(props.professional))
</script>

<style lang="scss" scoped>
.contact {
	display: flex;
	flex-direction: column;
	gap: 24px;

	&__head {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 680px;
	}

	&__panel {
		padding: 28px;
		border-radius: var(--radius-lg);
		background: var(--canvas);
	}
}

@media only screen and (max-width: 600px) {
	.contact__panel {
		padding: 20px 16px;
	}
}
</style>
