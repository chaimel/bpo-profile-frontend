<template>
	<div class="find">
		<Header :query="props.params.q ?? ''" @search="emit('update', { q: $event || undefined })" />
		<Results
			:params="props.params"
			:results="props.results"
			:state="props.state"
			:page-link="props.pageLink"
			@update="emit('update', $event)"
			@clear="emit('clear')"
		/>
	</div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Paginated } from '~/types/api/common'
import type { CompanyCard } from '~/types/features/directory'
import Header from './Header.vue'
import Results from './results/Index.vue'

interface Props {
	params: Record<string, string | undefined>
	results: Paginated<CompanyCard>
	state: 'ready' | 'error'
	pageLink: (page: number) => RouteLocationRaw
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update', _patch: Record<string, string | undefined>): void
	(_e: 'clear'): void
}>()
</script>
