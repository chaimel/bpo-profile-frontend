<template>
	<article class="detail" aria-labelledby="claim-detail-title">
		<MButton variant="text" size="sm" class="detail__back" @click="emit('back')">
			<template #prefix>
				<MIcon name="light-angle-left" size="xs" />
			</template>
			Back to claims
		</MButton>

		<header class="detail__head">
			<MStatusBadge kind="claim" :status="props.claim.status" size="sm" />
			<MHeading id="claim-detail-title" variant="2" size="4">{{ props.claim.company.name }}</MHeading>
			<MText size="xsmall" color="--text-muted" class="detail__sub">
				Claim from {{ props.claim.claimant.name }}, submitted {{ formatDateTime(props.claim.created_at) }}
			</MText>
		</header>

		<MAlert v-if="props.competing.length && is_open" tone="warning">
			<template #title>{{ competing_title }}</template>
			Review them together. When one claimant accepts their link, the other open claims for
			{{ props.claim.company.name }} are rejected automatically.
		</MAlert>

		<dl class="detail__meta">
			<div>
				<dt>Company</dt>
				<dd>
					<NuxtLink :to="`/admin/companies/${props.claim.company.id}`" class="detail__link">
						{{ props.claim.company.name }}
					</NuxtLink>
				</dd>
			</div>
			<div>
				<dt>Headquarters</dt>
				<dd>{{ props.claim.company.hq ?? 'Not set' }}</dd>
			</div>
			<div>
				<dt>Website</dt>
				<dd>
					<a
						v-if="props.claim.company.website_url"
						:href="props.claim.company.website_url"
						target="_blank"
						rel="noopener noreferrer"
						class="detail__link"
					>
						{{ website_host }}
						<span class="sr-only">(opens in a new tab)</span>
					</a>
					<template v-else>Not set</template>
				</dd>
			</div>
			<div>
				<dt>Claimant</dt>
				<dd>{{ props.claim.claimant.name }}</dd>
			</div>
			<div class="detail__wide">
				<dt>Email</dt>
				<dd class="detail__email">
					<a :href="`mailto:${props.claim.claimant.email}`" class="detail__link">{{ props.claim.claimant.email }}</a>
					<MBadge
						:tone="is_verified ? 'success' : 'warning'"
						:icon="is_verified ? 'light-check-circle' : 'light-exclamation-triangle'"
						size="sm"
					>
						{{ is_verified ? 'Email verified' : 'Email not verified' }}
					</MBadge>
				</dd>
			</div>
		</dl>

		<MText v-if="website_host" size="small" color="--text-secondary" class="detail__signal">
			<MIcon
				:name="domain_matches ? 'light-check-circle' : 'light-info-circle'"
				size="sm"
				:color="domain_matches ? 'success' : 'text-muted'"
			/>
			{{ domain_matches
				? 'The email address is on the company’s website domain.'
				: 'The email address isn’t on the company’s website domain. Ask for proof they work there before approving.' }}
		</MText>

		<!-- pending: the decision -->
		<template v-if="props.claim.status === 'pending'">
			<MTextarea
				id="claim-review-note"
				v-model="note"
				name="review_note"
				:rows="4"
				:has-error="Boolean(note_error)"
			>
				<template #label>Internal review note</template>
				<template #hint>Required to reject. Only platform admins see it; it’s never shown to the claimant.</template>
				<template #error>{{ note_error }}</template>
			</MTextarea>

			<div class="detail__actions">
				<MButton :disabled="!is_verified" @click="approve">
					<template #prefix>
						<MIcon name="light-paper-plane" size="xs" />
					</template>
					Approve and email claim link
				</MButton>
				<MButton variant="neutral" @click="reject">Reject claim</MButton>
			</div>

			<MText size="small" color="--text-muted" class="detail__footnote">
				{{ is_verified
					? `Approving emails a single-use link to ${props.claim.claimant.email}. It doesn’t verify or publish the company.`
					: 'Approval needs the claimant’s verified email. It unlocks once they sign in with the emailed code.' }}
			</MText>
		</template>

		<!-- approved: waiting for the claimant -->
		<template v-else-if="props.claim.status === 'approved'">
			<dl class="detail__token">
				<div>
					<dt>Claim link sent</dt>
					<dd>{{ formatDateTime(props.claim.token_sent_at) }}</dd>
				</div>
				<div>
					<dt>Link expires</dt>
					<dd>{{ formatDateTime(props.claim.token_expires_at) }}</dd>
				</div>
				<div>
					<dt>Approved by</dt>
					<dd>{{ props.claim.reviewed_by ?? 'Unknown' }}</dd>
				</div>
			</dl>

			<div v-if="props.claim.review_note" class="detail__note">
				<span class="detail__note-label">Internal note · never shown to the claimant</span>
				<MText size="small" color="--text-secondary">{{ props.claim.review_note }}</MText>
			</div>

			<div class="detail__actions">
				<MButton variant="neutral" @click="emit('reissue')">
					<template #prefix>
						<MIcon name="light-sync" size="xs" />
					</template>
					Reissue claim link
				</MButton>
			</div>

			<MText size="small" color="--text-muted" class="detail__footnote">
				Reissuing emails a new link and revokes the unused one. {{ props.claim.claimant.name }} becomes an
				owner only by accepting it while signed in with {{ props.claim.claimant.email }}.
			</MText>
		</template>

		<!-- rejected or fulfilled: read-only history -->
		<template v-else>
			<MText size="small" color="--text-primary" class="detail__outcome">
				<MIcon
					:name="props.claim.status === 'fulfilled' ? 'light-check-circle' : 'light-times-circle'"
					size="sm"
					:color="props.claim.status === 'fulfilled' ? 'success' : 'danger'"
				/>
				{{ props.claim.status === 'fulfilled'
					? `${props.claim.claimant.name} accepted the claim link and now owns this listing.`
					: 'This claim was rejected. The claimant would need to submit a new request.' }}
			</MText>

			<dl class="detail__token">
				<div>
					<dt>Reviewed by</dt>
					<dd>{{ props.claim.reviewed_by ?? 'Unknown' }}</dd>
				</div>
				<div>
					<dt>Reviewed</dt>
					<dd>{{ formatDateTime(props.claim.reviewed_at) }}</dd>
				</div>
				<div v-if="props.claim.token_sent_at">
					<dt>Claim link sent</dt>
					<dd>{{ formatDateTime(props.claim.token_sent_at) }}</dd>
				</div>
			</dl>

			<div v-if="props.claim.review_note" class="detail__note">
				<span class="detail__note-label">Internal note · never shown to the claimant</span>
				<MText size="small" color="--text-secondary">{{ props.claim.review_note }}</MText>
			</div>

			<MText size="small" color="--text-muted" class="detail__footnote">
				Fulfilled and rejected claims are history. They can’t receive new links.
			</MText>
		</template>
	</article>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { AdminClaim } from '~/types/features/admin'
