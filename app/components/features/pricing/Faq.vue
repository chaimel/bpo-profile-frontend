<template>
	<div class="faq">
		<div class="wrapper">
			<div class="faq__con">
				<div class="faq__intro">
					<MHeading variant="2" size="3">Questions about plans</MHeading>
					<MText color="--text-secondary" class="faq__lede">
						Wondering about something that isn’t covered here? Our team is happy to talk it through.
					</MText>
					<MButton to="/contact" variant="text" class="faq__contact">
						Talk to our team
						<template #suffix>
							<MIcon name="light-arrow-right" size="xs" />
						</template>
					</MButton>
				</div>

				<div class="faq__list">
					<details v-for="item in pricingFaq" :key="item.question" class="faq__item">
						<summary class="faq__question">
							<span>{{ item.question }}</span>
							<MIcon name="light-plus" size="sm" class="faq__icon" />
						</summary>
						<MText color="--text-secondary" class="faq__answer">{{ item.answer }}</MText>
					</details>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { pricingFaq } from '~/data/features/pricing'
</script>

<style lang="scss" scoped>
.faq {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		align-items: start;
		gap: 80px;
		padding: 96px 0;
	}

	&__intro {
		position: sticky;
		top: calc(var(--header-height) + 32px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__lede {
		padding-top: 12px;
	}

	&__contact {
		margin-top: 20px;
	}

	&__list {
		border-top: var(--rule);
	}

	&__item {
		border-bottom: var(--rule);

		&[open] {
			.faq__icon {
				transform: rotate(45deg);
			}
		}
	}

	// the whole row is the native, keyboard-operable toggle
	&__question {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		padding: 22px 0;
		list-style: none;
		cursor: pointer;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 500;
		line-height: 26px;
		color: var(--text-primary);

		&::-webkit-details-marker {
			display: none;
		}

		&:hover {
			color: var(--brand-strong);
		}
	}

	&__icon {
		margin-top: 5px;
		color: var(--brand-strong);
		transition: transform 0.2s ease;
	}

	&__answer {
		max-width: 640px;
		padding: 0 48px 24px 0;
	}
}

@media only screen and (max-width: 1024px) {
	.faq {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
			padding: 72px 0;
		}

		&__intro {
			position: static;
		}
	}
}

@media only screen and (max-width: 600px) {
	.faq {
		&__con {
			padding: 56px 0;
		}

		&__question {
			font-size: 17px;
			line-height: 24px;
		}

		&__answer {
			padding-right: 0;
		}
	}
}
</style>
