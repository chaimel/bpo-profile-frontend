<template>
	<div class="google-sign-in">
		<!-- A full page navigation, not a router link: the round trip runs
			through Laravel and Google (docs/API.md §1). -->
		<MButton :href="href" variant="neutral" size="lg" block class="google-sign-in__button">
			<template #prefix>
				<img src="/images/brand/google-g.svg" alt="" width="18" height="18" class="google-sign-in__mark">
			</template>
			Continue with Google
		</MButton>

		<MText size="small" color="--text-muted" align="center">{{ hints[props.intent] }}</MText>

		<MText variant="div" size="small" color="--text-muted" class="google-sign-in__divider">
			{{ dividers[props.intent] }}
		</MText>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { googleSignIn } from '~/data/features/onboarding'

interface Props {
	// register: a first-time Google account continues to onboarding
	intent?: 'sign-in' | 'register'
}

const props = withDefaults(defineProps<Props>(), {
	intent: 'sign-in',
})

const hints = {
	'sign-in': 'We’ll still email you a code to finish signing in.',
	'register': 'You’ll choose how you use BPO Profile after you sign in.',
}

const dividers = {
	'sign-in': 'or sign in with email',
	'register': 'or register with email',
}

// Live, both intents use googleSignIn.href and Laravel decides where the
// account goes. Static, ?account=new previews a first-time account.
const href = computed(() =>
	props.intent === 'register' ? `${googleSignIn.static_href}?account=new` : googleSignIn.static_href,
)
</script>

<style lang="scss" scoped>
.google-sign-in {
	display: flex;
	flex-direction: column;
	gap: 10px;

	&__mark {
		display: block;
	}

	// a rule either side of the text
	&__divider {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 10px;
		font-family: var(--font-ui);

		&::before,
		&::after {
			content: '';
			flex: 1 1 auto;
			border-top: var(--rule);
		}
	}
}
</style>
