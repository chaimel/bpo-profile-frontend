<template>
	<section id="audiences" class="audiences" aria-labelledby="audiences-title">
		<div class="wrapper">
			<div class="audiences__con">
				<div class="audiences__head">
					<MHeading id="audiences-title" variant="2" size="3">{{ audiencesIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="audiences__text">{{ audiencesIntro.text }}</MText>
				</div>

				<ul class="audiences__list">
					<li v-for="audience in audiences" :key="audience.title" class="audiences__item">
						<span class="audiences__icon">
							<MIcon :name="audience.icon" size="md" />
						</span>
						<MHeading variant="3" size="4" weight="semi-bold">{{ audience.title }}</MHeading>
						<MText size="small" color="--text-secondary">{{ audience.who }}</MText>
						<MBadge tone="brand" class="audiences__terms">{{ audience.terms }}</MBadge>

						<span class="audiences__key">What they need</span>
						<ul class="audiences__needs">
							<li v-for="need in audience.needs" :key="need" class="audiences__need text-medium">
								<MIcon name="light-check" size="xs" class="audiences__check" />
								<span>{{ need }}</span>
							</li>
						</ul>

						<span class="audiences__key">Our message to them</span>
						<blockquote class="audiences__promise">
							<MText weight="medium" color="--text-primary">“{{ audience.promise }}”</MText>
						</blockquote>
					</li>
				</ul>

				<MText color="--text-secondary" class="audiences__keeper">
					<MIcon name="light-shield" size="sm" class="audiences__keeper-icon" />
					<span>{{ audiencesIntro.keeper }}</span>
				</MText>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { audiences, audiencesIntro } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.audiences {
	background: var(--canvas);

	&__con {
		padding: 96px 0;
	}

	&__head {
		max-width: 720px;
		padding-bottom: 48px;
	}

	&__text {
		padding-top: 16px;
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 48px;
		list-style: none;
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding-top: 24px;
		border-top: 2px solid var(--text-primary);
	}

	&__icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		margin-bottom: 6px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border-strong);
		color: var(--brand);
	}

	&__terms {
		margin-top: 4px;
	}

	&__key {
		padding-top: 14px;
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__needs {
		display: flex;
		flex-direction: column;
		gap: 8px;
		list-style: none;
	}

	&__need {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		color: var(--text-primary);
	}

	&__check {
		flex: 0 0 auto;
		margin-top: 6px;
		color: var(--success);
	}

	&__promise {
		padding-left: 14px;
		border-left: 2px solid var(--brand);
	}

	&__keeper {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		margin-top: 48px;
		padding-top: 20px;
		border-top: var(--rule);
	}

	&__keeper-icon {
		flex: 0 0 auto;
		margin-top: 5px;
		color: var(--brand);
	}
}

@media only screen and (max-width: 1024px) {
	.audiences {
		&__con {
			padding: 80px 0;
		}

		&__list {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}

		&__item {
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.audiences {
		&__con {
			padding: 64px 0;
		}

		&__head {
			padding-bottom: 36px;
		}
	}
}
</style>
