<template>
	<div>
		<Legal
			:title="terms.title"
			:lede="terms.lede"
			:updated="terms.updated"
			:sections="terms.sections"
		/>
	</div>
</template>

<script setup lang="ts">
import Legal from '@/components/features/legal/Index.vue'
import { terms } from '~/data/features/legal'

useHead({
	title: terms.title,
	meta: [
		{ name: 'description', content: terms.description },
		// a draft that counsel hasn't approved stays out of search results
		{ name: 'robots', content: 'noindex' },
	],
})
</script>
