<template>
	<div class="updated">
		<header class="updated__head">
			<span class="updated__mark" aria-hidden="true">
				<MIcon name="light-check-circle" size="lg" />
			</span>
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="updated__title">
				Password updated
			</MHeading>
			<!-- A reset never signs anyone in (docs/ARCHITECTURE.md §5). -->
			<MText size="large" color="--text-secondary">
				Sign in with your new password — you’ll confirm a code from your email too.
			</MText>
		</header>

		<MText color="--text-secondary" class="updated__note">
			<MIcon name="light-shield" size="sm" color="text-muted" class="updated__note-icon" />
			For your security, we’ve signed you out everywhere else and cancelled any sign-in codes that were waiting.
		</MText>

		<MButton to="/login" size="lg" block>
			Sign in
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
.updated {
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
		background: var(--success-soft);
		color: var(--success);
	}

	&__title:focus {
		outline: none;
	}

	&__note {
		display: flex;
		gap: 12px;
		padding: 20px 0;
		border-top: var(--rule);
		border-bottom: var(--rule);
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 4px;
	}
}
</style>
