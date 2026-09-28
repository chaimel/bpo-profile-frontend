<template>
	<div>
		<Companies
			:companies="adminCompanies"
			:unpublishable-ids="unpublishable_ids"
			:status="status"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Companies from '@/components/features/admin/companies/Index.vue'

const { adminCompanies, adminCompanyDetails, companyPublicationChecks } = useAdminStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Companies — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

// ?status=pending_review | published | draft | suspended | deleted
const status = computed(() => String(route.query.status ?? ''))

// Listings the API would refuse to publish yet; their row menu links to
// the moderation checklist instead of offering Publish.
const unpublishable_ids = adminCompanyDetails
	.filter(company => !companyPublicationChecks(company).every(check => check.met))
	.map(company => company.id)
</script>
