<template>
	<div>
		<Professionals
			:params="params"
			:results="results"
			:page-link="pageLink"
			@update="update"
			@clear="clear"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Professionals from '@/components/features/professionals/Index.vue'
import type { ProfessionalSearchParams } from '~/types/features/directory'

const { searchProfessionals } = useDirectoryStore()

const keys = ['q', 'service', 'industry', 'country', 'location', 'language', 'sort'] as const
const { params, page, update, clear, pageLink } = useDirectoryQuery(keys)

// Static stand-in for GET /api/professionals.
const results = computed(() => searchProfessionals({ ...params.value, page: page.value } as ProfessionalSearchParams, 12))

useHead({
	title: 'Sales pros',
	meta: [
		{
			name: 'description',
			content: 'Meet the sales executives and business development professionals who represent BPO companies — and contact them directly.',
		},
	],
})

useCanonical('/professionals')
</script>
