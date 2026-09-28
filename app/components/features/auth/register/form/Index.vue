<template>
	<form ref="form_ref" class="form" novalidate @submit.prevent="submit">
		<header class="form__head">
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="form__title">
				Create your account
			</MHeading>
			<MText size="large" color="--text-secondary">
				Free for BPO companies and their sales professionals. Buyers never need an account.
			</MText>
		</header>

		<GoogleSignIn intent="register" />

		<PathChoice v-model="path" />

		<Details
			v-model:first-name="form.first_name"
			v-model:last-name="form.last_name"
			v-model:email="form.email"
			v-model:password="form.password"
			v-model:password-confirmation="form.password_confirmation"
			:errors="errors"
			:email-hint="email_hints[path]"
		/>

		<fieldset v-if="path === 'company'" class="form__group">
			<legend class="form__legend">Your company</legend>

			<MInput
				id="register-company-name"
				v-model="form.company_name"
				name="company_name"
				autocomplete="organization"
				:has-error="Boolean(errors.company_name)"
			>
				<template #label>Company name</template>
				<template #hint>You’ll add services, locations and your team after you sign in.</template>
				<template #error>{{ errors.company_name }}</template>
			</MInput>

			<MText size="small" color="--text-secondary" class="form__note">
				<MIcon name="light-file-edit" size="sm" color="brand-deep" class="form__note-icon" />
				Your listing starts as a private draft. Nothing is published until you submit it and BPO Profile reviews it.
			</MText>
		</fieldset>

		<fieldset v-else-if="path === 'professional'" class="form__group">
			<legend class="form__legend">Where you work</legend>

			<MCompanyPicker
				v-model="form.company_id"
				id-prefix="register-company"
				:companies="props.companies"
				:error="errors.company_id"
				@create-company="switchToCompany"
			/>

			<MInput
				id="register-job-title"
				v-model="form.job_title"
				name="job_title"
				autocomplete="organization-title"
				:has-error="Boolean(errors.job_title)"
			>
				<template #label>Job title</template>
				<template #hint>As it should appear on your profile, e.g. Director of Business Development.</template>
				<template #error>{{ errors.job_title }}</template>
			</MInput>

			<MText size="small" color="--text-secondary" class="form__note">
				<MIcon name="light-user-check" size="sm" color="brand-deep" class="form__note-icon" />
				{{ reviewer }} reviews your affiliation before your profile can be published. Until then it’s a
				private draft that only you can edit.
			</MText>
		</fieldset>

		<MAlert v-else tone="info">
			<template #title>Accepting an invitation or a claim?</template>
			Use the email address your invitation or claim approval was sent to — only that address can accept it.
			{{ props.redirect ? 'After you sign in, we’ll take you straight back to it.' : 'After you sign in, open the link in that email again to accept it.' }}
		</MAlert>

		<div class="form__terms">
			<MCheckbox id="register-terms" v-model="form.terms" name="terms" :has-error="Boolean(errors.terms)">
				I agree to the
				<NuxtLink to="/terms" target="_blank" class="form__link">Terms of Service</NuxtLink>
				and
				<NuxtLink to="/privacy" target="_blank" class="form__link">Privacy Policy</NuxtLink><span class="sr-only"> (both open in a new tab)</span>.
				<template #error>{{ errors.terms }}</template>
			</MCheckbox>
		</div>

		<MButton type="submit" size="lg" block>{{ submit_labels[path] }}</MButton>

		<MText size="small" color="--text-secondary" align="center" class="form__alt">
			Already have an account?
			<NuxtLink :to="sign_in_link" class="form__link">Sign in</NuxtLink>
		</MText>
	</form>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, reactive, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { authPolicy } from '~/data/features/onboarding'
import MCompanyPicker from '~/components/core/company/MCompanyPicker.vue'
import type { CompanyCard } from '~/types/features/directory'
import type { AccountFields, RegisterPath, RegisterSubmission } from '~/types/features/onboarding'
import GoogleSignIn from '../../GoogleSignIn.vue'
import Details from './Details.vue'
import PathChoice from './PathChoice.vue'

interface Props {
	type?: RegisterPath
	companies: CompanyCard[]
	redirect?: string
}

const props = withDefaults(defineProps<Props>(), {
	type: 'company',
	redirect: undefined,
})

const emit = defineEmits<{
	(_e: 'submit', _submission: RegisterSubmission): void
}>()

