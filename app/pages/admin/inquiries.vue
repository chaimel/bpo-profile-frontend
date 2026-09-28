<template>
	<div>
		<Inquiries :inquiries="adminInquiries" />
	</div>
</template>

<script setup lang="ts">
import Inquiries from '@/components/features/admin/inquiries/Index.vue'

const { adminInquiries } = useAdminStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Inquiries — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
