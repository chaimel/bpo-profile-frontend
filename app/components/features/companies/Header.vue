<template>
	<div class="header">
		<div class="wrapper">
			<div class="header__con">
				<MBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'BPO Profiles' }]" />
				<div class="header__row">
					<MHeading variant="1" size="2">BPO companies</MHeading>
					<MText size="small" color="--text-muted" class="header__count">{{ pluralize(props.total, 'company', 'companies') }} listed</MText>
				</div>
				<MText size="large" color="--text-secondary" class="header__lede">
					Every company here has a profile you can evaluate — services, industries, locations, capabilities —
					and a sales team you can contact directly.
				</MText>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { pluralize } from '~/utils/format'

interface Props {
	total: number
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.header {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 28px 0 24px;
	}

	&__row {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 8px 20px;
	}

	&__count {
		font-family: var(--font-ui);
	}

	&__lede {
		max-width: 720px;
	}
}
</style>
