<template>
	<div>
		<Services />
	</div>
</template>

<script setup lang="ts">
import Services from '@/components/features/services/Index.vue'

useHead({
	title: 'BPO services',
	meta: [
		{
			name: 'description',
			content: 'Browse BPO services — customer support, contact center, back office, technical support, and more — and go straight to the companies and sales professionals who offer them.',
		},
	],
})

useCanonical('/services')
</script>
