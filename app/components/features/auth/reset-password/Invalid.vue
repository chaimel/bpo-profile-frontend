<template>
	<div class="invalid">
		<header class="invalid__head">
			<span class="invalid__mark" aria-hidden="true">
				<MIcon name="light-exclamation-triangle" size="lg" />
			</span>
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="invalid__title">
				This reset link can’t be used
			</MHeading>
			<MText size="large" color="--text-secondary">
				It has expired or has already been used. Reset links work once and only for a short time — ask for a
				new one and use the most recent email.
			</MText>
		</header>

		<div class="invalid__actions">
			<MButton to="/forgot-password" size="lg" block>Request a new link</MButton>
			<MButton variant="text" to="/login">
				<template #prefix>
					<MIcon name="light-arrow-left" size="sm" />
				</template>
				Back to sign in
			</MButton>
		</div>
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
.invalid {
	display: flex;
	flex-direction: column;
	gap: 28px;

	&__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	&__mark {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: 12px;
		border-radius: var(--radius-md);
		background: var(--warning-soft);
		color: var(--warning);
	}

	&__title:focus {
		outline: none;
	}

	&__actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
}
</style>
