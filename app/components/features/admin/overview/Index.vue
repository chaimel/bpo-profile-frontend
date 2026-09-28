<template>
	<MPage
		id="admin-overview"
		class="overview"
		title="Overview"
		description="What’s waiting for a decision across BPO Profile. Every queue opens the list it counts."
	>
		<Queue
			:companies="props.companies"
			:professionals="props.professionals"
			:claims="props.claims"
			:inquiries="props.inquiries"
		/>

		<div class="overview__grid">
			<Review
				:companies="props.companies"
				:professionals="props.professionals"
				:claims="props.claims"
				:inquiries="props.inquiries"
			/>
			<Claims :claims="props.claims" />
		</div>

		<Decisions />
	</MPage>
</template>

<script setup lang="ts">
import type { AdminClaim, AdminCompanyRow, AdminProfessionalRow } from '~/types/features/admin'
import type { Inquiry } from '~/types/features/inquiry'
import Claims from './Claims.vue'
import Decisions from './Decisions.vue'
import Queue from './Queue.vue'
import Review from './Review.vue'

interface Props {
	companies: AdminCompanyRow[]
	professionals: AdminProfessionalRow[]
	claims: AdminClaim[]
	inquiries: Inquiry[]
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped>
.overview {
	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		align-items: start;
		gap: 24px;
	}
}

@media only screen and (max-width: 1200px) {
	.overview {
		&__grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>
