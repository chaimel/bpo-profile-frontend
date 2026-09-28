<template>
	<div :class="['m-inbox', { 'm-inbox--reading': is_reading }]">
		<div class="m-inbox__toolbar">
			<MTabs
				v-model="active_status"
				:tabs="status_tabs"
				label="Filter by status"
				class="m-inbox__tabs"
			/>

			<div class="m-inbox__filters">
				<MSearch
					:id="`${props.idPrefix}-search`"
					v-model="term"
					:name="`${props.idPrefix}-search`"
					size="sm"
					label="Search inquiries"
					placeholder="Search sender, email, or company"
					class="m-inbox__search"
				/>
				<MSelect
					:id="`${props.idPrefix}-type`"
					v-model="active_type"
					:name="`${props.idPrefix}-type`"
					:options="type_options"
					placeholder="All types"
					:height="36"
					aria-label="Filter by type"
					class="m-inbox__type"
				/>
			</div>
		</div>

		<div class="m-inbox__grid">
			<!-- list -->
			<div class="m-inbox__list-wrap">
				<ul v-if="visible.length" class="m-inbox__list" aria-label="Inquiries">
					<li v-for="inquiry in visible" :key="inquiry.id">
						<button
							type="button"
							:class="[
								'm-inbox__item',
								{
									'm-inbox__item--active': inquiry.id === selected?.id,
									'm-inbox__item--unread': statusOf(inquiry) === 'new',
								},
							]"
							:aria-current="inquiry.id === selected?.id ? 'true' : undefined"
							@click="open(inquiry.id)"
						>
							<span class="m-inbox__item-head">
								<span class="m-inbox__sender">
									<span v-if="statusOf(inquiry) === 'new'" class="m-inbox__dot" />
									{{ inquiry.sender_name }}
									<span v-if="statusOf(inquiry) === 'new'" class="sr-only">(new)</span>
								</span>
								<span class="m-inbox__date">{{ formatDate(inquiry.created_at) }}</span>
							</span>
							<span class="m-inbox__excerpt">{{ inquiry.message }}</span>
							<span class="m-inbox__item-foot">
								<MBadge :tone="type_tones[inquiry.type]" size="sm">{{ inquiryTypeLabels[inquiry.type] }}</MBadge>
								<span class="m-inbox__to">{{ toLabel(inquiry) }}</span>
							</span>
						</button>
					</li>
				</ul>

				<MEmptyState v-else icon="light-envelope" variant="plain" heading-level="3">
					<template #title>No inquiries here</template>
					{{ has_filters ? 'Try another status or clear the search.' : 'New inquiries from buyers will appear here.' }}
					<template v-if="has_filters" #actions>
						<MButton variant="neutral" size="sm" @click="clearFilters">Clear filters</MButton>
					</template>
				</MEmptyState>
			</div>

			<!-- detail -->
			<article v-if="selected" class="m-inbox__detail" aria-live="polite">
				<MButton variant="text" size="sm" class="m-inbox__back" @click="is_reading = false">
					<template #prefix>
						<MIcon name="light-angle-left" size="xs" />
					</template>
					Back to inquiries
				</MButton>

				<header class="m-inbox__detail-head">
					<div class="m-inbox__detail-title">
						<MBadge :tone="type_tones[selected.type]" size="sm">{{ inquiryTypeLabels[selected.type] }}</MBadge>
						<MStatusBadge kind="inquiry" :status="statusOf(selected)" size="sm" />
					</div>
					<MHeading variant="2" size="4">{{ selected.sender_name }}</MHeading>
					<MText size="xsmall" color="--text-muted" class="m-inbox__received">Received {{ formatDateTime(selected.created_at) }}</MText>
				</header>

				<dl class="m-inbox__meta">
					<div>
						<dt>Email</dt>
						<dd><a :href="`mailto:${selected.sender_email}`" class="m-inbox__mail">{{ selected.sender_email }}</a></dd>
					</div>
					<div v-if="selected.sender_company">
						<dt>Company</dt>
						<dd>{{ selected.sender_company }}</dd>
					</div>
					<div v-if="selected.sender_phone">
						<dt>Phone</dt>
						<dd>{{ selected.sender_phone }}</dd>
					</div>
					<div>
						<dt>Sent to</dt>
						<dd>{{ toLabel(selected, true) }}</dd>
					</div>
					<div v-if="selected.meta_json?.services?.length">
						<dt>Services</dt>
						<dd>{{ selected.meta_json.services.map(serviceName).join(', ') }}</dd>
					</div>
					<div v-if="selected.meta_json?.timeline">
						<dt>Timeline</dt>
						<dd>{{ selected.meta_json.timeline }}</dd>
					</div>
					<div v-if="selected.meta_json?.budget">
						<dt>Team size or budget</dt>
						<dd>{{ selected.meta_json.budget }}</dd>
					</div>
					<div v-if="selected.source_path">
						<dt>Sent from</dt>
						<dd>
							<NuxtLink :to="selected.source_path" class="m-inbox__source">{{ sourceLabel(selected.source_path) }}</NuxtLink>
						</dd>
					</div>
				</dl>

				<MText class="m-inbox__message">{{ selected.message }}</MText>

				<div class="m-inbox__actions">
					<MButton
						v-if="props.scope !== 'admin'"
						:href="`mailto:${selected.sender_email}?subject=${encodeURIComponent(reply_subject)}`"
					>
						<template #prefix>
							<MIcon name="light-envelope" size="xs" />
						</template>
						Reply by email
					</MButton>
					<MButton
						v-if="props.scope !== 'admin' && statusOf(selected) !== 'replied'"
						variant="neutral"
						@click="setStatus(selected.id, 'replied')"
					>
						Mark as replied
					</MButton>
					<MDropdown label="More actions" :items="more_actions" variant="neutral" @select="onAction" />
				</div>

				<MText v-if="props.scope === 'admin'" size="small" color="--text-muted" class="m-inbox__footnote">
					Moderation changes the status only. Sender content and the target can’t be edited.
				</MText>
				<MText v-else size="small" color="--text-muted" class="m-inbox__footnote">
					Replies go from your own email. Marking an inquiry as spam removes it from your stats.
				</MText>
			</article>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { DropdownItem, SelectOption, TabItem, Tone } from '~/types/base/ui'
