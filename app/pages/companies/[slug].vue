<template>
	<div>
		<Company :company="company" />
	</div>
</template>

<script setup lang="ts">
import Company from '@/components/features/company/Index.vue'
import { locationLabel } from '~/utils/format'
import { notFound } from '~/utils/errors'

const { findCompany } = useDirectoryStore()

const route = useRoute()
const config = useRuntimeConfig()

// Static stand-in for GET /api/companies/{slug}; unpublished or unknown
// profiles are a 404, never a 403 (docs/API.md §10).
const company = findCompany(String(route.params.slug))

if (!company) {
	throw notFound('That company profile isn’t available. It may have moved or isn’t published.')
}

const canonical = `${config.public.siteUrl}/companies/${company.slug}`
const hq = locationLabel(company.hq)
const description = company.seo_description
	?? `${company.tagline ?? ''} ${company.name} offers ${company.services.map(service => service.name).join(', ')}${hq ? ` from ${hq}` : ''}.`.trim()

useHead({
	title: company.seo_title ?? `${company.name}${hq ? ` — BPO company in ${hq}` : ''}`,
	meta: [
		{ name: 'description', content: description },
		{ property: 'og:title', content: company.name },
		{ property: 'og:description', content: description },
		{ property: 'og:type', content: 'profile' },
		{ property: 'og:url', content: canonical },
	],
	link: [{ rel: 'canonical', href: canonical }],
	script: [
		{
			type: 'application/ld+json',
			innerHTML: JSON.stringify([
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					'name': company.name,
					'description': company.tagline,
					'url': canonical,
					'sameAs': [company.website_url, company.linkedin_url].filter(Boolean),
					'foundingDate': company.founded_year ? String(company.founded_year) : undefined,
					'address': company.hq ? { '@type': 'PostalAddress', 'addressLocality': company.hq.name, 'addressCountry': company.hq.country } : undefined,
					'employee': company.professionals.map(person => ({
						'@type': 'Person',
						'name': `${person.first_name} ${person.last_name}`,
						'jobTitle': person.job_title,
						'url': `${config.public.siteUrl}/professionals/${person.slug}`,
					})),
				},
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					'itemListElement': [
						{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': config.public.siteUrl },
						{ '@type': 'ListItem', 'position': 2, 'name': 'BPO Profiles', 'item': `${config.public.siteUrl}/companies` },
						{ '@type': 'ListItem', 'position': 3, 'name': company.name, 'item': canonical },
					],
				},
			]),
		},
	],
})
</script>
