<template>
	<div class="m-inquiry-form">
		<!-- sent -->
		<div v-if="status === 'sent'" class="m-inquiry-form__sent" role="status">
			<span class="m-inquiry-form__sent-icon">
				<MIcon name="light-paper-plane" size="lg" />
			</span>
			<MHeading variant="3" size="4">Message sent</MHeading>
			<MText size="large" color="--text-secondary">
				{{ recipient_label }} will get your {{ type_noun }} by email. We’ve sent a copy to
				<strong>{{ form.sender_email }}</strong>.
			</MText>
			<MButton variant="neutral" @click="reset">Send another message</MButton>
		</div>

		<form v-else class="m-inquiry-form__form" novalidate @submit.prevent="submit">
			<MTabs
				v-if="available_types.length > 1"
				v-model="form.type"
				:tabs="available_types"
				label="What would you like to do?"
				variant="segmented"
				class="m-inquiry-form__types"
			/>

			<MAlert v-if="status === 'error'" tone="danger" live>
				<template #title>We couldn’t send your message. Please try again.</template>
				Your details are still here, so nothing needs retyping.
			</MAlert>

			<MSelect
				v-if="recipient_options.length > 1"
				:id="`${props.idPrefix}-recipient`"
				v-model="form.recipient"
				name="recipient"
				:options="recipient_options"
			>
				<template #label>Send to</template>
				<template #hint>Choose a person, or leave it with the company’s sales inbox.</template>
			</MSelect>

			<div class="m-inquiry-form__row">
				<MInput
					:id="`${props.idPrefix}-name`"
					v-model="form.sender_name"
					name="sender_name"
					autocomplete="name"
					required
					:has-error="Boolean(errors.sender_name)"
				>
					<template #label>Your name</template>
					<template #error>{{ errors.sender_name }}</template>
				</MInput>

				<MInput
					:id="`${props.idPrefix}-email`"
					v-model="form.sender_email"
					name="sender_email"
					type="email"
					autocomplete="email"
					required
					:has-error="Boolean(errors.sender_email)"
				>
					<template #label>Work email</template>
					<template #error>{{ errors.sender_email }}</template>
				</MInput>
			</div>

			<div class="m-inquiry-form__row">
				<MInput
					:id="`${props.idPrefix}-company`"
					v-model="form.sender_company"
					name="sender_company"
					autocomplete="organization"
					optional
				>
					<template #label>Company</template>
				</MInput>

				<MInput
					:id="`${props.idPrefix}-phone`"
					v-model="form.sender_phone"
					name="sender_phone"
					type="tel"
					autocomplete="tel"
					optional
				>
					<template #label>Phone</template>
				</MInput>
			</div>

			<!-- quote details travel as inquiry meta (docs/API.md §4) -->
			<template v-if="form.type === 'quote'">
				<fieldset v-if="props.services.length" class="m-inquiry-form__services">
					<legend class="m-inquiry-form__legend">
						Services you’re interested in
						<span class="m-field-optional">Optional</span>
					</legend>
					<div class="m-inquiry-form__service-list">
						<MCheckbox
							v-for="service in props.services"
							:id="`${props.idPrefix}-service-${service.slug}`"
							:key="service.slug"
							v-model="form.services"
							name="services"
							:value="service.slug"
						>
							{{ service.name }}
						</MCheckbox>
					</div>
				</fieldset>

				<div class="m-inquiry-form__row">
					<MSelect
						:id="`${props.idPrefix}-timeline`"
						v-model="form.timeline"
						name="timeline"
						placeholder="Not sure yet"
						:options="timeline_options"
						optional
					>
						<template #label>When do you want to start?</template>
					</MSelect>

					<MInput
						:id="`${props.idPrefix}-budget`"
						v-model="form.budget"
						name="budget"
						optional
						placeholder="e.g. team of 10, or a monthly budget"
					>
						<template #label>Team size or budget</template>
					</MInput>
				</div>
			</template>

			<MTextarea
				:id="`${props.idPrefix}-message`"
				v-model="form.message"
				name="message"
				:rows="5"
				required
				:max-length="2000"
				:placeholder="message_placeholder"
				:has-error="Boolean(errors.message)"
			>
				<template #label>{{ message_label }}</template>
				<template #error>{{ errors.message }}</template>
			</MTextarea>

			<!-- honeypot: hidden from people, filled in by bots -->
			<div class="m-inquiry-form__trap" aria-hidden="true">
				<label :for="`${props.idPrefix}-website`">Leave this field empty</label>
				<input :id="`${props.idPrefix}-website`" v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off">
			</div>

			<div class="m-inquiry-form__foot">
				<MButton type="submit" size="lg" :is-loading="status === 'sending'">
					{{ submit_label }}
				</MButton>
				<MText size="small" color="--text-muted" class="m-inquiry-form__note">
					<MIcon name="light-shield" size="xs" />
					No account needed. Your message goes to {{ recipient_label }}, and we email you a copy.
				</MText>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { SelectOption, TabItem } from '~/types/base/ui'
import type { InquiryAction, TaxonomyTag } from '~/types/features/directory'
import type { InquiryPayload } from '~/types/features/inquiry'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

interface Recipient {
	id: number
	name: string
	job_title: string
}

