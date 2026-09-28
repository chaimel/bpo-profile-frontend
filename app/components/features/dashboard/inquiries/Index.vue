<template>
	<MPage id="my-inquiries" class="inquiries" title="My inquiries">
		<template #description>
			Buyers who contacted you through your profile.
			<template v-if="props.companyInbox">
				Messages to {{ props.companyInbox.name }} as a whole are in the
				<NuxtLink :to="props.companyInbox.to" class="inquiries__link">company inbox</NuxtLink>.
			</template>
		</template>

		<LoadError
			v-if="props.state === 'error'"
			title="We couldn’t load your inquiries"
			:retry-path="props.retryPath"
		/>
		<MInbox
			v-else
			id-prefix="my-inbox"
			:inquiries="props.inquiries"
			scope="professional"
		/>
	</MPage>
</template>

<script setup lang="ts">
import MInbox from '~/components/core/inbox/MInbox.vue'
import LoadError from '~/components/features/dashboard/LoadError.vue'
import type { Inquiry } from '~/types/features/inquiry'

// GET / PATCH /api/dashboard/professional/inquiries — only inquiries
// assigned to the signed-in user (docs/API.md §6).
interface Props {
	inquiries: Inquiry[]
	// shown when the user also manages the company's shared inbox
	companyInbox?: { name: string, to: string } | null
	// 'error' previews a failed load (?state=error)
	state?: 'ready' | 'error'
	retryPath: string
}

const props = withDefaults(defineProps<Props>(), {
	companyInbox: null,
	state: 'ready',
})
</script>

<style lang="scss" scoped>
.inquiries {
	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}
}
</style>
