<template>
	<section id="data-display" class="data-display" aria-labelledby="data-display-title">
		<div class="wrapper">
			<div class="data-display__con">
				<MHeading id="data-display-title" variant="2" size="3">Data display</MHeading>

				<Specimen title="Avatars and logos" component="MAvatar · MLogo" description="Initials and monograms stand in until a photo or logo is uploaded.">
					<MAvatar name="Luis Cruz" size="sm" />
					<MAvatar name="Luis Cruz" size="md" />
					<MAvatar name="Luis Cruz" size="lg" />
					<MAvatar name="Luis Cruz" size="xl" />
					<MLogo name="Northshore CX" size="sm" />
					<MLogo name="Meridian Contact Group" size="md" />
					<MLogo name="Andes Nearshore Solutions" size="lg" />
					<MLogo name="Deccan Data Works" size="lg" />
				</Specimen>

				<Specimen title="Table" component="MTable" layout="stack">
					<MTable :columns="columns" :rows="rows" caption="Sample team">
						<template #cell-name="{ row }">
							<span class="data-display__person">
								<MAvatar :name="row.name" size="sm" decorative />
								{{ row.name }}
							</span>
						</template>
						<template #cell-status="{ row }">
							<MStatusBadge kind="publication" :status="row.status" size="sm" />
						</template>
						<template #cell-actions>
							<MDropdown label="Row actions" :items="[{ label: 'Edit profile', value: 'edit', icon: 'light-edit' }]" icon="light-dots-horizontal" icon-only variant="ghost" />
						</template>
					</MTable>
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { TableColumn } from '~/types/base/ui'
import type { PublicationStatus } from '~/types/features/directory'
import Specimen from './Specimen.vue'

const columns: TableColumn[] = [
	{ key: 'name', label: 'Name' },
	{ key: 'title', label: 'Job title', hideBelow: 'md' },
	{ key: 'status', label: 'Status' },
	{ key: 'actions', label: 'Actions', align: 'right', srOnlyLabel: true, width: '64px' },
]

const rows: { id: number, name: string, title: string, status: PublicationStatus }[] = [
	{ id: 1, name: 'Luis Cruz', title: 'Director of Business Development', status: 'published' },
	{ id: 2, name: 'Miguel Ramos', title: 'Account Manager', status: 'draft' },
	{ id: 3, name: 'Bea Lim', title: 'Sales Executive', status: 'pending_review' },
]
</script>

<style lang="scss" scoped>
.data-display {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}

	&__person {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-weight: 500;
	}
}
</style>
