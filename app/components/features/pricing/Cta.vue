<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__text">
					<MHeading variant="2" size="3">
						Put your company in front of businesses looking for outsourcing partners.
					</MHeading>
					<MText color="--text-secondary" class="cta__note">
						Already listed?
						<NuxtLink to="/claim" class="cta__link">Claim your profile</NuxtLink>
						to take control of it.
					</MText>
				</div>

				<div class="cta__actions">
					<MButton to="/register?type=company" size="lg">Get Listed</MButton>
					<MButton to="/contact" size="lg" variant="neutral">Talk to our team</MButton>
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
		gap: 48px;
		padding: 80px 0;
	}

	&__text {
		max-width: 640px;
	}

	&__note {
		padding-top: 16px;
	}

	&__link {
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		flex: 0 0 auto;
	}
}

@media only screen and (max-width: 1024px) {
	.cta {
		&__con {
			flex-direction: column;
			align-items: flex-start;
			gap: 32px;
			padding: 64px 0;
		}
	}
}
</style>
