<template>
	<section class="decisions" aria-labelledby="decisions-title">
		<div class="decisions__intro">
			<MHeading id="decisions-title" variant="2" size="5" color="white">Four separate decisions</MHeading>
			<MText size="medium" color="--on-dark-muted" class="decisions__lede">
				None of them grants another. Approving a claim doesn’t verify a company, and approving an
				affiliation doesn’t publish a person.
			</MText>
		</div>

		<dl class="decisions__list">
			<div v-for="decision in decisions" :key="decision.title" class="decisions__item">
				<dt class="decisions__title">
					<MIcon :name="decision.icon" size="sm" />
					{{ decision.title }}
				</dt>
				<dd class="decisions__text">{{ decision.text }}</dd>
				<dd class="decisions__who">{{ decision.who }}</dd>
			</div>
		</dl>
	</section>
</template>

<script setup lang="ts">
import type { MIconName } from '~/types/base/ui'

// Ownership, affiliation, publication and verification are distinct
// checks (docs/ARCHITECTURE.md §5, docs/PLAN.md §4.6).
interface Decision {
	title: string
	icon: MIconName
	text: string
	who: string
}

const decisions: Decision[] = [
	{
		title: 'Ownership',
		icon: 'light-shield',
		text: 'Who controls a listing. Granted when an approved claimant accepts the emailed link, or at company registration.',
		who: 'You approve the claim; the claimant completes it.',
	},
	{
		title: 'Affiliation',
		icon: 'light-user-plus',
		text: 'Whether a person belongs to a company. Approval adds them to the team; it doesn’t make them public.',
		who: 'The company’s owners and admins, or you.',
	},
	{
		title: 'Publication',
		icon: 'light-eye',
		text: 'Whether a profile is public. Companies can ask for review; nothing goes live without it.',
		who: 'Platform admins only.',
	},
	{
		title: 'Verification',
		icon: 'light-check-circle',
		text: 'Whether we checked identity: a company’s legal and website identity, or a person’s link to their company.',
		who: 'Platform admins only.',
	},
]
</script>

<style lang="scss" scoped>
.decisions {
	display: grid;
	grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
	gap: 32px;
	padding: 28px 32px;
	border-radius: var(--radius-md);
	background: var(--slate);
	color: var(--white);

	&__intro {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 0 20px;
		border-left: 1px solid var(--on-dark-rule);
	}

	&__title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		color: var(--white);
	}

	&__text {
		font-size: 15px;
		line-height: 22px;
		color: var(--on-dark-muted);
	}

	&__who {
		margin-top: auto;
		padding-top: 8px;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 500;
		line-height: 18px;
		color: var(--white);
	}
}

@media only screen and (max-width: 1280px) {
	.decisions {
		grid-template-columns: 1fr;
		gap: 20px;

		&__list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 20px 0;
		}
	}
}

@media only screen and (max-width: 600px) {
	.decisions {
		padding: 24px 20px;

		&__list {
			grid-template-columns: 1fr;
		}

		&__item {
			padding: 0 0 0 16px;
		}
	}
}
</style>
