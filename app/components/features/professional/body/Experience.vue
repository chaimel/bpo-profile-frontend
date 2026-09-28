<template>
	<section id="experience" class="experience" aria-labelledby="experience-title">
		<MHeading id="experience-title" variant="2" size="3">Experience highlights</MHeading>

		<ul class="experience__list">
			<li v-for="item in items" :key="item" class="experience__item">
				<span class="experience__marker" aria-hidden="true" />
				{{ item }}
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProfessionalProfile } from '~/types/features/directory'
import { lines } from '~/utils/format'

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()

const items = computed(() => lines(props.professional.experience_summary))
</script>

<style lang="scss" scoped>
.experience {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__list {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-left: 4px;

		// a quiet timeline rule
		&::before {
			content: '';
			position: absolute;
			top: 8px;
			bottom: 8px;
			left: 8px;
			width: 1px;
			background: var(--border-strong);
		}
	}

	&__item {
		position: relative;
		display: flex;
		align-items: baseline;
		gap: 16px;
		font-size: 17px;
		line-height: 26px;
	}

	&__marker {
		position: relative;
		flex: 0 0 auto;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 2px var(--brand);
		transform: translateY(-1px);
	}
}
</style>
