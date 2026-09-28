<template>
	<div class="nav">
		<div class="wrapper">
			<nav class="nav__con" aria-label="Profile sections">
				<a v-for="link in links" :key="link.href" :href="link.href" class="nav__link">{{ link.label }}</a>
			</nav>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyProfile } from '~/types/features/directory'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()

// Only link to sections the profile actually has.
const links = computed(() => [
	{ label: 'About', href: '#about', show: true },
	{ label: 'Services', href: '#services', show: props.company.services.length > 0 },
	{ label: 'Locations', href: '#locations', show: props.company.locations.length > 0 },
	{ label: 'Why choose us', href: '#why', show: Boolean(props.company.why_choose_us) },
	{ label: 'Sales team', href: '#team', show: true },
	{ label: 'Certifications', href: '#certifications', show: props.company.certifications.length > 0 },
	{ label: 'Contact', href: '#contact', show: true },
].filter(link => link.show))
</script>

<style lang="scss" scoped>
.nav {
	position: sticky;
	top: var(--header-height);
	z-index: 20;
	background: var(--header-glass);
	backdrop-filter: saturate(1.4) blur(12px);
	border-top: var(--rule);
	border-bottom: var(--rule);

	&__con {
		display: flex;
		gap: 4px;
		overflow-x: auto;
		scrollbar-width: none;
		// fade the right edge: more sections scroll into view
		mask-image: linear-gradient(to right, black calc(100% - 40px), transparent);

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__link {
		flex: 0 0 auto;
		padding: 14px 12px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;

		&:first-child {
			padding-left: 0;
		}

		&:hover {
			color: var(--brand-strong);
		}

		&:focus-visible {
			outline-offset: -2px;
		}
	}
}
</style>
