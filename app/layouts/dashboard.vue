<template>
	<div class="dashboard">
		<a href="#main-content" class="skip-link">Skip to content</a>

		<Sidebar
			:groups="nav"
			:open="is_menu_open"
			label="Dashboard"
			context="Dashboard"
			:user="{ name: user_name, role: role_label }"
			@navigate="is_menu_open = false"
		>
			<template #switcher>
				<div class="dashboard__switcher">
					<MDropdown label="Switch company" :items="company_items" align="left" variant="ghost" class="dashboard__switch">
						<template #trigger>
							<MLogo :name="company.name" size="sm" decorative />
							<span class="dashboard__switch-text">
								<span class="dashboard__switch-name">{{ company.name }}</span>
								<span class="dashboard__switch-role">{{ companyRoleLabels[company.role] }}</span>
							</span>
							<MIcon name="light-angle-down" size="xs" />
						</template>
					</MDropdown>
				</div>
			</template>
		</Sidebar>

		<button
			v-if="is_menu_open"
			type="button"
			class="dashboard__backdrop"
			aria-label="Close navigation"
			@click="is_menu_open = false"
		/>

		<div class="dashboard__main">
			<Topbar
				:user="{ name: user_name, email: me.email }"
				:menu-open="is_menu_open"
				account-path="/dashboard/account"
				@toggle-menu="is_menu_open = !is_menu_open"
			>
				<template #context>
					<span class="dashboard__crumb">{{ company.name }}</span>
					<MBadge :tone="status.tone" :icon="status.icon" size="sm" class="dashboard__status">{{ status.label }}</MBadge>
				</template>
				<template #actions>
					<MButton variant="neutral" size="sm" :to="`/companies/${company.slug}`" target="_blank" class="dashboard__public">
						<template #prefix>
							<MIcon name="light-external-link" size="xs" />
						</template>
						View public profile
					</MButton>
				</template>
			</Topbar>

			<main id="main-content" class="dashboard__content" tabindex="-1">
				<slot />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Sidebar from '@/components/layout/panel/Sidebar.vue'
import Topbar from '@/components/layout/panel/Topbar.vue'
import type { DropdownItem } from '~/types/base/ui'
import type { MeCompany } from '~/types/features/dashboard'
import type { PublicationStatus } from '~/types/features/directory'
import { companyRoleLabels, publicationStatusMeta } from '~/utils/labels'

const { findEditableCompany } = useDashboardStore()
const { dashboardNav, me } = useSessionStore()

const route = useRoute()
const is_menu_open = ref(false)

// The selected company is explicit in the URL (docs/ARCHITECTURE.md §3 State);
// account-wide pages fall back to the first membership.
const company = computed<MeCompany>(() => {
	const id = Number(route.params.companyId)
	return me.companies.find(item => item.id === id) ?? me.companies[0]!
})

// The company's listing status. The profile page previews the other
// statuses with ?state=, so the badge follows it there.
const preview_statuses: PublicationStatus[] = ['draft', 'pending_review', 'suspended']
const status = computed(() => {
	const preview = preview_statuses.find(value => value === route.query.state)
	const on_profile = route.path === `/dashboard/companies/${company.value.id}`
	const current = findEditableCompany(company.value.id)?.status ?? 'published'
	return publicationStatusMeta[on_profile && preview ? preview : current]
})

const nav = computed(() => dashboardNav(company.value.id))
const user_name = `${me.first_name} ${me.last_name}`
const role_label = computed(() => companyRoleLabels[company.value.role])

const company_items = computed<DropdownItem[]>(() => [
	...me.companies.map(item => ({
		label: item.name,
		value: String(item.id),
		icon: 'light-building' as const,
		to: `/dashboard/companies/${item.id}`,
	})),
	{ label: 'Claim another company', value: 'claim', icon: 'light-plus', to: '/claim', divided: true },
])

watch(() => route.path, () => {
	is_menu_open.value = false
})
</script>

<style lang="scss" scoped>
.dashboard {
	min-height: 100vh;
	background: var(--canvas);

	&__main {
		margin-left: 264px;
		min-height: 100vh;
	}

	&__content {
		padding: 32px;

		&:focus {
			outline: none;
		}
	}

	// --- Company switcher -------------------------------------
	&__switcher {
		padding: 0 0 8px;
		border-bottom: 1px solid var(--on-dark-rule);
	}

	&__switch {
		width: 100%;

		:deep(.m-dropdown__trigger) {
			width: 100%;
			height: auto;
			padding: 10px 12px;
			color: var(--white);
			text-align: left;

			&:hover {
				background: var(--on-dark-hover);
			}

			&:focus-visible {
				outline-color: var(--white);
			}
		}

		:deep(.m-dropdown__menu) {
			right: auto;
			left: 0;
			width: 100%;
		}
	}

	&__switch-text {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__switch-name {
		font-size: 14px;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__switch-role {
		font-size: 12px;
		font-weight: 400;
		color: var(--on-dark-subtle);
	}

	// --- Topbar context ---------------------------------------
	&__crumb {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__backdrop {
		position: fixed;
		inset: 0;
		z-index: 45;
		background: var(--overlay);
	}
}

@media only screen and (max-width: 1024px) {
	.dashboard {
		&__main {
			margin-left: 0;
		}

		&__content {
			padding: 20px 16px 32px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.dashboard {
		&__public,
		&__status {
			display: none;
		}
	}
}
</style>
