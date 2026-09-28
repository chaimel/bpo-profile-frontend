<template>
	<MPage
		id="admin-professional"
		class="professional"
		:title="fullName(current)"
		:description="`${current.job_title} · ${current.company.name}`"
		:back="{ label: 'All professionals', to: '/admin/professionals' }"
	>
		<template #actions>
			<MButton v-if="is_public" variant="neutral" :to="`/professionals/${current.slug}`">
				<template #prefix>
					<MIcon name="light-external-link" size="xs" />
				</template>
				Open public profile
			</MButton>
		</template>

		<Glance :professional="current" />

		<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<div class="professional__sections">
			<Moderation :professional="current" :company="props.company" @update="apply" />
			<Verification :professional="current" @update="apply" />
			<Affiliation :professional="current" :reviewer="props.reviewer" @update="apply" />
			<Account :professional="current" />
			<Summary :professional="current" :is-public="is_public" />
			<Danger :professional="current" @update="apply" />
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { fullName } from '~/utils/format'
import Account from './Account.vue'
import Affiliation from './Affiliation.vue'
import Danger from './Danger.vue'
import Glance from './Glance.vue'
import Moderation from './Moderation.vue'
import Summary from './Summary.vue'
import Verification from './Verification.vue'
import type { AdminCompanyDetail, AdminProfessionalDetail } from '~/types/features/admin'

// GET /api/admin/professionals/{id}: publication, verification and the
// affiliation review for one person. Each decision saves on its own.
interface Props {
	professional: AdminProfessionalDetail
	// the parent company; publication depends on it
	company?: AdminCompanyDetail
	// the signed-in admin, recorded on affiliation decisions
	reviewer?: string
}

const props = withDefaults(defineProps<Props>(), {
	company: undefined,
	reviewer: 'Platform admin',
})

// Sections patch this local copy while the UI is static.
const current = ref<AdminProfessionalDetail>({ ...props.professional })
const notice = ref('')

// Public only when published, approved and inside a live, published
// company (docs/DATABASE.md §4.5).
const is_public = computed(() =>
	current.value.status === 'published'
	&& current.value.affiliation_status === 'approved'
	&& !current.value.deleted_at
	&& props.company?.status === 'published'
	&& !props.company.deleted_at,
)

function apply(changes: Partial<AdminProfessionalDetail>, message: string) {
	current.value = { ...current.value, ...changes, updated_at: new Date().toISOString() }
	notice.value = message
}
</script>

<style lang="scss" scoped>
.professional {
	&__sections {
		padding: 8px 32px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}
}

@media only screen and (max-width: 600px) {
	.professional {
		&__sections {
			padding: 4px 16px;
		}
	}
}
</style>
