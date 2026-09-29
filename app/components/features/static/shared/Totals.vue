<template>
	<!-- counted from the sitemap data, never typed in -->
	<dl class="totals">
		<div v-for="total in props.totals" :key="total.label" class="totals__item">
			<dt class="totals__label">{{ total.label }}</dt>
			<dd class="totals__value">{{ total.value }}</dd>
		</div>
	</dl>
</template>

<script setup lang="ts">
// The demo's size at a glance, shared by the guide and sitemap banners.
interface Props {
	totals: { label: string, value: number }[]
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.totals {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));

	// the number reads first; the label names it
	&__item {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		gap: 6px;
		padding: 4px 0 4px 20px;
		border-left: var(--rule);
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 18px;
		color: var(--text-muted);
	}

	// display-size numerals may use --brand (large text, 3:1+)
	&__value {
		font-family: var(--font-display);
		font-size: 40px;
		font-weight: 600;
		line-height: 1;
		color: var(--brand);
	}
}

@media only screen and (max-width: 600px) {
	.totals {
		&__item {
			padding-left: 14px;
		}

		&__value {
			font-size: 30px;
		}
	}
}
</style>
