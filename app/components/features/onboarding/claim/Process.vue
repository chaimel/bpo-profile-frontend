<template>
	<div class="process">
		<div class="wrapper">
			<div class="process__con">
				<MHeading variant="2" size="4">How claiming works</MHeading>

				<ol class="process__steps">
					<li
						v-for="(step, index) in steps"
						:key="step.title"
						:class="['process__step', `process__step--${statusOf(index)}`]"
						:aria-current="statusOf(index) === 'current' ? 'step' : undefined"
					>
						<span class="process__marker" aria-hidden="true">
							<MIcon v-if="statusOf(index) === 'done'" name="light-check" size="sm" />
							<template v-else>{{ index + 1 }}</template>
						</span>

						<div class="process__body">
							<MText weight="semi-bold" class="process__step-title">
								{{ step.title }}
								<span v-if="statusOf(index) === 'done'" class="sr-only">(done)</span>
								<MBadge v-else-if="statusOf(index) === 'current' && props.current" tone="brand" size="sm">
									{{ props.current.label }}
								</MBadge>
							</MText>
							<MText color="--text-secondary">{{ step.text }}</MText>
						</div>
					</li>
				</ol>

				<MAlert tone="neutral" class="process__note">
					<template #title>Claiming doesn’t verify or publish a listing</template>
					Ownership, publication and the Verified company badge are separate decisions. Once the listing is
					yours, complete it and submit it for review — verification only follows BPO Profile’s identity check.
				</MAlert>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// The claim workflow (docs/ARCHITECTURE.md §5 "Company claims"). With a
// listing in view, the step the visitor has reached is marked in words as
// well as with the marker, never by color alone.
interface Props {
	companyName?: string
	current?: { step: number, label: string } | null
}

const props = withDefaults(defineProps<Props>(), {
	companyName: '',
	current: null,
})

type StepStatus = 'done' | 'current' | 'upcoming'

const steps = computed(() => [
	{
		title: 'Sign in with a verified email',
		text: 'Sign in, or create an account. Your email is verified the first time you sign in with an emailed code.',
	},
	{
		title: 'Submit a claim request',
		text: 'Tell us which listing you represent. A request on its own doesn’t give you editing access.',
	},
	{
		title: 'BPO Profile reviews your authority',
		text: `Our team checks that you’re authorized to represent ${props.companyName || 'the company'}.`,
	},
	{
		title: 'We email you a secure claim link',
		text: 'If we approve the request, we send a single-use link to the email address on your account.',
	},
	{
		title: 'Accept it to take ownership',
		text: 'Open the link while signed in to that same account, then accept. The listing becomes yours.',
	},
])

function statusOf(index: number): StepStatus {
	if (!props.current) return 'upcoming'
	if (index < props.current.step) return 'done'
	return index === props.current.step ? 'current' : 'upcoming'
}
</script>

<style lang="scss" scoped>
.process {
	&__con {
		max-width: 720px;
		padding: 56px 0 96px;
		border-top: var(--rule);
	}

	&__steps {
		display: flex;
		flex-direction: column;
		padding-top: 28px;
	}

	&__step {
		position: relative;
		display: flex;
		gap: 16px;
		padding-bottom: 28px;

		// the rail joining one marker to the next
		&::before {
			content: '';
			position: absolute;
			top: 38px;
			bottom: 6px;
			left: 15px;
			width: 2px;
			border-radius: var(--radius-full);
			background: var(--border);
		}

		&:last-child {
			padding-bottom: 0;

			&::before {
				display: none;
			}
		}

		&--done::before {
			background: var(--brand);
		}
	}

	&__marker {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border-strong);
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	&__step--done .process__marker {
		background: var(--brand-strong);
		box-shadow: none;
		color: var(--white);
	}

	&__step--current .process__marker {
		box-shadow: inset 0 0 0 2px var(--brand);
		color: var(--brand-deep);
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		padding-top: 4px;
	}

	&__step-title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 10px;
		font-family: var(--font-ui);
	}

	&__note {
		margin-top: 40px;
	}
}

@media only screen and (max-width: 600px) {
	.process {
		&__con {
			padding: 40px 0 64px;
		}
	}
}
</style>
