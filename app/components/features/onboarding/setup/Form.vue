<template>
	<form ref="form_ref" class="form" novalidate @submit.prevent="submit">
		<header class="form__head">
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="form__title">
				Set up your account
			</MHeading>
			<MText size="large" color="--text-secondary">
				You’re signed in as <strong class="form__email">{{ props.account.email }}</strong>. Tell us your name
				and how you’ll use BPO Profile.
			</MText>
		</header>

		<fieldset class="form__group">
			<legend class="form__legend">Your name</legend>

			<div class="form__names">
				<MInput
					id="onboarding-first-name"
					v-model="form.first_name"
					name="first_name"
					autocomplete="given-name"
					:has-error="Boolean(errors.first_name)"
				>
					<template #label>First name</template>
					<template #error>{{ errors.first_name }}</template>
				</MInput>

				<MInput
					id="onboarding-last-name"
					v-model="form.last_name"
					name="last_name"
					autocomplete="family-name"
					:has-error="Boolean(errors.last_name)"
				>
					<template #label>Last name</template>
					<template #error>{{ errors.last_name }}</template>
				</MInput>
			</div>
		</fieldset>

		<fieldset class="form__group">
			<legend class="form__legend">How will you use BPO Profile?</legend>

			<div class="form__paths">
				<MRadio
					v-for="option in paths"
					:id="`onboarding-path-${option.value}`"
					:key="option.value"
					v-model="path_model"
					name="onboarding_path"
					:value="option.value"
					variant="card"
				>
					{{ option.label }}
					<template #description>{{ option.description }}</template>
					<template #meta>
						<MIcon :name="option.icon" size="md" color="text-muted" />
					</template>
				</MRadio>
			</div>
		</fieldset>

		<fieldset v-if="path === 'company'" class="form__group">
			<legend class="form__legend">Your company</legend>

			<MInput
				id="onboarding-company-name"
				v-model="form.company_name"
				name="company_name"
				autocomplete="organization"
				:has-error="Boolean(errors.company_name)"
			>
				<template #label>Company name</template>
				<template #hint>You’ll add services, locations and your team next.</template>
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
				id-prefix="onboarding-company"
				:companies="props.companies"
				:error="errors.company_id"
				@create-company="switchToCompany"
			/>

			<MInput
				id="onboarding-job-title"
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

		<!-- Claims and invitations run through their own links, not this form. -->
		<MAlert v-else tone="info">
			<template #title>Accepting an invitation or a claim?</template>
			Open the link in the email we sent to {{ props.account.email }}. It brings you back here, signed in, to
			accept it. Want to take over a listing that already exists? Find it and request ownership.
			<template #actions>
				<MButton variant="outline" size="sm" to="/claim">Find your company’s listing</MButton>
			</template>
		</MAlert>

		<MButton v-if="path !== 'invite'" type="submit" size="lg" block>{{ submit_labels[path] }}</MButton>
	</form>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, reactive, ref } from 'vue'
import MCompanyPicker from '~/components/core/company/MCompanyPicker.vue'
import type { MIconName } from '~/types/base/ui'
import type { CompanyCard } from '~/types/features/directory'
import type { OnboardingAccount, OnboardingSubmission } from '~/types/features/onboarding'

type OnboardingPath = 'company' | 'professional' | 'invite'
type OnboardingField = 'first_name' | 'last_name' | 'company_name' | 'company_id' | 'job_title'

interface Props {
	account: OnboardingAccount
	companies: CompanyCard[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'submit', _submission: OnboardingSubmission): void
}>()

// The same choices as registration, minus the password (docs/PLAN.md §4.5).
const paths: { value: OnboardingPath, label: string, description: string, icon: MIconName }[] = [
	{
		value: 'company',
		label: 'I represent a BPO company',
		description: 'Create your company’s listing. You’ll own it, and can add your sales team next.',
		icon: 'light-building',
	},
	{
		value: 'professional',
		label: 'I’m a sales professional',
		description: 'Create your sales profile and connect it to the company you work for.',
		icon: 'light-id-card',
	},
	{
		value: 'invite',
		label: 'I was invited or I’m claiming a listing',
		description: 'Accept a team invitation, or take over a company listing that already exists.',
		icon: 'light-envelope-text',
	},
]

const submit_labels: Record<Exclude<OnboardingPath, 'invite'>, string> = {
	company: 'Create company listing',
	professional: 'Create sales profile',
}

const form_ref = ref<HTMLFormElement | null>(null)
const heading_ref = ref<ComponentPublicInstance | null>(null)

const path = ref<OnboardingPath>('company')
const is_attempted = ref(false)

// Google-created accounts have no name yet; others arrive filled in.
const form = reactive({
	first_name: props.account.first_name ?? '',
	last_name: props.account.last_name ?? '',
	company_name: '',
	company_id: null as number | null,
	job_title: '',
})

// MRadio reports plain strings; only the known paths get through.
const path_model = computed<string>({
	get: () => path.value,
	set: (value) => {
		const match = paths.find(option => option.value === value)
		if (match) path.value = match.value
	},
})

const reviewer = computed(() => props.companies.find(company => company.id === form.company_id)?.name ?? 'Your company')

function validate(): Partial<Record<OnboardingField, string>> {
	const result: Partial<Record<OnboardingField, string>> = {}

	if (!form.first_name.trim()) result.first_name = 'Enter your first name.'
	if (!form.last_name.trim()) result.last_name = 'Enter your last name.'

	if (path.value === 'company' && !form.company_name.trim()) {
		result.company_name = 'Enter your company’s name.'
	}

	if (path.value === 'professional') {
		if (form.company_id === null) result.company_id = 'Choose the company you work for.'
		if (!form.job_title.trim()) result.job_title = 'Enter your job title.'
	}

	return result
}

// Messages appear after the first submit, then clear as each field is fixed.
const errors = computed(() => (is_attempted.value ? validate() : {}))

function toSubmission(): OnboardingSubmission | null {
	const names = { first_name: form.first_name.trim(), last_name: form.last_name.trim() }

	if (path.value === 'company') {
		return { path: 'company', body: { ...names, company_name: form.company_name.trim() } }
	}
	if (path.value === 'professional' && form.company_id !== null) {
		return { path: 'professional', body: { ...names, company_id: form.company_id, job_title: form.job_title.trim() } }
	}
	return null
}

async function submit() {
	is_attempted.value = true

	if (Object.keys(errors.value).length) {
		await nextTick()
		form_ref.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
		return
	}

	const submission = toSubmission()
	if (submission) emit('submit', submission)
}

async function switchToCompany() {
	path.value = 'company'
	await nextTick()
	document.getElementById('onboarding-company-name')?.focus()
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

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
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

	&__names {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	&__paths {
		display: flex;
		flex-direction: column;
		gap: 10px;
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
}

@media only screen and (max-width: 600px) {
	.form {
		&__names {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>
