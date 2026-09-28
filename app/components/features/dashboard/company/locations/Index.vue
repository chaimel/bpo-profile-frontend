<template>
	<MPage
		id="company-locations"
		class="locations"
		title="Locations"
		:description="`Where ${props.company.name} operates. Buyers searching a country, region or city find you when one of your locations is inside it.`"
	>
		<div class="locations__layout">
			<form class="locations__form" novalidate @submit.prevent="save">
				<List
					:id-prefix="`${id_prefix}-list`"
					:location-ids="form.location_ids"
					:hq-id="form.hq_location_id"
					@set-hq="setHq"
					@remove="remove"
				/>

				<Add
					:id-prefix="`${id_prefix}-add`"
					:existing-ids="form.location_ids"
					@add="add"
				/>

				<SaveBar :state="save_state" :dirty="is_dirty" :error-count="hq_error ? 1 : 0" />
			</form>

			<Guide class="locations__aside" />
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import SaveBar from '~/components/features/dashboard/SaveBar.vue'
import type { EditableCompany } from '~/types/features/dashboard'
import Add from './Add.vue'
import Guide from './Guide.vue'
import List from './List.vue'

// PUT /api/dashboard/companies/{companyId}/locations replaces the list
// and the headquarters together. HQ is null or one of location_ids, so
// the UI never lets them disagree (docs/DATABASE.md §4.6).
interface Props {
	company: EditableCompany
	// 'error' previews a failed save (?state=error)
	state?: 'ready' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
})

const id_prefix = 'company-locations'

const form = reactive({
	location_ids: [...props.company.location_ids],
	hq_location_id: props.company.hq_location_id,
})

const save_state = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')
const is_dirty = ref(false)

// A backstop only: the list resolves HQ before anything is removed.
const hq_error = computed(() =>
	form.hq_location_id !== null && !form.location_ids.includes(form.hq_location_id),
)

watch(form, () => {
	is_dirty.value = true
	if (save_state.value !== 'saving') save_state.value = 'idle'
})

function setHq(id: number | null) {
	if (id === null || form.location_ids.includes(id)) form.hq_location_id = id
}

function remove(id: number) {
	// removing the headquarters needs a new one (or none) chosen first
	if (id === form.hq_location_id) return
	form.location_ids = form.location_ids.filter(location_id => location_id !== id)
}

function add(id: number) {
	if (!form.location_ids.includes(id)) form.location_ids = [...form.location_ids, id]
}

function save() {
	if (hq_error.value) return

	save_state.value = 'saving'
	// Static stand-in for the PUT; a failed save keeps the list as edited.
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
.locations {
	&__layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 300px;
		align-items: start;
		gap: 32px;
	}

	&__form {
		padding: 8px 28px 0;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__aside {
		position: sticky;
		top: 88px;
	}
}

@media only screen and (max-width: 1200px) {
	.locations {
		&__layout {
			grid-template-columns: minmax(0, 1fr);
		}

		&__aside {
			position: static;
		}
	}
}

@media only screen and (max-width: 600px) {
	.locations__form {
		padding: 0 16px;
	}
}
</style>
