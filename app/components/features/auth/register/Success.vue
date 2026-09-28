<template>
	<div class="success">
		<header class="success__head">
			<span class="success__mark" aria-hidden="true">
				<MIcon name="light-check-circle" size="lg" />
			</span>
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="success__title">
				Account created
			</MHeading>
			<MText size="large" color="--text-secondary">
				Now sign in to verify your email. We haven’t signed you in — every sign-in takes your password or
				Google, then a code from your inbox.
			</MText>
		</header>

		<ol class="success__steps">
			<li class="success__step">
				<span class="success__number" aria-hidden="true">1</span>
				<div class="success__step-body">
					<MText size="small" weight="semi-bold" class="success__step-title">Sign in and confirm your email</MText>
					<MText color="--text-secondary">
						Enter your password, then the {{ authPolicy.codeLength }}-digit code we email to
						<strong v-if="props.email" class="success__email">{{ props.email }}</strong>
						<template v-else>the address you registered with</template>. The first code verifies the address.
					</MText>
				</div>
			</li>
			<li class="success__step">
				<span class="success__number" aria-hidden="true">2</span>
				<div class="success__step-body">
					<MText size="small" weight="semi-bold" class="success__step-title">{{ next_step.title }}</MText>
					<MText color="--text-secondary">{{ next_step.text }}</MText>
				</div>
			</li>
		</ol>

		<MButton :to="sign_in_link" size="lg" block>
			Sign in
			<template #suffix>
				<MIcon name="light-long-arrow-right" size="sm" />
			</template>
		</MButton>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { authPolicy } from '~/data/features/onboarding'
import type { RegisterPath } from '~/types/features/onboarding'

interface Props {
	path: RegisterPath
	email?: string
	redirect?: string
}

const props = withDefaults(defineProps<Props>(), {
	email: '',
	redirect: undefined,
})

const heading_ref = ref<ComponentPublicInstance | null>(null)

// What the new account can do once it has signed in (docs/API.md §1).
const next_step = computed(() => {
	if (props.path === 'company') {
		return {
			title: 'Complete your company listing',
			text: 'It starts as a private draft. When it’s ready, submit it for review — nothing is published before then.',
		}
	}

	if (props.path === 'professional') {
		return {
			title: 'Wait for your company to confirm you',
			text: 'You can edit your draft profile straight away. Your company reviews your affiliation before BPO Profile can publish it.',
		}
	}

	return {
		title: 'Accept your invitation or claim',
		text: props.redirect
			? 'We’ll take you straight back to it once you’re signed in.'
			: 'Open the link in your invitation or approval email again while you’re signed in.',
	}
})

const sign_in_link = computed<RouteLocationRaw>(() => ({
	path: '/login',
	query: props.redirect ? { redirect: props.redirect } : undefined,
}))

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.success {
	display: flex;
	flex-direction: column;
	gap: 32px;

	&__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	&__mark {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: 12px;
		border-radius: var(--radius-md);
		background: var(--success-soft);
		color: var(--success);
	}

	&__title:focus {
		outline: none;
	}

	&__steps {
		border-top: var(--rule);
	}

	&__step {
		display: flex;
		gap: 16px;
		padding: 18px 0;
		border-bottom: var(--rule);
	}

	&__number {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--slate-soft);
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 600;
		color: var(--slate);
	}

	&__step-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__step-title {
		font-family: var(--font-ui);
	}

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}
}
</style>