import { formatDateTime, hostname } from '~/utils/format'

interface Props {
	claim: AdminClaim
	// other pending or approved claims for the same company
	competing?: AdminClaim[]
}

const props = withDefaults(defineProps<Props>(), {
	competing: () => [],
})

const emit = defineEmits<{
	(_e: 'approve' | 'reject', _note: string): void
	(_e: 'reissue' | 'back'): void
}>()

const note = ref('')
const note_error = ref('')

const is_open = computed(() => props.claim.status === 'pending' || props.claim.status === 'approved')
const is_verified = computed(() => Boolean(props.claim.claimant.email_verified_at))
const website_host = computed(() => hostname(props.claim.company.website_url))

const domain_matches = computed(() => {
	const domain = props.claim.claimant.email.split('@').pop()?.toLowerCase() ?? ''
	return Boolean(website_host.value) && domain === website_host.value.toLowerCase()
})

const competing_title = computed(() => {
	const names = props.competing.map(claim => claim.claimant.name)
	return names.length === 1
		? `${names[0]} also has an open claim for this company`
		: `${names.length} other people have open claims for this company`
})

function approve() {
	note_error.value = ''
	emit('approve', note.value.trim())
}

async function reject() {
	if (!note.value.trim()) {
		note_error.value = 'Add a note explaining why you’re rejecting this claim.'
		await nextTick()
		document.getElementById('claim-review-note')?.focus()
		return
	}

	note_error.value = ''
	emit('reject', note.value.trim())
}
</script>

<style lang="scss" scoped>
.detail {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 28px;
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	&__back {
		display: none;
		align-self: flex-start;
	}

	&__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	&__sub {
		font-family: var(--font-ui);
	}

	&__meta,
	&__token {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 14px 24px;
		padding: 16px 0;
		border-top: var(--rule);
		border-bottom: var(--rule);

		dt {
			font-family: var(--font-ui);
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--text-muted);
		}

		dd {
			margin-top: 2px;
			font-size: 16px;
			line-height: 23px;
			overflow-wrap: anywhere;
		}
	}

	&__wide {
		grid-column: 1 / -1;
	}

	&__email {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px 10px;
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	&__signal,
	&__outcome {
		display: flex;
		align-items: flex-start;
		gap: 8px;

		.m-icon {
			margin-top: 3px;
		}
	}

	&__note {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 16px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
	}

	&__note-label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted);
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
}

@media only screen and (max-width: 1024px) {
	.detail {
		padding: 20px;

		&__back {
			display: inline-flex;
		}
	}
}
</style>
