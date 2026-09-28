<template>
	<div class="header">
		<div class="wrapper">
			<div class="header__con">
				<div class="header__text">
					<MBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Sales Pros' }]" />
					<MHeading variant="1" size="2" class="header__title">Sales pros</MHeading>
					<MText size="large" color="--text-secondary" class="header__lede">
						Meet the sales and business development professionals behind BPO companies.
						Every profile belongs to a real person at a listed company — and you can contact them directly.
					</MText>
				</div>

				<dl class="header__facts">
					<div class="header__fact">
						<dt>Profiles</dt>
						<dd>{{ formatNumber(props.total) }}</dd>
					</div>
					<div class="header__fact">
						<dt>Affiliation</dt>
						<dd>Approved by their company</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { formatNumber } from '~/utils/format'

interface Props {
	total: number
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.header {
	&__con {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px;
		padding: 28px 0 24px;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 720px;
	}

	&__facts {
		display: flex;
		gap: 32px;
		flex: 0 0 auto;
	}

	&__fact {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-left: 16px;
		border-left: 2px solid var(--brand);

		dt {
			font-family: var(--font-ui);
			font-size: 12px;
			color: var(--text-muted);
		}

		dd {
			font-family: var(--font-display);
			font-size: 16px;
			font-weight: 600;
		}
	}
}

@media only screen and (max-width: 900px) {
	.header__con {
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}
}
</style>
