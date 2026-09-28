<template>
	<MPage
		id="company-team"
		class="team"
		title="Team"
		:description="`The people who represent ${props.company.name} on BPO Profile. Our team reviews every profile before it goes live.`"
	>
		<template #actions>
			<MButton variant="neutral" @click="openInvite(null)">
				<template #prefix>
					<MIcon name="light-envelope" size="xs" />
				</template>
				Invite by email
			</MButton>
			<MButton @click="openModal(add_modal)">
				<template #prefix>
					<MIcon name="light-user-plus" size="xs" />
				</template>
				Add team member
			</MButton>
		</template>

		<MAlert v-if="notice.text" :tone="notice.tone" live dismissible @dismiss="notice.text = ''">
			{{ notice.text }}
		</MAlert>

		<div class="team__body">
			<MTabs v-model="active_tab" :tabs="tabs" label="Team sections" panel-prefix="team" />

			<div
				id="team-members"
				role="tabpanel"
				aria-labelledby="team-tab-members"
				class="team__panel"
				:hidden="active_tab !== 'members'"
			>
				<Members
					:members="members"
					:company-id="props.company.id"
					:editable-ids="props.editableIds"
					:own-professional-id="props.ownProfessionalId"
					@invite="openInvite"
					@remove="openRemove"
				/>
			</div>

			<div
				id="team-requests"
				role="tabpanel"
				aria-labelledby="team-tab-requests"
				class="team__panel"
				:hidden="active_tab !== 'requests'"
			>
				<Requests
					:requests="requests"
					:company-name="props.company.name"
					@approve="approve"
					@reject="reject"
				/>
			</div>

			<div
				id="team-invitations"
				role="tabpanel"
				aria-labelledby="team-tab-invitations"
				class="team__panel"
				:hidden="active_tab !== 'invitations'"
			>
				<Invitations :invitations="invitations" @revoke="revoke" />
			</div>
		</div>

		<AddMember :name="add_modal" :company-name="props.company.name" @add="onAdd" />
		<Invite
			:name="invite_modal"
			:member="invite_target"
			:candidates="invite_candidates"
			@invite="onInvite"
			@add-member="switchToAdd"
		/>
		<Remove
			:name="remove_modal"
			:member="remove_target"
			:company-name="props.company.name"
			:is-self="remove_target !== null && remove_target.id === props.ownProfessionalId"
			@confirm="onRemove"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { TabItem } from '~/types/base/ui'
import type { AffiliationRequest, TeamInvitation, TeamMember, TeamOverview } from '~/types/features/dashboard'
import type { CompanyRef } from '~/types/features/directory'
import { fullName } from '~/utils/format'
import AddMember from './AddMember.vue'
import Invitations from './Invitations.vue'
import Invite from './Invite.vue'
import Members from './Members.vue'
import Remove from './Remove.vue'
import Requests from './Requests.vue'

type TeamTab = 'members' | 'requests' | 'invitations'

// GET .../team plus the affiliation, invitation and removal writes
// (docs/API.md §5). Everything updates locally while the UI is static.
interface Props {
	company: CompanyRef
	team: TeamOverview
	// members with an editor page (the static data has no editor for new rows)
	editableIds: number[]
	// the signed-in user's own profile, labelled "You"
	ownProfessionalId?: number | null
	// the invitation sender's name
	inviterName: string
	initialTab?: TeamTab
	// open the invite dialog for this roster profile (?invite=90)
	inviteFor?: number | null
}

const props = withDefaults(defineProps<Props>(), {
	ownProfessionalId: null,
	initialTab: 'members',
	inviteFor: null,
})

interface Notice {
	tone: 'success' | 'info'
	text: string
}

const { openModal, closeModal } = useModal()

const add_modal = 'team-add-member'
const invite_modal = 'team-invite'
const remove_modal = 'team-remove'

const members = ref<TeamMember[]>(props.team.members.map(member => ({ ...member })))
const requests = ref<AffiliationRequest[]>(props.team.requests.map(request => ({ ...request })))
const invitations = ref<TeamInvitation[]>(props.team.invitations.map(invitation => ({ ...invitation })))

const active_tab = ref<string>(props.initialTab)
// the latest outcome; empty text shows nothing
const notice = ref<Notice>({ tone: 'success', text: '' })
const invite_target = ref<TeamMember | null>(null)
const remove_target = ref<TeamMember | null>(null)

const tabs = computed<TabItem[]>(() => [
	{ value: 'members', label: 'Team members', count: members.value.length },
	{ value: 'requests', label: 'Affiliation requests', count: requests.value.length },
	{ value: 'invitations', label: 'Invitations', count: invitations.value.length },
])

// Only a roster profile without a login can be invited.
const invite_candidates = computed(() => members.value.filter(member => !member.has_account))

