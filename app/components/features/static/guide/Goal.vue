<template>
	<section id="goal" class="goal" aria-labelledby="goal-title">
		<div class="wrapper">
			<div class="goal__con">
				<div class="goal__grid">
					<div class="goal__intro">
						<span class="goal__label">{{ goalIntro.label }}</span>
						<MHeading id="goal-title" variant="2" size="3">{{ goalIntro.title }}</MHeading>

						<dl class="goal__aims">
							<div class="goal__aim">
								<dt class="goal__term">Mission</dt>
								<dd>
									<MText color="--text-secondary">{{ mission }}</MText>
								</dd>
							</div>
							<div class="goal__aim">
								<dt class="goal__term">Vision</dt>
								<dd>
									<MText color="--text-secondary">{{ vision }}</MText>
								</dd>
							</div>
						</dl>
					</div>

					<div class="goal__body">
						<MText weight="medium" color="--text-primary" class="goal__statement">{{ goalIntro.statement }}</MText>

						<div class="goal__points">
							<div v-for="point in goalPoints" :key="point.title" class="goal__point">
								<MHeading variant="3" size="5" weight="semi-bold">{{ point.title }}</MHeading>
								<MText color="--text-secondary">{{ point.text }}</MText>
							</div>
						</div>
					</div>
				</div>

				<!-- the journey every screen supports, as a timeline -->
				<div class="goal__journey">
					<span class="goal__journey-label">The north star</span>
					<ol class="goal__steps">
						<li v-for="(step, index) in northStar" :key="step.title" class="goal__step">
							<span class="goal__num" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
							<span class="goal__step-title">{{ step.title }}</span>
							<MText size="small" color="--text-secondary">{{ step.text }}</MText>
						</li>
					</ol>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { mission, vision } from '~/data/features/about'
import { goalIntro, goalPoints, northStar } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.goal {
	&__con {
		padding: 96px 0;
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 72px;
	}

	&__label,
	&__term,
	&__journey-label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__label {
		display: block;
		padding-bottom: 12px;
		color: var(--brand-strong);
	}

	// --- Mission and vision -----------------------------------------
	&__aims {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 32px;
	}

	&__aim {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-left: 16px;
		border-left: 2px solid var(--brand);
	}

	// --- Statement and points -------------------------------------
	// a display statement, larger than the text scale goes
	&__statement {
		font-family: var(--font-display);
		font-size: 28px;
		line-height: 38px;
		letter-spacing: -0.01em;
	}

	&__points {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 36px 48px;
		padding-top: 48px;
	}

	&__point {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 20px;
		border-top: 2px solid var(--text-primary);
	}

	// --- North star ---------------------------------------------------
	&__journey {
		padding-top: 72px;
	}

	&__steps {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin-top: 20px;
		list-style: none;
	}

	// one line runs through all four; each step sits on a dot
	&__step {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 28px 32px 0 0;
		border-top: 2px solid var(--brand-soft);

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: -7px;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: var(--brand);
		}

		&:last-child::before {
			background: var(--brand-deep);
		}
	}

	// display-size numerals may use --brand (large text, 3:1+)
	&__num {
		font-family: var(--font-display);
		font-size: 28px;
		font-weight: 600;
		line-height: 1;
		color: var(--brand);
	}

	&__step-title {
		padding-top: 6px;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 600;
		line-height: 26px;
		color: var(--text-primary);
	}
}

@media only screen and (max-width: 1024px) {
	.goal {
		&__con {
			padding: 80px 0;
		}

		&__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}

		&__intro {
			max-width: 640px;
		}

		&__steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			row-gap: 40px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.goal {
		&__con {
			padding: 64px 0;
		}

		&__statement {
			font-size: 22px;
			line-height: 31px;
		}

		&__points {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
			padding-top: 36px;
		}

		&__steps {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 0;
			margin-top: 12px;
		}

		// stacked: the line runs down the left instead
		&__step {
			padding: 0 0 28px 28px;
			border-top: 0;
			border-left: 2px solid var(--brand-soft);

			&::before {
				left: -7px;
				top: 2px;
			}

			&:last-child {
				padding-bottom: 0;
			}
		}
	}
}
</style>
