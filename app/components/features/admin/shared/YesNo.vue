<template>
	<span :class="['yes-no', props.value ? 'yes-no--yes' : 'yes-no--no']">
		<MIcon
			:name="props.value ? 'light-check-circle' : 'light-minus-circle'"
			size="xs"
			:color="props.value ? 'success' : 'text-muted'"
		/>
		{{ props.value ? props.yes : props.no }}
	</span>
</template>

<script setup lang="ts">
// A yes/no table value: an icon and a word, never color alone.
interface Props {
	value: boolean
	yes?: string
	no?: string
}

const props = withDefaults(defineProps<Props>(), {
	yes: 'Yes',
	no: 'No',
})
</script>

<style lang="scss" scoped>
.yes-no {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-family: var(--font-ui);
	font-size: 14px;
	white-space: nowrap;

	&--yes {
		color: var(--text-primary);
	}

	&--no {
		color: var(--text-muted);
	}
}
</style>
