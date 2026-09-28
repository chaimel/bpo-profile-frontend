<template>
	<div>
		<Overview
			:key="state"
			:me="me"
			:companies="companies"
			:professional="professional"
			:my-inquiries="my_inquiries"
			:my-stats="my_stats"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Overview from '@/components/features/dashboard/overview/Index.vue'

const {
	companyDashboards,
	findOwnProfessional,
	myInquiries,
	myStats,
	noActivityStats,
} = useDashboardStore()
const { me } = useSessionStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()

// ?state=empty previews a quiet account: no inquiries, no requests and
// no activity in the stats window.
const state = computed(() => (route.query.state === 'empty' ? 'empty' : 'ready'))

// GET /api/me, then each managed company's dashboard data.
const companies = computed(() => {
	const list = companyDashboards()
	if (state.value !== 'empty') return list

	return list.map(entry => ({
		...entry,
		inquiries: [],
		team: { ...entry.team, requests: [], invitations: [] },
		stats: noActivityStats('company'),
	}))
})

const professional = findOwnProfessional() ?? null
const my_inquiries = computed(() => (state.value === 'empty' ? [] : myInquiries))
const my_stats = computed(() => (state.value === 'empty' ? noActivityStats('professional') : myStats))

useHead({
	title: 'Dashboard',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
