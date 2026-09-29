<template>
	<div class="areas">
		<div class="wrapper">
			<div class="areas__con">
				<div class="areas__tools">
					<div class="areas__filter">
						<MSearch
							id="sitemap-filter"
							v-model="query"
							name="sitemap-filter"
							label="Filter screens"
							placeholder="Filter by screen, address or state"
							class="areas__search"
						/>
						<MText size="small" color="--text-muted" class="areas__count" aria-live="polite">{{ count_label }}</MText>
					</div>

					<nav v-if="visible_areas.length" class="areas__jump" aria-label="Areas on this page">
						<a v-for="area in visible_areas" :key="area.id" :href="`#${area.id}`" class="areas__jump-link">
							<MIcon :name="area.icon" size="sm" />
							{{ area.title }}
						</a>
					</nav>
				</div>

				<section
					v-for="area in visible_areas"
					:id="area.id"
					:key="area.id"
					class="areas__area"
					:aria-labelledby="`${area.id}-title`"
				>
					<div class="areas__head">
						<span class="areas__index">
							<MIcon :name="area.icon" size="sm" class="areas__icon" />
							{{ area.label }}
						</span>
						<MHeading :id="`${area.id}-title`" variant="2" size="4" weight="semi-bold">{{ area.title }}</MHeading>
						<MText size="small" weight="semi-bold" color="--text-primary">{{ area.audience }}</MText>
						<MText size="small" color="--text-secondary">{{ area.summary }}</MText>
						<MText size="xsmall" color="--text-muted" class="areas__recognize">
							<MIcon name="light-eye" size="xs" class="areas__recognize-icon" />
							<span>{{ area.recognize }}</span>
						</MText>
						<span class="areas__meta">
							{{ pluralize(area.screen_count, 'screen') }} · {{ pluralize(area.state_count, 'state') }}
						</span>
					</div>

					<div class="areas__groups">
						<div v-for="group in area.groups" :key="group.label" class="areas__group">
							<MHeading variant="3" size="6" weight="semi-bold" class="areas__group-title">{{ group.label }}</MHeading>
							<Screens :rows="group.rows" />
						</div>
					</div>
				</section>

				<MEmptyState v-if="!visible_areas.length" heading-level="2">
					<template #title>No screens match “{{ term }}”</template>
					Try a screen name such as Inquiries, or part of an address such as /admin.
					<template #actions>
						<MButton variant="neutral" @click="query = ''">Clear the filter</MButton>
					</template>
				</MEmptyState>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import { referenceArea, sitemapAreas } from '~/data/features/sitemap'
import type { SearchValue } from '~/types/base/search'
import type { SitemapArea, SitemapRow, SitemapScreen } from '~/types/features/guide'
import { pluralize } from '~/utils/format'
import Screens from './Screens.vue'

// Depth within a group: how many screens above this one its path extends.
function toRows(screens: SitemapScreen[]): SitemapRow[] {
	return screens.map((screen, index) => ({
		screen,
		depth: screens.slice(0, index).filter(parent => screen.path.startsWith(`${parent.path}/`)).length,
	}))
}

function statesIn(area: SitemapArea): number {
	return area.groups.reduce((sum, group) =>
		sum + group.screens.reduce((count, screen) => count + (screen.states?.length ?? 0), 0), 0)
}

// The product areas, numbered as the guide numbers them, then the pages
// about the demo itself.
const areas = [...sitemapAreas, referenceArea].map((area, index) => ({
	...area,
	label: index < sitemapAreas.length ? `Area ${index + 1}` : 'Reference',
	screen_count: area.groups.reduce((sum, group) => sum + group.screens.length, 0),
	state_count: statesIn(area),
	groups: area.groups.map(group => ({ label: group.label, rows: toRows(group.screens) })),
}))

const total = areas.reduce((sum, area) => sum + area.screen_count, 0)

const query = ref<SearchValue>('')
const term = computed(() => (query.value ?? '').trim())

// A screen matches on its own words, its states, or its area and group.
function matches(words: string[]): boolean {
	return words.join(' ').toLowerCase().includes(term.value.toLowerCase())
}

const visible_areas = computed(() => {
	if (!term.value) return areas

	return areas
		.map(area => ({
			...area,
			groups: area.groups
				.map(group => ({
					...group,
					rows: group.rows.filter(({ screen }) => matches([
						area.title,
						group.label,
						screen.title,
						screen.path,
						screen.to,
						screen.summary,
						screen.sample ?? '',
						...(screen.states ?? []).map(state => state.label),
					])),
				}))
				.filter(group => group.rows.length > 0),
		}))
		.filter(area => area.groups.length > 0)
})

const shown = computed(() => visible_areas.value.reduce((sum, area) =>
	sum + area.groups.reduce((count, group) => count + group.rows.length, 0), 0))

const count_label = computed(() =>
	term.value ? `Showing ${shown.value} of ${pluralize(total, 'screen')}` : `Showing all ${pluralize(total, 'screen')}`,
)
</script>

<style lang="scss" scoped>
.areas {
	&__con {
		padding: 40px 0 96px;
	}

	// --- Filter and jump links -------------------------------------
	&__tools {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-bottom: 32px;
	}

	&__filter {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px 20px;
	}

	&__search {
		flex: 0 1 420px;
	}

	&__jump {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
	}

	&__jump-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--brand-strong);

		.m-icon {
			color: var(--text-muted);
		}

		&:hover {
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	// --- One area ---------------------------------------------------
	&__area {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 64px;
		padding: 48px 0;
		border-top: 2px solid var(--text-primary);
	}

	&__head {
		position: sticky;
		top: calc(var(--header-height) + 32px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	&__index {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__icon {
		color: var(--brand);
	}

	&__recognize {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding-top: 4px;
		font-family: var(--font-ui);
	}

	&__recognize-icon {
		flex: 0 0 auto;
		margin-top: 2px;
	}

	&__meta {
		padding-top: 6px;
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	&__groups {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	&__group-title {
		padding-bottom: 4px;
		font-family: var(--font-ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.areas {
		&__area {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
			padding: 40px 0;
		}

		&__head {
			position: static;
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.areas {
		&__con {
			padding: 32px 0 72px;
		}

		&__search {
			flex-basis: 100%;
		}
	}
}
</style>
