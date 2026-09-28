<template>
	<div class="banner">
		<div class="wrapper">
			<div class="banner__con">
				<MBreadcrumbs :items="breadcrumbs" />

				<div class="banner__text">
					<MHeading variant="1">{{ props.title }}</MHeading>
					<MText size="xlarge" color="--text-secondary" class="banner__lede">{{ props.lede }}</MText>
					<MText size="xsmall" color="--text-muted" class="banner__meta">
						<MIcon name="light-file-edit" size="sm" class="banner__meta-icon" />
						<span>
							Draft last updated
							<time :datetime="props.updated">{{ formatDate(props.updated) }}</time>
						</span>
					</MText>
				</div>

				<!-- prominent on purpose: nothing here is in effect yet -->
				<MAlert tone="warning" class="banner__draft">
					<template #title>{{ draftNotice.title }}</template>
					{{ draftNotice.text }}
				</MAlert>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { draftNotice } from '~/data/features/legal'
import type { BreadcrumbItem } from '~/types/base/ui'
import { formatDate } from '~/utils/format'

interface Props {
	title: string
	lede: string
	updated: string
}

const props = defineProps<Props>()

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
	{ label: 'Home', to: '/' },
	{ label: props.title },
])
</script>

<style lang="scss" scoped>
.banner {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		padding: 32px 0 48px;
	}

	&__text {
		max-width: 760px;
		padding-top: 40px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__meta {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 20px;
		font-family: var(--font-ui);
	}

	&__meta-icon {
		color: var(--text-muted);
	}

	&__draft {
		max-width: 760px;
		margin-top: 32px;
		padding: 18px 20px;
		box-shadow: inset 4px 0 0 var(--warning);
	}
}

@media only screen and (max-width: 600px) {
	.banner {
		&__con {
			padding: 24px 0 40px;
		}

		&__text {
			padding-top: 32px;
		}

		&__draft {
			margin-top: 24px;
		}
	}
}
</style>
