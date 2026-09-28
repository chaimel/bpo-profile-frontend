<template>
	<MPage
		id="company-services"
		class="services"
		title="Services & expertise"
		:description="`What ${props.company.name} offers and how it delivers. Buyers filter search results by every one of these, so choose what your teams actually do.`"
	>
		<form class="services__form" novalidate @submit.prevent="save">
			<Offer
				v-model:service-ids="form.service_ids"
				v-model:industry-ids="form.industry_ids"
				:id-prefix="id_prefix"
			/>

			<Delivery
				v-model:capability-ids="form.capability_ids"
				v-model:language-ids="form.language_ids"
				v-model:technology-ids="form.technology_ids"
				:id-prefix="id_prefix"
				:facts-path="`/dashboard/companies/${props.company.id}#company-profile-facts`"
			/>

			<SaveBar :state="save_state" :dirty="is_dirty" />
		</form>

		<Certifications
			id-prefix="company-certifications"
			:certifications="props.company.certifications"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import SaveBar from '~/components/features/dashboard/SaveBar.vue'
import type { EditableCompany } from '~/types/features/dashboard'
import Certifications from './certifications/Index.vue'
import Delivery from './Delivery.vue'
import Offer from './Offer.vue'

// PUT /api/dashboard/companies/{companyId}/taxonomies replaces all five
// lists at once. Certifications have their own endpoints and save
// immediately, so they sit outside this form.
interface Props {
	company: EditableCompany
	// 'error' previews a failed save (?state=error)
	state?: 'ready' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
})

const id_prefix = 'company-services'

const form = reactive({
	service_ids: [...props.company.service_ids],
	industry_ids: [...props.company.industry_ids],
	capability_ids: [...props.company.capability_ids],
	language_ids: [...props.company.language_ids],
	technology_ids: [...props.company.technology_ids],
})

const save_state = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')
const is_dirty = ref(false)

watch(form, () => {
	is_dirty.value = true
	if (save_state.value !== 'saving') save_state.value = 'idle'
})

function save() {
	save_state.value = 'saving'
	// Static stand-in for the PUT; a failed save keeps every choice.
	setTimeout(() => {
		if (props.state === 'error') {
			save_state.value = 'failed'
			return
		}
		save_state.value = 'saved'
		is_dirty.value = false
	}, 600)
}
</script>

<style lang="scss" scoped>
.services {
	&__form {
		padding: 8px 28px 0;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}
}

@media only screen and (max-width: 600px) {
	.services__form {
		padding: 0 16px;
	}
}
</style>
