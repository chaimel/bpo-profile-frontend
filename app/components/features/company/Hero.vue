<template>
	<div class="hero">
		<div class="hero__cover">
			<img v-if="props.company.cover_url" :src="props.company.cover_url" :alt="props.company.cover_alt_text ?? ''" class="hero__cover-img">
		</div>

		<div class="wrapper">
			<div class="hero__con">
				<MLogo
					:name="props.company.name"
					:src="props.company.logo_url"
					:alt="props.company.logo_alt_text"
					size="xl"
					class="hero__logo"
				/>

				<div class="hero__main">
					<MBreadcrumbs
						:items="[
							{ label: 'Home', to: '/' },
							{ label: 'BPO Profiles', to: '/companies' },
							{ label: props.company.name },
						]"
					/>

					<div class="hero__identity">
						<MHeading variant="1" size="2" class="hero__name">{{ props.company.name }}</MHeading>
						<MText v-if="props.company.tagline" size="large" color="--text-secondary" class="hero__tagline">{{ props.company.tagline }}</MText>
					</div>

					<MTrustBadges
						kind="company"
						:claimed="props.company.claimed"
						:verified="props.company.verified"
						:completeness="props.company.completeness_score"
						:featured="props.company.featured"
					/>

					<ul class="hero__meta">
						<li v-if="props.company.hq">
							<MIcon name="light-map-marker" size="sm" />
							<span><span class="sr-only">Headquarters: </span>{{ locationLabel(props.company.hq) }}</span>
						</li>
						<li v-if="props.company.company_size !== 'unknown'">
							<MIcon name="light-users" size="sm" />
							{{ companySizeLabels[props.company.company_size] }}
						</li>
						<li v-if="props.company.work_model !== 'unknown'">
							<MIcon name="light-globe" size="sm" />
							{{ workModelLabels[props.company.work_model] }}
						</li>
						<li v-if="props.company.founded_year">
							<MIcon name="light-calendar" size="sm" />
							Founded {{ props.company.founded_year }}
						</li>
					</ul>
				</div>

				<div class="hero__side">
					<div class="hero__actions">
						<MButton size="lg" href="#contact" @click="emit('contact', 'contact')">Contact Sales</MButton>
						<MButton size="lg" variant="outline" href="#contact" @click="emit('contact', 'quote')">Request a Quote</MButton>
					</div>
					<div class="hero__secondary">
						<MButton
							v-if="props.company.website_url"
							variant="neutral"
							:href="props.company.website_url"
							target="_blank"
						>
							Visit Website
							<template #suffix>
								<MIcon name="light-external-link" size="xs" />
							</template>
							<span class="sr-only">(opens in a new tab)</span>
						</MButton>
						<MShareButton :title="props.company.name" />
					</div>

					<a v-if="props.company.professionals.length" href="#team" class="hero__team">
						<span class="hero__faces" aria-hidden="true">
							<MAvatar
								v-for="person in props.company.professionals.slice(0, 3)"
								:key="person.id"
								:name="`${person.first_name} ${person.last_name}`"
								:src="person.photo_url"
								size="sm"
								decorative
								class="hero__face"
							/>
						</span>
						Meet the Team
						<span class="hero__team-count">({{ props.company.professionals.length }})</span>
					</a>
				</div>
			</div>

			<MAlert v-if="!props.company.claimed" tone="neutral" icon="light-info-circle" class="hero__unclaimed">
				<template #title>This listing hasn’t been claimed yet</template>
				BPO Profile created it from public information. Inquiries go to the company’s listed contact until someone from {{ props.company.name }} claims it.
				<template #actions>
					<MButton variant="text" size="sm" :to="`/claim?company=${props.company.slug}`">Claim This Profile</MButton>
				</template>
			</MAlert>
		</div>
	</div>
</template>

<script setup lang="ts">
import MShareButton from '~/components/core/share/MShareButton.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { CompanyProfile, InquiryAction } from '~/types/features/directory'
import { locationLabel } from '~/utils/format'
import { companySizeLabels, workModelLabels } from '~/utils/labels'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'contact', _type: InquiryAction): void
}>()
</script>

<style lang="scss" scoped>
.hero {
	background: var(--white);

	// Cover band: the company's cover image, or a quiet slate weave.
	&__cover {
		height: 148px;
		overflow: hidden;
		background:
			repeating-linear-gradient(135deg, var(--slate) 0 14px, var(--slate-deep) 14px 15px);
	}

	&__cover-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__con {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 12px 28px;
		padding-bottom: 32px;
	}

	&__logo {
		margin-top: -52px;
		box-shadow:
			0 0 0 4px var(--white),
			var(--shadow-card);
	}

	&__main {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-width: 0;
		padding-top: 20px;
	}

	&__identity {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;

		li {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			font-family: var(--font-ui);
			font-size: 14px;
			color: var(--text-secondary);
		}

		.m-icon {
			color: var(--text-muted);
		}
	}

	// --- Actions ----------------------------------------------
	&__side {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
		min-width: 260px;
		padding-top: 24px;
	}

	&__actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__secondary {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		> * {
			flex: 1 1 0;
		}

		:deep(.m-button) {
			width: 100%;
		}
	}

	&__team {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding-top: 8px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--brand-strong);

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__faces {
		display: inline-flex;
	}

	&__face {
		box-shadow: 0 0 0 2px var(--white);

		& + & {
			margin-left: -8px;
		}
	}

	&__team-count {
		font-weight: 400;
		color: var(--text-muted);
	}

	&__unclaimed {
		margin-bottom: 32px;
	}
}

@media only screen and (max-width: 1024px) {
	.hero {
		&__con {
			grid-template-columns: auto minmax(0, 1fr);
		}

		&__side {
			grid-column: 1 / -1;
			min-width: 0;
			padding-top: 8px;
		}

		&__actions {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
}

@media only screen and (max-width: 640px) {
	.hero {
		&__cover {
			height: 104px;
		}

		&__con {
			grid-template-columns: 1fr;
		}

		&__logo {
			width: 80px !important;
			height: 80px !important;
		}

		&__main {
			padding-top: 0;
		}

		&__actions {
			flex-direction: column;
		}
	}
}
</style>
