<template>
	<section id="services" class="offerings" aria-labelledby="services-title">
		<MHeading id="services-title" variant="2" size="3">Services</MHeading>

		<ul v-if="props.company.services.length" class="offerings__services">
			<li v-for="service in props.company.services" :key="service.slug">
				<NuxtLink :to="`/find?service=${service.slug}`" class="offerings__service">
					<span class="offerings__service-icon">
						<MIcon :name="serviceIcons[service.slug] ?? 'light-tag'" size="md" />
					</span>
					<span class="offerings__service-name">{{ service.name }}</span>
				</NuxtLink>
			</li>
		</ul>

		<div class="offerings__split">
			<div v-if="props.company.industries.length" class="offerings__group">
				<MHeading variant="3" size="5">Industries served</MHeading>
				<MTagList
					:items="props.company.industries"
					label="Industries served"
					:link-to="(item) => `/find?industry=${item.slug}`"
				/>
			</div>

			<div v-if="props.company.capabilities.length" class="offerings__group">
				<MHeading variant="3" size="5">Capabilities</MHeading>
				<ul class="offerings__capabilities">
					<li v-for="capability in props.company.capabilities" :key="capability.slug">
						<MIcon name="light-check" size="sm" />
						{{ capability.name }}
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import MTagList from '~/components/core/tags/MTagList.vue'
import { serviceIcons } from '~/data/features/taxonomies'
import type { CompanyProfile } from '~/types/features/directory'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.offerings {
	display: flex;
	flex-direction: column;
	gap: 24px;

	// Visual service categories (PDF p. 21).
	&__services {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 12px;
	}

	&__service {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 100%;
		padding: 16px;
		border-radius: var(--radius-md);
		background: var(--canvas);
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--brand-soft);

			.offerings__service-name {
				color: var(--brand-deep);
			}
		}
	}

	&__service-icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-sm);
		background: var(--white);
		color: var(--brand);
	}

	&__service-name {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		line-height: 21px;
		color: var(--text-primary);
	}

	&__split {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px;
		padding-top: 8px;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__capabilities {
		display: flex;
		flex-direction: column;
		gap: 8px;

		li {
			display: flex;
			align-items: center;
			gap: 10px;
			font-family: var(--font-ui);
			font-size: 14px;
		}

		.m-icon {
			color: var(--success);
		}
	}
}

@media only screen and (max-width: 640px) {
	.offerings__split {
		grid-template-columns: 1fr;
	}
}
</style>
