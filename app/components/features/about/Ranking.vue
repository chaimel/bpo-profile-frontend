<template>
	<div id="ranking" class="ranking">
		<div class="wrapper">
			<div class="ranking__con">
				<div class="ranking__head">
					<MHeading variant="2" size="3">{{ rankingIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="ranking__text">{{ rankingIntro.text }}</MText>
				</div>

				<div class="ranking__body">
					<ol class="ranking__list">
						<li
							v-for="(priority, index) in rankingPriorities"
							:key="priority.title"
							:class="['ranking__item', { 'ranking__item--tie-breaker': priority.tie_breaker }]"
						>
							<span class="ranking__num">{{ index + 1 }}</span>
							<div class="ranking__copy">
								<MHeading variant="3" size="5" weight="semi-bold">{{ priority.title }}</MHeading>
								<MText color="--text-secondary">{{ priority.text }}</MText>
								<span v-if="priority.tie_breaker" class="ranking__tag">
									<MIcon name="light-balance-scale" size="xs" />
									Final, disclosed tie-breaker
								</span>
							</div>
						</li>
					</ol>

					<ul class="ranking__notes">
						<li v-for="note in rankingNotes" :key="note" class="ranking__note">
							<MIcon name="light-info-circle" size="sm" class="ranking__note-icon" />
							<span>{{ note }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { rankingIntro, rankingNotes, rankingPriorities } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.ranking {
	background: var(--canvas);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		align-items: start;
		gap: 80px;
		padding: 112px 0;
	}

	&__text {
		padding-top: 16px;
	}

	&__list {
		display: flex;
		flex-direction: column;
		list-style: none;
	}

	&__item {
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr);
		gap: 20px;
		padding: 24px 0;
		border-top: var(--rule);

		&--tie-breaker {
			margin-top: 24px;
			border-top: 1px dashed var(--border-input);
			border-bottom: 1px dashed var(--border-input);

			.ranking__num {
				color: var(--text-muted);
			}
		}
	}

	// display-size numerals may use --brand (large text, 3:1+)
	&__num {
		font-family: var(--font-display);
		font-size: 40px;
		font-weight: 600;
		line-height: 1;
		color: var(--brand);
	}

	&__copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}

	&__tag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 6px;
		padding: 4px 8px;
		border-radius: var(--radius-xs);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border-strong);
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		line-height: 16px;
		color: var(--text-secondary);
	}

	&__notes {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 32px;
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 16px;
		line-height: 24px;
		color: var(--text-secondary);
	}

	&__note-icon {
		margin-top: 4px;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.ranking {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 80px 0;
		}

		&__head {
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.ranking {
		&__con {
			padding: 64px 0;
		}

		&__item {
			grid-template-columns: 44px minmax(0, 1fr);
			gap: 12px;
		}

		&__num {
			font-size: 30px;
		}
	}
}
</style>
