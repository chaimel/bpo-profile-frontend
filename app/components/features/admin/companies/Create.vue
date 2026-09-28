<template>
	<MModal :name="props.modal" :max-width="560">
		<template #header>Create a company</template>

		<template #content>
			<form id="create-company-form" class="create" novalidate @submit.prevent="submit">
				<MText size="medium" color="--text-secondary" class="create__intro">
					This creates a draft, unclaimed listing. It stays hidden until you publish it, and nobody
					can manage it until someone’s claim is approved and accepted.
				</MText>

				<MInput
					id="create-company-name"
					v-model="name"
					name="name"
					autocomplete="off"
					required
					:has-error="Boolean(errors.name)"
				>
					<template #label>Company name</template>
					<template #error>{{ errors.name }}</template>
				</MInput>

				<MInput
					id="create-company-website"
					v-model="website"
					name="website_url"
					type="url"
					placeholder="https://"
					optional
					:has-error="Boolean(errors.website)"
				>
					<template #label>Website</template>
					<template #hint>Helps reviewers confirm who runs the company when someone claims it.</template>
					<template #error>{{ errors.website }}</template>
				</MInput>

				<div class="create__hq">
					<MLocationSelect
						v-model="hq"
						id-prefix="create-company-hq"
						legend="Headquarters"
						any-label="Not set yet"
						countries-only
					/>
					<MText size="small" color="--text-muted" class="create__hint">
						Optional. The company can add cities and operating sites later.
					</MText>
				</div>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.modal)">Cancel</MButton>
			<MButton type="submit" form="create-company-form">Create draft company</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import MLocationSelect from '~/components/core/location/MLocationSelect.vue'
import type { AdminCompanyPayload } from '~/types/features/admin'

// POST /api/admin/companies: a draft, unclaimed listing. Ownership only
// ever comes from the claim workflow (docs/API.md §8).
interface Props {
	// the MModal name
	modal: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'create', _payload: AdminCompanyPayload): void
}>()

const { closeModal, isOpen } = useModal()

const name = ref('')
const website = ref('')
const hq = ref('')
const errors = reactive({ name: '', website: '' })

const is_open = computed(() => isOpen(props.modal))

// start clean every time the dialog opens
watch(is_open, (open) => {
	if (!open) return
	name.value = ''
	website.value = ''
	hq.value = ''
	errors.name = ''
	errors.website = ''
})

function validate(): boolean {
	const url = website.value.trim()
	errors.name = name.value.trim() ? '' : 'Enter the company’s name.'
	errors.website = !url || /^https?:\/\/[^\s.]+\.\S+$/.test(url) ? '' : 'Enter the full address, starting with https://'
	return !errors.name && !errors.website
}

async function submit() {
	if (!validate()) {
		await nextTick()
		document.getElementById(errors.name ? 'create-company-name' : 'create-company-website')?.focus()
		return
	}

	emit('create', {
		name: name.value.trim(),
		website_url: website.value.trim() || null,
		hq_location_id: hq.value ? Number(hq.value) : null,
	})
	closeModal(props.modal)
}
</script>

<style lang="scss" scoped>
.create {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__hq {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
}
</style>
