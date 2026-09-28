<template>
	<header class="topbar">
		<div class="topbar__con">
			<MButtonIcon
				class="topbar__toggle"
				name="light-bars"
				title="Open navigation"
				variant="outline"
				icon-size="md"
				:aria-expanded="props.menuOpen"
				@click="emit('toggle-menu')"
			/>

			<div class="topbar__context">
				<slot name="context" />
			</div>

			<div class="topbar__actions">
				<slot name="actions" />

				<MDropdown :label="`Account menu for ${props.user.name}`" :items="account_items" variant="ghost">
					<template #trigger>
						<MAvatar :name="props.user.name" size="sm" decorative />
						<span class="topbar__user">{{ props.user.name }}</span>
						<MIcon name="light-angle-down" size="xs" class="topbar__caret" />
					</template>
				</MDropdown>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownItem } from '~/types/base/ui'

interface Props {
	user: { name: string, email: string }
	menuOpen?: boolean
	accountPath?: string
}

const props = withDefaults(defineProps<Props>(), {
	menuOpen: false,
	accountPath: undefined,
})

const emit = defineEmits<{
	(_e: 'toggle-menu'): void
}>()

const account_items = computed<DropdownItem[]>(() => [
	...(props.accountPath
		? [{ label: 'Account settings', value: 'account', icon: 'light-cog', to: props.accountPath } as DropdownItem]
		: []),
	{ label: 'View BPO Profile', value: 'site', icon: 'light-external-link', to: '/' },
	{ label: 'Sign out', value: 'sign-out', icon: 'light-sign-out', to: '/login', divided: true },
])
</script>

<style lang="scss" scoped>
.topbar {
	position: sticky;
	top: 0;
	z-index: 30;
	background: var(--header-glass);
	backdrop-filter: saturate(1.4) blur(12px);
	border-bottom: var(--rule);

	&__con {
		display: flex;
		align-items: center;
		gap: 16px;
		height: 64px;
		padding: 0 32px;
	}

	&__toggle {
		display: none;
	}

	&__context {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	&__actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
	}

	&__user {
		font-size: 14px;
		font-weight: 500;
	}

	&__caret {
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.topbar {
		&__con {
			padding: 0 16px;
		}

		&__toggle {
			display: inline-grid;
		}
	}
}

@media only screen and (max-width: 600px) {
	.topbar__user {
		display: none;
	}
}
</style>
