<template>
	<div class="get-listed">
		<div class="wrapper">
			<div class="get-listed__con">
				<div class="get-listed__main">
					<MText size="small" weight="semi-bold" color="--brand-strong" class="get-listed__kicker">For BPO companies</MText>
					<MHeading variant="2" class="get-listed__title">{{ getListed.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="get-listed__text">{{ getListed.text }}</MText>
					<div class="get-listed__actions">
						<MButton size="lg" to="/register?type=company">Get Listed</MButton>
						<MButton size="lg" variant="outline" to="/claim">Claim This Profile</MButton>
						<MButton variant="text" to="/pricing">See listing plans</MButton>
					</div>
				</div>

				<div class="get-listed__side">
					<div class="get-listed__faces" aria-hidden="true">
						<MAvatar v-for="person in faces" :key="person.slug" :name="`${person.first_name} ${person.last_name}`" size="md" decorative class="get-listed__face" />
					</div>
					<MHeading variant="3" size="5">{{ getListed.professionals.title }}</MHeading>
					<MText size="medium" color="--text-secondary">{{ getListed.professionals.text }}</MText>
					<MButton variant="text" to="/register?type=professional">
						Create Your Profile
						<template #suffix>
							<MIcon name="light-long-arrow-right" size="sm" />
						</template>
					</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getListed } from '~/data/features/home'

const { professionalCards } = useDirectoryStore()

const faces = professionalCards.slice(0, 4)
</script>

<style lang="scss" scoped>
.get-listed {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
		gap: 56px;
		padding: 96px 0;
	}

	&__kicker {
		font-family: var(--font-ui);
	}

	&__title {
		max-width: 720px;
		padding-top: 12px;
	}

	&__text {
		max-width: 620px;
		padding-top: 16px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		padding-top: 32px;
	}

	&__side {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		align-self: end;
		padding-left: 40px;
		border-left: var(--rule);
	}

	&__faces {
		display: flex;
		margin-bottom: 8px;
	}

	&__face {
		box-shadow: 0 0 0 3px var(--white);

		// a light overlap, so each face keeps both initials readable
		& + & {
			margin-left: -6px;
		}
	}
}

@media only screen and (max-width: 1024px) {
	.get-listed {
		&__con {
			grid-template-columns: 1fr;
			gap: 40px;
			padding: 64px 0;
		}

		&__side {
			padding: 32px 0 0;
			border-top: var(--rule);
			border-left: 0;
		}
	}
}
</style>
