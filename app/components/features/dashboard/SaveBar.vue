<template>
	<div class="save-bar">
		<MButton type="submit" :is-loading="props.state === 'saving'" class="save-bar__save">
			{{ props.label }}
		</MButton>

		<MButton
			v-if="props.publicPath"
			variant="neutral"
			:to="props.publicPath"
			target="_blank"
		>
			<template #prefix>
				<MIcon name="light-external-link" size="xs" />
			</template>
			<span class="save-bar__public-label">View public profile</span>
			<span class="sr-only">(opens in a new tab)</span>
		</MButton>

		<!-- always rendered, so each change is announced -->
		<MText
			size="small"
			role="status"
			:class="status ? `save-bar__status save-bar__status--${status.tone}` : 'save-bar__status'"
		>
			<template v-if="status">
				<MIcon :name="status.icon" size="sm" />
				<span>{{ status.text }}</span>
			</template>
		</MText>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName } from '~/types/base/ui'

// Sticky save row at the foot of a dashboard form panel. It sits inside
// the <form> (its button submits it) and bleeds to the panel's edges,
// so the panel keeps 28px side padding (16px on phones).
interface Props {
	state: 'idle' | 'saving' | 'saved' | 'failed'
	// the form differs from what was last saved
	dirty?: boolean
	// fields that failed validation on the last attempt
	errorCount?: number
	label?: string
	publicPath?: string
}

const props = withDefaults(defineProps<Props>(), {
	dirty: false,
	errorCount: 0,
	label: 'Save changes',
	publicPath: undefined,
})

interface SaveStatus {
	tone: 'error' | 'saved' | 'dirty'
	icon: MIconName
	text: string
}

const status = computed<SaveStatus | null>(() => {
	if (props.errorCount > 0) {
		return {
			tone: 'error',
			icon: 'light-exclamation-circle',
			text: props.errorCount === 1
				? 'One field needs attention before you can save.'
				: `${props.errorCount} fields need attention before you can save.`,
		}
	}
	if (props.state === 'failed') {
		return {
			tone: 'error',
			icon: 'light-exclamation-circle',
			text: 'We couldn’t save your changes. Please try again.',
		}
	}
	if (props.state === 'saved') return { tone: 'saved', icon: 'light-check-circle', text: 'Changes saved' }
	if (props.dirty) return { tone: 'dirty', icon: 'light-info-circle', text: 'You have unsaved changes' }
	return null
})
</script>

<style lang="scss" scoped>
.save-bar {
	position: sticky;
	bottom: 0;
	z-index: 5;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px;
	margin: 0 -28px;
	padding: 16px 28px;
	border-radius: 0 0 var(--radius-md) var(--radius-md);
	background: var(--white);
	// draws the top rule and keeps the panel's outline behind the bar
	box-shadow: inset 0 0 0 1px var(--border);

	&__status {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		font-family: var(--font-ui);
		// kept here, not as a prop, so the tone modifiers can override it
		color: var(--text-secondary);

		.m-icon {
			flex: 0 0 auto;
		}

		&--saved {
			color: var(--success);
		}

		&--error {
			color: var(--danger);
		}
	}
}

// phones: one row — Save fills it and the public link shrinks to its
// icon, so the stuck bar stays short
@media only screen and (max-width: 600px) {
	.save-bar {
		margin: 0 -16px;
		padding: 12px 16px;

		&__save {
			flex: 1 1 auto;
		}

		&__public-label {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		&__status {
			width: 100%;
			margin-left: 0;
		}
	}
}
</style>
