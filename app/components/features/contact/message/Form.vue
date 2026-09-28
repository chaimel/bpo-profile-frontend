<template>
	<div class="form">
		<!-- sent -->
		<div v-if="status === 'sent'" ref="sent_ref" class="form__sent" role="status" tabindex="-1">
			<span class="form__sent-icon">
				<MIcon name="light-paper-plane" size="lg" />
			</span>
			<MHeading variant="2" size="3">Message sent</MHeading>
			<MText size="large" color="--text-secondary" class="form__sent-text">
				Thanks, {{ first_name }}. Your message is with the BPO Profile team, and we’ll reply to
				<span class="form__email">{{ values.sender_email }}</span>.
			</MText>
			<MButton variant="neutral" class="form__again" @click="reset">Send another message</MButton>
		</div>

		<form v-else class="form__form" novalidate aria-labelledby="contact-form-title" @submit.prevent="submit">
			<div class="form__head">
				<MHeading id="contact-form-title" variant="2" size="4" weight="semi-bold">Send us a message</MHeading>
				<MText color="--text-secondary">All fields are required unless marked optional.</MText>
			</div>

			<!-- contact failure: neutral copy, values kept, retry allowed (PDF p. 39) -->
			<MAlert v-if="status === 'error'" tone="danger" live>
				<template #title>We couldn’t send your message. Please try again.</template>
				Your details are still here, so nothing needs retyping.
			</MAlert>

			<div class="form__row">
				<MInput
					id="contact-name"
					v-model="values.sender_name"
					name="sender_name"
					autocomplete="name"
					required
					:has-error="Boolean(errors.sender_name)"
				>
					<template #label>Your name</template>
					<template #error>{{ errors.sender_name }}</template>
				</MInput>

				<MInput
					id="contact-email"
					v-model="values.sender_email"
					name="sender_email"
					type="email"
					autocomplete="email"
					required
					:has-error="Boolean(errors.sender_email)"
				>
					<template #label>Email</template>
					<template #error>{{ errors.sender_email }}</template>
				</MInput>
			</div>

			<div class="form__row">
				<MInput
					id="contact-company"
					v-model="values.sender_company"
					name="sender_company"
					autocomplete="organization"
					optional
				>
					<template #label>Company</template>
				</MInput>

				<MInput
					id="contact-phone"
					v-model="values.sender_phone"
					name="sender_phone"
					type="tel"
					autocomplete="tel"
					optional
				>
					<template #label>Phone</template>
				</MInput>
			</div>

			<MTextarea
				id="contact-message"
				v-model="values.message"
				name="message"
				:rows="6"
				required
				:max-length="2000"
				:has-error="Boolean(errors.message)"
			>
				<template #label>Message</template>
				<template #hint>Tell us about your listing, a claim, a plan, or anything else we can help with.</template>
				<template #error>{{ errors.message }}</template>
			</MTextarea>

			<!-- honeypot: hidden from people, filled in by bots -->
			<div class="form__trap" aria-hidden="true">
				<label for="contact-website">Leave this field empty</label>
				<input
					id="contact-website"
					v-model="values.website"
					type="text"
					name="website"
					tabindex="-1"
					autocomplete="off"
				>
			</div>

			<div class="form__foot">
				<MButton type="submit" size="lg" :is-loading="status === 'sending'">
					<template #prefix>
						<MIcon name="light-paper-plane" size="sm" />
					</template>
					Send message
				</MButton>
				<MText size="small" color="--text-muted" class="form__note">
					<MIcon name="light-shield" size="xs" class="form__note-icon" />
					Your message goes only to the BPO Profile team — never to a company in the directory.
				</MText>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import type { ContactPayload } from '~/types/features/inquiry'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'
type FieldKey = 'sender_name' | 'sender_email' | 'message'

interface Props {
	// previews a state while the UI is static; the API drives it later
	initialStatus?: 'idle' | 'error' | 'sent'
}

const props = withDefaults(defineProps<Props>(), {
	initialStatus: 'idle',
})

