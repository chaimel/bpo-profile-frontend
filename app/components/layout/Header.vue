<template>
	<header class="header">
		<a href="#main-content" class="skip-link">Skip to content</a>

		<div class="wrapper">
			<div class="header__con">
				<Logo />

				<nav class="header__nav" aria-label="Primary">
					<NuxtLink
						v-for="link in primaryNav"
						:key="link.to"
						:to="link.to"
						class="header__link"
						active-class="header__link--active"
					>
						{{ link.label }}
					</NuxtLink>
				</nav>

				<div class="header__actions">
					<MButton variant="ghost" to="/login" class="header__sign-in">Sign In</MButton>
					<MButton to="/register?type=company" class="header__cta">Get Listed</MButton>
					<MButtonIcon
						class="header__toggle"
						name="light-bars"
						title="Open menu"
						variant="outline"
						icon-size="md"
						:aria-expanded="isOpen('mobile-nav')"
						@click="openModal('mobile-nav')"
					/>
				</div>
			</div>
		</div>

		<MDrawer name="mobile-nav" side="right" :width="360">
			<template #header>Menu</template>

			<nav class="header__drawer-nav" aria-label="Primary">
				<NuxtLink
					v-for="link in primaryNav"
					:key="link.to"
					:to="link.to"
					class="header__drawer-link"
					active-class="header__drawer-link--active"
					@click="closeModal('mobile-nav')"
				>
					{{ link.label }}
					<MIcon name="light-angle-right" size="sm" />
				</NuxtLink>
			</nav>

			<template #footer>
				<div class="header__drawer-actions">
					<MButton to="/register?type=company" block @click="closeModal('mobile-nav')">Get Listed</MButton>
					<MButton variant="neutral" to="/login" block @click="closeModal('mobile-nav')">Sign In</MButton>
				</div>
			</template>
		</MDrawer>
	</header>
</template>

<script setup lang="ts">
import Logo from '~/components/layout/Logo.vue'
import { primaryNav } from '~/data/features/site'

const { isOpen, openModal, closeModal } = useModal()
</script>

<style lang="scss" scoped>
.header {
	position: sticky;
	top: 0;
	z-index: 40;
	background: var(--header-glass);
	backdrop-filter: saturate(1.4) blur(12px);
	border-bottom: var(--rule);

	&__con {
		display: flex;
		align-items: center;
		gap: 32px;
		height: var(--header-height);
	}

	// --- Nav --------------------------------------------------
	&__nav {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-right: auto;
	}

	&__link {
		position: relative;
		padding: 8px 10px;
		border-radius: var(--radius-sm);
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--slate);
		white-space: nowrap;

		&::after {
			content: '';
			position: absolute;
			left: 10px;
			right: 10px;
			bottom: -15px;
			height: 2px;
			background: transparent;
			transition: background-color 0.15s ease;
		}

		&:hover {
			color: var(--text-primary);
			background: var(--surface-muted);
		}

		&--active {
			color: var(--text-primary);

			&::after {
				background: var(--brand);
			}
		}
	}

	// --- Actions ----------------------------------------------
	&__actions {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 0 0 auto;
	}

	&__toggle {
		display: none;
	}

	// --- Drawer -----------------------------------------------
	&__drawer-nav {
		display: flex;
		flex-direction: column;
	}

	&__drawer-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 0;
		border-bottom: var(--rule);
		font-family: var(--font-ui);
		font-size: 16px;
		font-weight: 500;
		color: var(--text-primary);

		.m-icon {
			color: var(--text-muted);
		}

		&--active {
			color: var(--brand-strong);
		}
	}

	&__drawer-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}
}

@media only screen and (max-width: 1160px) {
	.header {
		&__nav {
			display: none;
		}

		&__actions {
			margin-left: auto;
		}

		&__toggle {
			display: inline-grid;
		}
	}
}

@media only screen and (max-width: 600px) {
	.header {
		&__con {
			gap: 16px;
		}

		&__sign-in {
			display: none;
		}

		&__cta {
			height: 40px;
			padding-inline: 14px;
		}
	}
}

// the narrowest phones: Get Listed stays one tap away, in the menu's actions
@media only screen and (max-width: 359px) {
	.header__cta {
		display: none;
	}
}
</style>
