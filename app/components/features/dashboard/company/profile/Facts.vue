<template>
	<MFormSection
		:id="`${props.idPrefix}-facts`"
		class="facts"
		title="Company facts"
		description="Buyers filter by company size and work model, so keep these current."
	>
		<MInput
			:id="`${props.idPrefix}-founded`"
			:model-value="props.foundedYear"
			name="founded_year"
			inputmode="numeric"
			autocomplete="off"
			placeholder="e.g. 2014"
			:max-length="4"
			optional
			:has-error="Boolean(props.foundedYearError)"
			class="facts__year"
			@update:model-value="emit('update:foundedYear', $event)"
		>
			<template #label>Year founded</template>
			<template #error>{{ props.foundedYearError }}</template>
		</MInput>

		<div class="facts__row">
			<MSelect
				:id="`${props.idPrefix}-size`"
				:model-value="props.companySize"
				name="company_size"
				:options="companySizeOptions"
				placeholder="Not specified"
				@update:model-value="emit('update:companySize', $event)"
			>
				<template #label>Company size</template>
			</MSelect>

			<MSelect
				:id="`${props.idPrefix}-work-model`"
				:model-value="props.workModel"
				name="work_model"
				:options="workModelOptions"
				placeholder="Not specified"
				@update:model-value="emit('update:workModel', $event)"
			>
				<template #label>Work model</template>
				<template #hint>Onshore, offshore, nearshore, or a hybrid of them.</template>
			</MSelect>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import { companySizeOptions, workModelOptions } from '~/utils/labels'

// "Not specified" saves as the API's `unknown` value.
interface Props {
	idPrefix: string
	foundedYear: string
	companySize: string
	workModel: string
	foundedYearError?: string
}

const props = withDefaults(defineProps<Props>(), {
	foundedYearError: undefined,
})

const emit = defineEmits<{
	(_e: 'update:foundedYear' | 'update:companySize' | 'update:workModel', _value: string): void
}>()
</script>

<style lang="scss" scoped>
.facts {
	&__year {
		max-width: 200px;
	}

	&__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
		align-items: start;
	}
}

// side by side only when the form column fits two full values
@container (min-width: 540px) {
	.facts__row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media only screen and (max-width: 600px) {
	.facts {
		&__year {
			max-width: none;
		}
	}
}
</style>
