<template>
	<MModal :name="props.modal" :max-width="560">
		<template #header>Create a roster profile</template>

		<template #content>
			<form id="create-professional-form" class="create" novalidate @submit.prevent="submit">
				<MText size="medium" color="--text-secondary" class="create__intro">
					A draft profile a company manages for someone on its team. It has an approved affiliation and
					no login until the person accepts an invitation from the company.
				</MText>

				<MSelect
					id="create-professional-company"
					v-model="company_id"
					name="company_id"
					:options="company_options"
					placeholder="Choose a company"
					required
					:has-error="Boolean(errors.company)"
				>
					<template #label>Company</template>
					<template #error>{{ errors.company }}</template>
				</MSelect>

				<div class="create__names">
					<MInput
						id="create-professional-first"
						v-model="first_name"
						name="first_name"
						autocomplete="off"
						required
						:has-error="Boolean(errors.first)"
					>
						<template #label>First name</template>
						<template #error>{{ errors.first }}</template>
					</MInput>

					<MInput
						id="create-professional-last"
						v-model="last_name"
						name="last_name"
						autocomplete="off"
						required
						:has-error="Boolean(errors.last)"
					>
						<template #label>Last name</template>
						<template #error>{{ errors.last }}</template>
					</MInput>
				</div>

				<MInput
					id="create-professional-title"
					v-model="job_title"
					name="job_title"
					autocomplete="off"
					placeholder="e.g. Business Development Manager"
					required
					:has-error="Boolean(errors.title)"
				>
					<template #label>Job title</template>
					<template #error>{{ errors.title }}</template>
				</MInput>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.modal)">Cancel</MButton>
			<MButton type="submit" form="create-professional-form">Create roster profile</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import type { AdminCompanyRow, AdminProfessionalPayload } from '~/types/features/admin'

// POST /api/admin/professionals: a draft roster profile in a company,
// with approved affiliation and no linked user (docs/API.md §5, §8).
interface Props {
	// the MModal name
	modal: string
	companies: AdminCompanyRow[]
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'create', _payload: AdminProfessionalPayload): void
}>()

const { closeModal, isOpen } = useModal()

const company_id = ref('')
const first_name = ref('')
const last_name = ref('')
const job_title = ref('')
const errors = reactive({ company: '', first: '', last: '', title: '' })

const company_options = computed<SelectOption[]>(() =>
	props.companies
		.filter(company => !company.deleted_at)
		.map(company => ({ label: company.name, value: String(company.id) }))
		.sort((a, b) => a.label.localeCompare(b.label)),
)

const is_open = computed(() => isOpen(props.modal))

// start clean every time the dialog opens
watch(is_open, (open) => {
	if (!open) return
	company_id.value = ''
	first_name.value = ''
	last_name.value = ''
	job_title.value = ''
	Object.assign(errors, { company: '', first: '', last: '', title: '' })
})

function validate(): boolean {
	errors.company = company_id.value ? '' : 'Choose the company this person works for.'
	errors.first = first_name.value.trim() ? '' : 'Enter a first name.'
	errors.last = last_name.value.trim() ? '' : 'Enter a last name.'
	errors.title = job_title.value.trim() ? '' : 'Enter a job title.'
	return !errors.company && !errors.first && !errors.last && !errors.title
}

async function submit() {
	if (!validate()) {
		await nextTick()
		const fields: [string, string][] = [
			['create-professional-company', errors.company],
			['create-professional-first', errors.first],
			['create-professional-last', errors.last],
			['create-professional-title', errors.title],
		]
		const field_id = fields.find(([, message]) => message)?.[0]
		if (field_id) document.getElementById(field_id)?.focus()
		return
	}

	emit('create', {
		company_id: Number(company_id.value),
		first_name: first_name.value.trim(),
		last_name: last_name.value.trim(),
		job_title: job_title.value.trim(),
	})
	closeModal(props.modal)
}
</script>

<style lang="scss" scoped>
.create {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__names {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
}

@media only screen and (max-width: 600px) {
	.create {
		&__names {
			grid-template-columns: 1fr;
		}
	}
}
</style>
