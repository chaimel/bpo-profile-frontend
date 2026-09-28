<template>
	<div>
		<Find
			:params="params"
			:results="results"
			:state="state"
			:page-link="pageLink"
			@update="update"
			@clear="clear"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Find from '@/components/features/find/Index.vue'
import type { CompanySearchParams } from '~/types/features/directory'

const { searchCompanies } = useDirectoryStore()

const keys = ['q', 'service', 'industry', 'location', 'country', 'size', 'capability', 'work_model', 'language', 'technology', 'sort'] as const

const route = useRoute()
const { params, page, update, clear, pageLink } = useDirectoryQuery(keys)

// Static stand-in for GET /api/companies with the same params.
const results = computed(() => searchCompanies({ ...params.value, page: page.value } as CompanySearchParams, 8))

// ?state=error previews the failed-search state until the API exists.
const state = computed(() => (route.query.state === 'error' ? 'error' : 'ready'))

useHead({
	title: 'Find a BPO',
	meta: [
		{
			name: 'description',
			content: 'Search BPO companies by service, industry, location, company size, language, work model, capabilities, and technology.',
		},
	],
})

useCanonical('/find')
</script>
