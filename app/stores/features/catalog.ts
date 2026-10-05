import { defineStore } from 'pinia'
import {
	childrenOf,
	countries,
	countryOf,
	findCountryBySlug,
	findLocation,
	locations,
	regionOf,
	subtreeIds,
	toLocationRef,
} from '~/data/features/locations'
import { expandedPlans, plans } from '~/data/features/pricing'
import { getPlanLabel } from '~/utils/plans'
import {
	capabilities,
	findTaxonomy,
	industries,
	languages,
	services,
	taxonomies,
	technologies,
} from '~/data/features/taxonomies'
import { timezoneOptions } from '~/data/features/timezones'

// Public catalogs (docs/API.md §2): the taxonomies, the location tree,
// time zones and the listing plans. Read-only and the same for everyone,
// so they are plain members, not state that SSR would serialize.
export const useCatalogStore = defineStore('catalog', () => ({
	services,
	industries,
	capabilities,
	languages,
	technologies,
	taxonomies,
	findTaxonomy,
	locations,
	countries,
	findLocation,
	findCountryBySlug,
	childrenOf,
	subtreeIds,
	countryOf,
	regionOf,
	toLocationRef,
	timezoneOptions,
	plans,
	expandedPlans,
	planLabel: (slug: string) => getPlanLabel(plans, slug),
}))
