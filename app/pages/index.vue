<template>
	<div>
		<Home />
	</div>
</template>

<script setup lang="ts">
import Home from '@/components/features/home/Index.vue'
import { siteDescription } from '~/data/features/site'

useHead({
	meta: [
		{ name: 'description', content: siteDescription },
		{ property: 'og:title', content: 'BPO Profile — Find BPO companies. Meet the people behind them.' },
		{ property: 'og:description', content: siteDescription },
		{ property: 'og:type', content: 'website' },
	],
})

useCanonical('/')
</script>
