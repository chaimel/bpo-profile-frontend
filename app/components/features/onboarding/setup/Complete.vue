<template>
	<div class="complete">
		<span class="complete__mark" aria-hidden="true">
			<MIcon name="light-check-circle" size="lg" />
		</span>

		<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="complete__title">
			Your account is already set up
		</MHeading>

		<!-- the API's 422 when a company or sales profile already exists -->
		<MText size="large" color="--text-secondary">
			It already has a company or a sales profile, so there’s nothing more to do here. Pick up where you left
			off in your dashboard.
		</MText>

		<MButton to="/dashboard" size="lg" block>
			Go to your dashboard
			<template #suffix>
				<MIcon name="light-long-arrow-right" size="sm" />
			</template>
		</MButton>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref } from 'vue'

const heading_ref = ref<ComponentPublicInstance | null>(null)

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.complete {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 20px;

	&__mark {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: 4px;
		border-radius: var(--radius-md);
		background: var(--success-soft);
		color: var(--success);
	}

	&__title:focus {
		outline: none;
	}
}
</style>
