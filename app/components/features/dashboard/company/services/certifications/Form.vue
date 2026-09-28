<template>
	<MModal :name="props.name" class="form">
		<template #header>{{ props.certification ? 'Edit certification' : 'Add a certification' }}</template>

		<template #content>
			<form :id="form_id" class="form__fields" novalidate @submit.prevent="submit">
				<MInput
					:id="`${props.idPrefix}-name`"
					v-model="fields.name"
					name="certification_name"
					:max-length="150"
					required
					:has-error="Boolean(errors.name)"
				>
					<template #label>Certification</template>
					<template #hint>As it appears on the certificate, e.g. “ISO/IEC 27001:2022”.</template>
					<template #error>{{ errors.name }}</template>
				</MInput>

				<MInput
					:id="`${props.idPrefix}-issuer`"
					v-model="fields.issuer"
					name="certification_issuer"
					:max-length="150"
					optional
				>
					<template #label>Issued by</template>
					<template #hint>The certification or audit body.</template>
				</MInput>

				<MInput
					:id="`${props.idPrefix}-year`"
					v-model="fields.year"
					name="certification_year"
					inputmode="numeric"
					autocomplete="off"
					:max-length="4"
					optional
					:has-error="Boolean(errors.year)"
					class="form__year"
				>
					<template #label>Year</template>
					<template #hint>When it was awarded or last renewed.</template>
					<template #error>{{ errors.year }}</template>
				</MInput>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.name)">Cancel</MButton>
			<MButton type="submit" :form="form_id">
				{{ props.certification ? 'Save certification' : 'Add certification' }}
			</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Certification } from '~/types/features/directory'

interface Props {
	name: string
	idPrefix: string
	// null adds a new certification
	certification?: Certification | null
}

const props = withDefaults(defineProps<Props>(), {
	certification: null,
})

const emit = defineEmits<{
	(_e: 'save', _value: Omit<Certification, 'id'>): void
}>()

const { closeModal, isOpen } = useModal()

// the footer's submit button sits outside the <form>, so it points at it
const form_id = `${props.idPrefix}-form-fields`

const fields = reactive({ name: '', issuer: '', year: '' })
const errors = reactive<{ name?: string, year?: string }>({})

// Fill the fields each time the dialog opens. 'post' runs after the
// parent has passed down the certification being edited.
watch(() => isOpen(props.name), (open) => {
	if (!open) return
	fields.name = props.certification?.name ?? ''
	fields.issuer = props.certification?.issuer ?? ''
	fields.year = props.certification?.year ? String(props.certification.year) : ''
	errors.name = undefined
	errors.year = undefined
}, { flush: 'post' })

function isYear(value: string): boolean {
	if (!/^\d{4}$/.test(value)) return false
	const year = Number(value)
	return year >= 1950 && year <= new Date().getUTCFullYear()
}

function submit() {
	const name = fields.name.trim()
	const year = fields.year.trim()

	errors.name = name ? undefined : 'Enter the name of the certification.'
	errors.year = !year || isYear(year) ? undefined : 'Enter a four-digit year, like 2024.'
	if (errors.name || errors.year) return

	emit('save', {
		name,
		issuer: fields.issuer.trim() || null,
		year: year ? Number(year) : null,
	})
	closeModal(props.name)
}
</script>

<style lang="scss" scoped>
.form {
	&__fields {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__year {
		max-width: 160px;
	}
}
</style>
