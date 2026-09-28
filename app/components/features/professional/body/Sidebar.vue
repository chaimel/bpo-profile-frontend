<template>
	<aside class="sidebar" aria-label="Profile details">
		<section class="sidebar__panel" aria-labelledby="details-title">
			<MHeading id="details-title" variant="2" size="5" weight="semi-bold" class="sidebar__title">Details</MHeading>
			<dl class="sidebar__facts">
				<div class="sidebar__fact">
					<dt>Company</dt>
					<dd>
						<NuxtLink :to="`/companies/${props.professional.company.slug}`" class="sidebar__link">
							{{ props.professional.company.name }}
						</NuxtLink>
					</dd>
				</div>
				<div v-if="props.professional.location" class="sidebar__fact">
					<dt>Based in</dt>
					<dd>{{ locationLabel(props.professional.location) }}</dd>
				</div>
				<div v-if="props.professional.timezone" class="sidebar__fact">
					<dt>Time zone</dt>
					<dd>{{ timezoneLabel(props.professional.timezone) }} ({{ props.professional.timezone }})</dd>
				</div>
				<div v-if="props.professional.markets.length" class="sidebar__fact">
					<dt>Markets served</dt>
					<dd>{{ props.professional.markets.map(market => market.name).join(', ') }}</dd>
				</div>
			</dl>

			<ul v-if="props.professional.linkedin_url || props.professional.website_url" class="sidebar__links">
				<li v-if="props.professional.linkedin_url">
					<a :href="props.professional.linkedin_url" target="_blank" rel="noopener noreferrer" class="sidebar__link">
						<MIcon name="brand-linkedin" size="sm" />
						LinkedIn
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</li>
				<li v-if="props.professional.website_url">
					<a :href="props.professional.website_url" target="_blank" rel="noopener noreferrer" class="sidebar__link">
						<MIcon name="light-globe" size="sm" />
						{{ hostname(props.professional.website_url) }}
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</li>
			</ul>
		</section>

		<section class="sidebar__panel" aria-labelledby="profile-trust-title">
			<MHeading id="profile-trust-title" variant="2" size="5" weight="semi-bold" class="sidebar__title">Trust</MHeading>
			<MTrustBadges
				kind="professional"
				variant="list"
				size="sm"
				:verified="props.professional.verified"
				:completeness="props.professional.completeness_score"
			/>
			<MText v-if="!props.professional.verified" size="small" color="--text-secondary" class="sidebar__muted">
				Affiliation approved by {{ props.professional.company.name }}. Not yet verified by BPO Profile.
			</MText>
			<NuxtLink to="/about#trust" class="sidebar__more">What our badges mean</NuxtLink>
		</section>
	</aside>
</template>

<script setup lang="ts">
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { ProfessionalProfile } from '~/types/features/directory'
import { hostname, locationLabel, timezoneLabel } from '~/utils/format'

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.sidebar {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__panel {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 22px;
		border-radius: var(--radius-md);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__title {
		font-family: var(--font-display);
	}

	&__facts {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__fact {
		display: flex;
		flex-direction: column;
		gap: 2px;

		dt {
			font-family: var(--font-ui);
			font-size: 12px;
			color: var(--text-muted);
		}

		dd {
			font-size: 16px;
			line-height: 23px;
		}
	}

	&__links {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 14px;
		border-top: var(--rule);
	}

	&__link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--brand-strong);

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__more {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
}
</style>
