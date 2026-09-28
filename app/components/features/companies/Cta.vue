<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__text">
					<MHeading variant="2" size="3">Is your company missing, or listed without you?</MHeading>
					<MText size="large" color="--text-secondary">
						Create a free profile and add your sales team — or claim an existing listing to take control of it.
					</MText>
				</div>
				<div class="cta__actions">
					<MButton size="lg" to="/register?type=company">Get Listed</MButton>
					<MButton size="lg" variant="outline" to="/claim">Claim This Profile</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cta {
	background: var(--canvas);

	&__con {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 24px 48px;
		padding: 56px 0;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 680px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
}
</style>
