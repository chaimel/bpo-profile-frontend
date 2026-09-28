<template>
	<div class="default">
		<Header />
		<main id="main-content" tabindex="-1">
			<slot />
		</main>
		<Footer />
	</div>
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue'
import Header from '@/components/layout/Header.vue'
</script>

<style lang="scss" scoped>
.default {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

main {
	flex: 1 0 auto;

	&:focus {
		outline: none;
	}
}
</style>
