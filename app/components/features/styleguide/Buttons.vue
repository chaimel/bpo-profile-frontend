<template>
	<section id="buttons" class="buttons" aria-labelledby="buttons-title">
		<div class="wrapper">
			<div class="buttons__con">
				<MHeading id="buttons-title" variant="2" size="3">Buttons</MHeading>

				<Specimen title="Variants" component="MButton">
					<MButton>Find a BPO</MButton>
					<MButton variant="secondary">Secondary</MButton>
					<MButton variant="outline">Request a Quote</MButton>
					<MButton variant="neutral">Neutral</MButton>
					<MButton variant="ghost">Ghost</MButton>
					<MButton variant="text">Text link</MButton>
					<MButton variant="destructive">Delete</MButton>
				</Specimen>

				<Specimen title="Sizes and states" component="MButton">
					<MButton size="sm">Small</MButton>
					<MButton size="md">Medium</MButton>
					<MButton size="lg">Large</MButton>
					<MButton is-loading>Saving</MButton>
					<MButton disabled>Disabled</MButton>
					<MButton variant="neutral">
						<template #prefix>
							<MIcon name="light-plus" size="xs" />
						</template>
						With icon
					</MButton>
				</Specimen>

				<div class="buttons__dark">
					<Specimen title="On dark bands" component="MButton · inverse">
						<MButton variant="inverse">Get Listed</MButton>
						<MButtonIcon name="light-bars" title="Open menu" variant="inverse" />
					</Specimen>
				</div>

				<Specimen title="Icon buttons" component="MButtonIcon" description="The title is required — it is the control’s only accessible name.">
					<MButtonIcon name="light-edit" title="Edit" />
					<MButtonIcon name="light-trash" title="Delete" variant="outline" />
					<MButtonIcon name="light-search" title="Search" radius="full" />
					<MButtonIcon name="light-star" title="Pinned" active />
					<MButtonIcon name="light-times" title="Close" size="sm" variant="ghost" />
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import Specimen from './Specimen.vue'
</script>

<style lang="scss" scoped>
.buttons {
	background: var(--canvas);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}

	&__dark {
		padding: 20px;
		border-radius: var(--radius-md);
		background: var(--slate);

		:deep(.specimen__title),
		:deep(.specimen__description) {
			color: var(--white);
		}

		:deep(.specimen__stage) {
			box-shadow: inset 0 0 0 1px var(--on-dark-rule);
		}
	}
}
</style>
