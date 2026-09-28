<template>
	<aside class="help" aria-labelledby="contact-help-title">
		<MHeading id="contact-help-title" variant="2" size="5" weight="semi-bold">Looking for something else?</MHeading>

		<ul class="help__list">
			<li v-for="link in links" :key="link.to">
				<NuxtLink :to="link.to" class="help__link">
					<MIcon :name="link.icon" size="md" class="help__icon" />
					<span class="help__text">
						<span class="help__label">{{ link.label }}</span>
						<span class="help__description">{{ link.description }}</span>
					</span>
					<MIcon name="light-angle-right" size="sm" class="help__arrow" />
				</NuxtLink>
			</li>
		</ul>
	</aside>
</template>

<script setup lang="ts">
import type { MIconName } from '~/types/base/ui'

interface HelpLink {
	label: string
	description: string
	to: string
	icon: MIconName
}

const links: HelpLink[] = [
	{
		label: 'Find a BPO',
		description: 'Contact a company or sales pro from their profile. That form goes straight to them.',
		to: '/find',
		icon: 'light-search',
	},
	{
		label: 'Claim your profile',
		description: 'Already listed? Ask to take control of your company’s listing.',
		to: '/claim',
		icon: 'light-id-card',
	},
	{
		label: 'Listing plans',
		description: 'Compare Basic, Professional, and Premium, and see what’s available now.',
		to: '/pricing',
		icon: 'light-clipboard-list',
	},
	{
		label: 'What our badges mean',
		description: 'See what Claimed, Verified, and Profile complete stand for.',
		to: '/about#trust',
		icon: 'light-award',
	},
]
</script>

<style lang="scss" scoped>
.help {
	padding-top: 8px;

	&__list {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		border-top: var(--rule);
	}

	&__link {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr) 16px;
		align-items: start;
		gap: 16px;
		padding: 20px 0;
		border-bottom: var(--rule);

		&:hover {
			.help__label {
				color: var(--brand-strong);
				text-decoration: underline;
				text-underline-offset: 3px;
			}

			.help__arrow {
				transform: translateX(2px);
				color: var(--brand-strong);
			}
		}
	}

	&__icon {
		margin-top: 2px;
		color: var(--brand);
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);
	}

	&__description {
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__arrow {
		margin-top: 3px;
		color: var(--text-muted);
		transition: transform 0.15s ease;
	}
}
</style>
