<template>
	<MFormSection
		id="moderation"
		class="moderation"
		title="Moderation"
		description="Whether this profile is public. A professional can ask for a review once their affiliation is approved; only platform admins publish or suspend."
	>
		<fieldset class="moderation__options">
			<legend class="moderation__legend">Publication status</legend>

			<div class="moderation__grid">
				<MRadio
					v-for="option in options"
					:id="`moderation-${option.value}`"
					:key="option.value"
					v-model="status"
					name="moderation-status"
					:value="option.value"
					variant="card"
					:disabled="option.disabled"
				>
					{{ option.label }}
					<template #description>{{ option.description }}</template>
				</MRadio>
			</div>
		</fieldset>

		<MText v-if="is_deleted" size="small" color="--text-secondary" class="moderation__blocked">
			<MIcon name="light-info-circle" size="sm" color="text-muted" />
			Restore the profile before changing its status.
		</MText>
		<MText
			v-else-if="!can_publish && props.professional.status !== 'published'"
			size="small"
			color="--text-secondary"
			class="moderation__blocked"
		>
			<MIcon name="light-info-circle" size="sm" color="text-muted" />
			Publishing unlocks once every requirement below is met.
		</MText>

		<div class="moderation__checks">
			<MHeading variant="3" size="6" weight="semi-bold" class="moderation__checks-title">
				Publication requirements
			</MHeading>
			<ul class="moderation__list">
				<li v-for="check in checks" :key="check.key" class="moderation__check">
					<MIcon
						:name="check.met ? 'light-check-circle' : 'light-times-circle'"
						size="sm"
						:color="check.met ? 'success' : 'danger'"
					/>
					<span class="moderation__check-text">
						<span class="moderation__check-label">
							{{ check.label }}
							<span class="moderation__check-state">{{ check.met ? 'Met' : 'Not met' }}</span>
						</span>
						<span v-if="check.detail" class="moderation__check-detail">{{ check.detail }}</span>
					</span>
				</li>
			</ul>
			<MText size="small" color="--text-muted" class="moderation__aside">
				Publishing doesn’t verify the person. Verification is its own decision below.
			</MText>
		</div>

		<MTextarea
			id="moderation-note"
			v-model="note"
			name="moderation_note"
			:rows="3"
			optional
			:disabled="is_deleted"
		>
			<template #label>Internal note</template>
			<template #hint>Only platform admins see this. Say why you changed the status.</template>
		</MTextarea>

		<div v-if="props.professional.moderation_note" class="moderation__last">
			<span class="moderation__last-label">Latest note</span>
			<MText size="small" color="--text-secondary" class="moderation__last-text">
				{{ props.professional.moderation_note }}
			</MText>
		</div>

		<div class="moderation__actions">
			<MButton :disabled="!is_dirty || is_deleted" @click="save">Save status</MButton>
		</div>
	</MFormSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import type { PublicationStatus } from '~/types/features/directory'
import { publicationStatusMeta } from '~/utils/labels'
import type { AdminCompanyDetail, AdminProfessionalDetail } from '~/types/features/admin'

const { professionalPublicationChecks } = useAdminStore()

// Publication status for one person (PATCH /api/admin/professionals/{id}).
interface Props {
	professional: AdminProfessionalDetail
	company?: AdminCompanyDetail
}

interface StatusOption {
	value: PublicationStatus
	label: string
	description: string
	disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
	company: undefined,
})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminProfessionalDetail>, _message: string): void
}>()

const status = ref<string>(props.professional.status)
const note = ref('')

// follow restores and other changes made elsewhere on the page
watch(() => props.professional.status, (value) => {
	status.value = value
})

const is_deleted = computed(() => Boolean(props.professional.deleted_at))
const checks = computed(() => professionalPublicationChecks(props.professional, props.company))
const can_publish = computed(() => checks.value.every(check => check.met))

const options = computed<StatusOption[]>(() => [
	{
		value: 'draft',
		label: 'Draft',
		description: 'Private. The person and their company keep editing.',
		disabled: is_deleted.value,
	},
	{
		value: 'pending_review',
		label: 'Pending review',
		description: 'Submitted for review. Still private.',
		disabled: is_deleted.value,
	},
	{
		value: 'published',
		label: 'Published',
		description: 'Visible in search and on the company’s team.',
		disabled: is_deleted.value || (!can_publish.value && props.professional.status !== 'published'),
	},
	{
		value: 'suspended',
		label: 'Suspended',
		description: 'Hidden by the platform. Nobody can republish it but you.',
		disabled: is_deleted.value,
	},
])

const is_dirty = computed(() => status.value !== props.professional.status || Boolean(note.value.trim()))

function isStatus(value: string): value is PublicationStatus {
	return value in publicationStatusMeta
}

function save() {
	if (!isStatus(status.value)) return
	const next = status.value
	const changes: Partial<AdminProfessionalDetail> = { status: next }

	if (note.value.trim()) changes.moderation_note = note.value.trim()
	if (next === 'published' && !props.professional.published_at) changes.published_at = new Date().toISOString()

	emit(
		'update',
		changes,
		next === props.professional.status
			? 'Your note was saved.'
			: `Status saved: ${publicationStatusMeta[next].label}.`,
	)
	note.value = ''
}
</script>

<style lang="scss" scoped>
.moderation {
	&__options {
		min-width: 0;
	}

	&__legend {
		margin-bottom: 10px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	&__blocked {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	&__checks {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px 18px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
	}

	&__checks-title {
		font-family: var(--font-ui);
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__check {
		display: flex;
		align-items: flex-start;
		gap: 10px;

		.m-icon {
			margin-top: 2px;
		}
	}

	&__check-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__check-label {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 4px 10px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--text-primary);
	}

	&__check-state {
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted);
	}

	&__check-detail {
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
		overflow-wrap: anywhere;
	}

	&__aside {
		padding-top: 10px;
		border-top: var(--rule);
	}

	&__last {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-left: 14px;
		border-left: 3px solid var(--border-strong);
	}

	&__last-label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__actions {
		display: flex;
		gap: 8px;
	}
}

@media only screen and (max-width: 600px) {
	.moderation {
		&__grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>
