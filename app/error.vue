<template>
	<div class="error-page">
		<Header />

		<main id="main-content" class="error-page__main" tabindex="-1">
			<div class="wrapper">
				<div class="error-page__con">
					<span class="error-page__code">{{ status_code }}</span>

					<MHeading variant="1" size="2" class="error-page__title">
						{{ is_missing ? 'We couldn’t find that page' : 'Something went wrong. Please try again.' }}
					</MHeading>

					<MText size="xlarge" color="--text-secondary" class="error-page__lede">
						{{ message }}
					</MText>

					<div class="error-page__actions">
						<MButton size="lg" @click="goTo('/find')">
							<template #prefix>
								<MIcon name="light-search" size="sm" />
							</template>
							Find a BPO
						</MButton>
						<MButton size="lg" variant="neutral" @click="goTo('/')">Go to the home page</MButton>
					</div>
				</div>
			</div>
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import Footer from '~/components/layout/Footer.vue'
import Header from '~/components/layout/Header.vue'
import { siteName } from '~/data/features/site'

interface Props {
	error?: NuxtError
}

const props = defineProps<Props>()

const status_code = computed(() => props.error?.statusCode ?? 404)
const is_missing = computed(() => status_code.value === 404)

// Neutral, non-blaming language with a way forward (PDF p. 39). A page's
// own copy only when it threw notFound(); Nuxt's "no route" text is technical.
const message = computed(() => {
	const data = props.error?.data as { friendly?: boolean } | undefined
	if (is_missing.value && data?.friendly && props.error?.message) return props.error.message
	return is_missing.value
		? 'The page may have moved, or the profile is no longer published. Try searching the directory instead.'
		: 'We hit a problem loading this page. Refresh to try again, or head back to the directory.'
})

// error.vue replaces app.vue, so its title template doesn't apply here.
useHead({
	title: computed(() => `${is_missing.value ? 'Page not found' : 'Something went wrong'} | ${siteName}`),
})

function goTo(path: string) {
	clearError({ redirect: path })
}
</script>

<style lang="scss" scoped>
.error-page {
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	&__main {
		flex: 1 0 auto;
		background: var(--canvas);

		&:focus {
			outline: none;
		}
	}

	&__con {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: 720px;
		padding: 112px 0 128px;
	}

	&__code {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--brand-strong);

		&::before {
			content: 'Error ';
		}
	}

	&__title {
		padding-top: 12px;
	}

	&__lede {
		padding-top: 16px;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding-top: 32px;
	}
}

@media only screen and (max-width: 768px) {
	.error-page__con {
		padding: 64px 0 80px;
	}
}
</style>
