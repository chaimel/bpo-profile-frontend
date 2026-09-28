<template>
	<div class="invitations">
		<MText size="small" color="--text-secondary" class="invitations__intro">
			An invitation lets someone sign in and take over a roster profile. Each link works once, and only for the address it was sent to.
		</MText>

		<MTable :columns="columns" :rows="props.invitations" caption="Pending invitations">
			<template #cell-email="{ row }">
				<span class="invitations__email">{{ row.email }}</span>
			</template>

			<template #cell-profile="{ row }">
				{{ row.professional_name }}
			</template>

			<template #cell-sent="{ row }">
				<span class="invitations__sent">
					{{ formatDate(row.created_at) }}
					<span class="invitations__by">by {{ row.invited_by }}</span>
				</span>
			</template>

			<template #cell-expires="{ row }">
				{{ formatDate(row.expires_at) }}
			</template>

			<template #cell-actions="{ row }">
				<MButton variant="ghost" size="sm" @click="emit('revoke', row)">
					Revoke<span class="sr-only"> the invitation for {{ row.email }}</span>
				</MButton>
			</template>

			<template #empty>
				No pending invitations. Invite someone from a roster profile on the Team members tab.
			</template>
		</MTable>
	</div>
</template>

<script setup lang="ts">
import type { TableColumn } from '~/types/base/ui'
import type { TeamInvitation } from '~/types/features/dashboard'
import { formatDate } from '~/utils/format'

interface Props {
	invitations: TeamInvitation[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'revoke', _invitation: TeamInvitation): void
}>()

const columns: TableColumn[] = [
	{ key: 'email', label: 'Email' },
	{ key: 'profile', label: 'Profile' },
	{ key: 'sent', label: 'Sent', hideBelow: 'md' },
	{ key: 'expires', label: 'Expires' },
	{ key: 'actions', label: 'Actions', srOnlyLabel: true, align: 'right', width: '120px' },
]
</script>

<style lang="scss" scoped>
.invitations {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__intro {
		max-width: 720px;
	}

	&__email {
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	&__sent {
		display: flex;
		flex-direction: column;
	}

	&__by {
		font-size: 12px;
		color: var(--text-muted);
	}
}
</style>
