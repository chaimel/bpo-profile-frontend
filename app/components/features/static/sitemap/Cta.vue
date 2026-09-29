<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__text">
					<MHeading variant="2" size="3">{{ sitemapCta.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="cta__lede">{{ sitemapCta.text }}</MText>
				</div>

				<div class="cta__actions">
					<MButton to="/static/guide" size="lg">
						<template #prefix>
							<MIcon name="light-book-reader" size="sm" />
						</template>
						Read the guide
					</MButton>
					<MButton to="/" size="lg" variant="neutral">Go to the home page</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { sitemapCta } from '~/data/features/sitemap'
</script>

<style lang="scss" scoped>
.cta {
	background: var(--canvas);
	border-top: var(--rule);

	&__con {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px 64px;
		padding: 72px 0;
	}

	&__text {
		max-width: 560px;
	}

	&__lede {
		padding-top: 12px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		flex: 0 0 auto;
	}
}

@media only screen and (max-width: 768px) {
	.cta {
		&__con {
			flex-direction: column;
			align-items: flex-start;
			padding: 56px 0;
		}
	}
}
</style>
