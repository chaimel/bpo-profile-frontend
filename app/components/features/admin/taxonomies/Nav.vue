<template>
	<nav class="nav" aria-label="Taxonomies">
		<ul class="nav__list">
			<li v-for="key in keys" :key="key">
				<NuxtLink
					:to="`/admin/taxonomies/${key}`"
					:class="['nav__link', { 'nav__link--active': key === props.active }]"
					:aria-current="key === props.active ? 'page' : undefined"
				>
					{{ taxonomyLabels[key].plural }}
					<span class="nav__count">{{ props.counts[key] }}</span>
				</NuxtLink>
			</li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
import { taxonomyLabels } from '~/data/features/taxonomies'
import type { TaxonomyKey } from '~/types/features/directory'

// Each taxonomy is its own page, so these are links styled as tabs.
interface Props {
	active: TaxonomyKey
	counts: Record<TaxonomyKey, number>
}

const props = withDefaults(defineProps<Props>(), {})

const keys: TaxonomyKey[] = ['services', 'industries', 'capabilities', 'languages', 'technologies']
</script>

<style lang="scss" scoped>
.nav {
	border-bottom: var(--rule);

	&__list {
		display: flex;
		gap: 24px;
		overflow-x: auto;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		margin-bottom: -1px;
		box-shadow: inset 0 -2px 0 transparent;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;
		transition:
			color 0.15s ease,
			box-shadow 0.15s ease;

		&:hover {
			color: var(--text-primary);
		}

		&:focus-visible {
			outline-offset: -2px;
		}

		&--active {
			color: var(--text-primary);
			box-shadow: inset 0 -2px 0 var(--brand);
		}
	}

	&__count {
		min-width: 22px;
		padding: 1px 7px;
		border-radius: var(--radius-xs);
		background: var(--surface-muted);
		font-size: 12px;
		font-weight: 600;
		line-height: 18px;
		text-align: center;
		color: var(--text-secondary);
	}

	&__link--active .nav__count {
		background: var(--brand-soft);
		color: var(--brand-deep);
	}
}
</style>
