<template>
	<MFormSection
		:id="`${props.idPrefix}-basics`"
		class="basics"
		title="Basics"
		description="How your company appears in search results and at the top of your profile."
	>
		<MInput
			:id="`${props.idPrefix}-name`"
			:model-value="props.name"
			name="name"
			autocomplete="organization"
			:max-length="200"
			required
			:has-error="Boolean(props.nameError)"
			@update:model-value="emit('update:name', $event)"
		>
			<template #label>Company name</template>
			<template #error>{{ props.nameError }}</template>
		</MInput>

		<MInput
			:id="`${props.idPrefix}-tagline`"
			:model-value="props.tagline"
			name="tagline"
			:max-length="255"
			optional
			@update:model-value="emit('update:tagline', $event)"
		>
			<template #label>Tagline</template>
			<template #hint>One line for your search card, e.g. “Bilingual customer support for US healthcare.” Up to 255 characters.</template>
		</MInput>

		<MTextarea
			:id="`${props.idPrefix}-overview`"
			:model-value="props.overview"
			name="overview"
			:rows="9"
			@update:model-value="emit('update:overview', $event)"
		>
			<template #label>Overview</template>
			<template #hint>
				What you do, who you do it for, and how you work. Leave a blank line between paragraphs.
				You can include client testimonials if they’re attributed — they appear as company-provided content, not verified reviews.
			</template>
		</MTextarea>

		<MTextarea
			:id="`${props.idPrefix}-why`"
			:model-value="props.whyChooseUs"
			name="why_choose_us"
			:rows="5"
			@update:model-value="emit('update:whyChooseUs', $event)"
		>
			<template #label>Why choose us</template>
			<template #hint>One differentiator per line. Specific beats general: “HIPAA training for every agent” over “Quality service”.</template>
		</MTextarea>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'

interface Props {
	idPrefix: string
	name: string
	tagline: string
	overview: string
	whyChooseUs: string
	nameError?: string
}

const props = withDefaults(defineProps<Props>(), {
	nameError: undefined,
})

const emit = defineEmits<{
	(_e: 'update:name' | 'update:tagline' | 'update:overview' | 'update:whyChooseUs', _value: string): void
}>()
</script>

<style lang="scss" scoped>
.basics {
	min-width: 0;
}
</style>