import type { Inquiry, InquiryStatus, InquiryType } from '~/types/features/inquiry'
import { formatDate, formatDateTime } from '~/utils/format'
import { inquiryTypeLabels } from '~/utils/labels'

const { services } = useCatalogStore()

// Shared inbox: a company's inbox, a sales pro's own inbox, and the
// platform moderation queue (docs/API.md §5, §6, §8).
interface Props {
	idPrefix: string
	inquiries: Inquiry[]
	scope: 'company' | 'professional' | 'admin'
}

const props = defineProps<Props>()

const type_tones: Record<InquiryType, Tone> = {
	contact: 'slate',
	question: 'neutral',
	quote: 'brand',
	platform: 'warning',
}

// Status changes are local while the UI is static.
const overrides = reactive<Record<number, InquiryStatus>>({})
const active_status = ref('all')
const active_type = ref('')
const term = ref('')
const selected_id = ref<number | null>(props.inquiries[0]?.id ?? null)
const is_reading = ref(false)

function statusOf(inquiry: Inquiry): InquiryStatus {
	return overrides[inquiry.id] ?? inquiry.status
}

const status_tabs = computed<TabItem[]>(() => {
	const count = (status: InquiryStatus) => props.inquiries.filter(item => statusOf(item) === status).length
	return [
		{ value: 'all', label: 'All', count: props.inquiries.filter(item => statusOf(item) !== 'spam').length },
		{ value: 'new', label: 'New', count: count('new') },
		{ value: 'read', label: 'Read', count: count('read') },
		{ value: 'replied', label: 'Replied', count: count('replied') },
		{ value: 'archived', label: 'Archived', count: count('archived') },
		{ value: 'spam', label: 'Spam', count: count('spam') },
	]
})

const type_options = computed<SelectOption[]>(() => {
	const types: InquiryType[] = props.scope === 'admin'
		? ['contact', 'question', 'quote', 'platform']
		: ['contact', 'question', 'quote']
	return types.map(type => ({ label: inquiryTypeLabels[type], value: type }))
})

const has_filters = computed(() => active_status.value !== 'all' || Boolean(active_type.value) || Boolean(term.value.trim()))

const visible = computed(() => {
	const query = term.value.trim().toLowerCase()

	return props.inquiries.filter((inquiry) => {
		const status = statusOf(inquiry)
		if (active_status.value === 'all' && status === 'spam') return false
		if (active_status.value !== 'all' && status !== active_status.value) return false
		if (active_type.value && inquiry.type !== active_type.value) return false
		if (!query) return true
		return [inquiry.sender_name, inquiry.sender_email, inquiry.sender_company ?? '']
			.join(' ')
			.toLowerCase()
			.includes(query)
	})
})

