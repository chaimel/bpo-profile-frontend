<template>
	<div class="body">
		<div class="wrapper">
			<div class="body__con">
				<div class="body__main">
					<Overview :company="props.company" />
					<Offerings v-if="has_offerings" :company="props.company" />
					<Locations v-if="props.company.locations.length" :company="props.company" />
					<Differentiators v-if="props.company.why_choose_us" :company="props.company" />
					<Team :company="props.company" />
					<Certifications v-if="props.company.certifications.length" :company="props.company" />
					<Contact :company="props.company" :inquiry-type="props.inquiryType" />
				</div>

				<Sidebar :company="props.company" class="body__aside" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyProfile, InquiryAction } from '~/types/features/directory'
import Certifications from './Certifications.vue'
import Contact from './Contact.vue'
import Differentiators from './Differentiators.vue'
import Locations from './Locations.vue'
import Offerings from './Offerings.vue'
import Overview from './Overview.vue'
import Sidebar from './Sidebar.vue'
import Team from './Team.vue'

interface Props {
	company: CompanyProfile
	inquiryType: InquiryAction
}

const props = defineProps<Props>()

const has_offerings = computed(() =>
	props.company.services.length > 0 || props.company.industries.length > 0 || props.company.capabilities.length > 0,
)
</script>

<style lang="scss" scoped>
.body {
	background: var(--white);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		align-items: start;
		gap: 64px;
		padding: 48px 0 96px;
	}

	&__main {
		display: flex;
		flex-direction: column;
		min-width: 0;

		// anchor jumps clear the sticky header and section nav
		> * {
			scroll-margin-top: calc(var(--header-height) + 72px);
		}

		> * + * {
			margin-top: 0;
			padding-top: 48px;
			border-top: var(--rule);
		}

		> * {
			padding-bottom: 48px;
		}
	}

	&__aside {
		position: sticky;
		top: calc(var(--header-height) + 72px);
	}
}

@media only screen and (max-width: 1024px) {
	.body {
		&__con {
			grid-template-columns: 1fr;
			gap: 0;
			padding: 32px 0 64px;
		}

		&__aside {
			position: static;
			order: -1;
			padding-bottom: 32px;
		}
	}
}
</style>
