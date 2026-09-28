<template>
	<div>
		<MyStats
			:key="state"
			:stats="state === 'empty' ? noActivityStats('professional') : myStats"
			:state="state === 'error' ? 'error' : 'ready'"
			:retry-path="route.path"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MyStats from '@/components/features/dashboard/stats/Index.vue'
import { notFound } from '~/utils/errors'

const { findOwnProfessional, myStats, noActivityStats } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()

// GET /api/dashboard/professional/stats needs the user's own profile.
if (!findOwnProfessional()) {
	throw notFound('You don’t have a sales profile yet, so there are no stats to show.')
}

// ?state=empty previews a window with no activity; ?state=error a
// failed load.
const state = computed(() => {
	const value = route.query.state
	return value === 'empty' || value === 'error' ? value : 'ready'
})

useHead({
	title: 'My stats',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
