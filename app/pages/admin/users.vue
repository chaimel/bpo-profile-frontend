<template>
	<div>
		<Users
			:users="adminUsers"
			:companies="adminCompanies"
			:professionals="adminProfessionals"
			:current-user-id="adminMe.id"
			:status="status"
			:query="query"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Users from '@/components/features/admin/users/Index.vue'

const { adminCompanies, adminProfessionals, adminUsers } = useAdminStore()
const { adminMe } = useSessionStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Users — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

// ?status=provider | admin | unverified | deleted
const status = computed(() => String(route.query.status ?? ''))
// ?q= pre-fills the search, e.g. from a professional's linked account
const query = computed(() => String(route.query.q ?? ''))
</script>
