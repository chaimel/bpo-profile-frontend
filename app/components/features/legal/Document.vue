<template>
	<div class="document">
		<div class="wrapper">
			<div class="document__con">
				<nav class="document__toc" aria-labelledby="document-toc-title">
					<MText id="document-toc-title" size="xsmall" weight="semi-bold" color="--text-muted" class="document__toc-title">On this page</MText>
					<ol class="document__toc-list">
						<li v-for="(section, index) in props.sections" :key="section.id">
							<a :href="`#${section.id}`" class="document__toc-link">
								<span class="document__toc-num">{{ index + 1 }}.</span>
								<span>{{ section.title }}</span>
							</a>
						</li>
					</ol>
				</nav>

				<article class="document__body">
					<section
						v-for="(section, index) in props.sections"
						:id="section.id"
						:key="section.id"
						class="document__section"
					>
						<MHeading variant="2" size="4" weight="semi-bold" class="document__title">
							<span class="document__num">{{ index + 1 }}.</span>
							{{ section.title }}
						</MHeading>

						<!-- plain text only: escaped, never v-html -->
						<MText
							v-for="(paragraph, paragraph_index) in section.paragraphs"
							:key="paragraph_index"
							color="--text-primary"
							class="document__paragraph"
						>
							{{ paragraph }}
						</MText>

						<ul v-if="section.list?.length" class="document__list">
							<li v-for="item in section.list" :key="item" class="document__item text-medium">{{ item }}</li>
						</ul>
					</section>

					<MText color="--text-secondary" class="document__foot">
						Questions about this draft?
						<NuxtLink to="/contact" class="document__link">Contact the BPO Profile team</NuxtLink>
					</MText>
				</article>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DocumentSection } from '~/types/features/content'

interface Props {
	sections: DocumentSection[]
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.document {
	&__con {
		display: grid;
		grid-template-columns: 260px minmax(0, 1fr);
		align-items: start;
		gap: 80px;
		padding: 64px 0 112px;
	}

	// --- Table of contents ----------------------------------------
	&__toc {
		position: sticky;
		top: calc(var(--header-height) + 32px);
	}

	&__toc-title {
		padding-bottom: 12px;
		font-family: var(--font-ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	&__toc-list {
		display: flex;
		flex-direction: column;
		list-style: none;
		border-left: var(--rule);
	}

	&__toc-link {
		display: flex;
		gap: 8px;
		margin-left: -1px;
		padding: 6px 0 6px 14px;
		border-left: 2px solid transparent;
		font-family: var(--font-ui);
		font-size: 14px;
		line-height: 20px;
		color: var(--text-secondary);

		&:hover {
			border-left-color: var(--brand);
			color: var(--text-primary);
		}
	}

	&__toc-num {
		flex: 0 0 auto;
		min-width: 20px;
		color: var(--text-muted);
	}

	// --- Body -----------------------------------------------------
	&__body {
		max-width: 720px;
	}

	&__section {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 40px 0;
		border-top: var(--rule);

		&:first-child {
			padding-top: 0;
			border-top: 0;
		}
	}

	&__title {
		padding-bottom: 4px;
	}

	&__num {
		color: var(--text-muted);
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-left: 4px;
	}

	&__item {
		position: relative;
		padding-left: 22px;

		&::before {
			content: '';
			position: absolute;
			left: 4px;
			top: 12px;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--brand);
		}
	}

	&__foot {
		padding-top: 32px;
		border-top: var(--rule);
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
	.document {
		&__con {
			grid-template-columns: 220px minmax(0, 1fr);
			gap: 48px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.document {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 40px 0 80px;
		}

		&__toc {
			position: static;
			padding: 20px;
			border-radius: var(--radius-md);
			background: var(--canvas);
		}

		&__toc-list {
			border-left: 0;
		}

		&__toc-link {
			margin-left: 0;
			padding-left: 0;
			border-left: 0;
		}

		&__section {
			padding: 32px 0;
		}
	}
}
</style>
