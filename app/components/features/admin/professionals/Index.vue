<template>
	<MPage
		id="admin-professionals"
		class="professionals"
		title="Professionals"
		description="Sales professionals across every company. Affiliation, publication and verification are separate decisions."
	>
		<template #actions>
			<MButton @click="openModal(create_modal)">
				<template #prefix>
					<MIcon name="light-user-plus" size="xs" />
				</template>
				Create roster profile
			</MButton>
		</template>

		<div class="professionals__toolbar">
			<MTabs v-model="active_status" :tabs="status_tabs" label="Filter professionals by status" />
			<MSearch
				id="admin-professionals-search"
				v-model="term"
				name="admin-professionals-search"
				size="sm"
				label="Search professionals"
				placeholder="Search by name, job title or company"
				class="professionals__search"
			/>
		</div>

		<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<Table
			:rows="page_rows"
			:companies="props.companies"
			:unpublishable-ids="props.unpublishableIds"
			:has-filters="has_filters"
			@action="onAction"
			@clear-filters="clearFilters"
		/>

		<div class="professionals__foot">
			<MText size="xsmall" color="--text-muted" class="professionals__range">{{ range_label }}</MText>
			<MPagination v-model="page" :last-page="last_page" label="Professional list pages" />
		</div>

		<Create :modal="create_modal" :companies="props.companies" @create="onCreate" />

		<LifecycleModal
			:name="lifecycle_modal"
			kind="professional"
			:action="lifecycle_action"
			:subject="target ? fullName(target) : ''"
			@confirm="onLifecycle"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import type { TabItem } from '~/types/base/ui'
import type { AdminCompanyRow, AdminProfessionalPayload, AdminProfessionalRow } from '~/types/features/admin'
import type { PublicationStatus } from '~/types/features/directory'
import { fullName, pluralize, slugify } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import Create from './Create.vue'
import Table from './Table.vue'

interface Props {
	professionals: AdminProfessionalRow[]
	companies: AdminCompanyRow[]
	// profiles that fail a publication check
	unpublishableIds?: number[]
	// initial filter from ?status=
	status?: string
}

const props = withDefaults(defineProps<Props>(), {
	unpublishableIds: () => [],
	status: '',
})

const { openModal } = useModal()

const create_modal = 'admin-professional-create'
const lifecycle_modal = 'admin-professional-lifecycle'
const per_page = 10
const status_values = ['all', 'pending_review', 'affiliation_pending', 'published', 'draft', 'suspended', 'deleted']

// Actions change this local copy while the UI is static.
const rows = ref<AdminProfessionalRow[]>(props.professionals.map(row => ({ ...row })))
const term = ref('')
const active_status = ref(statusFrom(props.status))
const page = ref(1)
const notice = ref('')
const target = ref<AdminProfessionalRow | null>(null)
const lifecycle_action = ref<'delete' | 'restore'>('delete')

function statusFrom(value: string): string {
	return status_values.includes(value) ? value : 'all'
}

watch(() => props.status, (value) => {
	active_status.value = statusFrom(value)
})

watch([term, active_status], () => {
	page.value = 1
})

const live_rows = computed(() => rows.value.filter(row => !row.deleted_at))

function countOf(status: PublicationStatus): number {
	return live_rows.value.filter(row => row.status === status).length
}

const status_tabs = computed<TabItem[]>(() => [
	{ value: 'all', label: 'All', count: live_rows.value.length },
	{ value: 'pending_review', label: 'Pending review', count: countOf('pending_review') },
	{
		value: 'affiliation_pending',
		label: 'Affiliation pending',
		count: live_rows.value.filter(row => row.affiliation_status === 'pending').length,
	},
	{ value: 'published', label: 'Published', count: countOf('published') },
	{ value: 'draft', label: 'Draft', count: countOf('draft') },
	{ value: 'suspended', label: 'Suspended', count: countOf('suspended') },
	{ value: 'deleted', label: 'Deleted', count: rows.value.length - live_rows.value.length },
])

const has_filters = computed(() => active_status.value !== 'all' || Boolean(term.value.trim()))

