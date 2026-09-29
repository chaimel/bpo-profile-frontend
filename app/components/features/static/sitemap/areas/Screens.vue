<template>
	<ul class="screens">
		<li
			v-for="row in props.rows"
			:key="row.screen.path"
			:class="['screens__row', { 'screens__row--child': row.depth === 1, 'screens__row--grandchild': row.depth > 1 }]"
		>
			<div class="screens__main">
				<NuxtLink :to="row.screen.to" class="screens__title">
					{{ row.screen.title }}
					<MIcon name="light-arrow-right" size="xs" class="screens__arrow" />
				</NuxtLink>
				<code class="screens__path">
					<MIcon v-if="row.depth" name="light-arrow-level-right" size="xs" class="screens__branch" />
					<RoutePath :value="row.screen.path" />
				</code>
			</div>

			<div class="screens__detail">
				<MText size="small" color="--text-secondary">{{ row.screen.summary }}</MText>
				<MText v-if="row.screen.sample" size="xsmall" color="--text-muted" class="screens__sample">
					<MIcon name="light-file-details" size="xs" />
					<span>Opens {{ row.screen.sample }}</span>
				</MText>

				<div v-if="row.screen.states?.length" class="screens__states">
					<span class="screens__states-label" aria-hidden="true">States</span>
					<ul class="screens__state-list" :aria-label="`Other states of ${row.screen.title}`">
						<li v-for="state in row.screen.states" :key="state.to">
							<MTag :to="state.to" size="sm" variant="outline">{{ state.label }}</MTag>
						</li>
					</ul>
				</div>
			</div>
		</li>
	</ul>
</template>

<script setup lang="ts">
import type { SitemapRow } from '~/types/features/guide'
import RoutePath from '../../shared/RoutePath.vue'

// One group's screens as a tree: detail pages sit under their list.
interface Props {
	rows: SitemapRow[]
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.screens {
	display: flex;
	flex-direction: column;
	list-style: none;
	border-bottom: var(--rule);

	&__row {
		display: grid;
		grid-template-columns: minmax(0, 250px) minmax(0, 1fr);
		gap: 28px;
		padding: 18px 0;
		border-top: var(--rule);

		&--child .screens__main {
			padding-left: 20px;
		}

		&--grandchild .screens__main {
			padding-left: 40px;
		}
	}

	&__main {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		min-width: 0;
	}

	&__title {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;

			.screens__arrow {
				color: var(--brand-strong);
			}
		}
	}

	&__arrow {
		color: var(--text-muted);
	}

	&__path {
		display: flex;
		align-items: flex-start;
		gap: 4px;
		max-width: 100%;
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 18px;
		color: var(--text-muted);
		overflow-wrap: anywhere;
	}

	&__branch {
		flex: 0 0 auto;
		margin-top: 2px;
		color: var(--border-input);
	}

	&__detail {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		min-width: 0;
	}

	&__sample {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
	}

	&__states {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding-top: 2px;
	}

	&__states-label {
		flex: 0 0 auto;
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__state-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
	}
}

@media only screen and (max-width: 768px) {
	.screens {
		&__row {
			grid-template-columns: minmax(0, 1fr);
			gap: 10px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.screens {
		&__row {
			&--child .screens__main {
				padding-left: 12px;
			}

			&--grandchild .screens__main {
				padding-left: 24px;
			}
		}

		&__states {
			flex-direction: column;
			gap: 6px;
		}
	}
}
</style>
