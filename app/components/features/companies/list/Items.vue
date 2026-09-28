<template>
	<ul v-if="props.companies.length" class="items" aria-label="BPO companies">
		<li v-for="company in props.companies" :key="company.id" class="items__item">
			<MCompanyCard :company="company" layout="grid" heading-level="2" class="items__card" />
		</li>
	</ul>

	<MEmptyState v-else>
		<template #title>No BPOs found. Try adjusting your search.</template>
		Try another service or country, or clear the filters to see every listed company.
		<template #actions>
			<MButton variant="neutral" @click="emit('clear')">Clear filters</MButton>
			<MButton variant="text" to="/find">Open the full search</MButton>
		</template>
	</MEmptyState>
</template>

<script setup lang="ts">
import MCompanyCard from '~/components/core/company/MCompanyCard.vue'
import type { CompanyCard } from '~/types/features/directory'

interface Props {
	companies: CompanyCard[]
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
