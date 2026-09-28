<template>
	<MPage
		id="dashboard-overview"
		class="overview"
		:title="`Welcome back, ${props.me.first_name}`"
		:description="summary"
	>
		<div class="overview__grid">
			<div class="overview__main">
				<Companies :companies="props.companies" />

				<template v-if="primary">
					<KeyStats
						:stats="primary.stats"
						:company-name="primary.company.name"
						:stats-path="`/dashboard/companies/${primary.company.id}/stats`"
					/>
					<RecentInquiries
						:inquiries="primary.inquiries"
						:inbox-path="`/dashboard/companies/${primary.company.id}/inquiries`"
					/>
				</template>
			</div>

			<div class="overview__aside">
				<SalesProfile
					v-if="props.professional"
					:professional="props.professional"
					:inquiries="props.myInquiries"
					:stats="props.myStats"
				/>
				<Checklist :companies="props.companies" :professional="props.professional" />
			</div>
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyDashboard, DashboardStats, EditableProfessional, Me } from '~/types/features/dashboard'
import type { Inquiry } from '~/types/features/inquiry'
import { pluralize } from '~/utils/format'
import Checklist from './Checklist.vue'
import Companies from './Companies.vue'
import KeyStats from './KeyStats.vue'
import RecentInquiries from './RecentInquiries.vue'
import SalesProfile from './SalesProfile.vue'

interface Props {
	me: Me
	// one entry per company the user owns or administers
	companies: CompanyDashboard[]
	professional?: EditableProfessional | null
	myInquiries?: Inquiry[]
	myStats?: DashboardStats | null
}

const props = withDefaults(defineProps<Props>(), {
	professional: null,
	myInquiries: () => [],
	myStats: null,
})

// Stats and recent inquiries follow the first company; with more than
// one membership the company cards link to the rest.
const primary = computed(() => props.companies[0])

const new_inquiries = computed(() =>
	props.companies.reduce((total, entry) => total + entry.inquiries.filter(inquiry => inquiry.status === 'new').length, 0),
)

const pending_requests = computed(() =>
	props.companies.reduce((total, entry) => total + entry.team.requests.length, 0),
)

const summary = computed(() => {
	const waiting: string[] = []
	if (new_inquiries.value) waiting.push(pluralize(new_inquiries.value, 'new inquiry', 'new inquiries'))
	if (pending_requests.value) waiting.push(pluralize(pending_requests.value, 'affiliation request'))

	if (!waiting.length) return 'You’re all caught up. Here’s how your profiles are doing.'
	return `You have ${waiting.join(' and ')} waiting for you.`
})
</script>

<style lang="scss" scoped>
.overview {
	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 340px;
		align-items: start;
		gap: 32px;
	}

	&__main,
	&__aside {
		display: flex;
		flex-direction: column;
		gap: 32px;
		min-width: 0;
	}
}

@media only screen and (max-width: 1200px) {
	.overview__grid {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
