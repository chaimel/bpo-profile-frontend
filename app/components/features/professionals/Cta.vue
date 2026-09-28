<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__text">
					<MHeading variant="2" size="3">Sell for a BPO? Build your professional profile.</MHeading>
					<MText size="large" color="--text-secondary">
						Become easier for potential clients to find. Your company approves the affiliation, and we review
						every profile before it goes live.
					</MText>
				</div>
				<div class="cta__actions">
					<MButton size="lg" to="/register?type=professional">Create Your Profile</MButton>
					<MButton size="lg" variant="text" to="/register?type=company">Represent a company? Get Listed</MButton>
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
		align-items: center;
		gap: 12px 20px;
	}
}
</style>
