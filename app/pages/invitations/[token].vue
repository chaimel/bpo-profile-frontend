<template>
	<Invitation
		:state="state"
		:company="invitationAcceptance.company"
		:profile="invitationAcceptance.profile"
		:account-email="account_email"
		:return-to="route.path"
		@accept="onAccept"
		@sign-out="onSignOut"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Invitation from '@/components/features/onboarding/invitation/Index.vue'
import type { TokenState } from '~/types/features/onboarding'

const { invitationAcceptance } = useOnboardingStore()

definePageMeta({ layout: 'default' })

// Emailed links are secrets: no Referer leaves this page and it stays out
// of search results (docs/ARCHITECTURE.md §5).
useHead({
	title: 'Accept your team invitation',
	meta: [
		{ name: 'referrer', content: 'no-referrer' },
		{ name: 'robots', content: 'noindex' },
	],
})

const route = useRoute()

const states: TokenState[] = ['signed-out', 'ready', 'wrong-account', 'accepted', 'invalid']

// Static UI: ?state= previews each screen. Once the API is wired up, GET
// /api/me and the POST /api/team-invitations/accept response decide it.
// The token (route.params.token) is never shown — it only goes back in
// that POST.
function stateFromQuery(): TokenState {
	return states.find(state => state === route.query.state) ?? 'ready'
}

const state = ref<TokenState>(stateFromQuery())

watch(() => route.query.state, () => {
	state.value = stateFromQuery()
})

// Stand-in for /api/me: the wrong-account preview is someone else signed in.
const account_email = computed(() =>
	state.value === 'wrong-account' ? invitationAcceptance.other_account_email : invitationAcceptance.account_email,
)

// Stand-in for POST /api/team-invitations/accept { token } → 200.
function onAccept() {
	state.value = 'accepted'
}

// Stand-in for POST /api/logout, then back through sign-in to this link.
function onSignOut() {
	navigateTo({ path: '/login', query: { redirect: route.path } })
}
</script>
