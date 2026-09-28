<template>
	<MPage
		id="admin-inquiries"
		class="inquiries"
		title="Inquiries"
		description="Every provider inquiry and every message to the BPO Profile team. You can change a status; sender content and targets stay exactly as sent."
	>
		<MInbox id-prefix="admin-inbox" :inquiries="props.inquiries" scope="admin" />
	</MPage>
</template>

<script setup lang="ts">
import MInbox from '~/components/core/inbox/MInbox.vue'
import type { Inquiry } from '~/types/features/inquiry'

// GET /api/admin/inquiries: the moderation queue for provider inquiries
// and platform contacts (docs/API.md §8). The inbox's status tabs carry
// the counts.
interface Props {
	inquiries: Inquiry[]
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped>
.inquiries {
	// lets the inbox's split view shrink inside the admin layout
	min-width: 0;
}
</style>
