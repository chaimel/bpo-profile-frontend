<template>
	<div class="professionals">
		<Header :total="props.results.meta.total" />
		<Filters :params="props.params" @change="emit('update', $event)" @clear="emit('clear')" />
		<List :results="props.results" :page-link="props.pageLink" @clear="emit('clear')" />
		<Cta />
	</div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Paginated } from '~/types/api/common'
import type { ProfessionalCard } from '~/types/features/directory'
import Cta from './Cta.vue'
import Filters from './Filters.vue'
import Header from './Header.vue'
import List from './list/Index.vue'

interface Props {
	params: Record<string, string | undefined>
	results: Paginated<ProfessionalCard>
	pageLink: (page: number) => RouteLocationRaw
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update', _patch: Record<string, string | undefined>): void
	(_e: 'clear'): void
}>()
</script>