interface Props {
	idPrefix: string
	company: { id: number, name: string }
	// set when the form lives on a sales professional's profile
	professional?: Recipient | null
	// a company form can route to one of its sales pros instead
	recipients?: Recipient[]
	actions?: InquiryAction[]
	services?: TaxonomyTag[]
	initialType?: InquiryAction
	// preview a state while the UI is static; the API drives it later
	initialStatus?: FormStatus
}

const props = withDefaults(defineProps<Props>(), {
	professional: null,
	recipients: () => [],
	actions: () => ['contact', 'question', 'quote'],
	services: () => [],
	initialType: 'contact',
	initialStatus: 'idle',
})

const emit = defineEmits<{
	(_e: 'submit', _payload: InquiryPayload): void
}>()

const type_labels: Record<InquiryAction, string> = {
	contact: 'Contact',
	question: 'Ask a question',
	quote: 'Request a quote',
}

const available_types = computed<TabItem[]>(() =>
	props.actions.map(action => ({ value: action, label: type_labels[action] })),
)

const status = ref<FormStatus>(props.initialStatus)

const form = reactive({
	type: props.initialType as InquiryAction,
	recipient: props.professional ? String(props.professional.id) : '',
	sender_name: '',
	sender_email: '',
	sender_company: '',
	sender_phone: '',
	message: '',
	services: [] as (string | number)[],
	timeline: '',
	budget: '',
	website: '',
})

const errors = reactive<Record<string, string>>({})

// Parents switch the tab from outside (e.g. "Request a Quote" in a header).
watch(() => props.initialType, (type) => {
	form.type = type
})

const recipient_options = computed<SelectOption[]>(() => {
	if (props.professional || !props.recipients.length) return []
	return [
		{ label: `${props.company.name} sales inbox`, value: '' },
		...props.recipients.map(person => ({ label: `${person.name} — ${person.job_title}`, value: String(person.id) })),
	]
})

const recipient_label = computed(() => {
	if (props.professional) return `${props.professional.name} at ${props.company.name}`
	const person = props.recipients.find(item => String(item.id) === form.recipient)
	return person ? `${person.name} at ${props.company.name}` : `the ${props.company.name} sales team`
})

const timeline_options: SelectOption[] = [
	{ label: 'As soon as possible', value: 'asap' },
	{ label: 'Within 30 days', value: '30 days' },
	{ label: 'Within 60 days', value: '60 days' },
	{ label: 'Within 90 days', value: '90 days' },
	{ label: 'Later this year', value: 'later' },
]

const type_noun = computed(() => {
	if (form.type === 'quote') return 'quote request'
	if (form.type === 'question') return 'question'
	return 'message'
})

const message_label = computed(() => {
	if (form.type === 'quote') return 'What do you need?'
	if (form.type === 'question') return 'Your question'
	return 'Message'
})

const message_placeholder = computed(() => {
	if (form.type === 'quote') return 'Describe the work, channels, languages, and volumes you have in mind.'
	if (form.type === 'question') return 'Ask anything about their services, locations, or how they work.'
	return 'Introduce yourself and what you’re looking for.'
})

const submit_label = computed(() => {
	if (form.type === 'quote') return 'Request a Quote'
	if (form.type === 'question') return 'Send Question'
	return props.professional ? `Contact ${props.professional.name.split(' ')[0]}` : 'Contact Sales'
})

function validate(): boolean {
	Object.keys(errors).forEach(key => delete errors[key])

	if (!form.sender_name.trim()) errors.sender_name = 'Enter your name.'
	if (!form.sender_email.trim()) errors.sender_email = 'Enter your work email.'
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.sender_email)) errors.sender_email = 'Enter an email address like name@company.com.'
	if (form.message.trim().length < 10) errors.message = 'Add a little more detail so they can reply properly.'

	return Object.keys(errors).length === 0
}

function payload(): InquiryPayload {
	const professional_id = props.professional?.id ?? (form.recipient ? Number(form.recipient) : undefined)

	return {
		type: form.type,
		company_id: props.company.id,
		professional_id,
		sender_name: form.sender_name.trim(),
		sender_email: form.sender_email.trim(),
		sender_company: form.sender_company.trim() || undefined,
		sender_phone: form.sender_phone.trim() || undefined,
		message: form.message.trim(),
		meta: form.type === 'quote'
			? { services: form.services.map(String), timeline: form.timeline || undefined, budget: form.budget || undefined }
			: undefined,
	}
}

function submit() {
	if (!validate()) return

	emit('submit', payload())

	// Static UI: pretend the POST /api/inquiries round trip succeeded.
	status.value = 'sending'
	setTimeout(() => {
		status.value = 'sent'
	}, 700)
}

function reset() {
	form.message = ''
	form.services = []
	form.timeline = ''
	form.budget = ''
	status.value = 'idle'
}
</script>

<style lang="scss" scoped>
.m-inquiry-form {
	&__form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__types {
		align-self: flex-start;
		max-width: 100%;
	}

	&__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	&__legend {
		display: flex;
		align-items: baseline;
		margin-bottom: 12px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
	}

	&__service-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px 16px;
	}

	// Off-screen rather than display:none, which some bots skip.
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
		gap: 12px 20px;
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		flex: 1 1 240px;

		.m-icon {
			margin-top: 3px;
		}
	}

	// --- Sent --------------------------------------------------
	&__sent {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 8px 0;
	}

	&__sent-icon {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--success-soft);
		color: var(--success);
	}
}

@media only screen and (max-width: 600px) {
	.m-inquiry-form {
		&__row,
		&__service-list {
			grid-template-columns: 1fr;
		}
	}
}
</style>
