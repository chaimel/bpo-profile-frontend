<template>
	<ul v-if="props.professionals.length" class="items" aria-label="Sales pros">
		<li v-for="professional in props.professionals" :key="professional.id" class="items__item">
			<MProfessionalCard :professional="professional" layout="grid" heading-level="2" class="items__card" />
		</li>
	</ul>

	<MEmptyState v-else icon="light-user-friends">
		<template #title>No sales pros found. Try adjusting your search.</template>
		Try a broader service or a different country — or search companies instead and meet their teams.
		<template #actions>
			<MButton variant="neutral" @click="emit('clear')">Clear filters</MButton>
			<MButton variant="text" to="/find">Find a BPO</MButton>
		</template>
	</MEmptyState>
</template>

<script setup lang="ts">
import MProfessionalCard from '~/components/core/professional/MProfessionalCard.vue'
import type { ProfessionalCard } from '~/types/features/directory'

interface Props {
	professionals: ProfessionalCard[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'clear'): void
}>()
</script>

<style lang="scss" scoped>
.items {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 24px;

	&__item {
		display: flex;
	}

	&__card {
		width: 100%;
	}
}

@media only screen and (max-width: 1024px) {
	.items {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
}

@media only screen and (max-width: 640px) {
	.items {
		grid-template-columns: 1fr;
	}
}
</style>
