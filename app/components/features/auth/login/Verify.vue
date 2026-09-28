<template>
	<form class="verify" novalidate @submit.prevent="submit">
		<header class="verify__head">
			<span class="verify__mark" aria-hidden="true">
				<MIcon name="light-envelope-text" size="lg" />
			</span>
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="verify__title">
				Check your email
			</MHeading>
			<MText size="large" color="--text-secondary">
				We sent a {{ authPolicy.codeLength }}-digit code to
				<strong class="verify__email">{{ props.challenge.masked_email }}</strong>.
				Enter it below to finish signing in.
			</MText>
		</header>

		<MAlert v-if="is_resent" tone="success" live>
			We sent a new code to {{ props.challenge.masked_email }}. Codes from earlier emails no longer work.
		</MAlert>

		<MCodeInput
			id="login-code"
			v-model="code"
			name="code"
			:length="authPolicy.codeLength"
			:has-error="Boolean(code_error)"
		>
			<template #label>Sign-in code</template>
			<template #hint>
				The code expires {{ lifetime_label }} after we sent it. A new code doesn’t extend that time.
			</template>
			<template #error>{{ code_error }}</template>
		</MCodeInput>

		<MButton type="submit" size="lg" block>Verify and sign in</MButton>

		<div class="verify__help">
			<MText size="small" color="--text-secondary">
				Didn’t get it? Check your spam folder, or ask for a new code.
				After {{ authPolicy.maxCodeAttempts }} incorrect codes you’ll need to sign in again.
			</MText>

			<div v-if="sends_left > 0" class="verify__resend">
				<MButton
					variant="text"
					:disabled="seconds_left > 0"
					:is-loading="is_sending"
					@click="resend"
				>
					<template #prefix>
						<MIcon name="light-sync" size="sm" />
					</template>
					Resend code
				</MButton>
				<span v-if="seconds_left > 0" class="verify__wait">Available in {{ wait_label }}</span>
			</div>

			<MText v-else size="small" color="--text-secondary" class="verify__limit">
				<MIcon name="light-info-circle" size="sm" color="text-muted" class="verify__limit-icon" />
				We’ve sent {{ authPolicy.maxSends }} codes, the most we can send in {{ authPolicy.sendWindowMinutes }}
				minutes. Use the code in our latest email, or sign in again later.
			</MText>

			<!-- The countdown itself stays quiet; only its end is announced. -->
			<p class="sr-only" role="status">{{ cooldown_message }}</p>
		</div>

		<div class="verify__switch">
			<MButton variant="text" @click="restart">
				<template #prefix>
					<MIcon name="light-arrow-left" size="sm" />
				</template>
				Use a different account
			</MButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { authPolicy } from '~/data/features/onboarding'
import type { LoginChallenge } from '~/types/features/onboarding'

interface Props {
	challenge: LoginChallenge
	// the generic "that code didn't work" answer from the last attempt
	error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	error: false,
})

const emit = defineEmits<{
	(_e: 'verify', _code: string): void
	(_e: 'resend' | 'restart'): void
}>()

const heading_ref = ref<ComponentPublicInstance | null>(null)

// Kept as a string so leading zeros survive (docs/API.md §1).
const code = ref('')
const is_attempted = ref(false)

const code_error = computed(() => {
	if (is_attempted.value && code.value.length < authPolicy.codeLength) {
		return `Enter all ${authPolicy.codeLength} digits of the code.`
	}
	// Generic on purpose: expired, replaced and mistyped codes read the same.
	if (props.error && !code.value) {
		return 'That code didn’t work. Check the most recent email from us and try again.'
	}
	return ''
})

const lifetime_label = computed(() => {
	const minutes = Math.round(props.challenge.expires_in / 60)
	return `${minutes} minute${minutes === 1 ? '' : 's'}`
})

function submit() {
	is_attempted.value = true

	if (code.value.length < authPolicy.codeLength) {
		document.getElementById('login-code')?.focus()
		return
	}

	emit('verify', code.value)

	// Codes are single-use: clear it once it has been sent.
	code.value = ''
	is_attempted.value = false
}

function restart() {
	code.value = ''
	emit('restart')
}

// --- Resend cooldown ------------------------------------------
// A client-side timer against a fixed deadline, so a throttled background
// tab still shows the right number when it comes back.

const seconds_left = ref(props.challenge.resend_after)
const cooldown_message = ref('')
const is_sending = ref(false)
const is_resent = ref(false)

// The first email counts as a send. Laravel answers a send over the limit
// with 429; counting here only avoids offering a send that would fail.
const sends_used = ref(1)
const sends_left = computed(() => authPolicy.maxSends - sends_used.value)

const wait_label = computed(() => `${seconds_left.value} second${seconds_left.value === 1 ? '' : 's'}`)

let resend_at = 0
let timer: ReturnType<typeof setInterval> | undefined

function stopCooldown() {
	if (timer === undefined) return
	clearInterval(timer)
	timer = undefined
}

function tick() {
	seconds_left.value = Math.max(0, Math.ceil((resend_at - Date.now()) / 1000))
	if (seconds_left.value > 0) return

	stopCooldown()
	cooldown_message.value = sends_left.value > 0 ? 'You can ask for a new code now.' : ''
}

function startCooldown(seconds: number) {
	stopCooldown()
	cooldown_message.value = ''
	resend_at = Date.now() + seconds * 1000
	seconds_left.value = seconds
	timer = setInterval(tick, 1000)
}

function resend() {
	if (seconds_left.value > 0 || is_sending.value || sends_left.value <= 0) return
	is_sending.value = true
	emit('resend')
}

// A fresh challenge from the parent means the resend went through: the
// previous code is dead and the cooldown starts again. The deadline does not.
watch(() => props.challenge, (challenge) => {
	is_sending.value = false
	is_resent.value = true
	sends_used.value += 1
	startCooldown(challenge.resend_after)
})

// A rejected code has already been cleared; put the caret back in the field.
watch(() => props.error, async (error) => {
	if (!error) return
	await nextTick()
	document.getElementById('login-code')?.focus()
})

onMounted(() => startCooldown(props.challenge.resend_after))
onBeforeUnmount(stopCooldown)

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.verify {
	display: flex;
	flex-direction: column;
	gap: 28px;

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
		background: var(--brand-soft);
		color: var(--brand-deep);
	}

	&__title:focus {
		outline: none;
	}

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__help {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding-top: 24px;
		border-top: var(--rule);
	}

	&__resend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 14px;
	}

	&__wait {
		font-family: var(--font-ui);
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		color: var(--text-muted);
	}

	&__limit {
		display: flex;
		gap: 10px;
	}

	&__limit-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	&__switch {
		display: flex;
	}
}
</style>
