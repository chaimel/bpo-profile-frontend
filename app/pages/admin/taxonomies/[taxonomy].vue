<template>
	<div>
		<Taxonomies :key="taxonomy" :taxonomy="taxonomy" :terms="terms" :counts="counts" />
	</div>
</template>

<script setup lang="ts">
import Taxonomies from '@/components/features/admin/taxonomies/Index.vue'
import { taxonomyLabels } from '~/data/features/taxonomies'
import type { TaxonomyKey } from '~/types/features/directory'
import { notFound } from '~/utils/errors'

const { adminTaxonomyTerms } = useAdminStore()

definePageMeta({ layout: 'admin' })

// The five admin-editable taxonomies. Work model is a fixed enum and
// has no page (docs/PLAN.md §4.8).
const taxonomy_keys: TaxonomyKey[] = ['services', 'industries', 'capabilities', 'languages', 'technologies']

function isTaxonomyKey(value: string): value is TaxonomyKey {
	return (taxonomy_keys as string[]).includes(value)
}

const route = useRoute()
const param = String(route.params.taxonomy)

if (!isTaxonomyKey(param)) {
	throw notFound('No taxonomy with that name.')
}

const taxonomy: TaxonomyKey = param
const terms = adminTaxonomyTerms[taxonomy]

// live terms per taxonomy, for the tab counts
const counts: Record<TaxonomyKey, number> = {
	services: adminTaxonomyTerms.services.filter(term => !term.deleted_at).length,
	industries: adminTaxonomyTerms.industries.filter(term => !term.deleted_at).length,
	capabilities: adminTaxonomyTerms.capabilities.filter(term => !term.deleted_at).length,
	languages: adminTaxonomyTerms.languages.filter(term => !term.deleted_at).length,
	technologies: adminTaxonomyTerms.technologies.filter(term => !term.deleted_at).length,
}

useHead({
	title: `${taxonomyLabels[taxonomy].plural} — Taxonomies — Admin`,
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
