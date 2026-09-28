<template>
	<div class="m-company-picker">
		<MInput
			:id="`${props.idPrefix}-search`"
			v-model="query"
			:name="`${props.idPrefix}_search`"
			type="search"
			autocomplete="off"
			:has-error="Boolean(props.error)"
		>
			<template #label>Company</template>
			<template #inner-left>
				<MIcon name="light-search" size="sm" />
			</template>
			<template #hint>Search the companies listed on BPO Profile, then choose yours.</template>
			<template #error>{{ props.error }}</template>
		</MInput>

		<MText v-if="selected" size="small" color="--text-primary" class="m-company-picker__selected">
			<MIcon name="light-check-circle" size="sm" color="success" />
			<span>Selected: <strong>{{ selected.name }}</strong></span>
		</MText>

		<MText size="xsmall" color="--text-muted" role="status" class="m-company-picker__status">{{ status_text }}</MText>

		<div v-if="matches.length" class="m-company-picker__list" role="radiogroup" aria-label="Matching companies">
			<MRadio
				v-for="company in matches"
				:id="`${props.idPrefix}-${company.id}`"
				:key="company.id"
				:model-value="selected_value"
				name="company_id"
				:value="String(company.id)"
				:class="['m-company-picker__option', { 'm-company-picker__option--selected': company.id === props.modelValue }]"
				@update:model-value="select"
			>
				{{ company.name }}
				<template v-if="company.hq" #description>{{ locationLabel(company.hq) }}</template>
			</MRadio>
		</div>

		<MText size="small" color="--text-secondary">
			Can’t find your company? It needs a listing before you can join it. Ask your company’s admin to invite
			you, or
			<button type="button" class="m-company-picker__switch" @click="emit('create-company')">
				create your company’s listing
			</button>.
		</MText>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CompanyCard } from '~/types/features/directory'
import { locationLabel, pluralize } from '~/utils/format'

// A filter field over a native radio group: no custom combobox to learn,
// arrow keys move the choice, and the filter never loses the selection.
// Used by registration and onboarding, where a sales professional joins
// the company they work for.
interface Props {
	idPrefix: string
	modelValue: number | null
	companies: CompanyCard[]
	error?: string
}

const props = withDefaults(defineProps<Props>(), {
	error: '',
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: number): void
	(_e: 'create-company'): void
}>()

const query = ref('')

const term = computed(() => query.value.trim().toLowerCase())

const matches = computed(() =>
	props.companies
		.filter((company) => {
			if (!term.value) return true
			const haystack = [company.name, company.hq?.name, company.hq?.country].join(' ').toLowerCase()
			return haystack.includes(term.value)
		})
		.sort((a, b) => a.name.localeCompare(b.name)),
)

const selected = computed(() => props.companies.find(company => company.id === props.modelValue))
const selected_value = computed(() => (props.modelValue === null ? '' : String(props.modelValue)))

const status_text = computed(() => {
	const count = matches.value.length
	if (!term.value) return `${pluralize(count, 'company', 'companies')} on BPO Profile.`
	if (!count) return `No companies match “${query.value.trim()}”.`
	return `${pluralize(count, 'company', 'companies')} ${count === 1 ? 'matches' : 'match'} “${query.value.trim()}”.`
})

function select(value: string) {
	const id = Number(value)
	if (Number.isInteger(id)) emit('update:modelValue', id)
}
</script>

<style lang="scss" scoped>
.m-company-picker {
	display: flex;
	flex-direction: column;
	gap: 10px;

	&__selected {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);
	}

	&__status {
		font-family: var(--font-ui);
	}

	&__list {
		max-height: 272px;
		overflow-y: auto;
		border-radius: var(--radius-sm);
		box-shadow: inset 0 0 0 1px var(--border-strong);
	}

	&__option {
		align-items: center;
		padding: 12px 14px;
		border-bottom: var(--rule);

		&:last-child {
			border-bottom: 0;
		}

		&:hover {
			background: var(--canvas);
		}

		&--selected,
		&--selected:hover {
			background: var(--brand-tint);
		}
	}

	// a link-styled button inside a sentence: it takes the sentence's font
	&__switch {
		font-weight: 600;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;

		&:hover {
			color: var(--brand-deep);
		}
	}
}
</style>
