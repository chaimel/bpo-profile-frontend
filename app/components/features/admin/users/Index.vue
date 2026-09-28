<template>
	<MPage
		id="admin-users"
		class="users"
		title="Users"
		description="Every account on BPO Profile. Company access comes from memberships, and ownership only from a reviewed claim or company registration."
	>
		<template #actions>
			<MButton @click="openModal(create_modal)">
				<template #prefix>
					<MIcon name="light-user-plus" size="xs" />
				</template>
				Create account
			</MButton>
		</template>

		<div class="users__toolbar">
			<MTabs v-model="active_status" :tabs="status_tabs" label="Filter accounts" />
			<MSearch
				id="admin-users-search"
				v-model="term"
				name="admin-users-search"
				size="sm"
				label="Search accounts"
				placeholder="Search by name or email"
				class="users__search"
			/>
		</div>

		<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<Table
			:rows="page_rows"
			:companies="props.companies"
			:professionals="props.professionals"
			:current-user-id="props.currentUserId"
			:has-filters="has_filters"
			@action="onAction"
			@clear-filters="clearFilters"
		/>

		<div class="users__foot">
			<MText size="xsmall" color="--text-muted" class="users__range">{{ range_label }}</MText>
			<MPagination v-model="page" :last-page="last_page" label="Account list pages" />
		</div>

		<Create :modal="create_modal" :emails="rows.map(row => row.email)" @create="onCreate" />
		<Role :modal="role_modal" :user="target" @save="onRole" />

		<LifecycleModal
			:name="lifecycle_modal"
			kind="user"
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
import type { AdminCompanyRow, AdminProfessionalRow, AdminUser, AdminUserPayload } from '~/types/features/admin'
import type { PlatformRole } from '~/types/features/dashboard'
import { fullName, pluralize } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import Create from './Create.vue'
import Role from './Role.vue'
import Table from './Table.vue'

// GET / POST /api/admin/users and the account lifecycle (docs/API.md §8).
interface Props {
	users: AdminUser[]
	// to link memberships and profiles to their admin pages
	companies: AdminCompanyRow[]
	professionals: AdminProfessionalRow[]
	// the signed-in admin can't delete themself or change their own role
	currentUserId?: number | null
	// initial filter from ?status=
	status?: string
	// initial search from ?q=
	query?: string
}

const props = withDefaults(defineProps<Props>(), {
	currentUserId: null,
	status: '',
	query: '',
})

const { openModal } = useModal()

const create_modal = 'admin-user-create'
const role_modal = 'admin-user-role'
const lifecycle_modal = 'admin-user-lifecycle'
const per_page = 10
const status_values = ['all', 'provider', 'admin', 'unverified', 'deleted']

// Actions change this local copy while the UI is static.
const rows = ref<AdminUser[]>(props.users.map(user => ({ ...user })))
const term = ref(props.query)
const active_status = ref(statusFrom(props.status))
const page = ref(1)
const notice = ref('')
const target = ref<AdminUser | null>(null)
const lifecycle_action = ref<'delete' | 'restore'>('delete')

function statusFrom(value: string): string {
	return status_values.includes(value) ? value : 'all'
}

watch(() => props.status, (value) => {
	active_status.value = statusFrom(value)
})

watch(() => props.query, (value) => {
	term.value = value
})

watch([term, active_status], () => {
	page.value = 1
})

const live_rows = computed(() => rows.value.filter(row => !row.deleted_at))

const status_tabs = computed<TabItem[]>(() => [
	{ value: 'all', label: 'All', count: live_rows.value.length },
	{ value: 'provider', label: 'Provider accounts', count: live_rows.value.filter(row => row.platform_role === 'user').length },
	{ value: 'admin', label: 'Platform admins', count: live_rows.value.filter(row => row.platform_role === 'admin').length },
	{ value: 'unverified', label: 'Email not verified', count: live_rows.value.filter(row => !row.email_verified_at).length },
	{ value: 'deleted', label: 'Deleted', count: rows.value.length - live_rows.value.length },
])

const has_filters = computed(() => active_status.value !== 'all' || Boolean(term.value.trim()))

function matchesTab(row: AdminUser): boolean {
	if (active_status.value === 'deleted') return Boolean(row.deleted_at)
	if (row.deleted_at) return false
	if (active_status.value === 'provider') return row.platform_role === 'user'
	if (active_status.value === 'admin') return row.platform_role === 'admin'
	if (active_status.value === 'unverified') return !row.email_verified_at
	return true
}

const filtered = computed(() => {
	const search = term.value.trim().toLowerCase()

	return rows.value.filter((row) => {
		if (!matchesTab(row)) return false
		if (!search) return true
		return [fullName(row), row.email].join(' ').toLowerCase().includes(search)
	})
})

const last_page = computed(() => Math.max(1, Math.ceil(filtered.value.length / per_page)))
const page_rows = computed(() => filtered.value.slice((page.value - 1) * per_page, page.value * per_page))

const range_label = computed(() => {
	const total = filtered.value.length
	if (!total) return 'No accounts to show'
	const start = (page.value - 1) * per_page + 1
	const end = Math.min(page.value * per_page, total)
	return `Showing ${start}–${end} of ${pluralize(total, 'account')}`
})

watch(last_page, (value) => {
	if (page.value > value) page.value = value
})

function update(id: number, changes: Partial<AdminUser>) {
	rows.value = rows.value.map(row => (row.id === id ? { ...row, ...changes } : row))
}

function onAction(row: AdminUser, action: string) {
	target.value = row

	if (action === 'role') {
		openModal(role_modal)
		return
	}

	if (action === 'delete' || action === 'restore') {
		lifecycle_action.value = action
		openModal(lifecycle_modal)
	}
}

function onRole(role: PlatformRole) {
	const row = target.value
	if (!row || row.platform_role === role) return

	update(row.id, { platform_role: role })
	const change = role === 'admin' ? `${fullName(row)} is now a platform admin.` : `${fullName(row)} now has a provider account.`
	notice.value = `${change} They were signed out everywhere and need to sign in again.`
}

function onLifecycle() {
	const row = target.value
	if (!row) return

	if (lifecycle_action.value === 'delete') {
		update(row.id, { deleted_at: new Date().toISOString(), companies: [] })
		notice.value = `${fullName(row)}’s account was deleted. Their sessions, memberships and open claims were closed.`
	}
	else {
		update(row.id, { deleted_at: null })
		notice.value = `${fullName(row)}’s account was restored. They’ll sign in again with a fresh email code.`
	}

	target.value = null
}

function onCreate(payload: AdminUserPayload) {
	const now = new Date().toISOString()

	rows.value = [
		{
			id: Math.max(0, ...rows.value.map(row => row.id)) + 1,
			first_name: payload.first_name,
			last_name: payload.last_name,
			email: payload.email,
			platform_role: payload.platform_role,
			email_verified_at: null,
			companies: [],
			professional: null,
			last_login_at: null,
			created_at: now,
			deleted_at: null,
		},
		...rows.value,
	]

	term.value = ''
	active_status.value = 'all'
	notice.value = `An account was created for ${payload.email}. They verify their email the first time they sign in.`
}

function clearFilters() {
	term.value = ''
	active_status.value = 'all'
}
</script>

<style lang="scss" scoped>
.users {
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
