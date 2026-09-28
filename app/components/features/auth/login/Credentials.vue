<template>
	<form class="credentials" novalidate @submit.prevent="submit">
		<header class="credentials__head">
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="credentials__title">
				Sign in to BPO Profile
			</MHeading>
			<MText size="large" color="--text-secondary">
				Manage your company listing or sales profile. After your password or Google, we’ll email you a code to finish signing in.
			</MText>
		</header>

		<!-- One message for every failed attempt: it never says which detail was wrong or whether the account exists. -->
		<MAlert v-if="props.notice === 'error'" tone="danger" live>
			<template #title>We couldn’t sign you in with those details.</template>
			Check your email and password and try again.
		</MAlert>

		<MAlert v-else-if="props.notice === 'expired'" tone="warning" live>
			<template #title>That sign-in code can’t be used any more</template>
			Codes expire after {{ authPolicy.codeLifetimeMinutes }} minutes, and {{ authPolicy.maxCodeAttempts }} incorrect
			tries end the sign-in. Sign in again and we’ll email you a new code.
		</MAlert>

		<!-- linking Google signs the account out everywhere (docs/API.md §1) -->
		<MAlert v-else-if="props.notice === 'linked'" tone="success" live>
			<template #title>Your Google account is linked</template>
			For your security, we signed you out on every device. Sign in again with your password or with Google.
		</MAlert>

		<GoogleSignIn />

		<div class="credentials__fields">
			<MInput
				id="login-email"
				v-model="email_model"
				name="email"
				type="email"
				autocomplete="email"
				:has-error="Boolean(errors.email)"
			>
				<template #label>Email</template>
				<template #error>{{ errors.email }}</template>
			</MInput>

			<div class="credentials__password">
				<MInput
					id="login-password"
					v-model="password"
					name="password"
					type="password"
					autocomplete="current-password"
					revealable
					:has-error="Boolean(errors.password)"
				>
					<template #label>Password</template>
					<template #error>{{ errors.password }}</template>
				</MInput>

				<NuxtLink to="/forgot-password" class="credentials__forgot">Forgot password?</NuxtLink>
			</div>
		</div>

		<MButton type="submit" size="lg" block>Sign in</MButton>

		<footer class="credentials__foot">
			<MText size="small" weight="semi-bold" class="credentials__foot-title">New to BPO Profile?</MText>

			<ul class="credentials__routes">
				<li v-for="route in routes" :key="route.to">
					<NuxtLink :to="route.to" class="credentials__route">
						<span class="credentials__route-text">
							<span class="credentials__route-label">{{ route.label }}</span>
							<span class="credentials__route-description">{{ route.description }}</span>
						</span>
						<MIcon name="light-long-arrow-right" size="sm" color="brand-strong" class="credentials__route-icon" />
					</NuxtLink>
				</li>
			</ul>

			<MText size="small" color="--text-muted" class="credentials__buyers">
				Looking for a provider? You don’t need an account to search or send an inquiry.
				<NuxtLink to="/find" class="credentials__link">Find a BPO</NuxtLink>
			</MText>
		</footer>
	</form>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, ref } from 'vue'
import { authPolicy } from '~/data/features/onboarding'
import GoogleSignIn from '../GoogleSignIn.vue'

interface Props {
	email?: string
	// error: the generic failed-sign-in message · expired: a code challenge
	// ended · linked: Google was linked, so every session was signed out
	notice?: 'error' | 'expired' | 'linked' | null
}

const props = withDefaults(defineProps<Props>(), {
	email: '',
	notice: null,
})

const emit = defineEmits<{
	(_e: 'update:email', _value: string): void
	(_e: 'submit', _credentials: { email: string, password: string }): void
}>()

const routes = [
	{ to: '/register?type=company', label: 'Get Listed', description: 'Add your BPO company to the directory.' },
	{ to: '/register?type=professional', label: 'Create your sales profile', description: 'Join your company’s team on BPO Profile.' },
]

const heading_ref = ref<ComponentPublicInstance | null>(null)
const password = ref('')
const is_attempted = ref(false)

// The email lives with the parent so it survives a trip back to this step.
const email_model = computed({
	get: () => props.email,
	set: (value: string) => emit('update:email', value),
})

// Field messages appear after the first submit, then follow the input.
const errors = computed(() => ({
	email: is_attempted.value && !email_model.value.trim() ? 'Enter your email address.' : '',
	password: is_attempted.value && !password.value ? 'Enter your password.' : '',
}))

async function submit() {
	is_attempted.value = true

	if (errors.value.email || errors.value.password) {
		await nextTick()
		document.getElementById(errors.value.email ? 'login-email' : 'login-password')?.focus()
		return
	}

	emit('submit', { email: email_model.value.trim(), password: password.value })

	// The password leaves with the request and is never kept (docs/ARCHITECTURE.md §5).
	password.value = ''
	is_attempted.value = false
}

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.credentials {
	display: flex;
	flex-direction: column;
	gap: 28px;

	&__head {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__title:focus {
		outline: none;
	}

	&__fields {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__password {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
	}

	&__forgot,
	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--brand-strong);

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__foot {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 8px;
	}

	&__foot-title {
		font-family: var(--font-ui);
	}

	&__routes {
		border-top: var(--rule);
	}

	&__route {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 4px;
		border-bottom: var(--rule);

		&:hover {
			background: var(--canvas);
		}
	}

	&__route-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__route-label {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--brand-strong);
	}

	&__route-description {
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__route-icon {
		transition: transform 0.15s ease;
	}

	&__route:hover .credentials__route-icon {
		transform: translateX(3px);
	}

	&__buyers {
		padding-top: 4px;
	}
}
</style>
