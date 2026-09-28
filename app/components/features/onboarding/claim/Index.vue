<template>
	<div class="claim">
		<Banner :company="props.company" :missing="props.missing" />

		<template v-if="props.company">
			<Request
				:company="props.company"
				:state="props.state"
				:account="props.account"
				:return-to="props.returnTo"
				@submit="emit('submit')"
			/>
			<Process v-if="!props.company.claimed" :company-name="props.company.name" :current="progress" />
		</template>

		<template v-else>
			<Finder :companies="props.companies" />
			<Process />
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import type { Me } from '~/types/features/dashboard'
import type { CompanyCard } from '~/types/features/directory'
import type { ClaimRequestState } from '~/types/features/onboarding'
import Banner from './Banner.vue'
import Finder from './Finder.vue'
import Process from './Process.vue'
import Request from './Request.vue'

interface Props {
	// the listing from ?company=, or null to search for one
	company: CompanyCard | null
	// a ?company= slug was given but matched no listing
	missing?: boolean
	companies: CompanyCard[]
	state?: ClaimRequestState
	account: Pick<Me, 'first_name' | 'last_name' | 'email'>
	// where sign-in and registration bring the visitor back to
	returnTo: string
}

const props = withDefaults(defineProps<Props>(), {
	missing: false,
	state: 'signed-out',
})

const emit = defineEmits<{
	(_e: 'submit'): void
}>()

const progress_by_state: Record<ClaimRequestState, { step: number, label: string }> = {
	'signed-out': { step: 0, label: 'Start here' },
	'ready': { step: 1, label: 'Next step' },
	'submitted': { step: 2, label: 'In review' },
}

const progress = computed(() => progress_by_state[props.state])

// Choosing a listing from the search (or going back to it) only changes the
// query, so the page stays mounted and the link that was clicked disappears.
// Start again at the new heading, which also brings it into view.
watch(() => props.company?.slug, async () => {
	await nextTick()
	document.getElementById('claim-title')?.focus()
})
</script>
