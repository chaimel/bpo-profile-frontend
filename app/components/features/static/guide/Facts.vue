<template>
	<section id="demo" class="facts" aria-labelledby="demo-title">
		<div class="wrapper">
			<div class="facts__con">
				<div class="facts__intro">
					<MHeading id="demo-title" variant="2" size="3">{{ factsIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="facts__text">{{ factsIntro.text }}</MText>
					<MButton to="/about" variant="text" class="facts__link">
						See the public About page
						<template #suffix>
							<MIcon name="light-arrow-right" size="xs" />
						</template>
					</MButton>
				</div>

				<dl class="facts__list">
					<div v-for="fact in guideFacts" :key="fact.title" class="facts__item">
						<dt class="facts__term">
							<span class="facts__icon">
								<MIcon :name="fact.icon" size="md" />
							</span>
							{{ fact.title }}
						</dt>
						<dd>
							<MText color="--text-secondary">{{ fact.text }}</MText>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { factsIntro, guideFacts } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.facts {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 72px;
		padding: 96px 0;
	}

	&__intro {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__text {
		padding-top: 16px;
	}

	&__link {
		margin-top: 20px;
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 48px;
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 24px 0 28px;
		border-top: var(--rule);
	}

	&__term {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);
	}

	&__icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--brand-soft);
		color: var(--brand-deep);
	}
}

@media only screen and (max-width: 1024px) {
	.facts {
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
	.facts {
		&__con {
			padding: 64px 0;
		}

		&__list {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>
