<template>
	<div class="specimen">
		<div class="specimen__head">
			<MHeading variant="3" size="5" weight="semi-bold" class="specimen__title">{{ props.title }}</MHeading>
			<code v-if="props.component" class="specimen__component">{{ props.component }}</code>
		</div>
		<MText v-if="props.description" size="small" color="--text-secondary" class="specimen__description">{{ props.description }}</MText>
		<div :class="['specimen__stage', `specimen__stage--${props.layout}`]">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
// One labelled example in the styleguide.
interface Props {
	title: string
	component?: string
	description?: string
	layout?: 'row' | 'stack' | 'grid'
}

const props = withDefaults(defineProps<Props>(), {
	component: undefined,
	description: undefined,
	layout: 'row',
})
</script>

<style lang="scss" scoped>
.specimen {
	display: flex;
	flex-direction: column;
	gap: 10px;

	&__head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 8px 12px;
	}

	&__title {
		font-family: var(--font-display);
	}

	&__component {
		padding: 2px 8px;
		border-radius: var(--radius-xs);
		background: var(--surface-muted);
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-secondary);
	}

	&__stage {
		padding: 24px;
		border-radius: var(--radius-md);
		box-shadow: inset 0 0 0 1px var(--border);

		&--row {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 12px;
		}

		&--stack {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		&--grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
			gap: 20px;
		}
	}
}
</style>