const selected = computed(() =>
	visible.value.find(item => item.id === selected_id.value) ?? visible.value[0] ?? null,
)

const reply_subject = computed(() =>
	selected.value ? `Re: your ${inquiryTypeLabels[selected.value.type].toLowerCase()} on BPO Profile` : '',
)

const more_actions = computed<DropdownItem[]>(() => {
	if (!selected.value) return []
	const status = statusOf(selected.value)
	const items: DropdownItem[] = []

	if (status !== 'read' && status !== 'new') items.push({ label: 'Move back to inbox', value: 'read', icon: 'light-undo' })
	if (status === 'new') items.push({ label: 'Mark as read', value: 'read', icon: 'light-eye' })
	if (status !== 'archived') items.push({ label: 'Archive', value: 'archived', icon: 'light-box-full' })
	if (status !== 'spam') items.push({ label: 'Mark as spam', value: 'spam', icon: 'light-flag', tone: 'danger', divided: true })
	if (props.scope === 'admin') items.push({ label: 'Delete', value: 'delete', icon: 'light-trash', tone: 'danger' })
	return items
})

function toLabel(inquiry: Inquiry, long = false): string {
	if (inquiry.type === 'platform') return 'BPO Profile team'
	const target = inquiry.professional?.name ?? `${long ? `${inquiry.company?.name ?? ''} ` : ''}sales inbox`.trim()
	if (props.scope === 'admin' && inquiry.company) return `${target} · ${inquiry.company.name}`
	return target
}

function serviceName(slug: string): string {
	return services.find(service => service.slug === slug)?.name ?? slug
}

function open(id: number) {
	selected_id.value = id
	is_reading.value = true
	const inquiry = props.inquiries.find(item => item.id === id)
	// opening a new inquiry marks it read, as the dashboard would
	if (inquiry && statusOf(inquiry) === 'new' && props.scope !== 'admin') overrides[id] = 'read'
}

function setStatus(id: number, status: InquiryStatus) {
	overrides[id] = status
}

function onAction(item: DropdownItem) {
	if (!selected.value) return
	if (item.value === 'delete') return
	setStatus(selected.value.id, item.value as InquiryStatus)
}

function clearFilters() {
	active_status.value = 'all'
	active_type.value = ''
	term.value = ''
}

// The page the buyer wrote from, named rather than shown as a raw path.
function sourceLabel(path: string): string {
	if (path.startsWith('/professionals/')) return 'Sales profile page'
	if (path.startsWith('/companies/')) return 'Company profile page'
	return path
}
</script>

<style lang="scss" scoped>
.m-inbox {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__toolbar {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__filters {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__search {
		flex: 1 1 280px;
		max-width: 420px;
	}

	&__type {
		width: 180px;
	}

	// --- Split view --------------------------------------------
	&__grid {
		display: grid;
		grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
		align-items: start;
		gap: 16px;
	}

	&__list-wrap {
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
		overflow: hidden;
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
		padding: 16px;
		border-bottom: var(--rule);
		text-align: left;
		cursor: pointer;
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--canvas);
		}

		&--active,
		&--active:hover {
			background: var(--brand-tint);
			box-shadow: inset 3px 0 0 var(--brand);
		}

		&:focus-visible {
			outline-offset: -2px;
		}
	}

	li:last-child &__item {
		border-bottom: 0;
	}

	&__item-head,
	&__item-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	&__sender {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--text-primary);
	}

	&__item--unread &__sender {
		font-weight: 700;
	}

	&__dot {
		flex: 0 0 auto;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--brand);
	}

	&__date,
	&__to {
		flex: 0 0 auto;
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-muted);
	}

	&__to {
		flex: 0 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__excerpt {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 15px;
		line-height: 21px;
		color: var(--text-secondary);
	}

	// --- Detail ------------------------------------------------
	&__detail {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 28px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__back {
		display: none;
		align-self: flex-start;
	}

	&__detail-head {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__detail-title {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	&__received {
		font-family: var(--font-ui);
	}

	&__meta {
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

	&__mail,
	&__source {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	&__message {
		white-space: pre-wrap;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
}

@media only screen and (max-width: 1024px) {
	.m-inbox {
		&__grid {
			grid-template-columns: 1fr;
		}

		&__detail {
			display: none;
			padding: 20px;
		}

		&__back {
			display: inline-flex;
		}

		// phones and tablets show one pane at a time
		&--reading {
			.m-inbox__list-wrap {
				display: none;
			}

			.m-inbox__detail {
				display: flex;
			}
		}
	}
}
</style>
