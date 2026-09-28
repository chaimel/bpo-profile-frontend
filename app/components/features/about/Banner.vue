<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__grid">
					<div class="banner__text">
						<MHeading variant="1">{{ aboutIntro.title }}</MHeading>
						<MText weight="medium" class="banner__statement">{{ aboutIntro.statement }}</MText>
						<MText size="large" color="--text-secondary" class="banner__lede">
							{{ aboutIntro.lede }}
						</MText>
					</div>

					<!-- the core concept, drawn from the product model itself (PDF p. 6) -->
					<ol class="banner__flow" aria-label="How BPO Profile connects people">
						<li v-for="step in coreConcept" :key="step.title" class="banner__node">
							<span class="banner__node-icon">
								<MIcon :name="step.icon" size="md" />
							</span>
							<span class="banner__node-text">
								<span class="banner__node-title">{{ step.title }}</span>
								<span class="banner__node-desc">{{ step.text }}</span>
							</span>
						</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { aboutIntro, coreConcept } from '~/data/features/about'
import type { BreadcrumbItem } from '~/types/base/ui'

const breadcrumbs: BreadcrumbItem[] = [
	{ label: 'Home', to: '/' },
	{ label: 'About' },
]
</script>

<style lang="scss" scoped>
.banner {
	&__con {
		padding: 32px 0 80px;
	}

	&__grid {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		align-items: end;
		gap: 80px;
		padding-top: 40px;
	}

	// a display statement, larger than the text scale goes
	&__statement {
		max-width: 640px;
		padding-top: 24px;
		font-family: var(--font-display);
		font-size: 26px;
		line-height: 36px;
		letter-spacing: -0.01em;
	}

	&__lede {
		max-width: 600px;
		padding-top: 16px;
	}

	// --- Company → Person → Client --------------------------------
	&__flow {
		display: flex;
		flex-direction: column;
		gap: 20px;
		list-style: none;
	}

	&__node {
		position: relative;
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		align-items: start;
		gap: 16px;

		// the connecting line down to the next step
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 23px;
			top: 52px;
			bottom: -16px;
			width: 2px;
			background: var(--brand-soft);
		}

		&:last-child {
			.banner__node-icon {
				background: var(--brand-soft);
				box-shadow: none;
				color: var(--brand-deep);
			}
		}
	}

	&__node-icon {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border-strong);
		color: var(--brand);
	}

	&__node-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-top: 2px;
	}

	&__node-title {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);
	}

	&__node-desc {
		font-size: 16px;
		line-height: 24px;
		color: var(--text-secondary);
	}
}

@media only screen and (max-width: 1024px) {
	.banner {
		&__grid {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
			gap: 48px;
			padding-top: 32px;
		}

		&__flow {
			max-width: 480px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 56px;
		}

		&__statement {
			font-size: 22px;
			line-height: 31px;
		}
	}
}
</style>
