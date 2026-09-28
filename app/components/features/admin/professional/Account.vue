<template>
	<MFormSection
		id="account"
		class="account"
		title="Linked account"
		description="The login that edits this profile and receives its inquiries. Linking happens through registration or an accepted invitation."
	>
		<template v-if="props.professional.account">
			<div class="account__person">
				<MAvatar :name="props.professional.account.name" size="md" decorative />
				<div class="account__text">
					<span class="account__name">{{ props.professional.account.name }}</span>
					<a :href="`mailto:${props.professional.account.email}`" class="account__email">
						{{ props.professional.account.email }}
					</a>
				</div>
				<MBadge
					:tone="is_verified ? 'success' : 'warning'"
					:icon="is_verified ? 'light-check-circle' : 'light-exclamation-triangle'"
					size="sm"
				>
					{{ is_verified ? 'Email verified' : 'Email not verified' }}
				</MBadge>
			</div>

			<dl class="account__facts">
				<div>
					<dt>Last sign-in</dt>
					<dd>{{ props.professional.account.last_login_at ? formatDateTime(props.professional.account.last_login_at) : 'Never' }}</dd>
				</div>
				<div>
					<dt>Company membership</dt>
					<dd>{{ membership }}</dd>
				</div>
			</dl>

			<div>
				<MButton variant="neutral" size="sm" :to="users_link">
					View in users
				</MButton>
			</div>
		</template>

		<div v-else class="account__empty">
			<MIcon name="light-user-circle" size="lg" color="text-muted" />
			<div class="account__text">
				<MText size="small" weight="semi-bold" class="account__empty-title">No login yet</MText>
				<MText size="small" color="--text-secondary" class="account__empty-body">
					This is a roster profile {{ props.professional.company.name }} manages. The company can invite
					{{ props.professional.first_name }} to claim it from its team page; accepting links their account
					without creating a second profile.
				</MText>
			</div>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import { formatDateTime } from '~/utils/format'
import { companyRoleLabels } from '~/utils/labels'
import type { AdminProfessionalDetail } from '~/types/features/admin'

// Read-only. Account links come from registration or an accepted
// invitation, never from an admin edit (docs/ARCHITECTURE.md §5).
interface Props {
	professional: AdminProfessionalDetail
}

const props = withDefaults(defineProps<Props>(), {})

const is_verified = computed(() => Boolean(props.professional.account?.email_verified_at))

// the users list, searched for this account
const users_link = computed(() => ({
	path: '/admin/users',
	query: { q: props.professional.account?.email ?? '' },
}))

const membership = computed(() => {
	const role = props.professional.membership_role
	if (!role) return `None at ${props.professional.company.name}`
	return `${companyRoleLabels[role]} at ${props.professional.company.name}`
})
</script>

<style lang="scss" scoped>
.account {
	&__person {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px 14px;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1 1 200px;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
	}

	&__email {
		font-size: 15px;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
	}

	&__facts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		padding-top: 16px;
		border-top: var(--rule);

		dt {
			font-family: var(--font-ui);
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--text-muted);
		}

		dd {
			margin-top: 4px;
			font-size: 16px;
			line-height: 24px;
		}
	}

	&__empty {
		display: flex;
		align-items: flex-start;
		gap: 14px;
	}

	&__empty-title {
		font-family: var(--font-ui);
	}
}

@media only screen and (max-width: 600px) {
	.account {
		&__facts {
			grid-template-columns: 1fr;
		}
	}
}
</style>
