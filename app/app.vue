<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { siteDescription, siteName } from '~/data/features/site'

useHead({
	titleTemplate: title => (title && title !== siteName ? `${title} | ${siteName}` : `${siteName} — Find BPO companies. Meet the people behind them.`),
	meta: [
		{ name: 'description', content: siteDescription },
	],
})
</script>
