<template>
	<div class="header">
		<div class="wrapper">
			<div class="header__con">
				<MBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Find a BPO' }]" />

				<div class="header__row">
					<div class="header__text">
						<MHeading variant="1" size="2">Find a BPO</MHeading>
						<MText size="large" color="--text-secondary">
							Search by what you need, then meet the people who can deliver it.
						</MText>
					</div>

					<form class="header__search" role="search" aria-label="Search BPO companies" @submit.prevent="emit('search', term.trim())">
						<MSearch
							id="find-keyword"
							v-model="term"
							name="q"
							size="lg"
							label="Search BPO companies"
							placeholder="Company name, service, or specialty"
							@clear="emit('search', '')"
						/>
						<MButton type="submit" size="lg">Search</MButton>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'

interface Props {
	query: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'search', _value: string): void
}>()

const term = ref(props.query)

// Keep the field in step with the URL (back button, chip removal).
watch(() => props.query, (value) => {
	term.value = value
})
</script>

<style lang="scss" scoped>
.header {
	background: var(--canvas);
	border-bottom: var(--rule);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 28px 0 36px;
	}

	&__row {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		align-items: end;
		gap: 32px;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__search {
		display: flex;
		gap: 8px;
	}
}

@media only screen and (max-width: 1024px) {
	.header__row {
		grid-template-columns: 1fr;
		gap: 20px;
	}
}

@media only screen and (max-width: 480px) {
	.header__search {
		flex-direction: column;
	}
}
</style>
