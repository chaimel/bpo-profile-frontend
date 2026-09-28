<template>
	<div>
		<Overview
			:companies="adminCompanies"
			:professionals="adminProfessionals"
			:claims="adminClaims"
			:inquiries="adminInquiries"
		/>
	</div>
</template>

<script setup lang="ts">
import Overview from '@/components/features/admin/overview/Index.vue'

const { adminClaims, adminCompanies, adminInquiries, adminProfessionals } = useAdminStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Overview — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
