<template>
	<div class="certifications">
		<MFormSection
			:id="props.idPrefix"
			title="Certifications"
			description="Standards your company is certified against, like ISO/IEC 27001 or PCI DSS. They appear on your profile in this order."
		>
			<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
				{{ notice }}
			</MAlert>

			<ul v-if="items.length" class="certifications__list">
				<li v-for="item in items" :key="item.id" class="certifications__item">
					<span class="certifications__icon">
						<MIcon name="light-award" size="md" />
					</span>
					<div class="certifications__text">
						<span class="certifications__name">{{ item.name }}</span>
						<span class="certifications__meta">{{ metaOf(item) }}</span>
					</div>
					<div class="certifications__actions">
						<MButton variant="ghost" size="sm" @click="openEdit(item)">
							Edit<span class="sr-only"> {{ item.name }}</span>
						</MButton>
						<MButton variant="ghost" size="sm" @click="openRemove(item)">
							Remove<span class="sr-only"> {{ item.name }}</span>
						</MButton>
					</div>
				</li>
			</ul>

			<MEmptyState v-else icon="light-award" variant="plain" heading-level="3">
				<template #title>No certifications listed</template>
				Add the standards your teams are certified against, with the issuing body and year.
			</MEmptyState>

			<div class="certifications__foot">
				<MButton variant="neutral" @click="openAdd">
					<template #prefix>
						<MIcon name="light-plus" size="xs" />
					</template>
					Add certification
				</MButton>
				<MText size="small" color="--text-muted" class="certifications__note">
					Certification changes save as soon as you make them.
				</MText>
			</div>
		</MFormSection>

		<CertificationForm
			:name="form_modal"
			:id-prefix="props.idPrefix"
			:certification="editing"
			@save="onSave"
		/>
		<CertificationRemove
			:name="remove_modal"
			:certification="removing"
			@confirm="onRemove"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import type { Certification } from '~/types/features/directory'
import CertificationForm from './Form.vue'
import CertificationRemove from './Remove.vue'

// POST / PUT / DELETE .../certifications — each change is its own
// request, so this list keeps local state instead of joining a form.
interface Props {
	idPrefix: string
	certifications: Certification[]
}

const props = defineProps<Props>()

const { openModal } = useModal()

const form_modal = `${props.idPrefix}-form`
const remove_modal = `${props.idPrefix}-remove`

const items = ref<Certification[]>(props.certifications.map(item => ({ ...item })))
const editing = ref<Certification | null>(null)
const removing = ref<Certification | null>(null)
const notice = ref('')

function metaOf(item: Certification): string {
	const parts = [item.issuer, item.year ? String(item.year) : null].filter(Boolean)
	return parts.length ? parts.join(' · ') : 'Issuer and year not listed'
}

function openAdd() {
	editing.value = null
	openModal(form_modal)
}

function openEdit(item: Certification) {
	editing.value = item
	openModal(form_modal)
}

function openRemove(item: Certification) {
	removing.value = item
	openModal(remove_modal)
}

function onSave(value: Omit<Certification, 'id'>) {
	const current = editing.value

	if (current) {
		items.value = items.value.map(item => (item.id === current.id ? { ...value, id: current.id } : item))
		notice.value = `Saved your changes to ${value.name}.`
		return
	}

	const next_id = items.value.reduce((max, item) => Math.max(max, item.id), 0) + 1
	items.value = [...items.value, { ...value, id: next_id }]
	notice.value = `Added ${value.name} to your profile.`
}

function onRemove() {
	const target = removing.value
	if (!target) return

	items.value = items.value.filter(item => item.id !== target.id)
	notice.value = `Removed ${target.name} from your profile.`
	removing.value = null
}
</script>

<style lang="scss" scoped>
.certifications {
	padding: 8px 28px;
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	&__list {
		display: flex;
		flex-direction: column;
		border-top: var(--rule);
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 0;
		border-bottom: var(--rule);
	}

	&__icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-sm);
		background: var(--brand-tint);
		color: var(--brand-deep);
	}

	&__text {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
	}

	&__meta {
		font-size: 14px;
		line-height: 20px;
		color: var(--text-muted);
	}

	&__actions {
		display: flex;
		flex: 0 0 auto;
		gap: 4px;
	}

	&__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
	}
}

@media only screen and (max-width: 600px) {
	.certifications {
		padding: 0 16px 8px;

		&__item {
			flex-wrap: wrap;
		}

		&__actions {
			width: 100%;
			padding-left: 54px;
		}
	}
}
</style>
