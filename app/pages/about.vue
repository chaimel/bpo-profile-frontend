<template>
	<div>
		<About />
	</div>
</template>

<script setup lang="ts">
import About from '@/components/features/about/Index.vue'

useHead({
	title: 'About',
	meta: [
		{
			name: 'description',
			content: 'BPO Profile is a professional discovery network for the BPO industry: find companies, meet the sales professionals behind them, and see what our badges mean and how results are ranked.',
		},
	],
})

useCanonical('/about')
</script>
