<template>
	<MPage
		id="my-stats"
		class="stats"
		title="My stats"
		description="How buyers found and contacted you. These numbers cover your own profile only."
	>
		<LoadError
			v-if="props.state === 'error'"
			title="We couldn’t load your stats"
			:retry-path="props.retryPath"
		/>
		<MStatsPanel
			v-else
			id-prefix="my-stats-panel"
			:stats="props.stats"
			scope="professional"
			class="stats__panel"
		/>
	</MPage>
</template>

<script setup lang="ts">
import MStatsPanel from '~/components/core/stats/MStatsPanel.vue'
import LoadError from '~/components/features/dashboard/LoadError.vue'
import type { DashboardStats } from '~/types/features/dashboard'

// GET /api/dashboard/professional/stats
interface Props {
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
