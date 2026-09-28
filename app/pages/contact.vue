<template>
	<div>
		<!-- keyed so switching the preview state remounts the form -->
		<Contact :key="initial_status" :initial-status="initial_status" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Contact from '@/components/features/contact/Index.vue'

const route = useRoute()

// Static preview states until POST /api/contact exists:
//   ?state=error  failed send — values retained, retries keep failing
//   ?state=sent   the confirmation
// A normal visit validates and "sends" successfully after a short delay.
const initial_status = computed<'idle' | 'error' | 'sent'>(() => {
	if (route.query.state === 'error') return 'error'
	if (route.query.state === 'sent') return 'sent'
	return 'idle'
})

useHead({
	title: 'Contact us',
	meta: [
		{
			name: 'description',
			content: 'Send the BPO Profile team a message about listings, claims, plans, or the directory. To reach a BPO, use the form on their profile.',
		},
	],
})

useCanonical('/contact')
</script>