type RegisterField = keyof AccountFields | 'company_name' | 'company_id' | 'job_title' | 'terms'
type RegisterErrors = Partial<Record<RegisterField, string>>

const submit_labels: Record<RegisterPath, string> = {
	company: 'Create company account',
	professional: 'Create sales profile',
	account: 'Create account',
}

const email_hints: Record<RegisterPath, string> = {
	company: 'Use your work address. Sign-in codes are sent here.',
	professional: 'Use your work address. Sign-in codes are sent here.',
	account: 'Use the address your invitation or claim approval was sent to.',
}

const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form_ref = ref<HTMLFormElement | null>(null)
const heading_ref = ref<ComponentPublicInstance | null>(null)

const path = ref<RegisterPath>(props.type)
const is_attempted = ref(false)

const form = reactive({
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	password_confirmation: '',
	company_name: '',
	company_id: null as number | null,
	job_title: '',
	terms: false,
})

// ?type= can change while the page stays open (the header's Get Listed).
watch(() => props.type, (type) => {
	path.value = type
})

const reviewer = computed(() => props.companies.find(company => company.id === form.company_id)?.name ?? 'Your company')

const sign_in_link = computed<RouteLocationRaw>(() => ({
	path: '/login',
	query: props.redirect ? { redirect: props.redirect } : undefined,
}))

function validate(): RegisterErrors {
	const result: RegisterErrors = {}
	const email = form.email.trim()
	const min_length = authPolicy.passwordMinLength

	if (!form.first_name.trim()) result.first_name = 'Enter your first name.'
	if (!form.last_name.trim()) result.last_name = 'Enter your last name.'

	if (!email) result.email = 'Enter your work email address.'
	else if (!email_pattern.test(email)) result.email = 'Enter an email address like name@company.com.'

	if (!form.password) result.password = 'Create a password.'
	else if (form.password.length < min_length) result.password = `Use at least ${min_length} characters.`

	if (!form.password_confirmation) result.password_confirmation = 'Enter your password again.'
	else if (form.password_confirmation !== form.password) result.password_confirmation = 'The passwords don’t match. Enter the same password twice.'

	if (path.value === 'company' && !form.company_name.trim()) {
		result.company_name = 'Enter your company’s name.'
	}

	if (path.value === 'professional') {
		if (form.company_id === null) result.company_id = 'Choose the company you work for.'
		if (!form.job_title.trim()) result.job_title = 'Enter your job title.'
	}

	if (!form.terms) result.terms = 'Agree to the Terms of Service and Privacy Policy to create your account.'

	return result
}

// Messages appear after the first submit, then clear as each field is fixed.
const errors = computed<RegisterErrors>(() => (is_attempted.value ? validate() : {}))

// Every field, the terms checkbox included, marks itself aria-invalid.
function focusFirstError() {
	form_ref.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}

function toSubmission(): RegisterSubmission {
	const account: AccountFields = {
		first_name: form.first_name.trim(),
		last_name: form.last_name.trim(),
		email: form.email.trim(),
		password: form.password,
		password_confirmation: form.password_confirmation,
	}

	if (path.value === 'company') {
		return { path: 'company', body: { ...account, company_name: form.company_name.trim() } }
	}

	if (path.value === 'professional') {
		return { path: 'professional', body: { ...account, company_id: Number(form.company_id), job_title: form.job_title.trim() } }
	}

	return { path: 'account', body: account }
}

async function submit() {
	is_attempted.value = true

	if (Object.keys(errors.value).length) {
		await nextTick()
		focusFirstError()
		return
	}

	emit('submit', toSubmission())

	// Passwords leave with the request and are never kept (docs/ARCHITECTURE.md §5).
	form.password = ''
	form.password_confirmation = ''
	is_attempted.value = false
}

async function switchToCompany() {
	path.value = 'company'
	await nextTick()
	document.getElementById('register-company-name')?.focus()
}

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: 32px;

	&__head {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__title:focus {
		outline: none;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__legend {
		padding-bottom: 12px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);
	}

	&__note {
		display: flex;
		gap: 10px;
		padding: 14px 16px;
		border-left: 3px solid var(--brand);
		background: var(--brand-tint);
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	&__terms {
		padding-top: 4px;
	}

	&__link {
		font-weight: 500;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}

	&__alt {
		font-family: var(--font-ui);
	}
}
</style>
