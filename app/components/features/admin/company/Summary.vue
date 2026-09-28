<template>
	<MFormSection
		id="profile"
		class="summary"
		title="Profile summary"
		description="What the company wrote about itself. Companies edit this from their dashboard."
	>
		<dl class="summary__list">
			<div class="summary__row">
				<dt class="summary__label">Tagline</dt>
				<dd class="summary__value">{{ props.company.tagline ?? 'Not written yet' }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Headquarters</dt>
				<dd class="summary__value">{{ props.company.hq ?? 'Not set' }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Website</dt>
				<dd class="summary__value">
					<a
						v-if="props.company.website_url"
						:href="props.company.website_url"
						target="_blank"
						rel="noopener noreferrer"
						class="summary__link"
					>
						{{ hostname(props.company.website_url) }}
						<MIcon name="light-external-link" size="xs" />
						<span class="sr-only">(opens in a new tab)</span>
					</a>
					<template v-else>Not set</template>
				</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Founded</dt>
				<dd class="summary__value">{{ props.company.founded_year ?? 'Not specified' }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Company size</dt>
				<dd class="summary__value">{{ companySizeLabels[props.company.company_size] }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Work model</dt>
				<dd class="summary__value">{{ workModelLabels[props.company.work_model] }}</dd>
			</div>

			<div class="summary__row summary__row--wide">
				<dt class="summary__label">Services</dt>
				<dd class="summary__value">
					<MTagList v-if="props.company.services.length" :items="props.company.services" label="Services" size="sm" />
					<template v-else>None chosen yet</template>
				</dd>
			</div>

			<div class="summary__row summary__row--wide">
				<dt class="summary__label">Industries</dt>
				<dd class="summary__value">
					<MTagList v-if="props.company.industries.length" :items="props.company.industries" label="Industries" size="sm" />
					<template v-else>None chosen yet</template>
				</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Created</dt>
				<dd class="summary__value">{{ formatDate(props.company.created_at) }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">Last updated</dt>
				<dd class="summary__value">{{ formatDate(props.company.updated_at) }}</dd>
			</div>

			<div class="summary__row">
				<dt class="summary__label">First published</dt>
				<dd class="summary__value">{{ props.company.published_at ? formatDate(props.company.published_at) : 'Never' }}</dd>
			</div>
		</dl>

		<div class="summary__actions">
			<MButton v-if="is_public" variant="outline" size="sm" :to="`/companies/${props.company.slug}`">
				<template #prefix>
					<MIcon name="light-external-link" size="xs" />
				</template>
				Open public profile
			</MButton>
			<MText v-else size="small" color="--text-muted" class="summary__muted">
				The public profile at /companies/{{ props.company.slug }} opens only once the listing is published.
			</MText>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MTagList from '~/components/core/tags/MTagList.vue'
import { formatDate, hostname } from '~/utils/format'
import { companySizeLabels, workModelLabels } from '~/utils/labels'
import type { AdminCompanyDetail } from '~/types/features/admin'

interface Props {
	company: AdminCompanyDetail
}

const props = withDefaults(defineProps<Props>(), {})

const is_public = computed(() => props.company.status === 'published' && !props.company.deleted_at)
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

	// inline, so the icon follows the last line when a long host wraps
	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
		overflow-wrap: anywhere;

		.m-icon {
			margin-left: 4px;
		}
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
