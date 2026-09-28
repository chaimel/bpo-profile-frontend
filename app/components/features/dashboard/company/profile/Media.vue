<template>
	<MFormSection
		:id="`${props.idPrefix}-media`"
		class="media"
		title="Media"
		description="Your logo appears on search cards and your profile. The cover image runs across the top of your profile."
	>
		<MImageUpload
			:id="`${props.idPrefix}-logo`"
			kind="logo"
			label="Logo"
			:name="props.companyName"
			:src="props.logoUrl"
			:alt="props.logoAlt"
			rules="JPEG, PNG or WebP, up to 5 MB. A square image works best."
			@update:alt="emit('update:logoAlt', $event)"
			@change="emit('update:logoUrl', $event ? 'local-preview' : null)"
		/>

		<div class="media__rule" role="presentation" />

		<MImageUpload
			:id="`${props.idPrefix}-cover`"
			kind="cover"
			label="Cover image"
			:name="props.companyName"
			:src="props.coverUrl"
			:alt="props.coverAlt"
			rules="JPEG, PNG or WebP, up to 5 MB. Wide images work best — about four times as wide as they are tall."
			@update:alt="emit('update:coverAlt', $event)"
			@change="emit('update:coverUrl', $event ? 'local-preview' : null)"
		/>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import MImageUpload from '~/components/core/media/MImageUpload.vue'

// POST .../logo and .../cover; each upload carries its alt text.
interface Props {
	idPrefix: string
	// for the monogram shown until a logo is uploaded
	companyName: string
	logoUrl: string | null
	logoAlt: string
	coverUrl: string | null
	coverAlt: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update:logoUrl' | 'update:coverUrl', _value: string | null): void
	(_e: 'update:logoAlt' | 'update:coverAlt', _value: string): void
}>()
</script>

<style lang="scss" scoped>
.media {
	&__rule {
		height: 1px;
		background: var(--border);
	}
}
</style>
