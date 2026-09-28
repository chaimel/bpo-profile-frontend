<template>
	<MFormSection
		id="team"
		class="team"
		title="Team"
		:description="description"
	>
		<ul v-if="props.team.length" class="team__list">
			<li v-for="person in props.team" :key="person.id" class="team__person">
				<MAvatar :name="fullName(person)" :src="person.photo_url" size="sm" decorative />

				<div class="team__text">
					<NuxtLink
						:to="`/admin/professionals/${person.id}`"
						:class="['team__name', { 'team__name--muted': person.deleted_at }]"
					>
						{{ fullName(person) }}
					</NuxtLink>
					<span class="team__title">{{ person.job_title }}</span>
				</div>

				<div class="team__badges">
					<MBadge v-if="person.deleted_at" tone="danger" icon="light-trash" size="sm">Deleted</MBadge>
					<template v-else>
						<MStatusBadge kind="publication" :status="person.status" size="sm" />
						<MStatusBadge kind="affiliation" :status="person.affiliation_status" size="sm" />
						<MBadge v-if="person.verified_at" tone="brand" icon="light-user-check" size="sm">Verified</MBadge>
					</template>
				</div>
			</li>
		</ul>

		<MEmptyState v-else icon="light-users" variant="plain" heading-level="3">
			<template #title>No professionals yet</template>
			The company adds its team from its dashboard, or people ask to join it.
		</MEmptyState>

		<MText v-if="props.company.deleted_at && props.team.length" size="small" color="--text-muted" class="team__note">
			The whole team is hidden while the company is deleted.
		</MText>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { AdminCompanyDetail, AdminProfessionalRow } from '~/types/features/admin'
import { fullName, pluralize } from '~/utils/format'

// Everyone attached to the company, in any status. Each person is
// reviewed on their own page.
interface Props {
	company: AdminCompanyDetail
	team: AdminProfessionalRow[]
}

const props = withDefaults(defineProps<Props>(), {})

const description = computed(() => {
	const count = props.team.filter(person => !person.deleted_at).length
	return `${pluralize(count, 'person', 'people')} attached to ${props.company.name}. Affiliation, publication and verification are decided one person at a time.`
})
</script>

<style lang="scss" scoped>
.team {
	&__list {
		display: flex;
		flex-direction: column;
	}

	&__person {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		border-bottom: var(--rule);

		&:first-child {
			padding-top: 0;
		}

		&:last-child {
			border-bottom: 0;
		}
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}

		&--muted {
			color: var(--text-muted);
		}
	}

	&__title {
		font-size: 15px;
		line-height: 21px;
		color: var(--text-secondary);
	}

	&__badges {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 6px;
	}
}

@media only screen and (max-width: 768px) {
	.team {
		&__person {
			grid-template-columns: auto minmax(0, 1fr);
		}

		&__badges {
			grid-column: 2;
			justify-content: flex-start;
		}
	}
}
</style>
