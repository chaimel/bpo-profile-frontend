<template>
	<section id="about" class="about" aria-labelledby="about-title">
		<MHeading id="about-title" variant="2" size="3">About {{ props.professional.first_name }}</MHeading>

		<MText v-if="props.professional.expertise" weight="medium" class="about__expertise">
			<MIcon name="light-medal" size="md" />
			<span><span class="sr-only">Expertise: </span>{{ props.professional.expertise }}</span>
		</MText>

		<div v-if="blocks.length" class="about__text">
			<MText v-for="(block, index) in blocks" :key="index" size="large">{{ block }}</MText>
		</div>

		<MEmptyState v-else icon="light-file-edit" variant="plain" heading-level="3">
			<template #title>This profile is still being completed.</template>
			You can still contact {{ props.professional.first_name }} below.
		</MEmptyState>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProfessionalProfile } from '~/types/features/directory'
import { paragraphs } from '~/utils/format'

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()

const blocks = computed(() => paragraphs(props.professional.bio))
</script>

<style lang="scss" scoped>
.about {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__expertise {
		display: flex;
		align-items: center;
		gap: 12px;
		align-self: flex-start;
		padding: 12px 18px 12px 14px;
		border-radius: var(--radius-md);
		background: var(--brand-tint);
		box-shadow: inset 3px 0 0 var(--brand);
		font-family: var(--font-display);

		.m-icon {
			color: var(--brand);
		}
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 700px;
	}
}
</style>
