<template>
	<section id="company" class="company" aria-labelledby="company-title">
		<MHeading id="company-title" variant="2" size="3">Represents {{ props.professional.company.name }}</MHeading>

		<div class="company__card">
			<MLogo :name="props.professional.company.name" :src="props.professional.company.logo_url" size="lg" decorative />
			<div class="company__main">
				<NuxtLink :to="company_path" class="company__name">{{ props.professional.company.name }}</NuxtLink>
				<MText v-if="props.professional.company.tagline" color="--text-secondary" class="company__tagline">{{ props.professional.company.tagline }}</MText>
				<MText v-if="props.professional.company.hq" size="xsmall" color="--text-secondary" class="company__hq">
					<MIcon name="light-map-marker" size="xs" />
					{{ locationLabel(props.professional.company.hq) }}
				</MText>
				<MTrustBadges
					kind="company"
					:claimed="props.professional.company.claimed"
					:verified="props.professional.company.verified"
					:completeness="props.professional.company.completeness_score"
					size="sm"
				/>
			</div>
			<MButton variant="outline" :to="company_path" class="company__cta">View Company Profile</MButton>
		</div>

		<MText size="small" color="--text-secondary" class="company__affiliation">
			<MIcon name="light-user-check" size="sm" />
			{{ props.professional.company.name }} approved {{ props.professional.first_name }}’s affiliation with the company.
		</MText>

		<div v-if="colleagues.length" class="company__team">
			<MHeading variant="3" size="5">More from the {{ props.professional.company.name }} team</MHeading>
			<ul class="company__list">
				<li v-for="person in colleagues" :key="person.id">
					<MProfessionalCard :professional="person" layout="compact" heading-level="4" :show-company="false" />
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MProfessionalCard from '~/components/core/professional/MProfessionalCard.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { ProfessionalProfile } from '~/types/features/directory'
import { locationLabel } from '~/utils/format'

const { findCompany } = useDirectoryStore()

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()

const company_path = computed(() => `/companies/${props.professional.company.slug}`)

// The rest of the team, from the company profile payload.
const colleagues = computed(() =>
	(findCompany(props.professional.company.slug)?.professionals ?? [])
		.filter(person => person.id !== props.professional.id),
)
</script>

<style lang="scss" scoped>
.company {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__card {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 24px;
		border-radius: var(--radius-lg);
		background: var(--canvas);
	}

	&__main {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 600;
		line-height: 26px;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
		}
	}

	&__hq {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-ui);
	}

	&__affiliation {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);

		.m-icon {
			color: var(--success);
		}
	}

	&__team {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 8px;
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 12px;
	}
}

@media only screen and (max-width: 768px) {
	.company__card {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
