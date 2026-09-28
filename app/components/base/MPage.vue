<template>
	<div :id="props.id" class="m-page">
		<header v-if="props.title || $slots['actions']" class="m-page__head">
			<div class="m-page__head-text">
				<NuxtLink v-if="props.back" :to="props.back.to" class="m-page__back">
					<MIcon name="light-angle-left" size="xs" />
					{{ props.back.label }}
				</NuxtLink>
				<h1 v-if="props.title" class="m-page__title heading-3">{{ props.title }}</h1>
				<p v-if="props.description || $slots['description']" class="m-page__description">
					<slot name="description">{{ props.description }}</slot>
				</p>
			</div>

			<div v-if="$slots['actions']" class="m-page__actions">
				<slot name="actions" />
			</div>
		</header>

		<slot />
	</div>
</template>

<script setup lang="ts">
import MIcon from './MIcon.vue'

// Page shell for the dashboard and admin: one h1, an optional way
// back, and a slot for the page's primary actions.
interface Props {
	id: string
	title?: string
	description?: string
	back?: { label: string, to: string }
}

const props = withDefaults(defineProps<Props>(), {
	title: undefined,
	description: undefined,
	back: undefined,
})
</script>
