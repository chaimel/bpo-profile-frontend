<template>
	<div class="intro">
		<div class="wrapper">
			<div class="intro__con">
				<MBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'UI components' }]" />
				<MHeading variant="1" size="2">UI components</MHeading>
				<MText size="large" color="--text-secondary" class="intro__lede">
					The base primitives in <code>components/base</code> and the composed pieces in
					<code>components/core</code>, with their variants and states. Styles for every
					<code>M*</code> primitive live in <code>assets/scss/_component.scss</code>.
				</MText>
				<nav class="intro__toc" aria-label="On this page">
					<a v-for="link in links" :key="link.href" :href="link.href" class="intro__link">{{ link.label }}</a>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const links = [
	{ label: 'Foundations', href: '#foundations' },
	{ label: 'Buttons', href: '#buttons' },
	{ label: 'Forms', href: '#forms' },
	{ label: 'Feedback', href: '#feedback' },
	{ label: 'Navigation', href: '#navigation' },
	{ label: 'Overlays', href: '#overlays' },
	{ label: 'Data display', href: '#data-display' },
	{ label: 'Directory', href: '#directory' },
]
</script>

<style lang="scss" scoped>
.intro {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 28px 0 32px;
	}

	&__lede {
		max-width: 760px;

		code {
			font-family: var(--font-mono);
			font-size: 15px;
		}
	}

	&__toc {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		padding-top: 6px;
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--brand-strong);

		&:hover {
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}
}
</style>
