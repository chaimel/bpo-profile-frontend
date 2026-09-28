<template>
	<section id="navigation" class="navigation" aria-labelledby="navigation-title">
		<div class="wrapper">
			<div class="navigation__con">
				<MHeading id="navigation-title" variant="2" size="3">Navigation</MHeading>

				<Specimen title="Tabs" component="MTabs" description="Arrow keys move between tabs; Home and End jump to the ends." layout="stack">
					<MTabs v-model="tab" :tabs="tabs" label="Inquiry status" />
					<MTabs v-model="mode" :tabs="modes" label="Search for" variant="segmented" />
				</Specimen>

				<Specimen title="Breadcrumbs" component="MBreadcrumbs">
					<MBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'BPO Profiles', to: '/companies' }, { label: 'Northshore CX' }]" />
				</Specimen>

				<Specimen title="Pagination" component="MPagination">
					<MPagination v-model="page" :last-page="12" />
				</Specimen>

				<Specimen title="Menu" component="MDropdown" description="Down arrow opens and moves through items; Escape closes and returns focus.">
					<MDropdown label="Actions" :items="menu" align="left" />
					<MDropdown label="Row actions" :items="menu" icon="light-dots-horizontal" icon-only variant="ghost" align="left" />
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownItem, TabItem } from '~/types/base/ui'
import Specimen from './Specimen.vue'

const tab = ref('new')
const mode = ref('companies')
const page = ref(4)

const tabs: TabItem[] = [
	{ value: 'all', label: 'All', count: 8 },
	{ value: 'new', label: 'New', count: 3 },
	{ value: 'replied', label: 'Replied', count: 2 },
	{ value: 'archived', label: 'Archived' },
]

const modes: TabItem[] = [
	{ value: 'companies', label: 'BPO companies', icon: 'light-building' },
	{ value: 'professionals', label: 'Sales pros', icon: 'light-user-friends' },
]

const menu: DropdownItem[] = [
	{ label: 'View details', value: 'view', icon: 'light-eye' },
	{ label: 'Edit', value: 'edit', icon: 'light-edit' },
	{ label: 'Archive', value: 'archive', icon: 'light-box-full' },
	{ label: 'Delete', value: 'delete', icon: 'light-trash', tone: 'danger', divided: true },
]
</script>

<style lang="scss" scoped>
.navigation {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}
}
</style>
