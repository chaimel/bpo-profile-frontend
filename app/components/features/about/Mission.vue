<template>
	<div class="mission">
		<div class="wrapper">
			<div class="mission__con">
				<div class="mission__main">
					<MHeading variant="2" size="6" weight="semi-bold" class="mission__label">Our mission</MHeading>
					<MText weight="semi-bold" color="--white" class="mission__statement">{{ mission }}</MText>
				</div>

				<div class="mission__side">
					<div class="mission__block">
						<MHeading variant="2" size="6" weight="semi-bold" class="mission__label">Our vision</MHeading>
						<MText size="xlarge" weight="medium" color="--white" class="mission__text mission__text--vision">{{ vision }}</MText>
					</div>

					<div class="mission__block">
						<MHeading variant="2" size="6" weight="semi-bold" class="mission__label">Why we exist</MHeading>
						<MText color="--on-dark-muted" class="mission__text">{{ purpose }}</MText>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { mission, purpose, vision } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.mission {
	background: var(--slate);
	color: var(--white);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		align-items: end;
		gap: 96px;
		padding: 112px 0;
	}

	// small text on slate uses --on-dark-muted to keep AA contrast
	&__label {
		padding-bottom: 16px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-muted);
	}

	// a display statement, larger than the text scale goes
	&__statement {
		font-family: var(--font-display);
		font-size: 40px;
		line-height: 50px;
		letter-spacing: -0.02em;
	}

	&__side {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	&__block {
		padding-top: 24px;
		border-top: 1px solid var(--on-dark-rule);
	}

	&__text--vision {
		font-family: var(--font-display);
	}
}

@media only screen and (max-width: 1024px) {
	.mission {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 56px;
			padding: 80px 0;
		}

		&__statement {
			font-size: 32px;
			line-height: 42px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.mission {
		&__con {
			padding: 64px 0;
		}

		&__statement {
			font-size: 26px;
			line-height: 35px;
		}
	}
}
</style>
