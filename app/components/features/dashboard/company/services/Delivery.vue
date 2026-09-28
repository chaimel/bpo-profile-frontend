<template>
	<MFormSection
		:id="`${props.idPrefix}-delivery`"
		class="delivery"
		title="How you deliver"
		description="Capabilities, the languages your agents support, and the platforms your teams already work in."
	>
		<MTaxonomyPicker
			:id="`${props.idPrefix}-capabilities`"
			:model-value="props.capabilityIds"
			legend="Capabilities"
			:items="capabilities"
			@update:model-value="emit('update:capabilityIds', $event)"
		/>

		<MTaxonomyPicker
			:id="`${props.idPrefix}-languages`"
			:model-value="props.languageIds"
			legend="Languages"
			description="Languages your agents support customers in."
			:items="languages"
			@update:model-value="emit('update:languageIds', $event)"
		/>

		<MTaxonomyPicker
			:id="`${props.idPrefix}-technologies`"
			:model-value="props.technologyIds"
			legend="Technologies"
			description="Platforms your teams are trained on."
			:items="technologies"
			@update:model-value="emit('update:technologyIds', $event)"
		/>

		<MText size="small" color="--text-secondary" class="delivery__note">
			<MIcon name="light-info-circle" size="sm" class="delivery__note-icon" />
			<span>
				Looking for work model? Onshore, offshore, nearshore or hybrid is set under
				<NuxtLink :to="props.factsPath" class="delivery__link">Company facts</NuxtLink>
				on your profile.
			</span>
		</MText>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import MTaxonomyPicker from '~/components/core/taxonomy/MTaxonomyPicker.vue'

const { capabilities, languages, technologies } = useCatalogStore()

// work_model is a fixed enum on the company, not a taxonomy (docs/DATABASE.md §4.7)
interface Props {
	idPrefix: string
	capabilityIds: number[]
	languageIds: number[]
	technologyIds: number[]
	// the profile page's Company facts section
	factsPath: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update:capabilityIds' | 'update:languageIds' | 'update:technologyIds', _value: number[]): void
}>()
</script>

<style lang="scss" scoped>
.delivery {
	&__note {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 12px 14px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 2px;
		color: var(--text-muted);
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
</style>
