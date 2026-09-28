<template>
	<section id="locations" class="locations" aria-labelledby="locations-title">
		<MHeading id="locations-title" variant="2" size="3">Locations</MHeading>

		<div class="locations__groups">
			<div v-for="group in groups" :key="group.country" class="locations__group">
				<MHeading variant="3" size="5" class="locations__country">{{ group.country }}</MHeading>
				<ul class="locations__list">
					<li v-for="location in group.items" :key="location.id" class="locations__item">
						<MIcon name="light-map-marker" size="sm" class="locations__pin" />
						<span class="locations__name">
							{{ location.name }}
							<span v-if="location.region" class="locations__region">{{ location.region }}</span>
						</span>
						<MBadge v-if="location.is_headquarters" tone="slate" icon="light-building" size="sm">Headquarters</MBadge>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyLocation, CompanyProfile } from '~/types/features/directory'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()

// Group operating locations by country, headquarters first.
const groups = computed(() => {
	const map = new Map<string, CompanyLocation[]>()
	const sorted = [...props.company.locations].sort((a, b) => Number(b.is_headquarters) - Number(a.is_headquarters))

	for (const location of sorted) {
		const list = map.get(location.country) ?? []
		list.push(location)
		map.set(location.country, list)
	}

	return [...map.entries()].map(([country, items]) => ({ country, items }))
})
</script>

<style lang="scss" scoped>
.locations {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__groups {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 24px 40px;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__list {
		display: flex;
		flex-direction: column;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 0;
		border-bottom: var(--rule);
	}

	&__pin {
		color: var(--brand);
	}

	&__name {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 500;
	}

	&__region {
		font-size: 12px;
		font-weight: 400;
		color: var(--text-muted);
	}
}
</style>
