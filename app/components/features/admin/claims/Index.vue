<template>
	<MPage
		id="admin-claims"
		class="claims"
		title="Claims"
		description="Requests to take over an unclaimed listing. You review who’s asking; the claimant finishes the job."
	>
		<MAlert tone="info">
			<template #title>Approving doesn’t make anyone an owner</template>
			It emails a single-use claim link to the claimant’s verified address. Ownership starts only when they
			accept it, and any competing claims for that company are closed at that moment.
		</MAlert>

		<div v-if="props.companyId" class="claims__filter">
			<MIcon name="light-filter" size="sm" color="text-muted" />
			<span>
				Showing claims for <strong>{{ props.companyName ?? 'this company' }}</strong>
			</span>
			<MButton variant="text" size="sm" to="/admin/claims">Show all claims</MButton>
		</div>

		<MTabs v-model="active_status" :tabs="status_tabs" label="Claims by status" panel-prefix="claims" />

		<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<div
			:id="`claims-${active_status}`"
			role="tabpanel"
			:aria-labelledby="`claims-tab-${active_status}`"
			:class="['claims__grid', { 'claims__grid--reading': is_reading && selected }]"
		>
			<List
				class="claims__list"
				:claims="visible"
				:all-claims="rows"
				:selected-id="selected?.id ?? null"
				:status="active_status"
				@select="open"
			/>

			<Detail
				v-if="selected"
				:key="selected.id"
				class="claims__detail"
				:claim="selected"
				:competing="competing"
				@approve="approve"
				@reject="reject"
				@reissue="reissue"
				@back="is_reading = false"
			/>
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TabItem } from '~/types/base/ui'
import type { AdminClaim } from '~/types/features/admin'
import type { ClaimStatus } from '~/types/features/onboarding'
import Detail from './Detail.vue'
import List from './List.vue'

// GET /api/admin/claims, PATCH /api/admin/claims/{id} and
// POST /api/admin/claims/{id}/token (docs/API.md §7–8).
interface Props {
	claims: AdminClaim[]
	// initial tab from ?status=
	status?: string
	// a claim to open, from ?claim=
	claimId?: number | null
	// limit the list to one company, from ?company=
	companyId?: number | null
	companyName?: string | null
	// the signed-in admin, recorded as reviewer
	reviewer?: string
}

const props = withDefaults(defineProps<Props>(), {
	status: '',
	claimId: null,
	companyId: null,
	companyName: null,
	reviewer: 'Platform admin',
})

const day = 24 * 60 * 60 * 1000
// placeholder: the real claim-link lifetime is a server setting
const link_days = 7
const statuses: ClaimStatus[] = ['pending', 'approved', 'rejected', 'fulfilled']

// Decisions change this local copy while the UI is static.
const rows = ref<AdminClaim[]>(props.claims.map(claim => ({ ...claim })))
const active_status = ref<string>(initialStatus())
const selected_id = ref<number | null>(props.claimId)
const is_reading = ref(Boolean(props.claimId))
const notice = ref('')

function isStatus(value: string): value is ClaimStatus {
	return (statuses as string[]).includes(value)
}

function initialStatus(): string {
	const claim = props.claims.find(item => item.id === props.claimId)
	if (claim) return claim.status
	return isStatus(props.status) ? props.status : 'pending'
}

watch(() => props.claimId, (id) => {
	const claim = rows.value.find(item => item.id === id)
	if (!claim) return
	selected_id.value = claim.id
	active_status.value = claim.status
	is_reading.value = true
})

watch(() => props.status, (value) => {
	if (isStatus(value)) active_status.value = value
})

const scoped = computed(() =>
	props.companyId ? rows.value.filter(claim => claim.company.id === props.companyId) : rows.value,
)

const status_tabs = computed<TabItem[]>(() => [
	{ value: 'pending', label: 'Pending', count: scoped.value.filter(claim => claim.status === 'pending').length },
	{ value: 'approved', label: 'Approved', count: scoped.value.filter(claim => claim.status === 'approved').length },
	{ value: 'rejected', label: 'Rejected', count: scoped.value.filter(claim => claim.status === 'rejected').length },
	{ value: 'fulfilled', label: 'Fulfilled', count: scoped.value.filter(claim => claim.status === 'fulfilled').length },
])

const visible = computed(() =>
	scoped.value
		.filter(claim => claim.status === active_status.value)
		.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
)

const selected = computed(() =>
	visible.value.find(claim => claim.id === selected_id.value) ?? visible.value[0] ?? null,
)

// other open requests for the same company; the first to accept a
// link becomes the owner and the rest are closed automatically
const competing = computed(() => {
	const current = selected.value
	if (!current) return []
	return rows.value.filter(claim =>
		claim.company.id === current.company.id
		&& claim.id !== current.id
		&& (claim.status === 'pending' || claim.status === 'approved'),
	)
})

function open(id: number) {
	selected_id.value = id
	is_reading.value = true
}

function patch(id: number, changes: Partial<AdminClaim>) {
	rows.value = rows.value.map(claim => (claim.id === id ? { ...claim, ...changes } : claim))
}

function linkTimes() {
	const now = Date.now()
	return {
		token_sent_at: new Date(now).toISOString(),
		token_expires_at: new Date(now + link_days * day).toISOString(),
	}
}

function approve(note: string) {
	const claim = selected.value
	if (!claim) return

	patch(claim.id, {
		status: 'approved',
		reviewed_by: props.reviewer,
		reviewed_at: new Date().toISOString(),
		review_note: note || claim.review_note,
		...linkTimes(),
	})
	selected_id.value = claim.id
	active_status.value = 'approved'
	notice.value = `Claim approved. A single-use claim link went to ${claim.claimant.email}. ${claim.company.name} stays unclaimed until they accept it.`
}

function reject(note: string) {
	const claim = selected.value
	if (!claim) return

	patch(claim.id, {
		status: 'rejected',
		reviewed_by: props.reviewer,
		reviewed_at: new Date().toISOString(),
		review_note: note,
	})
	selected_id.value = claim.id
	active_status.value = 'rejected'
	notice.value = `The claim from ${claim.claimant.name} was rejected. Your note stays internal.`
}

function reissue() {
	const claim = selected.value
	if (!claim) return

	patch(claim.id, linkTimes())
	notice.value = `A new claim link went to ${claim.claimant.email}. The previous unused link no longer works.`
}
</script>

<style lang="scss" scoped>
.claims {
	&__filter {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 12px;
		padding: 10px 14px;
		border-radius: var(--radius-sm);
		background: var(--slate-soft);
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--text-primary);
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
		align-items: start;
		gap: 16px;
	}
}

@media only screen and (max-width: 1024px) {
	.claims {
		&__grid {
			grid-template-columns: 1fr;
		}

		// phones and tablets show one pane at a time
		&__grid .claims__detail {
			display: none;
		}

		&__grid--reading .claims__list {
			display: none;
		}

		&__grid--reading .claims__detail {
			display: flex;
		}
	}
}
</style>
