<template>
	<div>
		<Claims
			:claims="adminClaims"
			:status="status"
			:claim-id="claim_id"
			:company-id="company_id"
			:company-name="company_name"
			:reviewer="reviewer"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Claims from '@/components/features/admin/claims/Index.vue'
import { fullName } from '~/utils/format'

const { adminClaims, findAdminCompany } = useAdminStore()
const { adminMe } = useSessionStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Claims — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

// ?status=pending | approved | rejected | fulfilled
const status = computed(() => String(route.query.status ?? ''))
// ?claim=<id> opens one claim, on its own status tab
const claim_id = computed(() => Number(route.query.claim) || null)
// ?company=<id> shows only that company's claims
const company_id = computed(() => Number(route.query.company) || null)
const company_name = computed(() => (company_id.value ? findAdminCompany(company_id.value)?.name ?? null : null))

// recorded as reviewed_by when this admin decides
const reviewer = fullName(adminMe)
</script>
