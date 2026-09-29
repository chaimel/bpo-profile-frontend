<template>
	<span class="route-path">
		<template v-for="(part, index) in parts" :key="index">{{ part }}<wbr></template>
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// An address that wraps between its segments rather than inside them:
// "/dashboard/" "companies/" "[companyId]" "?state=empty". The parent's
// overflow-wrap still breaks a segment too long for the line.
interface Props {
	value: string
}

const props = defineProps<Props>()

const parts = computed(() => props.value.match(/[^/?&]*\/|[?&][^/?&]*|[^/?&]+/g) ?? [])
</script>
