<template>
	<div class="frame">
		<div class="frame__bar">
			<span class="frame__address">
				<span class="frame__domain">{{ siteDomain }}</span>{{ props.path }}
			</span>
		</div>
		<div class="frame__view">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { siteDomain } from '~/data/features/site'

// A small window around one area's replica, labelled with the address
// the area opens at.
interface Props {
	path: string
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.frame {
	overflow: hidden;
	border: 1px solid var(--border-strong);
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: var(--shadow-card);

	&__bar {
		display: flex;
		align-items: center;
		height: 36px;
		padding: 0 12px;
		border-bottom: var(--rule);
		background: var(--canvas);
	}

	&__address {
		max-width: 100%;
		padding: 3px 10px;
		overflow: hidden;
		border-radius: var(--radius-xs);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 16px;
		color: var(--text-secondary);
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__domain {
		color: var(--text-muted);
	}
}
</style>
