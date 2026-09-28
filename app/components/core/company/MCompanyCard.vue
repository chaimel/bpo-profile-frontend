<template>
	<article :class="['m-company-card', `m-company-card--${props.layout}`]">
		<MLogo
			:name="props.company.name"
			:src="props.company.logo_url"
			:alt="props.company.logo_alt_text"
			:size="props.layout === 'row' ? 64 : 'md'"
			decorative
			class="m-company-card__logo"
		/>

		<div class="m-company-card__main">
			<div class="m-company-card__identity">
				<MHeading :variant="props.headingLevel" size="5" weight="semi-bold" class="m-company-card__name">
					<!-- the name is the card's one link; its ::after covers the card -->
					<NuxtLink :to="`/companies/${props.company.slug}`" class="m-company-card__link">
						{{ props.company.name }}
					</NuxtLink>
				</MHeading>

				<span v-if="props.company.hq" class="m-company-card__location">
					<MIcon name="light-map-marker" size="xs" />
					{{ locationLabel(props.company.hq) }}
				</span>
			</div>

			<MTrustBadges
				kind="company"
				:claimed="props.company.claimed"
				:verified="props.company.verified"
				:completeness="props.company.completeness_score"
				:featured="props.company.featured"
				size="sm"
				class="m-company-card__badges"
			/>

			<MText v-if="props.company.tagline" color="--text-secondary" class="m-company-card__tagline">{{ props.company.tagline }}</MText>

			<dl class="m-company-card__facts">
				<div class="m-company-card__fact">
					<dt class="sr-only">Key services</dt>
					<dd>
						<MTagList :items="props.company.services" :max="3" size="sm" label="Key services" />
					</dd>
				</div>
				<div v-if="props.company.industries.length" class="m-company-card__fact m-company-card__fact--industries">
					<dt>Industries</dt>
					<dd>{{ props.company.industries.map(industry => industry.name).join(' · ') }}</dd>
				</div>
			</dl>
		</div>

		<div class="m-company-card__cta" aria-hidden="true">
			<span class="m-company-card__button">
				View Profile
				<MIcon name="light-long-arrow-right" size="sm" />
			</span>
		</div>
	</article>
</template>

<script setup lang="ts">
import MTagList from '~/components/core/tags/MTagList.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { CompanyCard } from '~/types/features/directory'
import { locationLabel } from '~/utils/format'

// Brief card anatomy (PDF p. 19): logo, company, location, key services,
// industries, short description, verified status, View Profile.
interface Props {
	company: CompanyCard
	layout?: 'grid' | 'row'
	headingLevel?: '2' | '3' | '4'
}

const props = withDefaults(defineProps<Props>(), {
	layout: 'grid',
	headingLevel: '3',
})
</script>

<style lang="scss" scoped>
.m-company-card {
	position: relative;
	display: flex;
	gap: 16px;
	background: var(--white);
	transition:
		box-shadow 0.2s ease,
		background-color 0.2s ease;

	&__main {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__identity {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__name {
		font-family: var(--font-display);
		letter-spacing: -0.005em;
	}

	&__link {
		color: var(--text-primary);

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: inherit;
		}

		&:focus-visible {
			outline: none;

			&::after {
				outline: 2px solid var(--brand);
				outline-offset: 2px;
			}
		}
	}

	&__location {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-secondary);
	}

	&__facts {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__fact--industries {
		display: flex;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 20px;
		color: var(--text-secondary);

		dt {
			font-weight: 600;
			color: var(--text-primary);

			&::after {
				content: ':';
			}
		}
	}

	&__button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--brand-strong);
		white-space: nowrap;
	}

	&:hover &__button {
		color: var(--brand-deep);
	}

	&:hover &__link {
		color: var(--brand-strong);
	}

	// --- Grid: vertical card in a directory grid ---------------
	&--grid {
		flex-direction: column;
		padding: 24px;
		border-radius: var(--radius-md);
		box-shadow: inset 0 0 0 1px var(--border);

		&:hover {
			box-shadow:
				inset 0 0 0 1px var(--border-strong),
				var(--shadow-card);
		}

		.m-company-card__main {
			flex: 1 1 auto;
		}

		.m-company-card__cta {
			padding-top: 16px;
			border-top: var(--rule);
		}
	}

	// --- Row: a search result separated by rules ---------------
	&--row {
		align-items: flex-start;
		gap: 20px;
		padding: 24px 0;

		.m-company-card__cta {
			flex: 0 0 auto;
			align-self: center;
		}

		.m-company-card__button {
			height: 40px;
			padding: 0 16px;
			border-radius: var(--radius-sm);
			box-shadow: inset 0 0 0 1px var(--brand-strong);
		}

		&:hover .m-company-card__button {
			background: var(--brand-soft);
		}
	}
}

@media only screen and (max-width: 768px) {
	.m-company-card {
		&--row {
			flex-wrap: wrap;

			.m-company-card__main {
				flex-basis: calc(100% - 84px);
			}

			.m-company-card__cta {
				flex-basis: 100%;
				padding-left: 84px;
			}
		}
	}
}
</style>
