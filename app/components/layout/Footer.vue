<template>
	<footer class="footer">
		<div class="wrapper">
			<div class="footer__con">
				<div class="footer__top">
					<div class="footer__brand">
						<Logo inverse />
						<MText size="xlarge" weight="medium" class="footer__message">{{ masterMessage }}</MText>
						<MText color="--on-dark-muted" class="footer__support">
							Businesses search and send inquiries for free — no account needed.
						</MText>
					</div>

					<nav v-for="column in footerColumns" :key="column.title" class="footer__col" :aria-label="column.title">
						<span class="footer__col-title">{{ column.title }}</span>
						<ul class="footer__links">
							<li v-for="link in column.links" :key="link.label">
								<NuxtLink :to="link.to" class="footer__link">{{ link.label }}</NuxtLink>
							</li>
						</ul>
					</nav>
				</div>

				<div class="footer__base">
					<span class="footer__note">&copy; {{ year }} {{ siteName }} · {{ siteDomain }}</span>
					<span class="footer__note">
						Paid placement never outranks relevance, completeness or verification.
						<NuxtLink to="/about#ranking" class="footer__inline">How results are ranked</NuxtLink>
					</span>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import Logo from '~/components/layout/Logo.vue'
import { footerColumns, masterMessage, siteDomain, siteName } from '~/data/features/site'

const year = 2026
</script>

<style lang="scss" scoped>
.footer {
	// a faint top edge keeps a dark band above it from running into the footer
	border-top: 1px solid var(--on-dark-rule);
	background: var(--slate);
	color: var(--white);

	&__con {
		padding: 72px 0 32px;
	}

	&__top {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 1fr));
		gap: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--on-dark-rule);
	}

	&__brand {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	&__message {
		max-width: 320px;
		font-family: var(--font-display);
	}

	&__support {
		max-width: 320px;
	}

	&__col {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__col-title {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-subtle);
	}

	&__links {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--on-dark-muted);

		&:hover {
			color: var(--white);
			text-decoration: underline;
			text-underline-offset: 3px;
		}

		&:focus-visible {
			outline-color: var(--white);
		}
	}

	&__base {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-top: 24px;
	}

	&__note {
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 20px;
		color: var(--on-dark-subtle);
	}

	&__inline {
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

@media only screen and (max-width: 1024px) {
	.footer {
		&__top {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		&__brand {
			grid-column: 1 / -1;
		}

		&__base {
			flex-direction: column;
			align-items: flex-start;
		}
	}
}

@media only screen and (max-width: 600px) {
	.footer {
		&__con {
			padding-top: 48px;
		}

		&__top {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 32px;
		}

		// three link groups in two columns: the last one takes the full row
		&__col:last-child {
			grid-column: 1 / -1;
		}
	}
}
</style>
