<template>
	<MFormSection
		:id="props.idPrefix"
		class="add"
		title="Add a location"
		description="Choose a country, then narrow it to a region or city if you like."
	>
		<p class="sr-only" role="status">{{ announcement }}</p>

		<MLocationSelect
			v-model="selection"
			:id-prefix="`${props.idPrefix}-place`"
			legend="New location"
			hide-legend
			any-label="Choose a country"
		/>

		<p v-if="error" class="m-field-error" role="alert">
			<MIcon name="light-exclamation-circle" size="xs" />
			{{ error }}
		</p>

		<div class="add__actions">
			<MButton variant="neutral" :disabled="!selection" @click="submit">
				<template #prefix>
					<MIcon name="light-plus" size="xs" />
				</template>
				Add location
			</MButton>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MLocationSelect from '~/components/core/location/MLocationSelect.vue'

const { findLocation } = useCatalogStore()

interface Props {
	idPrefix: string
	existingIds: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'add', _id: number): void
}>()

// the deepest location chosen so far, as MLocationSelect reports it
const selection = ref('')
const error = ref('')
const announcement = ref('')

watch(selection, () => {
	error.value = ''
})

function submit() {
	const location = findLocation(selection.value ? Number(selection.value) : null)
	if (!location) return

	if (props.existingIds.includes(location.id)) {
		error.value = `${location.name} is already on your list.`
		return
	}

	emit('add', location.id)
	announcement.value = `${location.name} added to your locations. Save to keep it.`
	selection.value = ''
}
</script>

<style lang="scss" scoped>
.add {
	&__actions {
		display: flex;
	}
}
</style>