// Sample input (reserved .example domain) so a previewed state shows
// what the person typed.
const example_values = {
	sender_name: 'Jordan Lee',
	sender_email: 'jordan@harborpoint.example',
	sender_company: 'Harbor Point Solutions',
	sender_phone: '',
	message: 'Our company is already listed on BPO Profile, and we’d like to claim the profile so we can update our services. What do we need to get started?',
}

const status = ref<FormStatus>(props.initialStatus)

// While previewing the failure every send fails, so retries show the
// retained values; otherwise the stand-in send succeeds.
const fails_on_send = props.initialStatus === 'error'

const values = reactive({
	sender_name: '',
	sender_email: '',
	sender_company: '',
	sender_phone: '',
	message: '',
	website: '',
	...(props.initialStatus === 'idle' ? {} : example_values),
})

const errors = reactive<Partial<Record<FieldKey, string>>>({})

// In form order, so focus lands on the first problem.
const field_ids: Record<FieldKey, string> = {
	sender_name: 'contact-name',
	sender_email: 'contact-email',
	message: 'contact-message',
}

const sent_ref = ref<HTMLElement | null>(null)

const first_name = computed(() => values.sender_name.trim().split(/\s+/)[0] || 'there')

function validate(): boolean {
	errors.sender_name = values.sender_name.trim() ? undefined : 'Enter your name.'

	const email = values.sender_email.trim()
	if (!email) errors.sender_email = 'Enter your email address.'
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.sender_email = 'Enter an email address like name@company.com.'
	else errors.sender_email = undefined

	const message = values.message.trim()
	if (!message) errors.message = 'Enter your message.'
	else if (message.length < 10) errors.message = 'Add a little more detail so we can help.'
	else errors.message = undefined

	return !errors.sender_name && !errors.sender_email && !errors.message
}

// POST /api/contact takes only the sender fields and the message.
function toPayload(): ContactPayload {
	return {
		sender_name: values.sender_name.trim(),
		sender_email: values.sender_email.trim(),
		sender_company: values.sender_company.trim() || undefined,
		sender_phone: values.sender_phone.trim() || undefined,
		message: values.message.trim(),
	}
}

// Static stand-in for POST /api/contact (docs/API.md §4).
function sendContact(_payload: ContactPayload): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(() => (fails_on_send ? reject(new Error('Contact failed')) : resolve()), 700)
	})
}

async function submit() {
	if (status.value === 'sending') return

	if (!validate()) {
		await nextTick()
		const first_invalid = (Object.keys(field_ids) as FieldKey[]).find(key => errors[key])
		if (first_invalid) document.getElementById(field_ids[first_invalid])?.focus()
		return
	}

	// bots fill the hidden field: look successful, send nothing
	if (values.website) {
		status.value = 'sent'
		return
	}

	status.value = 'sending'

	try {
		await sendContact(toPayload())
		status.value = 'sent'
		await nextTick()
		sent_ref.value?.focus()
	}
	catch {
		// never claim success; every value stays in place for the retry
		status.value = 'error'
	}
}

async function reset() {
	values.message = ''
	status.value = 'idle'
	await nextTick()
	document.getElementById(field_ids.message)?.focus()
}
</script>

<style lang="scss" scoped>
.form {
	min-width: 0;

	&__form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	&__head {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-bottom: 20px;
		border-bottom: var(--rule);
	}

	&__row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
	}

	// off-screen rather than display:none, which some bots skip
	&__trap {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	&__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px 24px;
		padding-top: 4px;
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		flex: 1 1 260px;
	}

	&__note-icon {
		margin-top: 4px;
	}

	// --- Sent ----------------------------------------------------
	&__sent {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 40px;
		border-radius: var(--radius-lg);
		background: var(--canvas);

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 2px solid var(--brand);
			outline-offset: 2px;
		}
	}

	&__sent-icon {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: 8px;
		border-radius: 50%;
		background: var(--success-soft);
		color: var(--success);
	}

	&__sent-text {
		max-width: 520px;
	}

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__again {
		margin-top: 12px;
	}
}

@media only screen and (max-width: 600px) {
	.form {
		&__row {
			grid-template-columns: minmax(0, 1fr);
		}

		&__sent {
			padding: 28px 20px;
		}
	}
}
</style>
