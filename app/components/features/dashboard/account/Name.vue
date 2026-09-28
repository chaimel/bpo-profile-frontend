<template>
	<MFormSection
		:id="props.idPrefix"
		class="name"
		title="Name"
		description="How you appear to your team — for example, on invitations you send. Your sales profile has its own name fields."
	>
		<form class="name__form" novalidate @submit.prevent="submit">
			<div class="name__row">
				<MInput
					:id="`${props.idPrefix}-first`"
					v-model="fields.first_name"
					name="first_name"
					autocomplete="given-name"
					:max-length="100"
					required
					:has-error="Boolean(errors.first_name)"
				>
					<template #label>First name</template>
					<template #error>{{ errors.first_name }}</template>
				</MInput>

				<MInput
					:id="`${props.idPrefix}-last`"
					v-model="fields.last_name"
					name="last_name"
					autocomplete="family-name"
					:max-length="100"
					required
					:has-error="Boolean(errors.last_name)"
				>
					<template #label>Last name</template>
					<template #error>{{ errors.last_name }}</template>
				</MInput>
			</div>

			<div class="name__actions">
				<MButton type="submit" :is-loading="status === 'saving'">Save name</MButton>
			</div>

			<MAlert v-if="status === 'saved'" tone="success" live>Your name is updated.</MAlert>
			<MAlert v-else-if="status === 'failed'" tone="danger" live>
				We couldn’t update your name. Please try again.
			</MAlert>
		</form>
	</MFormSection>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'

interface Props {
	idPrefix: string
	firstName: string
	lastName: string
	// previews a failed request (?state=error)
	fails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	fails: false,
})

const fields = reactive({ first_name: props.firstName, last_name: props.lastName })
const errors = reactive<{ first_name?: string, last_name?: string }>({})
const status = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')

function submit() {
	errors.first_name = fields.first_name.trim() ? undefined : 'Enter your first name.'
	errors.last_name = fields.last_name.trim() ? undefined : 'Enter your last name.'
	if (errors.first_name || errors.last_name) {
		status.value = 'idle'
		return
	}

	status.value = 'saving'
	// Static stand-in for the account update; a failure keeps the input.
	setTimeout(() => {
		status.value = props.fails ? 'failed' : 'saved'
	}, 500)
}
</script>

<style lang="scss" scoped>
.name {
	// the same measure as the other account forms
	&__form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 520px;
	}

	&__row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	&__actions {
		display: flex;
	}
}

@media only screen and (max-width: 600px) {
	.name__row {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
