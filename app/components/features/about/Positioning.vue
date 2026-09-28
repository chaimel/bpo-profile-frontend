<template>
	<div class="positioning">
		<div class="wrapper">
			<div class="positioning__con">
				<div class="positioning__is">
					<MHeading variant="2" size="6" weight="semi-bold" class="positioning__label">
						What BPO Profile is
					</MHeading>
					<MText weight="semi-bold" class="positioning__statement">{{ positioning.is }}</MText>
					<MText size="large" color="--text-secondary" class="positioning__text">
						{{ positioning.text }}
					</MText>
				</div>

				<div class="positioning__not">
					<MHeading variant="2" size="6" weight="semi-bold" class="positioning__label">
						What it isn’t
					</MHeading>
					<ul class="positioning__list">
						<li v-for="item in positioning.not" :key="item" class="positioning__item">
							<MIcon name="light-minus-circle" size="sm" class="positioning__icon" />
							<span>{{ item }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { positioning } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.positioning {
	background: var(--canvas);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		gap: 96px;
		padding: 96px 0;
	}

	&__label {
		padding-bottom: 16px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	// a display statement, larger than the text scale goes
	&__statement {
		max-width: 620px;
		font-family: var(--font-display);
		font-size: 36px;
		line-height: 44px;
		letter-spacing: -0.015em;
	}

	&__text {
		max-width: 580px;
		padding-top: 20px;
	}

	&__not {
		padding-left: 40px;
		border-left: 1px solid var(--border-strong);
	}

	&__list {
		display: flex;
		flex-direction: column;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		border-bottom: var(--rule);
		font-size: 18px;
		line-height: 26px;
		color: var(--text-secondary);

		&:first-child {
			padding-top: 0;
		}
	}

	&__icon {
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.positioning {
		&__con {
			gap: 48px;
		}

		&__statement {
			font-size: 30px;
			line-height: 38px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.positioning {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			padding: 64px 0;
		}

		&__not {
			padding: 32px 0 0;
			border-left: 0;
			border-top: 1px solid var(--border-strong);
		}

		&__statement {
			font-size: 26px;
			line-height: 34px;
		}
	}
}
</style>
