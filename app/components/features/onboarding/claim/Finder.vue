<template>
	<div class="finder">
		<div class="wrapper">
			<div class="finder__con">
				<MHeading id="claim-finder-title" variant="2" size="4">Find your company</MHeading>
				<MText size="medium" color="--text-secondary" class="finder__intro">
					Search the directory for your company’s listing. A listing that isn’t claimed yet can be claimed by
					someone authorized to represent the company.
				</MText>

				<MSearch
					id="claim-search"
					v-model="query"
					name="q"
					placeholder="e.g. Kingston Voice Partners"
					class="finder__search"
				>
					<template #label>Company name</template>
				</MSearch>

				<MText size="xsmall" color="--text-muted" role="status" class="finder__status">{{ status_text }}</MText>

				<ul v-if="matches.length" class="finder__results" aria-labelledby="claim-finder-title">
					<li v-for="company in matches" :key="company.id" class="finder__result">
						<MLogo
							:name="company.name"
							:src="company.logo_url"
							:alt="company.logo_alt_text"
							size="sm"
							decorative
						/>

						<div class="finder__identity">
							<NuxtLink :to="`/companies/${company.slug}`" class="finder__name">{{ company.name }}</NuxtLink>
							<span v-if="company.hq" class="finder__location">{{ locationLabel(company.hq) }}</span>
						</div>

						<MButton
							v-if="!company.claimed"
							size="sm"
							variant="outline"
							class="finder__action"
							:to="{ path: '/claim', query: { company: company.slug } }"
						>
							Claim this profile<span class="sr-only">: {{ company.name }}</span>
						</MButton>
						<MBadge v-else tone="slate" icon="light-shield" size="sm" class="finder__action">Claimed</MBadge>
					</li>
				</ul>

				<MEmptyState v-else variant="plain" icon="light-search" heading-level="3" class="finder__empty">
					<template #title>No listings match “{{ term_label }}”</template>
					Check the spelling, or try a shorter version of the name. If your company isn’t listed yet, you can
					create its listing instead.
					<template #actions>
						<MButton to="/register?type=company">Get Listed</MButton>
					</template>
				</MEmptyState>

				<MText color="--text-secondary" class="finder__missing">
					<MIcon name="light-building" size="sm" color="text-muted" class="finder__missing-icon" />
					<span>
						Can’t find your company?
						<NuxtLink to="/register?type=company" class="finder__link">Get Listed</NuxtLink>
						— create its listing and you’ll own it from the start.
					</span>
				</MText>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import type { SearchValue } from '~/types/base/search'
import type { CompanyCard } from '~/types/features/directory'
import { locationLabel, pluralize } from '~/utils/format'

interface Props {
	companies: CompanyCard[]
}

const props = defineProps<Props>()

const query = ref<SearchValue>('')

const term_label = computed(() => (query.value ?? '').trim())
const term = computed(() => term_label.value.toLowerCase())

// Listings still open to a claim come first.
const matches = computed(() =>
	props.companies
		.filter(company => !term.value || company.name.toLowerCase().includes(term.value))
		.sort((a, b) => Number(a.claimed) - Number(b.claimed) || a.name.localeCompare(b.name)),
)

const status_text = computed(() => {
	const count = matches.value.length
	const open = matches.value.filter(company => !company.claimed).length

	if (term.value && !count) return `No listings match “${term_label.value}”.`
	return `${pluralize(count, 'listing')} ${term.value ? `matching “${term_label.value}”` : 'in the directory'} — ${open} not yet claimed.`
})
</script>

<style lang="scss" scoped>
.finder {
	&__con {
		max-width: 720px;
		padding: 56px 0;
	}

	&__intro {
		padding-top: 8px;
	}

	&__search {
		padding-top: 24px;
	}

	&__status {
		padding-top: 12px;
		font-family: var(--font-ui);
	}

	&__results {
		margin-top: 12px;
		border-top: var(--rule);
	}

	&__result {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 0;
		border-bottom: var(--rule);
	}

	&__identity {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__location {
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 18px;
		color: var(--text-secondary);
	}

	&__empty {
		margin-top: 12px;
	}

	&__missing {
		display: flex;
		gap: 10px;
		padding-top: 24px;
	}

	&__missing-icon {
		flex: 0 0 auto;
		margin-top: 4px;
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}
}

@media only screen and (max-width: 600px) {
	.finder {
		&__con {
			padding: 40px 0;
		}

		&__result {
			flex-wrap: wrap;
		}

		&__identity {
			flex-basis: calc(100% - 46px);
		}

		// the wrapped action starts under the name: 32px logo + 14px gap
		&__action {
			margin-left: 46px;
		}
	}
}
</style>
