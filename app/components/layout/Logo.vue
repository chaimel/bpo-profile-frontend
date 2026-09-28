<template>
	<NuxtLink :to="props.to" :class="['logo', `logo--${props.size}`, { 'logo--inverse': props.inverse }]" :aria-label="`${siteName} home`">
		<!-- a profile card: a person beside two lines of detail -->
		<svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
			<rect class="logo__tile" width="32" height="32" rx="8" />
			<circle class="logo__glyph" cx="12" cy="12.5" r="4" />
			<path class="logo__glyph" d="M5.5 24.5c.9-3.7 3.4-6 6.5-6s5.6 2.3 6.5 6z" />
			<rect class="logo__glyph" x="20" y="10" width="7" height="2.8" rx="1.4" />
			<rect class="logo__glyph logo__glyph--soft" x="20" y="15.4" width="5" height="2.8" rx="1.4" />
		</svg>
		<span class="logo__word" aria-hidden="true"><strong>BPO</strong> Profile</span>
	</NuxtLink>
</template>

<script setup lang="ts">
import { siteName } from '~/data/features/site'

interface Props {
	to?: string
	size?: 'sm' | 'md'
	// white wordmark for slate and ink backgrounds
	inverse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	to: '/',
	size: 'md',
	inverse: false,
})
</script>

<style lang="scss" scoped>
.logo {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	flex: 0 0 auto;
	color: var(--text-primary);

	&__mark {
		width: 32px;
		height: 32px;
	}

	&__tile {
		fill: var(--brand);
	}

	&__glyph {
		fill: var(--white);

		&--soft {
			opacity: 0.7;
		}
	}

	&__word {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.02em;
		white-space: nowrap;

		strong {
			font-weight: 700;
		}
	}

	&--sm {
		gap: 8px;

		.logo__mark {
			width: 28px;
			height: 28px;
		}

		.logo__word {
			font-size: 17px;
		}
	}

	&--inverse {
		color: var(--white);

		&:focus-visible {
			outline-color: var(--white);
		}
	}
}
</style>
