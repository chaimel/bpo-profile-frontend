<template>
	<div>
		<Companies
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
import Companies from '@/components/features/companies/Index.vue'
import type { CompanySearchParams } from '~/types/features/directory'

const { searchCompanies } = useDirectoryStore()

const keys = ['service', 'industry', 'country', 'sort'] as const
const { params, page, update, clear, pageLink } = useDirectoryQuery(keys)

// Static stand-in for GET /api/companies.
const results = computed(() => searchCompanies({ ...params.value, page: page.value } as CompanySearchParams, 9))

useHead({
	title: 'BPO companies',
	meta: [
		{
			name: 'description',
			content: 'Browse BPO companies by service, industry, and country. See what each provider offers and meet the sales team behind it.',
		},
	],
})

useCanonical('/companies')
</script>
