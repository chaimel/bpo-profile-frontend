<template>
	<div>
		<Locations />
	</div>
</template>

<script setup lang="ts">
import Locations from '@/components/features/locations/Index.vue'

useHead({
	title: 'BPO locations',
	meta: [
		{
			name: 'description',
			content: 'Explore BPO companies by country, region, and city, and go straight to the providers operating in each place.',
		},
	],
})

useCanonical('/locations')
</script>
