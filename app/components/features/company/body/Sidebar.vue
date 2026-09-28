<template>
	<aside class="sidebar" aria-label="Company details">
		<section class="sidebar__panel" aria-labelledby="glance-title">
			<MHeading id="glance-title" variant="2" size="5" weight="semi-bold" class="sidebar__title">At a glance</MHeading>
			<dl class="sidebar__facts">
				<div v-if="props.company.hq" class="sidebar__fact">
					<dt>Headquarters</dt>
					<dd>{{ locationLabel(props.company.hq) }}</dd>
				</div>
				<div class="sidebar__fact">
					<dt>Company size</dt>
					<dd>{{ companySizeLabels[props.company.company_size] }}</dd>
				</div>
				<div class="sidebar__fact">
					<dt>Work model</dt>
					<dd>{{ workModelLabels[props.company.work_model] }}</dd>
				</div>
				<div v-if="props.company.founded_year" class="sidebar__fact">
					<dt>Founded</dt>
					<dd>{{ props.company.founded_year }}</dd>
				</div>
				<div v-if="props.company.languages.length" class="sidebar__fact">
					<dt>Languages</dt>
					<dd>{{ props.company.languages.map(item => item.name).join(', ') }}</dd>
				</div>
				<div v-if="props.company.technologies.length" class="sidebar__fact">
					<dt>Technology</dt>
					<dd>{{ props.company.technologies.map(item => item.name).join(', ') }}</dd>
				</div>
			</dl>

			<ul v-if="props.company.website_url || props.company.linkedin_url || props.company.phone" class="sidebar__links">
				<li v-if="props.company.website_url">
					<a :href="props.company.website_url" target="_blank" rel="noopener noreferrer" class="sidebar__link">
						<MIcon name="light-globe" size="sm" />
						{{ hostname(props.company.website_url) }}
						<span class="sr-only">(company website, opens in a new tab)</span>
					</a>
				</li>
				<li v-if="props.company.linkedin_url">
					<a :href="props.company.linkedin_url" target="_blank" rel="noopener noreferrer" class="sidebar__link">
						<MIcon name="brand-linkedin" size="sm" />
						LinkedIn
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</li>
				<li v-if="props.company.phone">
					<a :href="`tel:${props.company.phone.replace(/\s/g, '')}`" class="sidebar__link">
						<MIcon name="light-phone" size="sm" />
						{{ props.company.phone }}
					</a>
				</li>
			</ul>
		</section>

		<section class="sidebar__panel" aria-labelledby="trust-title">
			<MHeading id="trust-title" variant="2" size="5" weight="semi-bold" class="sidebar__title">Trust</MHeading>
			<MTrustBadges
				kind="company"
				variant="list"
				size="sm"
				:claimed="props.company.claimed"
				:verified="props.company.verified"
				:completeness="props.company.completeness_score"
			/>
			<MText v-if="!props.company.verified && !props.company.claimed" size="small" color="--text-secondary" class="sidebar__muted">
				Not yet claimed or verified by BPO Profile.
			</MText>
			<MText v-else-if="!props.company.verified" size="small" color="--text-secondary" class="sidebar__muted">
				Not yet verified by BPO Profile.
			</MText>
			<MProgress :value="props.company.completeness_score" :threshold="80" label="Profile completeness" size="sm" />
			<NuxtLink to="/about#trust" class="sidebar__more">What our badges mean</NuxtLink>
		</section>

		<section v-if="!props.company.claimed" class="sidebar__panel sidebar__panel--claim" aria-labelledby="claim-title">
			<MHeading id="claim-title" variant="2" size="5" weight="semi-bold" class="sidebar__title">Work at {{ props.company.name }}?</MHeading>
			<MText size="small" color="--text-secondary" class="sidebar__muted">Claim this listing to update the profile, add your sales team, and receive inquiries.</MText>
			<MButton variant="secondary" size="sm" :to="`/claim?company=${props.company.slug}`">Claim This Profile</MButton>
		</section>
	</aside>
</template>

<script setup lang="ts">
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { CompanyProfile } from '~/types/features/directory'
import { hostname, locationLabel } from '~/utils/format'
import { companySizeLabels, workModelLabels } from '~/utils/labels'

interface Props {
	company: CompanyProfile
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

		&--claim {
			background: var(--canvas);
			box-shadow: none;
			align-items: flex-start;
		}
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
