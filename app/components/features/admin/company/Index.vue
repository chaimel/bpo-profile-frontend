<template>
	<MPage
		id="admin-company"
		class="company"
		:title="current.name"
		:description="description"
		:back="{ label: 'All companies', to: '/admin/companies' }"
	>
		<template #actions>
			<MButton v-if="is_public" variant="neutral" :to="`/companies/${current.slug}`">
				<template #prefix>
					<MIcon name="light-external-link" size="xs" />
				</template>
				Open public profile
			</MButton>
		</template>

		<Glance :company="current" />

		<MAlert v-if="notice" tone="success" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<div class="company__sections">
			<Moderation :company="current" @update="apply" />
			<Verification :company="current" @update="apply" />
			<Plan :company="current" @update="apply" />
			<Ownership :company="current" :claims="props.claims" />
			<Team :company="current" :team="props.team" />
			<Summary :company="current" />
			<Danger :company="current" @update="apply" />
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdminClaim, AdminCompanyDetail, AdminProfessionalRow } from '~/types/features/admin'
import Danger from './Danger.vue'
import Glance from './Glance.vue'
import Moderation from './Moderation.vue'
import Ownership from './Ownership.vue'
import Plan from './Plan.vue'
import Summary from './Summary.vue'
import Team from './Team.vue'
import Verification from './Verification.vue'

// GET /api/admin/companies/{id}: moderation, verification, plan and
// lifecycle for one listing. Each decision saves on its own.
interface Props {
	company: AdminCompanyDetail
	team: AdminProfessionalRow[]
	claims: AdminClaim[]
}

const props = withDefaults(defineProps<Props>(), {})

// Sections patch this local copy while the UI is static.
const current = ref<AdminCompanyDetail>({ ...props.company })
const notice = ref('')

const is_public = computed(() => current.value.status === 'published' && !current.value.deleted_at)

const description = computed(() =>
	[current.value.hq ?? 'Headquarters not set', `/companies/${current.value.slug}`].join(' · '),
)

function apply(changes: Partial<AdminCompanyDetail>, message: string) {
	current.value = { ...current.value, ...changes, updated_at: new Date().toISOString() }
	notice.value = message
}
</script>

<style lang="scss" scoped>
.company {
	&__sections {
		padding: 8px 32px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}
}

@media only screen and (max-width: 600px) {
	.company {
		&__sections {
			padding: 4px 16px;
		}
	}
}
</style>
