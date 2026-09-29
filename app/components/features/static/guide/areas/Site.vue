<template>
	<Frame path="/" class="site">
		<div class="site__header">
			<div class="site__top">
				<Logo size="sm" />
				<div class="site__actions">
					<NuxtLink to="/login" class="site__sign-in">Sign In</NuxtLink>
					<MButton to="/register?type=company" size="sm">Get Listed</MButton>
				</div>
			</div>

			<!-- the real header's menu, one row down to fit the replica -->
			<nav class="site__nav" aria-label="Public site menu">
				<NuxtLink v-for="link in primaryNav" :key="link.to" :to="link.to" class="site__link">{{ link.label }}</NuxtLink>
			</nav>
		</div>

		<!-- the shape of the page between them: the home page's hero search -->
		<div class="site__page" aria-hidden="true">
			<span class="site__line site__line--title" />
			<span class="site__line site__line--title site__line--short" />
			<span class="site__line" />
			<span class="site__field" />
		</div>

		<div class="site__footer">
			<span class="site__footer-label">Footer</span>
			<ul class="site__columns">
				<li v-for="column in footerColumns" :key="column.title">{{ column.title }}</li>
			</ul>
		</div>
	</Frame>
</template>

<script setup lang="ts">
import Logo from '~/components/layout/Logo.vue'
import { footerColumns, primaryNav } from '~/data/features/site'
import Frame from './Frame.vue'
</script>

<style lang="scss" scoped>
.site {
	&__header {
		padding: 12px 16px 0;
		border-bottom: var(--rule);
	}

	&__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	&__actions {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	&__sign-in {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
		}
	}

	&__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0 4px;
		padding-top: 10px;
	}

	// the header's links: a blue mark under the one you hover
	&__link {
		padding: 6px 8px 8px;
		border-bottom: 2px solid transparent;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 500;
		color: var(--slate);
		white-space: nowrap;

		&:hover {
			border-bottom-color: var(--brand);
			color: var(--text-primary);
		}
	}

	// --- Page placeholder -------------------------------------------
	&__page {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 28px 16px 32px;
	}

	&__line {
		display: block;
		width: 72%;
		height: 8px;
		border-radius: var(--radius-xs);
		background: var(--surface-muted);

		&--title {
			width: 56%;
			height: 14px;
			background: var(--border-strong);
		}

		&--short {
			width: 34%;
		}
	}

	&__field {
		display: block;
		width: 88%;
		height: 34px;
		margin-top: 8px;
		border-radius: var(--radius-sm);
		box-shadow: inset 0 0 0 1px var(--border-input);
	}

	// --- Footer ---------------------------------------------------
	&__footer {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 20px;
		padding: 14px 16px;
		background: var(--slate);
	}

	&__footer-label {
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-dark-subtle);
	}

	&__columns {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		list-style: none;
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--on-dark-muted);
	}
}
</style>
