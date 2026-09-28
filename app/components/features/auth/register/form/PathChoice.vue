<template>
	<fieldset class="path-choice">
		<legend class="path-choice__legend">How will you use BPO Profile?</legend>

		<div class="path-choice__options">
			<MRadio
				v-for="option in options"
				:id="`register-path-${option.value}`"
				:key="option.value"
				v-model="model"
				name="register_path"
				:value="option.value"
				variant="card"
			>
				{{ option.label }}
				<template #description>{{ option.description }}</template>
				<template #meta>
					<MIcon :name="option.icon" size="md" color="text-muted" />
				</template>
			</MRadio>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName } from '~/types/base/ui'
import type { RegisterPath } from '~/types/features/onboarding'

interface Props {
	modelValue: RegisterPath
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: RegisterPath): void
}>()

// The three public registration paths (docs/PLAN.md §4.5). Platform admins
// are invited, and buyers never need an account.
const options: { value: RegisterPath, label: string, description: string, icon: MIconName }[] = [
	{
		value: 'company',
		label: 'I represent a BPO company',
		description: 'Create your company’s listing. You’ll own it, and can add your sales team once you’re signed in.',
		icon: 'light-building',
	},
	{
		value: 'professional',
		label: 'I’m a sales professional',
		description: 'Create your sales profile and connect it to the company you work for.',
		icon: 'light-id-card',
	},
	{
		value: 'account',
		label: 'I was invited or I’m claiming a listing',
		description: 'Create an account to accept a team invitation or to take over an existing company listing.',
		icon: 'light-envelope-text',
	},
]

const values = options.map(option => option.value)

// MRadio reports plain strings; only the known paths get through.
const model = computed<string>({
	get: () => props.modelValue,
	set: (value) => {
		const path = values.find(item => item === value)
		if (path) emit('update:modelValue', path)
	},
})
</script>

<style lang="scss" scoped>
.path-choice {
	&__legend {
		padding-bottom: 12px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);
	}

	&__options {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
</style>
