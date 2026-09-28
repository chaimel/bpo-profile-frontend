<template>
	<div class="results">
		<div class="wrapper">
			<div class="results__con">
				<aside class="results__sidebar" aria-labelledby="find-filters-title">
					<div class="results__sidebar-head">
						<MHeading id="find-filters-title" variant="2" size="5" weight="semi-bold" class="results__sidebar-title">Filters</MHeading>
						<MButton v-if="chips.length" variant="text" size="sm" @click="emit('clear')">Clear all</MButton>
					</div>
					<Filters id-prefix="find-sidebar" :params="props.params" @change="emit('update', $event)" />
				</aside>

				<div class="results__main">
					<div class="results__toolbar">
						<!-- a failed search has no count to report -->
						<MText v-if="props.state === 'ready'" size="small" color="--text-secondary" role="status" class="results__count">
							<strong>{{ formatNumber(props.results.meta.total) }}</strong>
							{{ props.results.meta.total === 1 ? 'BPO company' : 'BPO companies' }}
							<template v-if="props.params.q">for “{{ props.params.q }}”</template>
						</MText>

						<div class="results__tools">
							<MButton variant="neutral" class="results__filter-button" @click="openModal('find-filters')">
								<template #prefix>
									<MIcon name="light-filter" size="sm" />
								</template>
								Filters
								<span v-if="chips.length">({{ chips.length }})</span>
							</MButton>
							<MSortControl
								id="find-sort"
								:model-value="props.params.sort ?? 'relevance'"
								@update:model-value="emit('update', { sort: $event === 'relevance' ? undefined : $event })"
							/>
						</div>
					</div>

					<MFilterChips :chips="chips" class="results__chips" @remove="removeChip" @clear="emit('clear')" />

					<Items :companies="props.results.data" :state="props.state" @clear="emit('clear')" />

					<MPagination
						v-if="props.state === 'ready'"
						:model-value="props.results.meta.current_page"
						:last-page="props.results.meta.last_page"
						:href-for="props.pageLink"
						label="Search results pages"
						class="results__pagination"
					/>

					<details class="results__ranking">
						<summary class="results__ranking-summary">
							How results are ranked
							<MIcon name="light-angle-down" size="sm" class="results__ranking-caret" />
						</summary>
						<ol>
							<li>Relevance to your search and filters</li>
							<li>Profile completeness</li>
							<li>Verification</li>
							<li>Location and service match</li>
							<li>Quality signals — usable images, substantive copy, working contact details</li>
							<li>Premium visibility, only as a final tie-breaker — and always disclosed</li>
						</ol>
						<NuxtLink to="/about#ranking">More about ranking and badges</NuxtLink>
					</details>

					<MText size="small" color="--text-secondary" class="results__people">
						<MIcon name="light-user-friends" size="sm" />
						Looking for a person rather than a company?
						<NuxtLink to="/professionals">Browse Sales Pros</NuxtLink>
					</MText>
				</div>
			</div>
		</div>

		<MDrawer name="find-filters" side="left" :width="380">
			<template #header>Filters</template>
			<Filters id-prefix="find-drawer" :params="props.params" @change="emit('update', $event)" />
			<template #footer>
				<MButton block @click="closeModal('find-filters')">
					Show {{ pluralize(props.results.meta.total, 'result') }}
				</MButton>
				<MButton v-if="chips.length" variant="neutral" @click="emit('clear')">Clear</MButton>
			</template>
		</MDrawer>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import MFilterChips from '~/components/core/filters/MFilterChips.vue'
import MSortControl from '~/components/core/filters/MSortControl.vue'
import type { Paginated } from '~/types/api/common'
import type { CompanyCard, CompanySize, WorkModel } from '~/types/features/directory'
import { formatNumber, pluralize } from '~/utils/format'
import { companySizeLabels, workModelLabels } from '~/utils/labels'
import Filters from '../Filters.vue'
import Items from './Items.vue'

const { findCountryBySlug, findLocation, findTaxonomy } = useCatalogStore()

