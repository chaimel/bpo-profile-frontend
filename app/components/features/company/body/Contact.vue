<template>
	<section id="contact" class="contact" aria-labelledby="contact-title">
		<div class="contact__head">
			<MHeading id="contact-title" variant="2" size="3">Contact {{ props.company.name }}</MHeading>
			<MText size="large" color="--text-secondary">
				Send a message, ask a question, or request a quote. Pick a sales pro, or leave it with the company’s sales inbox.
			</MText>
		</div>

		<div class="contact__panel">
			<MInquiryForm
				id-prefix="company-inquiry"
				:company="{ id: props.company.id, name: props.company.name }"
				:recipients="recipients"
				:services="props.company.services"
				:actions="props.company.inquiry_actions"
				:initial-type="props.inquiryType"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MInquiryForm from '~/components/core/inquiry/MInquiryForm.vue'
import type { CompanyProfile, InquiryAction } from '~/types/features/directory'
import { fullName } from '~/utils/format'

interface Props {
	company: CompanyProfile
	inquiryType: InquiryAction
}

const props = defineProps<Props>()

const recipients = computed(() =>
	props.company.professionals.map(person => ({ id: person.id, name: fullName(person), job_title: person.job_title })),
)
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
