<template>
	<div class="accessibility">
		<div class="wrapper">
			<div class="accessibility__con">
				<div class="accessibility__intro">
					<MHeading variant="2" size="3">{{ accessibility.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="accessibility__text">
						{{ accessibility.text }}
					</MText>
				</div>

				<div class="accessibility__body">
					<ul class="accessibility__list">
						<li v-for="point in accessibility.points" :key="point" class="accessibility__item">
							<MIcon name="light-check" size="sm" class="accessibility__icon" />
							<span>{{ point }}</span>
						</li>
					</ul>

					<MText color="--text-secondary" class="accessibility__contact">
						{{ accessibility.contact }}
						<NuxtLink to="/contact" class="accessibility__link">Tell us about an accessibility problem</NuxtLink>
					</MText>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { accessibility } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.accessibility {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		align-items: start;
		gap: 80px;
		padding: 112px 0;
	}

	&__text {
		padding-top: 16px;
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 32px;
		border-top: var(--rule);
	}

	&__item {
		display: grid;
		grid-template-columns: 16px minmax(0, 1fr);
		gap: 12px;
		padding: 16px 0;
		border-bottom: var(--rule);
		font-size: 16px;
		line-height: 24px;
		color: var(--text-primary);
	}

	&__icon {
		margin-top: 4px;
		color: var(--success);
	}

	&__contact {
		padding-top: 24px;
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}
}

@media only screen and (max-width: 1024px) {
	.accessibility {
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
	.accessibility {
		&__con {
			padding: 64px 0;
		}

		&__list {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>
