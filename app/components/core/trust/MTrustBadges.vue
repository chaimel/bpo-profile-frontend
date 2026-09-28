<template>
	<!-- inline: badges only · list: each badge with what it means -->
	<ul
		v-if="badges.length"
		:class="['m-trust-badges', `m-trust-badges--${props.variant}`]"
		:aria-label="props.variant === 'inline' ? 'Trust indicators' : undefined"
	>
		<li v-for="badge in badges" :key="badge.key" class="m-trust-badges__item">
			<MBadge :tone="badge.tone" :icon="badge.icon" :size="props.size" :title="badge.meaning">
				{{ badge.label }}
			</MBadge>
			<MText v-if="props.variant === 'list'" size="small" color="--text-secondary" class="m-trust-badges__meaning">{{ badge.meaning }}</MText>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName, Tone } from '~/types/base/ui'

// Meaningful badges only (docs/PLAN.md §4.6). Each one states what was
// checked; none is decorative, and none implies another.
interface Props {
	kind: 'company' | 'professional'
	claimed?: boolean
	verified?: boolean
	completeness?: number
	featured?: boolean
	threshold?: number
	variant?: 'inline' | 'list'
	size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
	claimed: false,
	verified: false,
	completeness: 0,
	featured: false,
	threshold: 80,
	variant: 'inline',
	size: 'md',
})

interface TrustBadge {
	key: string
	label: string
	meaning: string
	icon: MIconName
	tone: Tone
}

const badges = computed<TrustBadge[]>(() => {
	const list: TrustBadge[] = []

	if (props.verified && props.kind === 'company') {
		list.push({
			key: 'verified',
			label: 'Verified company',
			meaning: 'BPO Profile reviewed this company’s legal and website identity.',
			icon: 'light-check-circle',
			tone: 'brand',
		})
	}

	if (props.verified && props.kind === 'professional') {
		list.push({
			key: 'verified',
			label: 'Verified professional',
			meaning: 'BPO Profile confirmed this person belongs to the company they represent.',
			icon: 'light-user-check',
			tone: 'brand',
		})
	}

	if (props.claimed && props.kind === 'company') {
		list.push({
			key: 'claimed',
			label: 'Claimed',
			meaning: 'A company admin signed in and controls this listing.',
			icon: 'light-shield',
			tone: 'slate',
		})
	}

	if (props.completeness >= props.threshold) {
		list.push({
			key: 'complete',
			label: 'Profile complete',
			meaning: `The profile meets our completeness standard (${props.threshold}% or more).`,
			icon: 'light-clipboard-check',
			tone: 'success',
		})
	}

	if (props.featured) {
		list.push({
			key: 'featured',
			label: 'Featured',
			// premium is the final tie-breaker only (docs/PLAN.md §4.7)
			meaning: 'A paid or editorially selected placement. It never outranks a better match; at most it breaks a tie.',
			icon: 'light-star',
			tone: 'warning',
		})
	}

	return list
})
</script>

<style lang="scss" scoped>
.m-trust-badges {
	// rows pack to the top even when a grid stretches the list taller
	&--inline {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 6px;
	}

	&--list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__meaning {
		margin-top: 6px;
	}
}
</style>
