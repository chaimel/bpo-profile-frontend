<template>
	<section id="about" class="overview" aria-labelledby="about-title">
		<MHeading id="about-title" variant="2" size="3">About {{ props.company.name }}</MHeading>

		<template v-if="blocks.length">
			<div class="overview__text">
				<MText v-for="(block, index) in blocks" :key="index" size="large" color="--text-primary">{{ block }}</MText>
			</div>
			<MText size="xsmall" color="--text-muted" class="overview__source">
				<MIcon name="light-info-circle" size="xs" />
				Profile content, including any client testimonials, is provided by {{ props.company.name }}.
			</MText>
		</template>

		<MEmptyState v-else icon="light-file-edit" variant="plain" heading-level="3">
			<template #title>This profile is still being completed.</template>
			You can still contact the company below.
		</MEmptyState>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyProfile } from '~/types/features/directory'
import { paragraphs } from '~/utils/format'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()

// Plain text from the API, rendered escaped — never v-html.
const blocks = computed(() => paragraphs(props.company.overview))
</script>

<style lang="scss" scoped>
.overview {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__text {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 720px;
	}

	&__source {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
	}
}
</style>