interface Props {
	params: Record<string, string | undefined>
	results: Paginated<CompanyCard>
	state: 'ready' | 'error'
	pageLink: (page: number) => RouteLocationRaw
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update', _patch: Record<string, string | undefined>): void
	(_e: 'clear'): void
}>()

const { openModal, closeModal } = useModal()

// One removable chip per active filter, labelled in plain words.
const chips = computed(() => {
	const p = props.params
	const list: { key: string, label: string }[] = []

	if (p.q) list.push({ key: 'q', label: `“${p.q}”` })
	if (p.service) list.push({ key: 'service', label: findTaxonomy('services', p.service)?.name ?? p.service })
	if (p.industry) list.push({ key: 'industry', label: findTaxonomy('industries', p.industry)?.name ?? p.industry })
	if (p.country) list.push({ key: 'country', label: findCountryBySlug(p.country)?.name ?? p.country })
	if (p.location) list.push({ key: 'location', label: findLocation(Number(p.location))?.name ?? 'Location' })
	if (p.size) list.push({ key: 'size', label: companySizeLabels[p.size as CompanySize] ?? p.size })
	if (p.work_model) list.push({ key: 'work_model', label: workModelLabels[p.work_model as WorkModel] ?? p.work_model })
	if (p.capability) list.push({ key: 'capability', label: findTaxonomy('capabilities', p.capability)?.name ?? p.capability })
	if (p.language) list.push({ key: 'language', label: findTaxonomy('languages', p.language)?.name ?? p.language })
	if (p.technology) list.push({ key: 'technology', label: findTaxonomy('technologies', p.technology)?.name ?? p.technology })

	return list
})

function removeChip(key: string) {
	emit('update', { [key]: undefined })
}
</script>

<style lang="scss" scoped>
.results {
	&__con {
		display: grid;
		grid-template-columns: 280px minmax(0, 1fr);
		align-items: start;
		gap: 48px;
		padding: 32px 0 96px;
	}

	// --- Sidebar ----------------------------------------------
	// in the page flow: a capped, sticky panel hid its last filters in an
	// inner scroll with no cue
	&__sidebar {
		padding-right: 4px;
	}

	&__sidebar-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 8px;
	}

	&__sidebar-title {
		font-family: var(--font-display);
	}

	// --- Toolbar ----------------------------------------------
	&__toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px 24px;
		padding-bottom: 16px;
		border-bottom: var(--rule);
	}

	&__count {
		font-family: var(--font-ui);

		strong {
			font-weight: 600;
			color: var(--text-primary);
		}
	}

	&__tools {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	&__filter-button {
		display: none;
	}

	&__chips {
		padding-top: 16px;
	}

	&__pagination {
		padding-top: 32px;
	}

	// --- Disclosure -------------------------------------------
	&__ranking {
		margin-top: 48px;
		padding: 20px 24px;
		border-radius: var(--radius-md);
		background: var(--canvas);

		&[open] .results__ranking-caret {
			transform: rotate(180deg);
		}

		ol {
			display: flex;
			flex-direction: column;
			gap: 6px;
			margin: 14px 0 12px;
			padding-left: 20px;
			list-style: decimal;
			font-size: 16px;
			line-height: 24px;
			color: var(--text-secondary);
		}

		a {
			font-family: var(--font-ui);
			font-size: 14px;
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__ranking-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		list-style: none;
		cursor: pointer;

		&::-webkit-details-marker {
			display: none;
		}
	}

	&__ranking-caret {
		color: var(--text-muted);
		transition: transform 0.15s ease;
	}

	&__people {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-top: 24px;
		font-family: var(--font-ui);

		.m-icon {
			color: var(--brand);
		}

		a {
			font-weight: 600;
			color: var(--brand-strong);

			&:hover {
				text-decoration: underline;
				text-underline-offset: 3px;
			}
		}
	}
}

@media only screen and (max-width: 1024px) {
	.results {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			padding: 24px 0 64px;
		}

		&__sidebar {
			display: none;
		}

		&__filter-button {
			display: inline-flex;
		}
	}
}

@media only screen and (max-width: 600px) {
	.results {
		&__tools {
			width: 100%;
			justify-content: space-between;
		}
	}
}
</style>
