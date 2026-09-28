<template>
	<MFormSection
		:id="props.idPrefix"
		class="list"
		title="Operating locations"
		description="Every country, region or city your teams work from. Your headquarters appears on your search card and profile."
	>
		<p class="sr-only" role="status">{{ announcement }}</p>

		<MAlert v-if="rows.length && props.hqId === null" tone="neutral">
			No headquarters is set. Choose one below so buyers can see where you’re based.
		</MAlert>

		<ul v-if="rows.length" class="list__items">
			<li
				v-for="row in rows"
				:key="row.id"
				:class="['list__item', { 'list__item--hq': row.is_hq }]"
			>
				<div class="list__row">
					<span class="list__icon">
						<MIcon :name="row.is_hq ? 'light-building' : 'light-map-marker'" size="sm" />
					</span>

					<div class="list__place">
						<span class="list__title">
							<span class="list__name">{{ row.name }}</span>
							<MBadge v-if="row.is_hq" tone="brand" icon="light-check-circle" size="sm">Headquarters</MBadge>
						</span>
						<span class="list__meta">{{ row.meta }}</span>
					</div>

					<div class="list__actions">
						<MButton v-if="!row.is_hq" variant="text" size="sm" @click="makeHq(row)">
							Set as headquarters<span class="sr-only">: {{ row.name }}</span>
						</MButton>
						<MButton
							variant="text"
							size="sm"
							:aria-expanded="row.is_hq ? is_resolving : undefined"
							:aria-controls="row.is_hq ? `${props.idPrefix}-resolve` : undefined"
							@click="startRemove(row)"
						>
							Remove<span class="sr-only"> {{ row.name }}</span>
						</MButton>
					</div>
				</div>

				<!-- the headquarters can't simply vanish: settle it first -->
				<div v-if="row.is_hq && is_resolving" :id="`${props.idPrefix}-resolve`" class="list__resolve">
					<MAlert tone="warning">
						<template #title>{{ row.name }} is your headquarters</template>
						Choose a new headquarters before you remove it, or remove it and leave headquarters empty for now.
						<template #actions>
							<div class="list__resolve-body">
								<MSelect
									v-if="replacement_options.length"
									:id="`${props.idPrefix}-replacement`"
									v-model="replacement"
									:name="`${props.idPrefix}-replacement`"
									:options="replacement_options"
									placeholder="Choose a location"
									class="list__replacement"
								>
									<template #label>New headquarters</template>
								</MSelect>

								<div class="list__resolve-buttons">
									<MButton
										v-if="replacement_options.length"
										size="sm"
										:disabled="!replacement"
										@click="confirmRemove(row, Number(replacement))"
									>
										Move headquarters and remove
									</MButton>
									<MButton variant="neutral" size="sm" @click="confirmRemove(row, null)">
										Remove and clear headquarters
									</MButton>
									<MButton variant="text" size="sm" @click="cancelRemove">Cancel</MButton>
								</div>
							</div>
						</template>
					</MAlert>
				</div>
			</li>
		</ul>

		<MEmptyState v-else icon="light-map-marker" variant="plain" heading-level="3">
			<template #title>No operating locations yet</template>
			Add at least one below, so buyers searching by country, region or city can find you.
		</MEmptyState>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import type { SelectOption } from '~/types/base/ui'
import type { LocationItem, LocationType } from '~/types/features/directory'

const { countryOf, findLocation, regionOf } = useCatalogStore()

interface Props {
	idPrefix: string
	locationIds: number[]
	hqId: number | null
}

const props = defineProps<Props>()

// set-hq always comes before a remove, so the parent never holds an HQ
// that isn't in the list; null clears the headquarters.
const emit = defineEmits<{
	(_e: 'set-hq', _id: number | null): void
	(_e: 'remove', _id: number): void
}>()

interface LocationRow {
	id: number
	name: string
	meta: string
	is_hq: boolean
}

const type_labels: Record<LocationType, string> = {
	country: 'Country',
	region: 'Region',
	city: 'City',
}

const is_resolving = ref(false)
const replacement = ref('')
const announcement = ref('')

// Headquarters first, then the rest in the order they were added.
const rows = computed<LocationRow[]>(() =>
	props.locationIds
		.map(id => findLocation(id))
		.filter((location): location is LocationItem => location !== undefined)
		.map((location) => {
			const region = regionOf(location)
			const country = countryOf(location)
			const parts = [type_labels[location.type]]
			if (region) parts.push(region.name)
			if (country.id !== location.id) parts.push(country.name)

			return {
				id: location.id,
				name: location.name,
				meta: parts.join(' · '),
				is_hq: location.id === props.hqId,
			}
		})
		.sort((a, b) => Number(b.is_hq) - Number(a.is_hq)),
)

const replacement_options = computed<SelectOption[]>(() =>
	rows.value
		.filter(row => !row.is_hq)
		.map(row => ({ label: `${row.name} (${row.meta})`, value: String(row.id) })),
)

function nameOf(id: number | null): string {
	return rows.value.find(row => row.id === id)?.name ?? ''
}

function makeHq(row: LocationRow) {
	is_resolving.value = false
	emit('set-hq', row.id)
	announcement.value = `${row.name} is now your headquarters.`
}

function startRemove(row: LocationRow) {
	if (!row.is_hq) {
		emit('remove', row.id)
		announcement.value = `${row.name} removed from your locations.`
		return
	}

	replacement.value = ''
	is_resolving.value = !is_resolving.value
	if (is_resolving.value) {
		announcement.value = `${row.name} is your headquarters. Choose a new one or clear it before removing it.`
	}
}

function confirmRemove(row: LocationRow, next_hq: number | null) {
	const next_name = nameOf(next_hq)

	emit('set-hq', next_hq)
	emit('remove', row.id)
	is_resolving.value = false
	announcement.value = next_hq === null
		? `${row.name} removed. No headquarters is set.`
		: `${row.name} removed. ${next_name} is now your headquarters.`
}

function cancelRemove() {
	is_resolving.value = false
	announcement.value = ''
}
</script>

<style lang="scss" scoped>
.list {
	&__items {
		display: flex;
		flex-direction: column;
		border-top: var(--rule);
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 14px 0;
		border-bottom: var(--rule);
	}

	// the place and its actions share the column beside the icon, one
	// above the other: the form column is too narrow for a single line
	&__row {
		display: grid;
		grid-template-columns: 36px minmax(0, 1fr);
		column-gap: 14px;
		row-gap: 6px;
		align-items: start;
	}

	&__icon {
		display: grid;
		place-items: center;
		grid-row: span 2;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		background: var(--surface-muted);
		color: var(--text-secondary);
	}

	&__item--hq .list__icon {
		background: var(--brand-soft);
		color: var(--brand-deep);
	}

	&__place {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	&__title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 10px;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
	}

	&__meta {
		font-size: 14px;
		line-height: 20px;
		color: var(--text-muted);
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 16px;
		grid-column: 2;
	}

	// --- Removing the headquarters -------------------------------
	&__resolve {
		padding-left: 50px;
	}

	&__resolve-body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
	}

	&__replacement {
		max-width: 360px;
	}

	&__resolve-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
}

@media only screen and (max-width: 768px) {
	.list {
		&__resolve {
			padding-left: 0;
		}

		&__replacement {
			max-width: none;
		}
	}
}
</style>
