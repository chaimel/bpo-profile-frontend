<template>
	<MFormSection
		id="profile"
		class="summary"
		title="Profile summary"
		description="What the profile says today. The person or their company edits it from the dashboard."
	>
		<dl class="summary__list">
			<div class="summary__row">
				<dt class="summary__label">Job title</dt>
				<dd class="summary__value">{{ props.professional.job_title }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Company</dt>
				<dd class="summary__value">
					<NuxtLink :to="`/admin/companies/${props.professional.company.id}`" class="summary__link">
						{{ props.professional.company.name }}
					</NuxtLink>
				</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Location</dt>
				<dd class="summary__value">{{ props.professional.location ?? 'Not set' }}</dd>
			</div>

			<div class="summary__row summary__row--wide">
				<dt class="summary__label">Expertise</dt>
				<dd class="summary__value">{{ props.professional.expertise ?? 'Not written yet' }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Came from</dt>
				<dd class="summary__value">
					{{ props.professional.source === 'roster' ? 'Roster profile the company created' : 'Self-registration' }}
				</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Created</dt>
				<dd class="summary__value">{{ formatDate(props.professional.created_at) }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Last updated</dt>
				<dd class="summary__value">{{ formatDate(props.professional.updated_at) }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">First published</dt>
				<dd class="summary__value">
					{{ props.professional.published_at ? formatDate(props.professional.published_at) : 'Never' }}
				</dd>
			</div>
		</dl>

		<div class="summary__actions">
			<MButton v-if="props.isPublic" variant="outline" size="sm" :to="`/professionals/${props.professional.slug}`">
				<template #prefix>
					<MIcon name="light-external-link" size="xs" />
				</template>
				Open public profile
			</MButton>
			<MText v-else size="small" color="--text-muted" class="summary__muted">
				The public profile at /professionals/{{ props.professional.slug }} opens only once it’s published,
				approved and part of a published company.
			</MText>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import { formatDate } from '~/utils/format'
import type { AdminProfessionalDetail } from '~/types/features/admin'

interface Props {
	professional: AdminProfessionalDetail
	isPublic?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	isPublic: false,
})
</script>

<style lang="scss" scoped>
.summary {
	&__list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px 24px;
	}

	&__row {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;

		&--wide {
			grid-column: 1 / -1;
		}
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__value {
		font-size: 16px;
		line-height: 24px;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	&__actions {
		display: flex;
		padding-top: 16px;
		border-top: var(--rule);
	}
}

@media only screen and (max-width: 768px) {
	.summary {
		&__list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
}
</style>
