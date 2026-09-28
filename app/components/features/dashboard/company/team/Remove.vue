<template>
	<MModal :name="props.name" variant="alert" tone="danger" class="remove">
		<template #icon>
			<MIcon name="light-trash" size="md" />
		</template>
		<template #header>
			{{ props.isSelf ? 'Remove your sales profile from the team?' : `Remove ${member_name} from the team?` }}
		</template>

		<template #content>
			<div class="remove__body">
				<MText v-if="props.isSelf" color="--text-secondary" class="remove__text">
					Your profile is hidden from the directory and from {{ props.companyName }}’s public team, and new inquiries go to the company inbox instead. You stay the company’s owner.
				</MText>
				<template v-else>
					<MText color="--text-secondary" class="remove__text">
						{{ member_name }}’s profile is hidden from the directory and from {{ props.companyName }}’s public team, and new inquiries can no longer reach them. Any pending invitation for this profile is revoked.
					</MText>
					<MText v-if="props.member?.has_account" color="--text-secondary" class="remove__text">
						They keep their BPO Profile login but lose access to {{ props.companyName }}.
					</MText>
				</template>
				<MText color="--text-secondary" class="remove__text">
					Only the BPO Profile team can restore a removed profile, and it would need approval and review again before going live.
				</MText>
			</div>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.name)">Keep on the team</MButton>
			<MButton variant="destructive" @click="confirm">Remove from team</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TeamMember } from '~/types/features/dashboard'
import { fullName } from '~/utils/format'

// DELETE .../team/{professionalId} (docs/API.md §5): hides the profile,
// revokes its invitations and removes a professional-only membership.
interface Props {
	name: string
	member?: TeamMember | null
	companyName: string
	// the signed-in user's own profile: their owner role stays
	isSelf?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	member: null,
	isSelf: false,
})

const emit = defineEmits<{
	(_e: 'confirm'): void
}>()

const { closeModal } = useModal()

const member_name = computed(() => (props.member ? fullName(props.member) : 'this person'))

function confirm() {
	emit('confirm')
	closeModal(props.name)
}
</script>

<style lang="scss" scoped>
.remove {
	&__body {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
</style>
