<template>
	<div>
		<Professionals
			:professionals="adminProfessionals"
			:companies="adminCompanies"
			:unpublishable-ids="unpublishable_ids"
			:status="status"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Professionals from '@/components/features/admin/professionals/Index.vue'

const {
	adminCompanies,
	adminProfessionalDetails,
	adminProfessionals,
	findAdminCompany,
	professionalPublicationChecks,
} = useAdminStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Professionals — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

// ?status=pending_review | affiliation_pending | published | draft | suspended | deleted
const status = computed(() => String(route.query.status ?? ''))

// Profiles the API would refuse to publish yet; their row menu links to
// the moderation checklist instead of offering Publish.
const unpublishable_ids = adminProfessionalDetails
	.filter(professional => !professionalPublicationChecks(professional, findAdminCompany(professional.company.id)).every(check => check.met))
	.map(professional => professional.id)
</script>
