<template>
	<MPage
		id="admin-companies"
		class="companies"
		title="Companies"
		description="Every listing on BPO Profile, in any status. Publishing, verification and plans are decided here."
	>
		<template #actions>
			<MButton @click="openModal(create_modal)">
				<template #prefix>
					<MIcon name="light-plus" size="xs" />
				</template>
				Create company
			</MButton>
		</template>

		<div class="companies__toolbar">
			<MTabs v-model="active_status" :tabs="status_tabs" label="Filter companies by status" />
			<MSearch
				id="admin-companies-search"
				v-model="term"
				name="admin-companies-search"
				size="sm"
				label="Search companies"
				placeholder="Search by name, URL or headquarters"
				class="companies__search"
			/>
		</div>

		<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<Table
			:rows="page_rows"
			:unpublishable-ids="props.unpublishableIds"
			:has-filters="has_filters"
			@action="onAction"
			@clear-filters="clearFilters"
		/>

		<div class="companies__foot">
			<MText size="xsmall" color="--text-muted" class="companies__range">{{ range_label }}</MText>
			<MPagination v-model="page" :last-page="last_page" label="Company list pages" />
		</div>

		<Create :modal="create_modal" @create="onCreate" />

		<LifecycleModal
			:name="lifecycle_modal"
			kind="company"
			:action="lifecycle_action"
			:subject="target?.name ?? ''"
			@confirm="onLifecycle"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import type { TabItem } from '~/types/base/ui'
import type { AdminCompanyPayload, AdminCompanyRow } from '~/types/features/admin'
import type { PublicationStatus } from '~/types/features/directory'
import { pluralize, slugify } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import Create from './Create.vue'
import Table from './Table.vue'

const { findLocation } = useCatalogStore()

interface Props {
	companies: AdminCompanyRow[]
	// listings that fail a publication check
	unpublishableIds?: number[]
	// initial filter from ?status=
	status?: string
}

const props = withDefaults(defineProps<Props>(), {
	unpublishableIds: () => [],
	status: '',
})

const { openModal } = useModal()

const create_modal = 'admin-company-create'
const lifecycle_modal = 'admin-company-lifecycle'
const per_page = 10
const status_values = ['all', 'pending_review', 'published', 'draft', 'suspended', 'deleted']

// Actions change this local copy while the UI is static.
const rows = ref<AdminCompanyRow[]>(props.companies.map(row => ({ ...row })))
const term = ref('')
const active_status = ref(statusFrom(props.status))
const page = ref(1)
const notice = ref('')
const target = ref<AdminCompanyRow | null>(null)
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
	{ value: 'published', label: 'Published', count: countOf('published') },
	{ value: 'draft', label: 'Draft', count: countOf('draft') },
	{ value: 'suspended', label: 'Suspended', count: countOf('suspended') },
	{ value: 'deleted', label: 'Deleted', count: rows.value.length - live_rows.value.length },
])

const has_filters = computed(() => active_status.value !== 'all' || Boolean(term.value.trim()))

const filtered = computed(() => {
	const query = term.value.trim().toLowerCase()

	return rows.value.filter((row) => {
		if (active_status.value === 'deleted') {
			if (!row.deleted_at) return false
		}
		else {
			if (row.deleted_at) return false
			if (active_status.value !== 'all' && row.status !== active_status.value) return false
		}

		if (!query) return true
		return [row.name, row.slug, row.hq ?? ''].join(' ').toLowerCase().includes(query)
	})
})

const last_page = computed(() => Math.max(1, Math.ceil(filtered.value.length / per_page)))
const page_rows = computed(() => filtered.value.slice((page.value - 1) * per_page, page.value * per_page))

const range_label = computed(() => {
	const total = filtered.value.length
	if (!total) return 'No companies to show'
	const start = (page.value - 1) * per_page + 1
	const end = Math.min(page.value * per_page, total)
	return `Showing ${start}–${end} of ${pluralize(total, 'company', 'companies')}`
})

watch(last_page, (value) => {
	if (page.value > value) page.value = value
})

function update(id: number, changes: Partial<AdminCompanyRow>) {
	const updated_at = new Date().toISOString()
	rows.value = rows.value.map(row => (row.id === id ? { ...row, ...changes, updated_at } : row))
}

function onAction(row: AdminCompanyRow, action: string) {
	switch (action) {
		case 'publish':
			update(row.id, { status: 'published' })
			notice.value = `${row.name} is published and visible in the directory.`
			break
		case 'unpublish':
			update(row.id, { status: 'draft' })
			notice.value = `${row.name} is back to draft and hidden from the directory.`
			break
		case 'draft':
			update(row.id, { status: 'draft' })
			notice.value = `${row.name} was returned to draft. The company can resubmit it when it’s ready.`
			break
		case 'suspend':
			update(row.id, { status: 'suspended' })
			notice.value = `${row.name} is suspended and hidden from the directory.`
			break
		case 'lift':
			update(row.id, { status: 'draft' })
			notice.value = `The suspension on ${row.name} was lifted. It stays a draft until it’s published.`
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
		update(row.id, { deleted_at: new Date().toISOString(), claimed_at: null, owners: [] })
		notice.value = `${row.name} was deleted. Its team is hidden, memberships are removed and open claims were rejected.`
	}
	else {
		update(row.id, { deleted_at: null, status: 'draft', claimed_at: null, owners: [] })
		notice.value = `${row.name} was restored as an unclaimed draft. It needs a new claim before anyone can manage it.`
	}

	target.value = null
}

function onCreate(payload: AdminCompanyPayload) {
	const now = new Date().toISOString()
	const hq = findLocation(payload.hq_location_id)

	rows.value = [
		{
			id: Math.max(0, ...rows.value.map(row => row.id)) + 1,
			slug: slugify(payload.name),
			name: payload.name,
			logo_url: null,
			hq: hq?.name ?? null,
			status: 'draft',
			claimed_at: null,
			verified_at: null,
			plan: 'basic',
			plan_expires_at: null,
			completeness_score: 0,
			team_count: 0,
			owners: [],
			created_at: now,
			updated_at: now,
			deleted_at: null,
		},
		...rows.value,
	]

	term.value = ''
	active_status.value = 'draft'
	notice.value = `${payload.name} was created as a draft, unclaimed listing. It stays hidden until you publish it.`
}

function clearFilters() {
	term.value = ''
	active_status.value = 'all'
}
</script>

<style lang="scss" scoped>
.companies {
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
