<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__text">
					<MHeading variant="2" size="3">{{ guideCta.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="cta__lede">{{ guideCta.text }}</MText>
				</div>

				<div class="cta__actions">
					<MButton to="/static/sitemap" size="lg">
						<template #prefix>
							<MIcon name="light-folders" size="sm" />
						</template>
						Open the sitemap
					</MButton>
					<MButton to="/" size="lg" variant="neutral">Go to the home page</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { guideCta } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.cta {
	&__con {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px 64px;
		padding: 80px 0;
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
