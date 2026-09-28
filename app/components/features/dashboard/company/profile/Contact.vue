<template>
	<MFormSection
		:id="`${props.idPrefix}-contact`"
		class="contact"
		title="Contact and links"
		description="Buyers reach you through the forms on your profile. These add other ways to learn about you."
	>
		<div class="contact__row">
			<MInput
				:id="`${props.idPrefix}-website`"
				:model-value="props.websiteUrl"
				name="website_url"
				type="url"
				autocomplete="url"
				placeholder="https://"
				:max-length="500"
				optional
				:has-error="Boolean(props.websiteError)"
				@update:model-value="emit('update:websiteUrl', $event)"
			>
				<template #label>Website</template>
				<template #error>{{ props.websiteError }}</template>
			</MInput>

			<MInput
				:id="`${props.idPrefix}-linkedin`"
				:model-value="props.linkedinUrl"
				name="linkedin_url"
				type="url"
				placeholder="https://"
				:max-length="500"
				optional
				:has-error="Boolean(props.linkedinError)"
				@update:model-value="emit('update:linkedinUrl', $event)"
			>
				<template #label>LinkedIn page</template>
				<template #error>{{ props.linkedinError }}</template>
			</MInput>
		</div>

		<MInput
			:id="`${props.idPrefix}-inquiry-email`"
			:model-value="props.inquiryEmail"
			name="inquiry_email"
			type="email"
			autocomplete="email"
			:max-length="255"
			:has-error="Boolean(props.inquiryEmailError)"
			@update:model-value="emit('update:inquiryEmail', $event)"
		>
			<template #label>Inquiry email</template>
			<template #inner-left>
				<MIcon name="light-eye-slash" size="sm" />
			</template>
			<template #hint>
				Private — never shown on your profile. Inquiries sent to the company arrive here, and so do inquiries for team members who can’t receive them yet. Required before publication.
			</template>
			<template #error>{{ props.inquiryEmailError }}</template>
		</MInput>

		<MInput
			:id="`${props.idPrefix}-phone`"
			:model-value="props.phone"
			name="phone"
			type="tel"
			autocomplete="tel"
			:max-length="50"
			optional
			class="contact__phone"
			@update:model-value="emit('update:phone', $event)"
		>
			<template #label>Phone</template>
			<template #hint>Shown on your public profile.</template>
		</MInput>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'

interface Props {
	idPrefix: string
	websiteUrl: string
	linkedinUrl: string
	// the private fallback inbox (docs/API.md §4)
	inquiryEmail: string
	phone: string
	websiteError?: string
	linkedinError?: string
	inquiryEmailError?: string
}

const props = withDefaults(defineProps<Props>(), {
	websiteError: undefined,
	linkedinError: undefined,
	inquiryEmailError: undefined,
})

const emit = defineEmits<{
	(_e: 'update:websiteUrl' | 'update:linkedinUrl' | 'update:inquiryEmail' | 'update:phone', _value: string): void
}>()
</script>

<style lang="scss" scoped>
.contact {
	&__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
		align-items: start;
	}

	&__phone {
		max-width: 320px;
	}
}

// side by side only when the form column fits two full URLs
@container (min-width: 540px) {
	.contact__row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media only screen and (max-width: 600px) {
	.contact {
		&__phone {
			max-width: none;
		}
	}
}
</style>
