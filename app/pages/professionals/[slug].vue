<template>
	<div>
		<Professional :professional="professional" />
	</div>
</template>

<script setup lang="ts">
import Professional from '@/components/features/professional/Index.vue'
import { fullName, locationLabel } from '~/utils/format'
import { notFound } from '~/utils/errors'

const { findProfessional } = useDirectoryStore()

const route = useRoute()
const config = useRuntimeConfig()

// Static stand-in for GET /api/professionals/{slug}. Only published
// profiles with approved affiliations exist publicly (docs/API.md §3).
const professional = findProfessional(String(route.params.slug))

if (!professional) {
	throw notFound('That profile isn’t available. It may have moved or isn’t published.')
}

const name = fullName(professional)
const canonical = `${config.public.siteUrl}/professionals/${professional.slug}`
const description = professional.seo_description
	?? `${name}, ${professional.job_title} at ${professional.company.name}${professional.location ? ` in ${locationLabel(professional.location)}` : ''}. ${professional.expertise ?? ''}`.trim()

useHead({
	title: professional.seo_title ?? `${name} — ${professional.job_title} at ${professional.company.name}`,
	meta: [
		{ name: 'description', content: description },
		{ property: 'og:title', content: name },
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
					'@type': 'Person',
					'name': name,
					'jobTitle': professional.job_title,
					'url': canonical,
					'worksFor': {
						'@type': 'Organization',
						'name': professional.company.name,
						'url': `${config.public.siteUrl}/companies/${professional.company.slug}`,
					},
					'workLocation': professional.location ? { '@type': 'Place', 'name': locationLabel(professional.location) } : undefined,
					'knowsLanguage': professional.languages.map(language => language.name),
					'sameAs': [professional.linkedin_url, professional.website_url].filter(Boolean),
				},
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					'itemListElement': [
						{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': config.public.siteUrl },
						{ '@type': 'ListItem', 'position': 2, 'name': 'Sales Pros', 'item': `${config.public.siteUrl}/professionals` },
						{ '@type': 'ListItem', 'position': 3, 'name': name, 'item': canonical },
					],
				},
			]),
		},
	],
})
</script>
