<template>
	<div class="pending">
		<span class="pending__mark" aria-hidden="true">
			<MIcon name="light-user-check" size="lg" />
		</span>

		<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="pending__title">
			Your sales profile is waiting for review
		</MHeading>

		<MText size="large" color="--text-secondary">
			{{ props.companyName || 'Your company' }} reviews your affiliation. Until they approve it, your profile is
			a private draft that only you can see and edit.
		</MText>

		<ol class="pending__steps">
			<li v-for="(step, index) in steps" :key="step.title" class="pending__step">
				<span class="pending__number" aria-hidden="true">{{ index + 1 }}</span>
				<div class="pending__step-body">
					<MText size="small" weight="semi-bold" class="pending__step-title">{{ step.title }}</MText>
					<MText color="--text-secondary">{{ step.text }}</MText>
				</div>
			</li>
		</ol>

		<MButton to="/dashboard/profile?state=pending" size="lg" block>
			Complete your draft profile
			<template #suffix>
				<MIcon name="light-long-arrow-right" size="sm" />
			</template>
		</MButton>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref } from 'vue'

interface Props {
	companyName?: string
}

const props = withDefaults(defineProps<Props>(), {
	companyName: '',
})

// Affiliation approval and publication are separate decisions (docs/PLAN.md §4.5).
const steps = [
	{
		title: 'Fill in your profile',
		text: 'Add your photo, expertise, markets and languages while you wait. It stays private.',
	},
	{
		title: 'Your company approves you',
		text: 'An owner or admin confirms you work there, which adds you to the team.',
	},
	{
		title: 'BPO Profile publishes it',
		text: 'Submit your profile for review. It goes live after that review.',
	},
]

const heading_ref = ref<ComponentPublicInstance | null>(null)

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.pending {
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
		background: var(--warning-soft);
		color: var(--warning);
	}

	&__title:focus {
		outline: none;
	}

	&__steps {
		align-self: stretch;
		margin: 12px 0;
		border-top: var(--rule);
	}

	&__step {
		display: flex;
		gap: 16px;
		padding: 18px 0;
		border-bottom: var(--rule);
	}

	&__number {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--slate-soft);
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 600;
		color: var(--slate);
	}

	&__step-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__step-title {
		font-family: var(--font-ui);
	}
}
</style>
