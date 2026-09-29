<template>
	<section id="growth" class="growth" aria-labelledby="growth-title">
		<div class="wrapper">
			<div class="growth__con">
				<div class="growth__intro">
					<MHeading id="growth-title" variant="2" size="3">{{ growthIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="growth__text">{{ growthIntro.text }}</MText>
				</div>

				<div class="growth__body">
					<ol class="growth__steps">
						<li v-for="(step, index) in growthSteps" :key="step.title" class="growth__step">
							<span class="growth__num" aria-hidden="true">{{ index + 1 }}</span>
							<div class="growth__copy">
								<MHeading variant="3" size="5" weight="semi-bold">{{ step.title }}</MHeading>
								<MText color="--text-secondary">{{ step.text }}</MText>
							</div>
						</li>
					</ol>

					<!-- the loop closes back at step 1 -->
					<MText weight="medium" color="--text-primary" class="growth__loop">
						<span class="growth__loop-icon">
							<MIcon name="light-sync" size="sm" />
						</span>
						<span>{{ growthIntro.loop }}</span>
					</MText>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { growthIntro, growthSteps } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.growth {
	background: var(--canvas);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		align-items: start;
		gap: 80px;
		padding: 96px 0;
	}

	&__text {
		padding-top: 16px;
	}

	&__steps {
		display: flex;
		flex-direction: column;
		list-style: none;
	}

	&__step {
		position: relative;
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		gap: 20px;
		padding-bottom: 28px;

		// the line down to the next step
		&::after {
			content: '';
			position: absolute;
			left: 19px;
			top: 44px;
			bottom: 4px;
			width: 2px;
			background: var(--brand-soft);
		}
	}

	&__num {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 2px var(--brand);
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: var(--brand-deep);
	}

	&__copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 7px;
	}

	&__loop {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	&__loop-icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--brand-strong);
		color: var(--white);
	}
}

@media only screen and (max-width: 1024px) {
	.growth {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 80px 0;
		}

		&__intro {
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.growth {
		&__con {
			padding: 64px 0;
		}

		&__step {
			gap: 14px;
		}

		&__loop {
			gap: 14px;
		}
	}
}
</style>