function slugFor(first_name: string, last_name: string): string {
	return `${first_name} ${last_name}`
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function nextId(): number {
	const ids = [...members.value.map(member => member.id), ...requests.value.map(request => request.professional_id)]
	return Math.max(900, ...ids) + 1
}

// --- Roster profiles ------------------------------------------

function onAdd(value: { first_name: string, last_name: string, job_title: string }) {
	const member: TeamMember = {
		id: nextId(),
		slug: slugFor(value.first_name, value.last_name),
		first_name: value.first_name,
		last_name: value.last_name,
		job_title: value.job_title,
		photo_url: null,
		status: 'draft',
		// a company-created roster row is approved from the start
		affiliation_status: 'approved',
		verified: false,
		has_account: false,
		// name, job title and company: 3 of 8 checks
		completeness_score: 38,
	}

	members.value = [...members.value, member]
	active_tab.value = 'members'
	notice.value = {
		tone: 'success',
		text: `${fullName(member)} is on your team as a draft profile. Invite them by email so they can sign in and keep it up to date.`,
	}
}

function switchToAdd() {
	closeModal(invite_modal)
	openModal(add_modal)
}

// --- Invitations ----------------------------------------------

function openInvite(member: TeamMember | null) {
	invite_target.value = member
	openModal(invite_modal)
}

function onInvite(value: { professional_id: number, email: string }) {
	const member = members.value.find(item => item.id === value.professional_id)
	if (!member) return

	const replaced = invitations.value.some(invitation => invitation.professional_id === member.id)
	const now = Date.now()

	// a new invitation revokes any unused one for the same profile
	invitations.value = [
		...invitations.value.filter(invitation => invitation.professional_id !== member.id),
		{
			id: Math.max(300, ...invitations.value.map(invitation => invitation.id)) + 1,
			professional_id: member.id,
			professional_name: fullName(member),
			email: value.email,
			invited_by: props.inviterName,
			created_at: new Date(now).toISOString(),
			expires_at: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
		},
	]
	active_tab.value = 'invitations'
	notice.value = {
		tone: 'success',
		text: `Invitation sent to ${value.email}.${replaced ? ` It replaces the earlier invitation for ${fullName(member)}.` : ''}`,
	}
}

function revoke(invitation: TeamInvitation) {
	invitations.value = invitations.value.filter(item => item.id !== invitation.id)
	notice.value = {
		tone: 'info',
		text: `Invitation to ${invitation.email} revoked. The link in that email no longer works.`,
	}
}

// --- Removal --------------------------------------------------

function openRemove(member: TeamMember) {
	remove_target.value = member
	openModal(remove_modal)
}

function onRemove() {
	const member = remove_target.value
	if (!member) return

	members.value = members.value.filter(item => item.id !== member.id)
	// removing a profile revokes its pending invitations
	invitations.value = invitations.value.filter(invitation => invitation.professional_id !== member.id)
	remove_target.value = null
	notice.value = {
		tone: 'info',
		text: `${fullName(member)} was removed from the team. Their profile is no longer shown in the directory.`,
	}
}

// --- Affiliation requests -------------------------------------

function approve(request: AffiliationRequest) {
	// approval needs the applicant's verified email (docs/API.md §5)
	if (!request.email_verified) return

	requests.value = requests.value.filter(item => item.professional_id !== request.professional_id)
	members.value = [
		...members.value,
		{
			id: request.professional_id,
			slug: slugFor(request.first_name, request.last_name),
			first_name: request.first_name,
			last_name: request.last_name,
			job_title: request.job_title,
			photo_url: null,
			// approval doesn't publish or verify
			status: 'draft',
			affiliation_status: 'approved',
			verified: false,
			has_account: true,
			// name, job title, company and a contact path: 4 of 8 checks
			completeness_score: 50,
		},
	]
	notice.value = {
		tone: 'success',
		text: `${fullName(request)} is now on your team. Their profile stays a draft until our team reviews and publishes it.`,
	}
}

function reject(request: AffiliationRequest) {
	requests.value = requests.value.filter(item => item.professional_id !== request.professional_id)
	notice.value = {
		tone: 'info',
		text: `You declined ${fullName(request)}’s request. Their draft stays private, with no access to ${props.company.name}.`,
	}
}

// Deep link from a roster profile's "Send an invitation". Wait a tick so
// the client-only dialog exists and can take focus when it opens.
onMounted(async () => {
	if (props.inviteFor === null) return
	const member = members.value.find(item => item.id === props.inviteFor && !item.has_account)
	if (!member) return

	await nextTick()
	openInvite(member)
})
</script>

<style lang="scss" scoped>
.team {
	&__body {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__panel {
		min-width: 0;

		&:focus-visible {
			outline-offset: 4px;
		}
	}
}
</style>
