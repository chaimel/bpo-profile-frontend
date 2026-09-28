<template>
	<aside class="guide" aria-labelledby="locations-guide-title">
		<MHeading id="locations-guide-title" variant="2" size="5" weight="semi-bold" class="guide__title">How locations work</MHeading>

		<ul class="guide__list">
			<li class="guide__item">
				<MIcon name="light-search" size="sm" class="guide__icon" />
				<span>A search for a country or region also finds companies with a city inside it.</span>
			</li>
			<li class="guide__item">
				<MIcon name="light-building" size="sm" class="guide__icon" />
				<span>Your headquarters must be one of your operating locations. It shows on your search card.</span>
			</li>
			<li class="guide__item">
				<MIcon name="light-exclamation-triangle" size="sm" class="guide__icon" />
				<span>To remove your headquarters, choose a new one first — or clear it.</span>
			</li>
			<li class="guide__item">
				<MIcon name="light-save" size="sm" class="guide__icon" />
				<span>Nothing changes on your profile until you save.</span>
			</li>
		</ul>
	</aside>
</template>

<script setup lang="ts">
// Static help beside the locations editor (docs/API.md §3, §5).
</script>

<style lang="scss" scoped>
.guide {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	border-radius: var(--radius-md);
	background: var(--brand-tint);

	&__list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__icon {
		flex: 0 0 auto;
		margin-top: 2px;
		color: var(--brand-deep);
	}
}
</style>
