<template>
	<div>
		<Sitemap />
	</div>
</template>

<script setup lang="ts">
import Sitemap from '@/components/features/static/sitemap/Index.vue'

// Every screen in the static demo, including the dashboards and the
// admin, so it stays out of search results and link crawls.
useHead({
	title: 'Sitemap',
	meta: [
		{
			name: 'description',
			content: 'Every screen in the BPO Profile demo, grouped by who uses it, with a link to each of its states.',
		},
		{ name: 'robots', content: 'noindex, nofollow' },
	],
})
</script>
