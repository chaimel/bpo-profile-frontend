<template>
	<div class="body">
		<div class="wrapper">
			<div class="body__con">
				<div class="body__main">
					<About :professional="props.professional" />
					<Expertise :professional="props.professional" />
					<Experience v-if="props.professional.experience_summary" :professional="props.professional" />
					<Company :professional="props.professional" />
					<Contact :professional="props.professional" :inquiry-type="props.inquiryType" />
				</div>

				<Sidebar :professional="props.professional" class="body__aside" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { InquiryAction, ProfessionalProfile } from '~/types/features/directory'
import About from './About.vue'
import Company from './Company.vue'
import Contact from './Contact.vue'
import Experience from './Experience.vue'
import Expertise from './Expertise.vue'
import Sidebar from './Sidebar.vue'

interface Props {
	professional: ProfessionalProfile
	inquiryType: InquiryAction
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.body {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 300px;
		align-items: start;
		gap: 64px;
		padding: 48px 0 96px;
	}

	&__main {
		display: flex;
		flex-direction: column;
		min-width: 0;

		> * {
			padding-bottom: 44px;
			scroll-margin-top: calc(var(--header-height) + 24px);
		}

		> * + * {
			padding-top: 44px;
			border-top: var(--rule);
		}
	}

	&__aside {
		position: sticky;
		top: calc(var(--header-height) + 24px);
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
