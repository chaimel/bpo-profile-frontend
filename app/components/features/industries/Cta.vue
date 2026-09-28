<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__text">
					<MHeading variant="2" size="3" color="white">Narrow it down by service and location</MHeading>
					<MText size="large" class="cta__lede">
						Find a BPO lets you combine an industry with the services, locations, and languages you need.
					</MText>
				</div>

				<div class="cta__actions">
					<MButton to="/find" variant="inverse" size="lg">
						<template #prefix>
							<MIcon name="light-search" size="sm" />
						</template>
						Find a BPO
					</MButton>
					<NuxtLink to="/register?type=company" class="cta__link">
						Serve one of these industries? Get Listed
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cta {
	background: var(--slate);
	color: var(--white);

	&__con {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 48px;
		padding: 72px 0;
	}

	&__text {
		max-width: 620px;
	}

	&__lede {
		padding-top: 12px;
		color: var(--on-dark-muted);
	}

	&__actions {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		flex: 0 0 auto;
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--on-dark-muted);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--white);
		}

		&:focus-visible {
			outline-color: var(--white);
		}
	}
}

@media only screen and (max-width: 768px) {
	.cta {
		&__con {
			flex-direction: column;
			align-items: flex-start;
			gap: 32px;
			padding: 56px 0;
		}
	}
}
</style>
