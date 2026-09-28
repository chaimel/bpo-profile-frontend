<template>
	<div>
		<Locations :locations="adminLocations" />
	</div>
</template>

<script setup lang="ts">
import Locations from '@/components/features/admin/locations/Index.vue'

const { adminLocations } = useAdminStore()

definePageMeta({ layout: 'admin' })

useHead({
	title: 'Locations — Admin',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
