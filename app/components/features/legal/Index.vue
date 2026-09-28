<template>
	<div class="legal">
		<Banner :title="props.title" :lede="props.lede" :updated="props.updated" />
		<DocumentBody :sections="props.sections" />
	</div>
</template>

<script setup lang="ts">
import type { DocumentSection } from '~/types/features/content'
import Banner from './Banner.vue'
import DocumentBody from './Document.vue'

// Shared by /terms and /privacy; the copy lives in ~/data/features/legal.
interface Props {
	title: string
	lede: string
	// ISO date of the last edit to the draft
	updated: string
	sections: DocumentSection[]
}

const props = defineProps<Props>()
</script>
