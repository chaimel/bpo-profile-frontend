<template>
	<MModal :name="props.name" class="add-member">
		<template #header>Add a team member</template>

		<template #content>
			<form :id="form_id" class="add-member__fields" novalidate @submit.prevent="submit">
				<MText color="--text-secondary" class="add-member__intro">
					This creates a draft profile that {{ props.companyName }} manages. It has no login until you invite the person by email.
				</MText>

				<div class="add-member__row">
					<MInput
						:id="`${props.name}-first`"
						v-model="fields.first_name"
						name="first_name"
						autocomplete="off"
						:max-length="100"
						required
						:has-error="Boolean(errors.first_name)"
					>
						<template #label>First name</template>
						<template #error>{{ errors.first_name }}</template>
					</MInput>

					<MInput
						:id="`${props.name}-last`"
						v-model="fields.last_name"
						name="last_name"
						autocomplete="off"
						:max-length="100"
						required
						:has-error="Boolean(errors.last_name)"
					>
						<template #label>Last name</template>
						<template #error>{{ errors.last_name }}</template>
					</MInput>
				</div>

				<MInput
					:id="`${props.name}-title`"
					v-model="fields.job_title"
					name="job_title"
					autocomplete="off"
					:max-length="150"
					required
					:has-error="Boolean(errors.job_title)"
				>
					<template #label>Job title</template>
					<template #error>{{ errors.job_title }}</template>
				</MInput>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.name)">Cancel</MButton>
			<MButton type="submit" :form="form_id">Add team member</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

// POST .../team: first name, last name and job title make a draft roster
// profile with approved affiliation and no user (docs/API.md §5).
interface Props {
	name: string
	companyName: string
}

const props = defineProps<Props>()

interface NewMember {
	first_name: string
	last_name: string
	job_title: string
}

const emit = defineEmits<{
	(_e: 'add', _value: NewMember): void
}>()

const { closeModal, isOpen } = useModal()

// the footer's submit button sits outside the <form>, so it points at it
const form_id = `${props.name}-fields`

const fields = reactive<NewMember>({ first_name: '', last_name: '', job_title: '' })
const errors = reactive<Partial<Record<keyof NewMember, string>>>({})

// A fresh form every time the dialog opens.
watch(() => isOpen(props.name), (open) => {
	if (!open) return
	fields.first_name = ''
	fields.last_name = ''
	fields.job_title = ''
	errors.first_name = undefined
	errors.last_name = undefined
	errors.job_title = undefined
})

function submit() {
	const value: NewMember = {
		first_name: fields.first_name.trim(),
		last_name: fields.last_name.trim(),
		job_title: fields.job_title.trim(),
	}

	errors.first_name = value.first_name ? undefined : 'Enter their first name.'
	errors.last_name = value.last_name ? undefined : 'Enter their last name.'
	errors.job_title = value.job_title ? undefined : 'Enter their job title, like “Account Manager”.'
	if (errors.first_name || errors.last_name || errors.job_title) return

	emit('add', value)
	closeModal(props.name)
}
</script>

<style lang="scss" scoped>
.add-member {
	&__fields {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
}

@media only screen and (max-width: 600px) {
	.add-member__row {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
