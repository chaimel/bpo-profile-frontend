<template>
	<section id="directory" class="directory" aria-labelledby="directory-title">
		<div class="wrapper">
			<div class="directory__con">
				<MHeading id="directory-title" variant="2" size="3">Directory (core)</MHeading>

				<Specimen title="Company card" component="MCompanyCard" description="Grid for directories, row for search results." layout="stack">
					<div class="directory__grid">
						<MCompanyCard v-if="company" :company="company" />
						<MCompanyCard v-if="unclaimed" :company="unclaimed" />
					</div>
					<MCompanyCard v-if="company" :company="company" layout="row" />
				</Specimen>

				<Specimen title="Sales pro card" component="MProfessionalCard" layout="stack">
					<div class="directory__grid">
						<MProfessionalCard v-if="person" :professional="person" />
						<div class="directory__stack">
							<MProfessionalCard v-if="person" :professional="person" layout="compact" />
							<MProfessionalCard v-if="person" :professional="person" layout="row" />
						</div>
					</div>
				</Specimen>

				<Specimen title="Trust badges" component="MTrustBadges" description="Meaningful badges only. The list variant says what each one checked." layout="grid">
					<MTrustBadges kind="company" claimed verified :completeness="92" />
					<MTrustBadges kind="company" claimed verified :completeness="92" variant="list" size="sm" />
				</Specimen>

				<Specimen title="Directory search" component="MDirectorySearch" layout="stack">
					<MDirectorySearch id-prefix="sg-directory" />
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import MCompanyCard from '~/components/core/company/MCompanyCard.vue'
import MProfessionalCard from '~/components/core/professional/MProfessionalCard.vue'
import MDirectorySearch from '~/components/core/search/MDirectorySearch.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import Specimen from './Specimen.vue'

const { companyCards, professionalCards } = useDirectoryStore()

const company = companyCards.find(item => item.slug === 'northshore-cx')
const unclaimed = companyCards.find(item => !item.claimed)
const person = professionalCards.find(item => item.slug === 'luis-cruz')
</script>

<style lang="scss" scoped>
.directory {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0 96px;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
	}

	&__stack {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
}

@media only screen and (max-width: 768px) {
	.directory__grid {
		grid-template-columns: 1fr;
	}
}
</style>
