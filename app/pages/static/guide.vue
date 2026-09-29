<template>
	<div>
		<Guide />
	</div>
</template>

<script setup lang="ts">
import Guide from '@/components/features/static/guide/Index.vue'

// The goal, the business and a walkthrough of the static demo, for
// investors and other reviewers — not linked from the site's menus.
// Share /static/guide directly.
useHead({
	title: 'Guide',
	meta: [
		{
			name: 'description',
			content: 'What BPO Profile is for, who it serves, how it makes money and where it’s going, with guided tours through the directory, the provider dashboard and the admin tools.',
		},
		{ name: 'robots', content: 'noindex, nofollow' },
	],
})
</script>
