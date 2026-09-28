<template>
	<MBadge :tone="meta.tone" :icon="meta.icon" :size="props.size">
		{{ meta.label }}
	</MBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AffiliationStatus, PublicationStatus } from '~/types/features/directory'
import type { InquiryStatus } from '~/types/features/inquiry'
import type { ClaimStatus } from '~/types/features/onboarding'
import {
	affiliationStatusMeta,
	claimStatusMeta,
	inquiryStatusMeta,
	publicationStatusMeta,
	type StatusMeta,
} from '~/utils/labels'

// One component for every workflow state, so "Pending review" reads the
// same in the dashboards and the admin.
interface Props {
	kind: 'publication' | 'affiliation' | 'inquiry' | 'claim'
	status: PublicationStatus | AffiliationStatus | InquiryStatus | ClaimStatus
	size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
})

const meta = computed<StatusMeta>(() => {
	const fallback: StatusMeta = { label: props.status, tone: 'neutral', icon: 'light-info-circle' }

	switch (props.kind) {
		case 'publication': return publicationStatusMeta[props.status as PublicationStatus] ?? fallback
		case 'affiliation': return affiliationStatusMeta[props.status as AffiliationStatus] ?? fallback
		case 'inquiry': return inquiryStatusMeta[props.status as InquiryStatus] ?? fallback
		case 'claim': return claimStatusMeta[props.status as ClaimStatus] ?? fallback
		default: return fallback
	}
})
</script>
