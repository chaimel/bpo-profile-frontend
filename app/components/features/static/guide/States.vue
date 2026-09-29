<template>
	<section id="states" class="states" aria-labelledby="states-title">
		<div class="wrapper">
			<div class="states__con">
				<div class="states__intro">
					<MHeading id="states-title" variant="2" size="3">{{ statesIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="states__text">
						{{ intro_before }}<code v-if="intro_after !== undefined" class="states__token">{{ token }}</code>{{ intro_after }}
					</MText>
					<MButton to="/static/sitemap" variant="text" class="states__link">
						Browse every state in the sitemap
						<template #suffix>
							<MIcon name="light-arrow-right" size="xs" />
						</template>
					</MButton>
				</div>

				<ul class="states__list">
					<li v-for="example in examples" :key="example.to">
						<NuxtLink :to="example.to" class="states__example">
							<span class="states__address">
								<span class="states__domain">{{ siteDomain }}</span><RoutePath :value="example.path" /><span class="states__query">{{ example.query }}</span>
							</span>
							<span class="states__label">
								{{ example.label }}
								<MIcon name="light-arrow-right" size="xs" class="states__arrow" />
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { stateExamples, statesIntro } from '~/data/features/guide'
import { siteDomain } from '~/data/features/site'
import RoutePath from '../shared/RoutePath.vue'

// The intro names the query to add; set as code so it never wraps.
const token = '?state='
const [intro_before, intro_after] = statesIntro.text.split(token)

// Each example split at "?", so the part that picks the state stands out.
const examples = stateExamples.map((example) => {
	const index = example.to.indexOf('?')

	return {
		...example,
		path: index === -1 ? example.to : example.to.slice(0, index),
		query: index === -1 ? '' : example.to.slice(index),
	}
})
</script>

<style lang="scss" scoped>
.states {
	background: var(--canvas);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
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

	&__token {
		padding: 1px 5px;
		border-radius: var(--radius-xs);
		background: var(--brand-soft);
		font-family: var(--font-mono);
		font-size: 15px;
		color: var(--brand-deep);
		white-space: nowrap;
	}

	&__link {
		margin-top: 20px;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		list-style: none;
	}

	&__example {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px 16px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
		transition: box-shadow 0.15s ease;

		&:hover {
			box-shadow: inset 0 0 0 1px var(--brand);

			.states__label,
			.states__arrow {
				color: var(--brand-strong);
			}
		}
	}

	&__address {
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 20px;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__domain {
		color: var(--text-muted);
	}

	// flush with the path, so the highlight never reads as a space
	&__query {
		border-radius: var(--radius-xs);
		background: var(--brand-soft);
		color: var(--brand-deep);
		white-space: nowrap;
	}

	&__label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	&__arrow {
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.states {
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
	.states {
		&__con {
			padding: 64px 0;
		}
	}
}
</style>
