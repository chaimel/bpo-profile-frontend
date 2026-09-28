<template>
	<component
		:is="props.variant"
		:class="['m-text', size_class, weight_class, props.class]"
		:style="text_style"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	variant?: 'p' | 'span' | 'div'
	size?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall'
	weight?: 'regular' | 'medium' | 'semi-bold' | 'bold'
	class?: string
	// Token name ("text-primary"), custom property ("--text-muted"),
	// or a raw CSS color ("#fff", "rgb(...)").
	color?: string | undefined
	align?: 'left' | 'right' | 'center' | 'inherit'
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'p',
	size: 'medium',
	weight: 'regular',
	class: '',
	color: undefined,
	align: 'inherit',
})

// Resolve a token / custom-property / raw color to a usable CSS value.
function resolveColor(value: string): string {
	const v = value.trim()
	if (!v) return v
	if (v.startsWith('--')) return `var(${v})`
	if (/^(#|rgb|hsl|var\()/i.test(v)) return v
	return `var(--${v})`
}

const text_style = computed(() => {
	const style: Record<string, string> = {}
	if (props.align !== 'inherit') style.textAlign = props.align
	if (props.color) style.color = resolveColor(props.color)
	return style
})

const size_class = computed(() => `text-${props.size}`)
const weight_class = computed(() => `font-${props.weight}`)
</script>