function matchesTab(row: AdminProfessionalRow): boolean {
	if (active_status.value === 'deleted') return Boolean(row.deleted_at)
	if (row.deleted_at) return false
	if (active_status.value === 'all') return true
	if (active_status.value === 'affiliation_pending') return row.affiliation_status === 'pending'
	return row.status === active_status.value
}

const filtered = computed(() => {
	const query = term.value.trim().toLowerCase()

	return rows.value.filter((row) => {
		if (!matchesTab(row)) return false
		if (!query) return true
		return [fullName(row), row.job_title, row.company.name].join(' ').toLowerCase().includes(query)
	})
})

const last_page = computed(() => Math.max(1, Math.ceil(filtered.value.length / per_page)))
const page_rows = computed(() => filtered.value.slice((page.value - 1) * per_page, page.value * per_page))

const range_label = computed(() => {
	const total = filtered.value.length
	if (!total) return 'No professionals to show'
	const start = (page.value - 1) * per_page + 1
	const end = Math.min(page.value * per_page, total)
	return `Showing ${start}–${end} of ${pluralize(total, 'professional')}`
})

watch(last_page, (value) => {
	if (page.value > value) page.value = value
})

function update(id: number, changes: Partial<AdminProfessionalRow>) {
	const updated_at = new Date().toISOString()
	rows.value = rows.value.map(row => (row.id === id ? { ...row, ...changes, updated_at } : row))
}

function onAction(row: AdminProfessionalRow, action: string) {
	const name = fullName(row)

	switch (action) {
		case 'publish':
			update(row.id, { status: 'published' })
			notice.value = `${name} is published on ${row.company.name}’s team.`
			break
		case 'unpublish':
			update(row.id, { status: 'draft' })
			notice.value = `${name} is back to draft and hidden from the directory.`
			break
		case 'draft':
			update(row.id, { status: 'draft' })
			notice.value = `${name}’s profile was returned to draft.`
			break
		case 'suspend':
			update(row.id, { status: 'suspended' })
			notice.value = `${name} is suspended and hidden from the directory.`
			break
		case 'lift':
			update(row.id, { status: 'draft' })
			notice.value = `The suspension on ${name} was lifted. The profile stays a draft until it’s published.`
			break
		case 'delete':
		case 'restore':
			target.value = row
			lifecycle_action.value = action === 'delete' ? 'delete' : 'restore'
			openModal(lifecycle_modal)
			break
	}
}

function onLifecycle() {
	const row = target.value
	if (!row) return

	if (lifecycle_action.value === 'delete') {
		update(row.id, { deleted_at: new Date().toISOString() })
		notice.value = `${fullName(row)} was deleted and removed from ${row.company.name}’s public team.`
	}
	else {
		update(row.id, { deleted_at: null, status: 'draft', affiliation_status: 'pending', verified_at: null })
		notice.value = `${fullName(row)} was restored as a draft. The affiliation needs approving again.`
	}

	target.value = null
}

function onCreate(payload: AdminProfessionalPayload) {
	const company = props.companies.find(item => item.id === payload.company_id)
	if (!company) return

	rows.value = [
		{
			id: Math.max(0, ...rows.value.map(row => row.id)) + 1,
			slug: slugify(`${payload.first_name} ${payload.last_name}`),
			first_name: payload.first_name,
			last_name: payload.last_name,
			job_title: payload.job_title,
			photo_url: null,
			company: { id: company.id, name: company.name, slug: company.slug },
			status: 'draft',
			affiliation_status: 'approved',
			verified_at: null,
			has_account: false,
			completeness_score: 0,
			updated_at: new Date().toISOString(),
			deleted_at: null,
		},
		...rows.value,
	]

	term.value = ''
	active_status.value = 'draft'
	notice.value = `${payload.first_name} ${payload.last_name} was added to ${company.name} as a draft roster profile with no login.`
}

function clearFilters() {
	term.value = ''
	active_status.value = 'all'
}
</script>

<style lang="scss" scoped>
.professionals {
	&__toolbar {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__search {
		max-width: 420px;
	}

	&__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	&__range {
		font-family: var(--font-ui);
	}
}
</style>
