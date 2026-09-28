<template>
	<section id="why" class="differentiators" aria-labelledby="why-title">
		<MHeading id="why-title" variant="2" size="3">Why choose {{ props.company.name }}</MHeading>

		<ol class="differentiators__list">
			<li v-for="(item, index) in items" :key="item" class="differentiators__item">
				<span class="differentiators__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
				<span class="differentiators__text">{{ item }}</span>
			</li>
		</ol>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyProfile } from '~/types/features/directory'
import { lines } from '~/utils/format'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()

const items = computed(() => lines(props.company.why_choose_us))
</script>

<style lang="scss" scoped>
.differentiators {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 32px;
		list-style: none;
	}

	&__item {
		display: flex;
		align-items: baseline;
		gap: 16px;
		padding: 18px 0;
		border-top: var(--rule);
	}

	&__number {
		flex: 0 0 auto;
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		color: var(--brand-strong);
	}

	&__text {
		font-size: 17px;
		line-height: 26px;
	}
}

@media only screen and (max-width: 640px) {
	.differentiators__list {
		grid-template-columns: 1fr;
	}
}
</style>
