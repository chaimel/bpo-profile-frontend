<template>
	<form
		:class="['m-directory-search', `m-directory-search--${props.variant}`]"
		role="search"
		:aria-label="props.label"
		@submit.prevent="submit"
	>
		<div v-if="props.showModes" class="m-directory-search__modes">
			<MTabs
				v-model="form.mode"
				:tabs="modes"
				label="What are you looking for?"
				variant="segmented"
			/>
		</div>

		<div class="m-directory-search__fields">
			<MInput
				:id="`${props.idPrefix}-q`"
				v-model="form.q"
				class="m-directory-search__keyword"
				name="q"
				type="search"
				autocomplete="off"
				:height="field_height"
				:placeholder="form.mode === 'companies' ? 'Company name or specialty' : 'Name, role, or specialty'"
			>
				<template #label>Keyword</template>
				<template #inner-left>
					<MIcon name="light-search" size="sm" />
				</template>
			</MInput>

			<MSelect
				:id="`${props.idPrefix}-service`"
				v-model="form.service"
				name="service"
				:height="field_height"
				placeholder="Any service"
				:options="service_options"
			>
				<template #label>Service</template>
			</MSelect>

			<MSelect
				:id="`${props.idPrefix}-country`"
				v-model="form.country"
				name="country"
				:height="field_height"
				placeholder="Anywhere"
				:options="country_options"
			>
				<template #label>Location</template>
			</MSelect>

			<MButton type="submit" :size="props.variant === 'hero' ? 'lg' : 'md'" class="m-directory-search__submit">
				<template #prefix>
					<MIcon name="light-search" size="sm" />
				</template>
				{{ form.mode === 'companies' ? 'Find a BPO' : 'Find a Sales Pro' }}
			</MButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { SelectOption, TabItem } from '~/types/base/ui'

const { services } = useCatalogStore()
const { locationsWithCompanies } = useDirectoryStore()

type SearchMode = 'companies' | 'professionals'

interface SearchSubmit {
	mode: SearchMode
	q: string
	service: string
	country: string
}

interface Props {
	idPrefix?: string
	label?: string
	variant?: 'hero' | 'bar'
	showModes?: boolean
	initial?: Partial<SearchSubmit>
}

const props = withDefaults(defineProps<Props>(), {
	idPrefix: 'directory-search',
	label: 'Search the directory',
	variant: 'hero',
	showModes: true,
	initial: () => ({}),
})

const emit = defineEmits<{
	(_e: 'submit', _value: SearchSubmit): void
}>()

// "Find a BPO" stays primary; "Find a Sales Pro" is the second path (PDF p. 23).
const modes: TabItem[] = [
	{ value: 'companies', label: 'BPO companies', icon: 'light-building' },
	{ value: 'professionals', label: 'Sales pros', icon: 'light-user-friends' },
]

const form = reactive<SearchSubmit>({
	mode: props.initial.mode ?? 'companies',
	q: props.initial.q ?? '',
	service: props.initial.service ?? '',
	country: props.initial.country ?? '',
})

const field_height = computed(() => (props.variant === 'hero' ? 52 : 44))

const service_options = computed<SelectOption[]>(() =>
	services.map(service => ({ label: service.name, value: service.slug })),
)

// Only countries that actually have providers are offered.
const country_options = computed<SelectOption[]>(() =>
	locationsWithCompanies()
		.filter(location => location.type === 'country')
		.map(country => ({ label: country.name, value: country.slug })),
)

function submit() {
	emit('submit', { ...form, q: form.q.trim() })
}
</script>

<style lang="scss" scoped>
.m-directory-search {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__fields {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) auto;
		align-items: end;
		gap: 12px;
	}

	&__submit {
		min-width: 168px;
	}

	// --- Hero: a raised panel on the white band ----------------
	&--hero {
		padding: 20px;
		border-radius: var(--radius-lg);
		background: var(--white);
		box-shadow:
			0 0 0 1px var(--border),
			var(--shadow-card);
	}

	// --- Bar: flush, for page headers --------------------------
	&--bar {
		.m-directory-search__submit {
			min-width: 0;
		}
	}
}

@media only screen and (max-width: 1024px) {
	.m-directory-search {
		&__fields {
			grid-template-columns: 1fr 1fr;
		}

		&__keyword {
			grid-column: 1 / -1;
		}

		&__submit {
			grid-column: 1 / -1;
			width: 100%;
		}
	}
}

@media only screen and (max-width: 600px) {
	.m-directory-search {
		&--hero {
			padding: 16px;
		}

		&__fields {
			grid-template-columns: 1fr;
		}
	}
}
</style>
