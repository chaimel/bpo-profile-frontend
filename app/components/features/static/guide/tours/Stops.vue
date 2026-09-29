<template>
	<ol class="stops">
		<li v-for="(stop, index) in props.stops" :key="stop.to" class="stops__stop">
			<span class="stops__num" aria-hidden="true">{{ index + 1 }}</span>

			<div class="stops__body">
				<NuxtLink :to="stop.to" class="stops__title">
					{{ stop.title }}
					<MIcon name="light-arrow-right" size="xs" class="stops__arrow" />
				</NuxtLink>
				<code class="stops__path">
					<RoutePath :value="stop.to" />
				</code>
				<MText size="small" color="--text-secondary" class="stops__text">{{ stop.text }}</MText>
				<MText v-if="stop.hint" size="small" class="stops__hint">
					<MIcon name="light-keyboard" size="sm" class="stops__hint-icon" />
					<span><strong>Try:</strong> {{ stop.hint }}</span>
				</MText>
			</div>
		</li>
	</ol>
</template>

<script setup lang="ts">
import type { GuideStop } from '~/types/features/guide'
import RoutePath from '../../shared/RoutePath.vue'

// One tour's stops, drawn as a route: numbered markers on a line.
interface Props {
	stops: GuideStop[]
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.stops {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	list-style: none;

	&__stop {
		position: relative;
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		gap: 16px;
		padding-bottom: 22px;

		// the route on to the next stop
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 15px;
			top: 36px;
			bottom: 2px;
			width: 2px;
			background: var(--brand-soft);
		}

		&:last-child {
			padding-bottom: 0;

			.stops__num {
				background: var(--brand-strong);
				box-shadow: none;
				color: var(--white);
			}
		}
	}

	&__num {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 2px var(--brand);
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
		color: var(--brand-deep);
	}

	&__body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		min-width: 0;
		padding-top: 4px;
	}

	&__title {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;

			.stops__arrow {
				color: var(--brand-strong);
			}
		}
	}

	&__arrow {
		color: var(--text-muted);
	}

	&__path {
		max-width: 100%;
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 18px;
		color: var(--text-muted);
		overflow-wrap: anywhere;
	}

	&__text {
		padding-top: 4px;
	}

	&__hint {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		margin-top: 8px;
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
		box-shadow: inset 0 0 0 1px var(--border);
		color: var(--text-primary);

		strong {
			font-weight: 700;
		}
	}

	&__hint-icon {
		flex: 0 0 auto;
		margin-top: 3px;
		color: var(--brand);
	}
}
</style>
