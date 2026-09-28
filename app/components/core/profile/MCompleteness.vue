<template>
	<section class="m-completeness" :aria-labelledby="title_id">
		<div class="m-completeness__head">
			<MHeading :id="title_id" variant="2" size="5" weight="semi-bold" class="m-completeness__title">{{ props.title }}</MHeading>
			<MBadge v-if="is_complete" tone="success" icon="light-clipboard-check" size="sm">
				Profile complete
			</MBadge>
		</div>

		<MProgress
			:value="props.score"
			:threshold="props.threshold"
			:aria-label="`${props.title}: ${props.score}%`"
			label="Completeness"
		/>

		<ul class="m-completeness__list">
			<li
				v-for="item in props.items"
				:key="item.label"
				:class="['m-completeness__item', { 'm-completeness__item--done': item.done }]"
			>
				<MIcon :name="item.done ? 'light-check-circle' : 'light-circle'" size="sm" />
				<NuxtLink v-if="item.to && !item.done" :to="item.to" class="m-completeness__link">
					{{ item.label }}
				</NuxtLink>
				<span v-else>{{ item.label }}</span>
				<span class="sr-only">{{ item.done ? '(done)' : '(to do)' }}</span>
			</li>
		</ul>

		<MText size="small" color="--text-muted" class="m-completeness__note">
			Complete profiles rank higher in search. Completeness never replaces verification or review.
		</MText>
	</section>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface CompletenessItem {
	label: string
	done: boolean
	// where to fix it, e.g. "#photo"
	to?: string
}

interface Props {
	score: number
	items: CompletenessItem[]
	title?: string
	// "Profile complete" threshold (docs/DATABASE.md §6)
	threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
	title: 'Profile completeness',
	threshold: 80,
})

const title_id = useId()
const is_complete = computed(() => props.score >= props.threshold)
</script>

<style lang="scss" scoped>
.m-completeness {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);

	// in a narrow column the badge drops below the title rather than
	// squeezing it onto two lines
	&__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	&__title {
		flex: 1 0 auto;
		font-family: var(--font-display);
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--text-primary);

		.m-icon {
			color: var(--text-muted);
		}

		&--done {
			color: var(--text-secondary);

			.m-icon {
				color: var(--success);
			}
		}
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}

	&__note {
		padding-top: 12px;
		border-top: var(--rule);
	}
}
</style>
