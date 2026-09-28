<template>
	<aside :class="['sidebar', { 'sidebar--open': props.open }]" :aria-label="props.label">
		<div class="sidebar__con">
			<div class="sidebar__brand">
				<Logo inverse size="sm" />
				<span class="sidebar__context">{{ props.context }}</span>
			</div>

			<slot name="switcher" />

			<nav class="sidebar__nav" :aria-label="props.label">
				<div v-for="(group, index) in props.groups" :key="`${index}-${group.label}`" class="sidebar__group">
					<span v-if="group.label" class="sidebar__group-label">{{ group.label }}</span>
					<NuxtLink
						v-for="link in group.links"
						:key="link.to"
						:to="link.to"
						:class="['sidebar__link', { 'sidebar__link--active': isActive(link) }]"
						:aria-current="isActive(link) ? 'page' : undefined"
						@click="emit('navigate')"
					>
						<MIcon v-if="link.icon" :name="link.icon" size="sm" />
						<span class="sidebar__link-label">{{ link.label }}</span>
						<span v-if="link.badge" class="sidebar__badge">
							{{ link.badge }}<span class="sr-only"> need attention</span>
						</span>
					</NuxtLink>
				</div>
			</nav>

			<div class="sidebar__foot">
				<NuxtLink to="/" class="sidebar__view">
					<MIcon name="light-external-link" size="xs" />
					View BPO Profile
				</NuxtLink>

				<div class="sidebar__user">
					<MAvatar :name="props.user.name" size="sm" decorative />
					<div class="sidebar__user-text">
						<span class="sidebar__user-name">{{ props.user.name }}</span>
						<span class="sidebar__user-role">{{ props.user.role }}</span>
					</div>
					<MButtonIcon name="light-sign-out" title="Sign out" variant="inverse" radius="full" to="/login" />
				</div>
			</div>
		</div>
	</aside>
</template>

<script setup lang="ts">
import Logo from '~/components/layout/Logo.vue'
import type { NavGroup, NavLink } from '~/types/app/navigation'

// Shared by the dashboard and admin shells; each passes its own groups.
interface Props {
	groups: NavGroup[]
	label: string
	context: string
	user: { name: string, role: string }
	open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	open: false,
})

const emit = defineEmits<{
	(_e: 'navigate'): void
}>()

const route = useRoute()

function isActive(link: NavLink): boolean {
	if (link.exact) return route.path === link.to
	const prefix = link.match ?? link.to
	return route.path === prefix || route.path.startsWith(`${prefix}/`)
}
</script>

<style lang="scss" scoped>
.sidebar {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	z-index: 50;
	width: 264px;
	background: var(--slate);
	color: var(--white);

	&__con {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 20px 16px;
		overflow-y: auto;
	}

	// --- Brand ------------------------------------------------
	&__brand {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 0 8px 20px;
	}

	&__context {
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-subtle);
	}

	// --- Nav --------------------------------------------------
	&__nav {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding-top: 12px;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__group-label {
		padding: 0 12px 8px;
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-subtle);
	}

	&__link {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 40px;
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--on-dark-muted);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;

		&:hover {
			background: var(--on-dark-hover);
			color: var(--white);
		}

		&:focus-visible {
			outline-color: var(--white);
			outline-offset: -2px;
		}

		&--active,
		&--active:hover {
			background: var(--white);
			color: var(--slate);
		}
	}

	&__link-label {
		flex: 1 1 auto;
	}

	&__badge {
		min-width: 22px;
		padding: 1px 7px;
		border-radius: var(--radius-xs);
		background: var(--brand);
		font-size: 12px;
		font-weight: 600;
		line-height: 18px;
		text-align: center;
		color: var(--white);
	}

	// --- Foot -------------------------------------------------
	// compact, so the footer still fits on shorter laptop screens
	&__foot {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: auto;
		padding-top: 16px;
	}

	&__view {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		background: var(--on-dark-hover);
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--on-dark-muted);

		&:hover {
			color: var(--white);
		}

		&:focus-visible {
			outline-color: var(--white);
		}
	}

	&__user {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-top: 12px;
		border-top: 1px solid var(--on-dark-rule);
	}

	&__user-text {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__user-name {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
	}

	&__user-role {
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--on-dark-subtle);
	}
}

@media only screen and (max-width: 1024px) {
	.sidebar {
		transform: translateX(-100%);
		visibility: hidden;
		transition:
			transform 0.2s ease,
			visibility 0.2s;

		&--open {
			transform: translateX(0);
			visibility: visible;
		}
	}
}
</style>
