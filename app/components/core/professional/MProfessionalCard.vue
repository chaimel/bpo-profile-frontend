<template>
	<article :class="['m-professional-card', `m-professional-card--${props.layout}`]">
		<MAvatar
			:name="name"
			:src="props.professional.photo_url"
			:alt="props.professional.photo_alt_text"
			:size="avatar_size"
			decorative
			class="m-professional-card__photo"
		/>

		<div class="m-professional-card__main">
			<!-- compact rows step down a size to sit beside the smaller avatar -->
			<MHeading
				:variant="props.headingLevel"
				:size="props.layout === 'compact' ? '6' : '5'"
				weight="semi-bold"
				class="m-professional-card__name"
			>
				<!-- the name is the card's link; Connect sits above its overlay -->
				<NuxtLink :to="profile_path" class="m-professional-card__link">{{ name }}</NuxtLink>
			</MHeading>

			<MText
				:size="props.layout === 'compact' ? 'xsmall' : 'small'"
				color="--text-secondary"
				class="m-professional-card__role"
			>
				{{ props.professional.job_title }}
				<!-- real spaces, not margins, so a wrapped line starts flush -->
				<template v-if="props.showCompany">
					<span class="m-professional-card__at">at</span> <span class="m-professional-card__company">{{ props.professional.company.name }}</span>
				</template>
			</MText>

			<template v-if="props.layout !== 'compact'">
				<MText v-if="props.professional.expertise" color="--text-primary" class="m-professional-card__expertise">
					<MIcon name="light-medal" size="xs" />
					{{ props.professional.expertise }}
				</MText>

				<div class="m-professional-card__meta">
					<span v-if="props.professional.location" class="m-professional-card__location">
						<MIcon name="light-map-marker" size="xs" />
						{{ locationLabel(props.professional.location) }}
					</span>
					<MTrustBadges kind="professional" :verified="props.professional.verified" size="sm" />
				</div>
			</template>
		</div>

		<div class="m-professional-card__cta">
			<MButton
				:to="`${profile_path}#contact`"
				:size="props.layout === 'compact' ? 'sm' : 'md'"
				:variant="props.layout === 'grid' ? 'primary' : 'outline'"
				:block="props.layout === 'grid'"
				:aria-label="`Connect with ${name}`"
			>
				Connect
			</MButton>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { ProfessionalCard } from '~/types/features/directory'
import { fullName, locationLabel } from '~/utils/format'

// Brief card anatomy (PDF p. 19): photo, name, position, company,
// expertise, location, Connect.
interface Props {
	professional: ProfessionalCard
	layout?: 'grid' | 'row' | 'compact'
	headingLevel?: '2' | '3' | '4'
	// hide on a company's own team list, where it is implied
	showCompany?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	layout: 'grid',
	headingLevel: '3',
	showCompany: true,
})

const name = computed(() => fullName(props.professional))
const profile_path = computed(() => `/professionals/${props.professional.slug}`)
const avatar_size = computed(() => {
	if (props.layout === 'grid') return 'xl'
	if (props.layout === 'row') return 'lg'
	return 'md'
})
</script>

<style lang="scss" scoped>
.m-professional-card {
	position: relative;
	display: flex;
	gap: 16px;
	background: var(--white);
	transition: box-shadow 0.2s ease;

	&__main {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-display);
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

	&:hover &__link {
		color: var(--brand-strong);
	}

	&__role {
		font-family: var(--font-ui);
	}

	&__at {
		color: var(--text-muted);
	}

	&__company {
		font-weight: 600;
		color: var(--text-primary);
	}

	&__expertise {
		display: flex;
		align-items: flex-start;
		gap: 6px;

		.m-icon {
			margin-top: 4px;
			color: var(--brand);
		}
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		margin-top: 2px;
	}

	&__location {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-secondary);
	}

	// Connect is its own destination, so it sits above the card link.
	&__cta {
		position: relative;
		z-index: 1;
	}

	// --- Grid: portrait card -----------------------------------
	&--grid {
		flex-direction: column;
		align-items: flex-start;
		padding: 24px;
		border-radius: var(--radius-md);
		box-shadow: inset 0 0 0 1px var(--border);

		&:hover {
			box-shadow:
				inset 0 0 0 1px var(--border-strong),
				var(--shadow-card);
		}

		.m-professional-card__main {
			flex: 1 1 auto;
		}

		.m-professional-card__cta {
			width: 100%;
			padding-top: 8px;
		}
	}

	// --- Row: list result --------------------------------------
	&--row {
		align-items: flex-start;
		padding: 20px 0;

		.m-professional-card__cta {
			align-self: center;
		}
	}

	// --- Compact: team rosters ---------------------------------
	&--compact {
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border-radius: var(--radius-md);
		box-shadow: inset 0 0 0 1px var(--border);

		&:hover {
			box-shadow: inset 0 0 0 1px var(--border-strong);
		}
	}
}

@media only screen and (max-width: 600px) {
	.m-professional-card {
		&--row {
			flex-wrap: wrap;

			// the details wrap under the avatar here, so Connect lines up with them
			.m-professional-card__cta {
				flex-basis: 100%;
			}
		}
	}
}
</style>
