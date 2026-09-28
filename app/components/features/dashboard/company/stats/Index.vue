<template>
	<MPage
		id="company-stats"
		class="stats"
		title="Stats"
		:description="`How buyers found and contacted ${props.company.name}. Totals include your sales team.`"
	>
		<LoadError
			v-if="props.state === 'error'"
			title="We couldn’t load your stats"
			:retry-path="props.retryPath"
		/>
		<MStatsPanel
			v-else
			id-prefix="company-stats-panel"
			:stats="props.stats"
			scope="company"
			class="stats__panel"
		/>
	</MPage>
</template>

<script setup lang="ts">
import MStatsPanel from '~/components/core/stats/MStatsPanel.vue'
import LoadError from '~/components/features/dashboard/LoadError.vue'
import type { DashboardStats } from '~/types/features/dashboard'
import type { CompanyRef } from '~/types/features/directory'

// GET /api/dashboard/companies/{companyId}/stats — basic Phase 1 counts.
interface Props {
	company: CompanyRef
	stats: DashboardStats
	// 'error' previews a failed load (?state=error)
	state?: 'ready' | 'error'
	retryPath: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
})
</script>

<style lang="scss" scoped>
.stats {
	&__panel {
		min-width: 0;
	}
}
</style>
