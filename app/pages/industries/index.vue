<template>
	<div>
		<Industries />
	</div>
</template>

<script setup lang="ts">
import Industries from '@/components/features/industries/Index.vue'

useHead({
	title: 'BPO companies by industry',
	meta: [
		{
			name: 'description',
			content: 'Find BPO companies and sales professionals with experience in healthcare, e-commerce, financial services, technology, and other industries.',
		},
	],
})

useCanonical('/industries')
</script>
