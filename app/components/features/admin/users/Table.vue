<template>
	<div class="table">
		<MTable :columns="columns" :rows="props.rows" caption="Accounts" :muted-row="isDeleted">
			<template #cell-name="{ row }">
				<div class="table__person">
					<MAvatar :name="fullName(row)" size="sm" decorative />
					<div class="table__person-text">
						<span :class="['table__name', { 'table__name--muted': row.deleted_at }]">
							{{ fullName(row) }}
						</span>
						<!-- the email lives under the name: its own column squeezed every other -->
						<span class="table__email">{{ row.email }}</span>
						<span v-if="row.id === props.currentUserId" class="table__meta">That’s you</span>
						<span v-else class="table__meta">Joined {{ formatDate(row.created_at) }}</span>
					</div>
				</div>
			</template>

			<template #cell-role="{ row }">
				<MBadge
					:tone="row.platform_role === 'admin' ? 'slate' : 'neutral'"
					:icon="row.platform_role === 'admin' ? 'light-shield' : 'light-user'"
					size="sm"
				>
					{{ platformRoleLabels[row.platform_role] }}
				</MBadge>
			</template>

			<template #cell-verified="{ row }">
				<YesNo :value="Boolean(row.email_verified_at)" />
			</template>

			<template #cell-memberships="{ row }">
				<ul v-if="row.companies.length" class="table__memberships">
					<li v-for="membership in row.companies" :key="membership.slug">
						<NuxtLink v-if="companyId(membership.slug)" :to="`/admin/companies/${companyId(membership.slug)}`" class="table__link">
							{{ membership.name }}
						</NuxtLink>
						<template v-else>{{ membership.name }}</template>
						<span class="table__meta"> · {{ companyRoleLabels[membership.role] }}</span>
					</li>
				</ul>
				<span v-else class="table__meta">None</span>
			</template>

			<template #cell-professional="{ row }">
				<div v-if="row.professional" class="table__profile">
					<NuxtLink
						v-if="professionalId(row.professional.slug)"
						:to="`/admin/professionals/${professionalId(row.professional.slug)}`"
						class="table__link"
					>
						View profile
					</NuxtLink>
					<MStatusBadge kind="affiliation" :status="row.professional.affiliation_status" size="sm" />
				</div>
				<span v-else class="table__meta">None</span>
			</template>

			<template #cell-login="{ row }">
				<span class="table__meta">{{ row.last_login_at ? formatDateTime(row.last_login_at) : 'Never' }}</span>
			</template>

			<template #cell-status="{ row }">
				<MBadge v-if="row.deleted_at" tone="danger" icon="light-trash" size="sm">Deleted</MBadge>
				<MBadge v-else tone="success" icon="light-check-circle" size="sm">Active</MBadge>
			</template>

			<template #cell-actions="{ row }">
				<RowMenu
					v-if="actionsFor(row).length"
					:label="`Actions for ${fullName(row)}`"
					:items="actionsFor(row)"
					@select="emit('action', row, $event.value)"
				/>
			</template>

			<template #empty>
				<MEmptyState icon="light-users" variant="plain" heading-level="2">
					<template #title>No accounts found</template>
					{{ props.hasFilters ? 'Try another filter or clear the search.' : 'Create an account to get started.' }}
					<template v-if="props.hasFilters" #actions>
						<MButton variant="neutral" size="sm" @click="emit('clear-filters')">Clear filters</MButton>
					</template>
				</MEmptyState>
			</template>
		</MTable>
	</div>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { DropdownItem, TableColumn } from '~/types/base/ui'
import type { AdminCompanyRow, AdminProfessionalRow, AdminUser } from '~/types/features/admin'
import { formatDate, formatDateTime, fullName } from '~/utils/format'
import { companyRoleLabels, platformRoleLabels } from '~/utils/labels'
import RowMenu from '../shared/RowMenu.vue'
import YesNo from '../shared/YesNo.vue'

interface Props {
	rows: AdminUser[]
	companies: AdminCompanyRow[]
	professionals: AdminProfessionalRow[]
	currentUserId?: number | null
	hasFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	currentUserId: null,
	hasFilters: false,
})

const emit = defineEmits<{
	(_e: 'action', _row: AdminUser, _action: string): void
	(_e: 'clear-filters'): void
}>()

const columns: TableColumn[] = [
	{ key: 'name', label: 'Name and email' },
	{ key: 'role', label: 'Role' },
	{ key: 'verified', label: 'Email verified', hideBelow: 'md' },
	{ key: 'memberships', label: 'Memberships', hideBelow: 'lg' },
	{ key: 'professional', label: 'Sales profile', hideBelow: 'lg' },
	{ key: 'login', label: 'Last sign-in', hideBelow: 'lg' },
	{ key: 'status', label: 'Status' },
	{ key: 'actions', label: 'Actions', align: 'right', srOnlyLabel: true, width: '64px' },
]

function isDeleted(row: AdminUser): boolean {
	return Boolean(row.deleted_at)
}

function companyId(slug: string): number | undefined {
	return props.companies.find(company => company.slug === slug)?.id
}

function professionalId(slug: string): number | undefined {
	return props.professionals.find(professional => professional.slug === slug)?.id
}

// Nobody deletes their own account or changes their own role here.
function actionsFor(row: AdminUser): DropdownItem[] {
	if (row.id === props.currentUserId) return []
	if (row.deleted_at) return [{ label: 'Restore account', value: 'restore', icon: 'light-undo' }]

	return [
		{ label: 'Change role', value: 'role', icon: 'light-shield' },
		{ label: 'Delete account', value: 'delete', icon: 'light-trash', tone: 'danger', divided: true },
	]
}
</script>

<style lang="scss" scoped>
.table {
	// wide enough for a typical address on one line
	&__person {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 240px;
	}

	&__person-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__name {
		font-weight: 600;
		color: var(--text-primary);

		&--muted {
			color: var(--text-muted);
		}
	}

	&__meta {
		font-size: 13px;
		color: var(--text-muted);
	}

	&__email {
		font-size: 13px;
		color: var(--text-secondary);
		overflow-wrap: anywhere;
	}

	&__memberships {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__profile {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
}
</style>
