<template>
	<section id="roadmap" class="roadmap" aria-labelledby="roadmap-title">
		<div class="wrapper">
			<div class="roadmap__con">
				<div class="roadmap__head">
					<MHeading id="roadmap-title" variant="2" size="3">{{ roadmapIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="roadmap__text">{{ roadmapIntro.text }}</MText>
				</div>

				<ol class="roadmap__phases">
					<li
						v-for="phase in roadmapPhases"
						:key="phase.name"
						:class="['roadmap__phase', { 'roadmap__phase--current': phase.current }]"
					>
						<span class="roadmap__name">{{ phase.name }}</span>
						<MHeading variant="3" size="5" weight="semi-bold">{{ phase.title }}</MHeading>
						<MBadge v-if="phase.current" tone="brand" icon="light-eye" size="sm">{{ roadmapIntro.current }}</MBadge>
						<ul class="roadmap__items">
							<li v-for="item in phase.items" :key="item" class="roadmap__item text-medium">{{ item }}</li>
						</ul>
					</li>
				</ol>

				<MText size="small" color="--text-muted" class="roadmap__later">{{ roadmapIntro.later }}</MText>

				<!-- what launch success means, each goal next to where the demo shows it -->
				<div class="roadmap__launch">
					<MHeading variant="3" size="4" weight="semi-bold">{{ launchIntro.title }}</MHeading>
					<ul class="roadmap__goals">
						<li v-for="goal in launchGoals" :key="goal.text" class="roadmap__goal">
							<MIcon name="light-check-circle" size="md" class="roadmap__goal-icon" />
							<div class="roadmap__goal-body">
								<MText color="--text-primary">{{ goal.text }}</MText>
								<MButton
									v-if="goal.link.to.startsWith('#')"
									:href="goal.link.to"
									variant="text"
									size="sm"
								>
									{{ goal.link.label }}
									<template #suffix>
										<MIcon name="light-arrow-right" size="xs" />
									</template>
								</MButton>
								<MButton v-else :to="goal.link.to" variant="text" size="sm">
									{{ goal.link.label }}
									<template #suffix>
										<MIcon name="light-arrow-right" size="xs" />
									</template>
								</MButton>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { launchGoals, launchIntro, roadmapIntro, roadmapPhases } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.roadmap {
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

	// --- Phases -------------------------------------------------------
	&__phases {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 32px;
		list-style: none;
	}

	&__phase {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding-top: 20px;
		border-top: 4px solid var(--border-strong);

		&--current {
			border-top-color: var(--brand);
		}
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__items {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 6px;
		list-style: none;
	}

	&__item {
		position: relative;
		padding-left: 16px;
		color: var(--text-secondary);

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 10px;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--border-input);
		}
	}

	&__phase--current .roadmap__item::before {
		background: var(--brand);
	}

	&__later {
		max-width: 760px;
		padding-top: 32px;
	}

	// --- Launch goals -------------------------------------------------
	&__launch {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 72px;
		margin-top: 72px;
		padding-top: 40px;
		border-top: var(--rule);
	}

	&__goals {
		display: flex;
		flex-direction: column;
		list-style: none;
	}

	&__goal {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr);
		gap: 14px;
		padding: 16px 0;
		border-top: var(--rule);

		&:first-child {
			padding-top: 0;
			border-top: 0;
		}
	}

	&__goal-icon {
		margin-top: 3px;
		color: var(--success);
	}

	&__goal-body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
}

@media only screen and (max-width: 1024px) {
	.roadmap {
		&__con {
			padding: 80px 0;
		}

		&__phases {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			row-gap: 40px;
		}

		&__launch {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.roadmap {
		&__con {
			padding: 64px 0;
		}

		&__head {
			padding-bottom: 36px;
		}

		&__phases {
			grid-template-columns: minmax(0, 1fr);
		}

		&__launch {
			margin-top: 56px;
		}
	}
}
</style>
