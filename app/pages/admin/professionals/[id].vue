<template>
	<div>
		<Professional
			:key="professional.id"
			:professional="professional"
			:company="company"
			:reviewer="reviewer"
		/>
	</div>
</template>

<script setup lang="ts">
import Professional from '@/components/features/admin/professional/Index.vue'
import { fullName } from '~/utils/format'
import { notFound } from '~/utils/errors'

const { findAdminCompany, findAdminProfessional } = useAdminStore()
const { adminMe } = useSessionStore()

definePageMeta({ layout: 'admin' })

// recorded as affiliation_reviewed_by when this admin decides
const reviewer = fullName(adminMe)

const route = useRoute()
const found = findAdminProfessional(Number(route.params.id))

if (!found) {
	throw notFound('No professional with that ID.')
}

const professional = found
const company = findAdminCompany(professional.company.id)

useHead({
	title: `${professional.first_name} ${professional.last_name} — Admin`,
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
