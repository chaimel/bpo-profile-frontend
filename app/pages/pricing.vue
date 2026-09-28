<template>
	<div>
		<Pricing />
	</div>
</template>

<script setup lang="ts">
import Pricing from '@/components/features/pricing/Index.vue'

useHead({
	title: 'Pricing and listing plans',
	meta: [
		{
			name: 'description',
			content: 'Compare BPO Profile listing plans for BPO companies. Basic is free; Professional and Premium add visibility and insight features as they launch, and no plan can buy a higher search ranking.',
		},
	],
})

useCanonical('/pricing')
</script>
