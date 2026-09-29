<template>
	<Frame :path="props.path" class="panel">
		<div class="panel__body">
			<div class="panel__side">
				<div class="panel__brand">
					<Logo inverse size="sm" />
					<span class="panel__context">{{ props.context }}</span>
				</div>

				<div v-if="props.company" class="panel__switcher">
					<MLogo :name="props.company.name" size="sm" decorative />
					<span class="panel__switch-text">
						<span class="panel__switch-name">{{ props.company.name }}</span>
						<span class="panel__switch-role">{{ props.company.role }}</span>
					</span>
				</div>

				<nav class="panel__nav" :aria-label="`${props.context} menu`">
					<div v-for="(group, group_index) in props.groups" :key="`${group_index}-${group.label}`" class="panel__group">
						<span v-if="group.label" class="panel__group-label">{{ group.label }}</span>
						<NuxtLink
							v-for="(link, link_index) in group.links"
							:key="link.to"
							:to="link.to"
							:class="['panel__link', { 'panel__link--current': group_index === 0 && link_index === 0 }]"
						>
							<MIcon v-if="link.icon" :name="link.icon" size="xs" />
							<span class="panel__link-label">{{ link.label }}</span>
							<span v-if="link.badge" class="panel__badge">
								{{ link.badge }}<span class="sr-only"> need attention</span>
							</span>
						</NuxtLink>
					</div>
				</nav>
			</div>

			<div class="panel__main">
				<div class="panel__top">
					<span v-if="props.title" class="panel__crumb">{{ props.title }}</span>
					<MBadge :tone="props.badge.tone" :icon="props.badge.icon" size="sm">{{ props.badge.label }}</MBadge>
					<span class="panel__user">
						<MAvatar :name="props.user" size="xs" decorative />
						{{ props.user }}
					</span>
				</div>

				<!-- the shape of a dashboard page: a title, then panels -->
				<div class="panel__page" aria-hidden="true">
					<span class="panel__line panel__line--title" />
					<span class="panel__line" />
					<span class="panel__block" />
					<span class="panel__block panel__block--short" />
				</div>
			</div>
		</div>
	</Frame>
</template>

<script setup lang="ts">
import Logo from '~/components/layout/Logo.vue'
import type { NavGroup } from '~/types/app/navigation'
import type { StatusMeta } from '~/utils/labels'
import Frame from './Frame.vue'

// A replica of the dashboard and admin shell (layout/panel Sidebar and
// Topbar), built from the same navigation groups, so every item links to
// its real screen. The first item is drawn as the current page.
interface Props {
	path: string
	context: string
	groups: NavGroup[]
	user: string
	// the dashboard's company switcher
	company?: { name: string, role: string } | null
	// top bar: the company name and its listing status, or the admin badge
	title?: string
	badge: StatusMeta
}

const props = withDefaults(defineProps<Props>(), {
	company: null,
	title: undefined,
})
</script>

<style lang="scss" scoped>
.panel {
	&__body {
		display: grid;
		grid-template-columns: 208px minmax(0, 1fr);
	}

	// --- Sidebar --------------------------------------------------
	&__side {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px 10px 18px;
		background: var(--slate);
		color: var(--white);
	}

	&__brand {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 0 6px;
	}

	&__context,
	&__group-label {
		font-family: var(--font-ui);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-subtle);
	}

	&__switcher {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 6px 10px;
		border-bottom: 1px solid var(--on-dark-rule);
	}

	&__switch-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
		font-family: var(--font-ui);
	}

	&__switch-name {
		overflow: hidden;
		font-size: 13px;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__switch-role {
		font-size: 11px;
		color: var(--on-dark-subtle);
	}

	&__nav {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	&__group-label {
		padding: 0 8px 4px;
	}

	&__link {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 30px;
		padding: 5px 8px;
		border-radius: var(--radius-sm);
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 500;
		color: var(--on-dark-muted);

		&:hover {
			background: var(--on-dark-hover);
			color: var(--white);
		}

		&:focus-visible {
			outline-color: var(--white);
			outline-offset: -2px;
		}

		&--current,
		&--current:hover {
			background: var(--white);
			color: var(--slate);
		}
	}

	&__link-label {
		flex: 1 1 auto;
	}

	&__badge {
		min-width: 18px;
		padding: 0 5px;
		border-radius: var(--radius-xs);
		background: var(--brand);
		font-size: 11px;
		font-weight: 600;
		line-height: 16px;
		text-align: center;
		color: var(--white);
	}

	// --- Main -----------------------------------------------------
	&__main {
		display: flex;
		flex-direction: column;
		min-width: 0;
		background: var(--canvas);
	}

	&__top {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 10px;
		min-height: 48px;
		padding: 8px 14px;
		border-bottom: var(--rule);
		background: var(--white);
	}

	&__crumb {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
	}

	&__user {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 500;
		white-space: nowrap;
	}

	&__page {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px 14px;
	}

	&__line {
		display: block;
		width: 70%;
		height: 8px;
		border-radius: var(--radius-xs);
		background: var(--border);

		&--title {
			width: 46%;
			height: 14px;
			background: var(--border-strong);
		}
	}

	&__block {
		display: block;
		height: 96px;
		margin-top: 6px;
		border-radius: var(--radius-sm);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);

		&--short {
			height: 64px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.panel {
		&__body {
			grid-template-columns: minmax(0, 1fr);
		}

		// on a phone the menu is the part worth seeing
		&__main {
			display: none;
		}
	}
}
</style>
