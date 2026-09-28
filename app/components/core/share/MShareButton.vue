<template>
	<div class="m-share-button">
		<MButton :variant="props.variant" :size="props.size" @click="share">
			<template #prefix>
				<MIcon :name="copied ? 'light-check' : 'light-link'" size="sm" />
			</template>
			{{ copied ? 'Link copied' : props.label }}
		</MButton>
		<span class="sr-only" role="status">{{ copied ? 'Profile link copied to clipboard' : '' }}</span>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

// Profiles are meant to be shared (PDF p. 36): native share sheet where
// the device has one, otherwise copy the link.
interface Props {
	title: string
	label?: string
	variant?: 'neutral' | 'ghost' | 'outline'
	size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
	label: 'Share Profile',
	variant: 'neutral',
	size: 'md',
})

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function share() {
	const url = window.location.href.split('#')[0] ?? window.location.href

	if (navigator.share) {
		try {
			await navigator.share({ title: props.title, url })
			return
		}
		catch {
			// dismissed or unsupported — fall back to copying
		}
	}

	try {
		await navigator.clipboard.writeText(url)
		copied.value = true
		clearTimeout(timer)
		timer = setTimeout(() => {
			copied.value = false
		}, 2400)
	}
	catch {
		copied.value = false
	}
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style lang="scss" scoped>
.m-share-button {
	display: inline-flex;
}
</style>
