<template>
	<div>
		<MyProfile :key="state" :professional="preview_professional" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MyProfile from '@/components/features/dashboard/profile/Index.vue'
import type { EditableProfessional } from '~/types/features/dashboard'
import { notFound } from '~/utils/errors'

const { findOwnProfessional } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const professional = resolveProfessional()

// GET /api/dashboard/professional. An account with no sales profile has
// nothing to edit here.
function resolveProfessional() {
	const found = findOwnProfessional()

	if (!found) {
		throw notFound('You don’t have a sales profile yet. Register as a sales professional to create one.')
	}
	return found
}

// ?state= previews each notice the editor shows: a draft, pending_review
// or suspended profile, or a pending or rejected affiliation (both of
// which keep the profile a private draft).
const previews: Record<string, Partial<EditableProfessional>> = {
	draft: { status: 'draft' },
	pending_review: { status: 'pending_review' },
	suspended: { status: 'suspended' },
	pending: { status: 'draft', affiliation_status: 'pending' },
	rejected: { status: 'draft', affiliation_status: 'rejected' },
}

const state = computed(() => String(route.query.state ?? ''))
const preview_professional = computed(() => ({ ...professional, ...previews[state.value] }))

useHead({
	title: 'My sales profile',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
