<template>
	<section id="expertise" class="expertise" aria-labelledby="expertise-title">
		<MHeading id="expertise-title" variant="2" size="3">What {{ props.professional.first_name }} works on</MHeading>

		<dl class="expertise__grid">
			<div v-if="props.professional.services.length" class="expertise__group">
				<dt>Services represented</dt>
				<dd>
					<MTagList
						:items="props.professional.services"
						label="Services represented"
						variant="brand"
						:link-to="(item) => `/professionals?service=${item.slug}`"
					/>
				</dd>
			</div>

			<div v-if="props.professional.industries.length" class="expertise__group">
				<dt>Industries</dt>
				<dd>
					<MTagList
						:items="props.professional.industries"
						label="Industries"
						:link-to="(item) => `/professionals?industry=${item.slug}`"
					/>
				</dd>
			</div>

			<div v-if="props.professional.markets.length" class="expertise__group">
				<dt>Markets served</dt>
				<dd>
					<ul class="expertise__markets">
						<li v-for="market in props.professional.markets" :key="market.slug">
							<MIcon name="light-globe" size="xs" />
							{{ market.name }}
						</li>
					</ul>
					<MText size="small" color="--text-muted" class="expertise__note">Where {{ props.professional.first_name }} sells — not necessarily where they’re based.</MText>
				</dd>
			</div>

			<div v-if="props.professional.languages.length" class="expertise__group">
				<dt>Languages</dt>
				<dd class="expertise__plain">{{ props.professional.languages.map(language => language.name).join(', ') }}</dd>
			</div>
		</dl>
	</section>
</template>

<script setup lang="ts">
import MTagList from '~/components/core/tags/MTagList.vue'
import type { ProfessionalProfile } from '~/types/features/directory'

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.expertise {
	display: flex;
	flex-direction: column;
	gap: 24px;

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 28px 40px;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 12px;

		dt {
			font-family: var(--font-ui);
			font-size: 13px;
			font-weight: 600;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--text-muted);
		}
	}

	&__markets {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;

		li {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			font-family: var(--font-ui);
			font-size: 14px;
			font-weight: 500;
		}

		.m-icon {
			color: var(--brand);
		}
	}

	&__note {
		margin-top: 8px;
	}

	&__plain {
		font-size: 17px;
		line-height: 26px;
	}
}

@media only screen and (max-width: 640px) {
	.expertise__grid {
		grid-template-columns: 1fr;
	}
}
</style>
