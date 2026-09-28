<template>
	<section id="foundations" class="foundations" aria-labelledby="foundations-title">
		<div class="wrapper">
			<div class="foundations__con">
				<MHeading id="foundations-title" variant="2" size="3">Foundations</MHeading>

				<Specimen title="Color tokens" description="Brand blue for action, slate for navigation and dark bands, black for text — on restrained neutrals." layout="grid">
					<div v-for="color in colors" :key="color.token" class="foundations__swatch">
						<span class="foundations__chip" :style="{ background: `var(--${color.token})` }" />
						<span class="foundations__token">--{{ color.token }}</span>
						<span class="foundations__use">{{ color.use }}</span>
					</div>
				</Specimen>

				<Specimen title="Type scale" description="Poppins for headings and UI, Calibri (Carlito fallback) for reading copy." layout="stack">
					<!-- specimens of the raw element styles: MText's size classes would override them -->
					<p v-for="level in levels" :key="level.class" :class="level.class" class="foundations__sample">
						{{ level.label }}
					</p>
					<p class="foundations__body">
						Body copy — Calibri at 17px. BPO Profile makes it easier to discover outsourcing providers, explore
						their capabilities, and connect directly with sales professionals.
					</p>
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import Specimen from './Specimen.vue'

const colors = [
	{ token: 'brand', use: 'BPO Blue — icons, marks, display text' },
	{ token: 'brand-strong', use: 'Buttons and links (AA)' },
	{ token: 'brand-deep', use: 'Pressed; text on brand-soft' },
	{ token: 'brand-soft', use: 'Tinted surfaces' },
	{ token: 'slate', use: 'Navigation, dark bands' },
	{ token: 'ink', use: 'Headings and text' },
	{ token: 'canvas', use: 'Alternate bands' },
	{ token: 'surface-muted', use: 'Wells and tags' },
	{ token: 'border', use: 'Hairline rules' },
	{ token: 'border-input', use: 'Field outlines (3:1)' },
	{ token: 'success', use: 'Positive states' },
	{ token: 'warning', use: 'Needs attention' },
	{ token: 'danger', use: 'Errors, destructive' },
]

const levels = [
	{ class: 'heading-1', label: 'H1 — 48 Bold' },
	{ class: 'heading-2', label: 'H2 — 36 Semi-bold' },
	{ class: 'heading-3', label: 'H3 — 28 Semi-bold' },
	{ class: 'heading-4', label: 'H4 — 22 Medium' },
	{ class: 'heading-5', label: 'H5 — 18 Medium' },
	{ class: 'heading-6', label: 'H6 — 14 Regular' },
]
</script>

<style lang="scss" scoped>
.foundations {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}

	&__swatch {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__chip {
		height: 56px;
		border-radius: var(--radius-sm);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__token {
		font-family: var(--font-mono);
		font-size: 13px;
	}

	&__use {
		font-size: 14px;
		color: var(--text-muted);
	}

	&__sample {
		font-family: var(--font-display);
		color: var(--text-primary);
	}

	&__body {
		max-width: 680px;
	}
}
</style>
