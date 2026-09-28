<template>
	<div class="contact">
		<Banner />
		<Message :initial-status="props.initialStatus" />
	</div>
</template>

<script setup lang="ts">
import Banner from './Banner.vue'
import Message from './message/Index.vue'

interface Props {
	// previews a form state while the UI is static (?state=error | sent)
	initialStatus?: 'idle' | 'error' | 'sent'
}

const props = withDefaults(defineProps<Props>(), {
	initialStatus: 'idle',
})
</script>
