<template>
	<div class="company">
		<Hero :company="props.company" @contact="inquiry_type = $event" />
		<Nav :company="props.company" />
		<Body :company="props.company" :inquiry-type="inquiry_type" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CompanyProfile, InquiryAction } from '~/types/features/directory'
import Body from './body/Index.vue'
import Hero from './Hero.vue'
import Nav from './Nav.vue'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()

// "Request a Quote" in the hero opens the contact form on the quote tab.
const inquiry_type = ref<InquiryAction>('contact')
</script>
