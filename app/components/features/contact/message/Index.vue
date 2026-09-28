<template>
	<div class="message">
		<div class="wrapper">
			<div class="message__con">
				<ContactForm :initial-status="props.initialStatus" />
				<Help />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ContactForm from './Form.vue'
import Help from './Help.vue'

interface Props {
	initialStatus?: 'idle' | 'error' | 'sent'
}

const props = withDefaults(defineProps<Props>(), {
	initialStatus: 'idle',
})
</script>

<style lang="scss" scoped>
.message {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		align-items: start;
		gap: 80px;
		padding: 24px 0 112px;
	}
}

@media only screen and (max-width: 1024px) {
	.message {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 56px;
			padding-bottom: 80px;
		}
	}
}
</style>
