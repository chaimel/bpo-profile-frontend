<template>
	<MFormSection
		:id="`${props.idPrefix}-offer`"
		class="offer"
		title="What you offer"
		description="Services and industries are the first filters buyers reach for. Choose every one you actively sell."
	>
		<MTaxonomyPicker
			:id="`${props.idPrefix}-services`"
			:model-value="props.serviceIds"
			legend="Services"
			description="Choose at least one, so buyers searching by service can find you."
			:items="services"
			@update:model-value="emit('update:serviceIds', $event)"
		/>

		<MTaxonomyPicker
			:id="`${props.idPrefix}-industries`"
			:model-value="props.industryIds"
			legend="Industries"
			description="Industries you have real client experience in."
			:items="industries"
			@update:model-value="emit('update:industryIds', $event)"
		/>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import MTaxonomyPicker from '~/components/core/taxonomy/MTaxonomyPicker.vue'

const { industries, services } = useCatalogStore()

interface Props {
	idPrefix: string
	serviceIds: number[]
	industryIds: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update:serviceIds' | 'update:industryIds', _value: number[]): void
}>()
</script>

<style lang="scss" scoped>
.offer {
	min-width: 0;
}
</style>
