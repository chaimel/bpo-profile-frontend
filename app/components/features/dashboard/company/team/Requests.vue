<template>
	<div class="requests">
		<MAlert tone="info">
			<template #title>Approving adds someone to your team — nothing more</template>
			It doesn’t publish or verify their profile. The BPO Profile team reviews every profile before it goes live, and verification is a separate check.
		</MAlert>

		<ul v-if="props.requests.length" class="requests__list">
			<li v-for="request in props.requests" :key="request.professional_id" class="requests__item">
				<div class="requests__person">
					<MAvatar :name="fullName(request)" size="md" decorative />
					<div class="requests__who">
						<span class="requests__name">{{ fullName(request) }}</span>
						<span class="requests__title">{{ request.job_title }}</span>
						<span class="requests__email">{{ request.email }}</span>
					</div>
				</div>

				<div class="requests__facts">
					<MBadge v-if="request.email_verified" tone="success" icon="light-check-circle" size="sm">Email verified</MBadge>
					<MBadge v-else tone="warning" icon="light-alarm-clock" size="sm">Email not verified yet</MBadge>
					<span class="requests__date">Requested {{ formatDate(request.requested_at) }}</span>
				</div>

				<div class="requests__actions">
					<MButton
						size="sm"
						:disabled="!request.email_verified"
						:aria-describedby="request.email_verified ? undefined : noteId(request)"
						@click="emit('approve', request)"
					>
						Approve<span class="sr-only"> {{ fullName(request) }}</span>
					</MButton>
					<MButton variant="neutral" size="sm" @click="emit('reject', request)">
						Reject<span class="sr-only"> {{ fullName(request) }}</span>
					</MButton>
				</div>

				<MText v-if="!request.email_verified" :id="noteId(request)" size="small" color="--text-primary" class="requests__note">
					<MIcon name="light-info-circle" size="sm" class="requests__note-icon" />
					<span>
						{{ request.first_name }} hasn’t confirmed their email address yet. You can approve the request once they sign in and enter the code we email them.
					</span>
				</MText>
			</li>
		</ul>

		<MEmptyState v-else icon="light-user-check" heading-level="2">
			<template #title>No requests waiting</template>
			When someone registers as a sales professional at {{ props.companyName }}, their request appears here for you to review.
		</MEmptyState>
	</div>
</template>

<script setup lang="ts">
import type { AffiliationRequest } from '~/types/features/dashboard'
import { formatDate, fullName } from '~/utils/format'

interface Props {
	requests: AffiliationRequest[]
	companyName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'approve' | 'reject', _request: AffiliationRequest): void
}>()

function noteId(request: AffiliationRequest): string {
	return `team-request-${request.professional_id}-note`
}
</script>

<style lang="scss" scoped>
.requests {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__list {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px 24px;
		padding: 18px 20px;

		& + .requests__item {
			border-top: var(--rule);
		}
	}

	&__person {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	&__who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
	}

	&__title {
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__email {
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 20px;
		color: var(--text-muted);
		overflow-wrap: anywhere;
	}

	&__facts {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}

	&__date {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-muted);
	}

	&__actions {
		display: flex;
		gap: 8px;
	}

	&__note {
		grid-column: 1 / -1;
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		background: var(--warning-soft);
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 2px;
		color: var(--warning);
	}
}

@media only screen and (max-width: 900px) {
	.requests__item {
		grid-template-columns: minmax(0, 1fr);
		padding: 16px;
	}
}
</style>
