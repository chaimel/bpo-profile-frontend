<template>
	<MModal :name="props.name" variant="alert" tone="danger" class="remove">
		<template #icon>
			<MIcon name="light-trash" size="md" />
		</template>
		<template #header>Remove {{ props.certification?.name ?? 'this certification' }}?</template>

		It comes off your public profile straight away. You can add it again at any time.

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.name)">Keep it</MButton>
			<MButton variant="destructive" @click="confirm">Remove certification</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import type { Certification } from '~/types/features/directory'

interface Props {
	name: string
	certification?: Certification | null
}

const props = withDefaults(defineProps<Props>(), {
	certification: null,
})

const emit = defineEmits<{
	(_e: 'confirm'): void
}>()

const { closeModal } = useModal()

function confirm() {
	emit('confirm')
	closeModal(props.name)
}
</script>

<style lang="scss" scoped>
// Layout and type come from MModal's alert variant; nothing to add here.
</style>
