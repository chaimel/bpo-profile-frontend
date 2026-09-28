<template>
	<div>
		<Legal
			:title="privacy.title"
			:lede="privacy.lede"
			:updated="privacy.updated"
			:sections="privacy.sections"
		/>
	</div>
</template>

<script setup lang="ts">
import Legal from '@/components/features/legal/Index.vue'
import { privacy } from '~/data/features/legal'

useHead({
	title: privacy.title,
	meta: [
		{ name: 'description', content: privacy.description },
		// a draft that counsel hasn't approved stays out of search results
		{ name: 'robots', content: 'noindex' },
	],
})
</script>
