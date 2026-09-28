<template>
	<component
		:is="tag"
		:class="['m-heading', size_class, weight_class, props.class]"
		:style="heading_style"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6'

interface Props {
	// the semantic level — keep the page's heading order intact
	variant?: HeadingLevel
	// the visual size, when it should differ from the level
	size?: HeadingLevel
	// defaults to the level's brand weight (PDF p. 28)
	weight?: 'regular' | 'medium' | 'semi-bold' | 'bold'
	class?: string
	// Token name ("text-primary"), custom property ("--brand"),
	// or a raw CSS color ("#fff", "rgb(...)").
	color?: string
}

const props = withDefaults(defineProps<Props>(), {
	variant: '2',
	size: undefined,
	weight: undefined,
	class: '',
	color: undefined,
})

// Resolve a token / custom-property / raw color to a usable CSS value.
function resolveColor(value: string): string {
	const v = value.trim()
	if (!v) return v
	if (v.startsWith('--')) return `var(${v})`
	if (/^(#|rgb|hsl|var\()/i.test(v)) return v
	return `var(--${v})`
}

const heading_style = computed(() => (props.color ? { color: resolveColor(props.color) } : {}))

const tag = computed(() => `h${props.variant}`)

// Only add a size class when the look should differ from the level.
const size_class = computed(() => (props.size && props.size !== props.variant ? `heading-${props.size}` : ''))

const weight_class = computed(() => (props.weight ? `font-${props.weight}` : ''))
</script>
