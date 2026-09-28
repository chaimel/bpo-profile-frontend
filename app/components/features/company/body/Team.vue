<template>
	<section id="team" class="team" aria-labelledby="team-title">
		<div class="team__head">
			<MHeading id="team-title" variant="2" size="3">Meet the sales team</MHeading>
			<MText size="large" color="--text-secondary">
				The people who represent {{ props.company.name }}. Connect with one directly, or use the contact form below.
			</MText>
		</div>

		<ul v-if="props.company.professionals.length" class="team__list">
			<li v-for="person in props.company.professionals" :key="person.id">
				<MProfessionalCard :professional="person" layout="row" heading-level="3" :show-company="false" class="team__card" />
			</li>
		</ul>

		<MEmptyState v-else icon="light-user-friends" variant="plain" heading-level="3">
			<template #title>This company hasn’t added its sales team yet.</template>
			You can still reach {{ props.company.name }} through the contact form below.
			<template #actions>
				<MButton variant="neutral" href="#contact">Contact the company</MButton>
			</template>
		</MEmptyState>
	</section>
</template>

<script setup lang="ts">
import MProfessionalCard from '~/components/core/professional/MProfessionalCard.vue'
import type { CompanyProfile } from '~/types/features/directory'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.team {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__head {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 680px;
	}

	&__list {
		display: flex;
		flex-direction: column;

		> li + li {
			border-top: var(--rule);
		}
	}
}
</style>
