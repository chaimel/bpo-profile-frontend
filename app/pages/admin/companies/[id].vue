<template>
	<div>
		<Company :key="company.id" :company="company" :team="team" :claims="claims" />
	</div>
</template>

<script setup lang="ts">
import Company from '@/components/features/admin/company/Index.vue'
import { notFound } from '~/utils/errors'

const { adminClaims, adminProfessionals, findAdminCompany } = useAdminStore()

definePageMeta({ layout: 'admin' })

const route = useRoute()
const found = findAdminCompany(Number(route.params.id))

if (!found) {
	throw notFound('No company with that ID.')
}

const company = found
const team = adminProfessionals.filter(professional => professional.company.id === company.id)
const claims = adminClaims.filter(claim => claim.company.id === company.id)

useHead({
	title: `${company.name} — Admin`,
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
