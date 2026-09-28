<template>
	<MPage id="company-inquiries" class="inquiries" title="Inquiries">
		<template #description>
			Everything buyers send to {{ props.company.name }}, including messages to your sales team. Only owners and admins see this inbox.
		</template>

		<LoadError
			v-if="props.state === 'error'"
			title="We couldn’t load your inquiries"
			:retry-path="props.retryPath"
		/>
		<MInbox
			v-else
			id-prefix="company-inbox"
			:inquiries="props.inquiries"
			scope="company"
			class="inquiries__inbox"
		/>
	</MPage>
</template>

<script setup lang="ts">
import MInbox from '~/components/core/inbox/MInbox.vue'
import LoadError from '~/components/features/dashboard/LoadError.vue'
import type { CompanyRef } from '~/types/features/directory'
import type { Inquiry } from '~/types/features/inquiry'

// GET / PATCH /api/dashboard/companies/{companyId}/inquiries
interface Props {
	company: CompanyRef
	inquiries: Inquiry[]
	// 'error' previews a failed load (?state=error)
	state?: 'ready' | 'error'
	retryPath: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
})
</script>

<style lang="scss" scoped>
.inquiries {
	&__inbox {
		min-width: 0;
	}
}
</style>
