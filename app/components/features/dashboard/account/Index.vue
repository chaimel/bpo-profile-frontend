<template>
	<MPage
		id="account"
		class="account"
		title="Account settings"
		description="Your sign-in details. They apply to every company you manage and to your sales profile."
	>
		<div class="account__panel">
			<Name
				id-prefix="account-name"
				:first-name="props.me.first_name"
				:last-name="props.me.last_name"
				:fails="fails"
			/>
			<Email id-prefix="account-email" :email="props.me.email" :fails="fails" />
			<Password id-prefix="account-password" :fails="fails" />
			<Google id-prefix="account-google" :email="props.me.email" :fails="fails" :stale="props.googleStale" />
			<Sessions id-prefix="account-sessions" :fails="fails" />
		</div>

		<div class="account__panel account__panel--danger">
			<Delete
				id-prefix="account-delete"
				:company-names="props.me.companies.map(company => company.name)"
				:has-sales-profile="props.me.professional !== null"
				:fails="fails"
			/>
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Me } from '~/types/features/dashboard'
import Delete from './Delete.vue'
import Email from './Email.vue'
import Google from './Google.vue'
import Name from './Name.vue'
import Password from './Password.vue'
import Sessions from './Sessions.vue'

// Each section is its own request and form. Email, password and session
// changes bump the account's auth version, which signs out every
// session (docs/ARCHITECTURE.md §5).
interface Props {
	me: Me
	// 'error' previews every request failing (?state=error)
	state?: 'ready' | 'error'
	// previews Google linking refused for an old sign-in (?google=stale)
	googleStale?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
	googleStale: false,
})

const fails = computed(() => props.state === 'error')
</script>

<style lang="scss" scoped>
.account {
	&__panel {
		padding: 8px 28px 16px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);

		// a red edge marks the irreversible action; the words carry the meaning
		&--danger {
			box-shadow: inset 4px 0 0 var(--danger), inset 0 0 0 1px var(--border);
		}
	}
}

@media only screen and (max-width: 600px) {
	.account__panel {
		padding: 0 16px 12px;
	}
}
</style>
