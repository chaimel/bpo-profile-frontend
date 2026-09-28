<template>
	<div class="professional">
		<Hero :professional="props.professional" @contact="inquiry_type = $event" />
		<Body :professional="props.professional" :inquiry-type="inquiry_type" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { InquiryAction, ProfessionalProfile } from '~/types/features/directory'
import Body from './body/Index.vue'
import Hero from './Hero.vue'

interface Props {
	professional: ProfessionalProfile
}

const props = defineProps<Props>()

const inquiry_type = ref<InquiryAction>('contact')
</script>
