<template>
	<section :id="props.id" class="m-form-section" :aria-labelledby="`${props.id}-title`">
		<div class="m-form-section__intro">
			<MHeading :id="`${props.id}-title`" variant="2" size="5" weight="semi-bold" class="m-form-section__title">{{ props.title }}</MHeading>
			<MText v-if="props.description" size="small" color="--text-secondary" class="m-form-section__description">{{ props.description }}</MText>
			<slot name="aside" />
		</div>

		<div class="m-form-section__body">
			<slot />
		</div>
	</section>
</template>

<script setup lang="ts">
// Editor layout: what the section is for on the left, its fields on
// the right. Used by every dashboard and admin form.
interface Props {
	id: string
	title: string
	description?: string
}

const props = withDefaults(defineProps<Props>(), {
	description: undefined,
})
</script>

<style lang="scss" scoped>
.m-form-section {
	display: grid;
	grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
	gap: 32px;
	padding: 32px 0;
	border-top: var(--rule);

	&:first-child {
		border-top: 0;
		padding-top: 8px;
	}

	&__intro {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__title {
		font-family: var(--font-display);
	}

	// a query container, so field rows can split into columns only when
	// the column itself is wide enough
	&__body {
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-width: 0;
		container-type: inline-size;
	}
}

@media only screen and (max-width: 1024px) {
	.m-form-section {
		grid-template-columns: 1fr;
		gap: 16px;
		padding: 24px 0;
	}
}
</style>
