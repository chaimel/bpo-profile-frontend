<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<MHeading variant="2" size="2" class="cta__promise">{{ promise }}</MHeading>

				<div class="cta__paths">
					<div class="cta__path">
						<MHeading variant="3" size="5" weight="semi-bold">{{ aboutCta.buyers.title }}</MHeading>
						<MText color="--text-secondary" class="cta__text">{{ aboutCta.buyers.text }}</MText>
						<MButton to="/find" size="lg" class="cta__button">
							<template #prefix>
								<MIcon name="light-search" size="sm" />
							</template>
							Find a BPO
						</MButton>
					</div>

					<div class="cta__path">
						<MHeading variant="3" size="5" weight="semi-bold">{{ aboutCta.providers.title }}</MHeading>
						<MText color="--text-secondary" class="cta__text">{{ aboutCta.providers.text }}</MText>
						<MButton to="/register?type=company" size="lg" variant="secondary" class="cta__button">
							Get Listed
						</MButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { aboutCta, promise } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.cta {
	background: var(--canvas);
	border-top: var(--rule);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
		align-items: end;
		gap: 80px;
		padding: 96px 0;
	}

	&__promise {
		max-width: 560px;
	}

	&__paths {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 40px;
	}

	&__path {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-top: 20px;
		border-top: 2px solid var(--text-primary);
	}

	&__text {
		padding-top: 8px;
	}

	&__button {
		margin-top: 24px;
	}
}

@media only screen and (max-width: 1024px) {
	.cta {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 48px;
			padding: 72px 0;
		}
	}
}

@media only screen and (max-width: 600px) {
	.cta {
		&__con {
			padding: 56px 0;
		}

		&__paths {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>
