<template>
	<div>
		<Styleguide />
	</div>
</template>

<script setup lang="ts">
import Styleguide from '@/components/features/styleguide/Index.vue'

// Internal reference for the component library — not linked from the site.
useHead({
	title: 'UI components',
	meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>
