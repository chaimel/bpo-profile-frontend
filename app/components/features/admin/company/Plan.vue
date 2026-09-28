<template>
	<MFormSection
		id="plan"
		class="plan"
		title="Plan"
		description="Assigned manually until billing launches. A plan changes what a company can show, never where it ranks."
	>
		<div class="plan__fields">
			<MSelect
				id="plan-slug"
				v-model="plan"
				name="plan"
				:options="plan_options"
				:disabled="is_deleted"
			>
				<template #label>Plan</template>
			</MSelect>

			<MInput
				id="plan-expires"
				v-model="expires"
				name="plan_expires_at"
				type="date"
				optional
				:disabled="is_deleted"
			>
				<template #label>Expires on</template>
				<template #hint>Leave it empty for no expiry.</template>
			</MInput>
		</div>

		<MAlert tone="neutral">
			Premium never overrides ranking. It can only break a final tie, after relevance, completeness,
			verification, location and service match, and quality.
		</MAlert>

		<div class="plan__actions">
			<MButton :disabled="!is_dirty || is_deleted" @click="save">Save plan</MButton>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import type { PlanSlug } from '~/types/features/directory'
import { formatDate } from '~/utils/format'
import { planLabels, toOptions } from '~/utils/labels'
import type { AdminCompanyDetail } from '~/types/features/admin'

// Phase 1 plan assignment: an active company-audience plan and an
// optional expiry (docs/DATABASE.md §4.2).
interface Props {
	company: AdminCompanyDetail
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminCompanyDetail>, _message: string): void
}>()

const plan_options = toOptions(planLabels)

const plan = ref<string>(props.company.plan)
const expires = ref(toDateInput(props.company.plan_expires_at))

watch(() => [props.company.plan, props.company.plan_expires_at] as const, ([next_plan, next_expiry]) => {
	plan.value = next_plan
	expires.value = toDateInput(next_expiry)
})

const is_deleted = computed(() => Boolean(props.company.deleted_at))

const is_dirty = computed(() =>
	plan.value !== props.company.plan || expires.value !== toDateInput(props.company.plan_expires_at),
)

// "2027-03-01T00:00:00Z" -> "2027-03-01" for the date field
function toDateInput(iso: string | null): string {
	return iso ? iso.slice(0, 10) : ''
}

function isPlan(value: string): value is PlanSlug {
	return value in planLabels
}

function save() {
	if (!isPlan(plan.value)) return
	const next = plan.value
	const plan_expires_at = expires.value ? `${expires.value}T00:00:00Z` : null

	emit(
		'update',
		{ plan: next, plan_expires_at },
		`Plan saved: ${planLabels[next]}, ${plan_expires_at ? `until ${formatDate(plan_expires_at)}` : 'with no expiry'}.`,
	)
}
</script>

<style lang="scss" scoped>
.plan {
	&__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	&__actions {
		display: flex;
		gap: 8px;
	}
}

@media only screen and (max-width: 600px) {
	.plan {
		&__fields {
			grid-template-columns: 1fr;
		}
	}
}
</style>
