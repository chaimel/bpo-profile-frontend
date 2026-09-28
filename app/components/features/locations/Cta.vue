<template>
	<div class="cta">
		<div class="wrapper">
			<div class="cta__con">
				<div class="cta__buyers">
					<MHeading variant="2" size="3">Don’t see the place you need?</MHeading>
					<MText size="large" color="--text-secondary" class="cta__text">
						Many providers serve markets far from where their teams sit. Search by service and industry to
						find companies that already work with businesses like yours.
					</MText>
					<MButton to="/find" size="lg" class="cta__button">
						<template #prefix>
							<MIcon name="light-search" size="sm" />
						</template>
						Find a BPO
					</MButton>
				</div>

				<div class="cta__providers">
					<MHeading variant="2" size="5" weight="semi-bold">Operate somewhere new?</MHeading>
					<MText color="--text-secondary" class="cta__text">
						Add every location your company works from when you get listed. They appear here once your
						listing is published.
					</MText>
					<MButton to="/register?type=company" variant="secondary" class="cta__button">Get Listed</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cta {
	border-top: var(--rule);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		align-items: center;
		gap: 64px;
		padding: 80px 0 96px;
	}

	&__buyers,
	&__providers {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__providers {
		padding: 32px;
		border-radius: var(--radius-md);
		background: var(--canvas);
	}

	&__text {
		max-width: 560px;
		padding-top: 12px;
	}

	&__button {
		margin-top: 24px;
	}
}

@media only screen and (max-width: 1024px) {
	.cta {
		&__con {
			gap: 40px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.cta {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			padding: 56px 0 64px;
		}

		&__providers {
			padding: 24px;
		}
	}
}
</style>
