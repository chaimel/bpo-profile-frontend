<template>
	<!-- the band between the business and the walkthrough -->
	<div class="demo-intro">
		<div class="wrapper">
			<div class="demo-intro__con">
				<span class="demo-intro__label">{{ demoIntro.label }}</span>
				<MText size="xlarge" weight="medium" color="--white" class="demo-intro__text">{{ demoIntro.text }}</MText>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { demoIntro } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.demo-intro {
	background: var(--slate);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 48px 0;
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-subtle);
	}

	&__text {
		max-width: 760px;
		font-family: var(--font-display);
	}
}

@media only screen and (max-width: 600px) {
	.demo-intro {
		&__con {
			padding: 40px 0;
		}
	}
}
</style>
