<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__search">
					<MHeading variant="2" size="3">Know exactly what you need?</MHeading>
					<MText size="large" color="--text-secondary" class="cta__text">
						Search by keyword, then narrow the list by industry, location, language, and work model.
					</MText>
					<MButton to="/find" size="lg" class="cta__button">
						<template #prefix>
							<MIcon name="light-search" size="sm" />
						</template>
						Find a BPO
					</MButton>
				</div>

				<div class="cta__provider">
					<MHeading variant="2" size="5" weight="semi-bold">Offer one of these services?</MHeading>
					<MText color="--text-secondary" class="cta__text">
						Put your company and your sales team in front of businesses looking for outsourcing partners.
					</MText>
					<MButton to="/register?type=company" variant="outline" class="cta__button">Get Listed</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cta {
	background: var(--canvas);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		gap: 64px;
		padding: 80px 0;
	}

	&__search,
	&__provider {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__provider {
		justify-content: center;
		padding-left: 64px;
		border-left: 1px solid var(--border-strong);
	}

	&__text {
		max-width: 520px;
		padding-top: 12px;
	}

	&__button {
		margin-top: 28px;
	}
}

@media only screen and (max-width: 1024px) {
	.cta {
		&__con {
			gap: 40px;
		}

		&__provider {
			padding-left: 40px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.cta {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			padding: 56px 0;
		}

		&__provider {
			padding: 40px 0 0;
			border-left: 0;
			border-top: 1px solid var(--border-strong);
		}
	}
}
</style>
