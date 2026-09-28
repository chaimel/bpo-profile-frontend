<template>
	<div>
		<Account :key="state" :me="me" :state="state" :google-stale="route.query.google === 'stale'" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Account from '@/components/features/dashboard/account/Index.vue'

const { me } = useSessionStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()

// ?state=error previews every account request failing: messages stay
// neutral, typed input is kept, and passwords are cleared.
const state = computed(() => (route.query.state === 'error' ? 'error' : 'ready'))

useHead({
	title: 'Account settings',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
