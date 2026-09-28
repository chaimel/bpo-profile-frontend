<template>
	<div class="hero">
		<div class="wrapper">
			<div class="hero__con">
				<MBreadcrumbs
					:items="[
						{ label: 'Home', to: '/' },
						{ label: 'Sales Pros', to: '/professionals' },
						{ label: name },
					]"
				/>

				<div class="hero__grid">
					<MAvatar
						:name="name"
						:src="props.professional.photo_url"
						:alt="props.professional.photo_alt_text"
						size="xxl"
						class="hero__photo"
					/>

					<div class="hero__main">
						<MHeading variant="1" size="2">{{ name }}</MHeading>
						<MText size="large" weight="medium" color="--text-secondary" class="hero__role">{{ props.professional.job_title }}</MText>

						<NuxtLink :to="`/companies/${props.professional.company.slug}`" class="hero__company">
							<MLogo :name="props.professional.company.name" :src="props.professional.company.logo_url" size="sm" decorative />
							<span>
								<span class="sr-only">Company: </span>{{ props.professional.company.name }}
							</span>
							<MBadge v-if="props.professional.company.verified" tone="brand" icon="light-check-circle" size="sm">Verified company</MBadge>
						</NuxtLink>

						<ul class="hero__meta">
							<li v-if="props.professional.location">
								<MIcon name="light-map-marker" size="sm" />
								{{ locationLabel(props.professional.location) }}
							</li>
							<li v-if="props.professional.timezone">
								<MIcon name="light-alarm-clock" size="sm" />
								Works on {{ timezoneLabel(props.professional.timezone) }}
							</li>
							<li v-if="props.professional.languages.length">
								<MIcon name="light-comments" size="sm" />
								{{ props.professional.languages.map(language => language.name).join(', ') }}
							</li>
						</ul>

						<MTrustBadges
							kind="professional"
							:verified="props.professional.verified"
							:completeness="props.professional.completeness_score"
							:featured="props.professional.featured"
						/>
					</div>

					<div class="hero__actions">
						<MButton size="lg" href="#contact" @click="emit('contact', 'contact')">
							Connect with {{ props.professional.first_name }}
						</MButton>
						<MButton size="lg" variant="outline" href="#contact" @click="emit('contact', 'quote')">Request a Quote</MButton>
						<div class="hero__secondary">
							<MButton variant="neutral" :to="`/companies/${props.professional.company.slug}`">Visit Company</MButton>
							<MShareButton :title="`${name} — ${props.professional.company.name}`" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MShareButton from '~/components/core/share/MShareButton.vue'
import MTrustBadges from '~/components/core/trust/MTrustBadges.vue'
import type { InquiryAction, ProfessionalProfile } from '~/types/features/directory'
import { fullName, locationLabel, timezoneLabel } from '~/utils/format'

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'contact', _type: InquiryAction): void
}>()

const name = computed(() => fullName(props.professional))
</script>

<style lang="scss" scoped>
.hero {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 28px;
		padding: 28px 0 48px;
	}

	&__grid {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) 280px;
		align-items: center;
		gap: 36px;
	}

	&__photo {
		box-shadow:
			0 0 0 6px var(--white),
			var(--shadow-card);
	}

	&__main {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		min-width: 0;
	}

	&__role {
		font-family: var(--font-display);
	}

	&__company {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);

		&:hover > span:not(.m-badge) {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
		padding: 4px 0;

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

	&__actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	// two buttons share the 280px column, or wrap when their labels don't fit
	&__secondary {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		> * {
			flex: 1 1 auto;
			min-width: 0;
		}

		:deep(.m-button) {
			width: 100%;
		}
	}
}

@media only screen and (max-width: 1024px) {
	.hero__grid {
		grid-template-columns: auto minmax(0, 1fr);

		.hero__actions {
			grid-column: 1 / -1;
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
}

@media only screen and (max-width: 640px) {
	.hero {
		&__grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		&__photo {
			width: 96px !important;
			height: 96px !important;
			font-size: 36px !important;
		}

		&__grid .hero__actions {
			flex-direction: column;
		}
	}
}
</style>
