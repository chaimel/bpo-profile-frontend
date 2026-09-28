<template>
	<div class="load-error" role="alert">
		<MEmptyState icon="light-exclamation-triangle" tone="danger" variant="plain" heading-level="2">
			<template #title>{{ props.title }}</template>
			Something went wrong on our side. Please try again.
			<template #actions>
				<MButton :to="props.retryPath">
					<template #prefix>
						<MIcon name="light-sync" size="xs" />
					</template>
					Try again
				</MButton>
			</template>
		</MEmptyState>
	</div>
</template>

<script setup lang="ts">
// Failed-load state for dashboard data (docs/SETUP.md §5): neutral
// wording and a retry, never a dead end.
interface Props {
	// what didn't load, e.g. "We couldn’t load your inquiries"
	title: string
	// reloads the same page
	retryPath: string
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.load-error {
	border-radius: var(--radius-md);
	background: var(--white);
	box-shadow: inset 0 0 0 1px var(--border);
}
</style>
