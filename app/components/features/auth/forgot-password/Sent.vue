<template>
	<div class="sent">
		<header class="sent__head">
			<span class="sent__mark" aria-hidden="true">
				<MIcon name="light-envelope-text" size="lg" />
			</span>
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="sent__title">
				Check your email
			</MHeading>
			<!-- The same words whether or not an account exists (docs/API.md §1). -->
			<MText size="large" color="--text-secondary">
				If an account exists for
				<strong v-if="props.email" class="sent__email">{{ props.email }}</strong>
				<template v-else>that email</template>,
				we’ve sent a link to reset your password.
			</MText>
		</header>

		<ul class="sent__notes">
			<li class="sent__note">
				<MIcon name="light-link" size="sm" color="text-muted" class="sent__note-icon" />
				The link works once and expires after a while, so use it soon.
			</li>
			<li class="sent__note">
				<MIcon name="light-sign-in" size="sm" color="text-muted" class="sent__note-icon" />
				Choosing a new password doesn’t sign you in. You’ll sign in afterwards with the new password and a code from your email.
			</li>
		</ul>

		<MButton to="/login" size="lg" block>Back to sign in</MButton>

		<MText size="small" color="--text-secondary" align="center">
			Nothing arrived? Check your spam folder, or
			<button type="button" class="sent__retry-button" @click="emit('retry')">try a different email</button>.
		</MText>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref } from 'vue'

interface Props {
	email?: string
}

const props = withDefaults(defineProps<Props>(), {
	email: '',
})

const emit = defineEmits<{
	(_e: 'retry'): void
}>()

const heading_ref = ref<ComponentPublicInstance | null>(null)

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.sent {
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
		background: var(--brand-soft);
		color: var(--brand-deep);
	}

	&__title:focus {
		outline: none;
	}

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__notes {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px 0;
		border-top: var(--rule);
		border-bottom: var(--rule);
	}

	&__note {
		display: flex;
		gap: 12px;
		font-size: 16px;
		line-height: 24px;
		color: var(--text-secondary);
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 4px;
	}

	// a link-styled button inside a sentence: it takes the sentence's font
	&__retry-button {
		font-weight: 600;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;

		&:hover {
			color: var(--brand-deep);
		}
	}
}
</style>
