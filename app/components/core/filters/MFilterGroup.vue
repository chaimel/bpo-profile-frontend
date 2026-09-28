<template>
	<!-- native disclosure: keyboard and screen-reader support for free -->
	<details class="m-filter-group" :open="props.open">
		<summary class="m-filter-group__summary">
			<span class="m-filter-group__title">{{ props.title }}</span>
			<span v-if="props.active" class="m-filter-group__active">
				<span class="sr-only">(filter applied)</span>
			</span>
			<MIcon name="light-angle-down" size="xs" class="m-filter-group__caret" />
		</summary>
		<div class="m-filter-group__body">
			<slot />
		</div>
	</details>
</template>

<script setup lang="ts">
interface Props {
	title: string
	open?: boolean
	// marks the group while one of its filters is set
	active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	open: true,
	active: false,
})
</script>

<style lang="scss" scoped>
.m-filter-group {
	border-bottom: var(--rule);

	&__summary {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 16px 0;
		list-style: none;
		cursor: pointer;

		&::-webkit-details-marker {
			display: none;
		}
	}

	&__title {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	&__active {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--brand);
	}

	&__caret {
		margin-left: auto;
		color: var(--text-muted);
		transition: transform 0.15s ease;
	}

	&[open] &__caret {
		transform: rotate(180deg);
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-bottom: 18px;
	}
}
</style>
