<template>
	<section id="forms" class="forms" aria-labelledby="forms-title">
		<div class="wrapper">
			<div class="forms__con">
				<MHeading id="forms-title" variant="2" size="3">Forms</MHeading>

				<Specimen title="Text fields" component="MInput" layout="grid">
					<MInput id="sg-name" v-model="form.name" name="name">
						<template #label>Your name</template>
					</MInput>
					<MInput id="sg-company" v-model="form.company" name="company" optional>
						<template #label>Company</template>
						<template #hint>Shown to the sales team you contact.</template>
					</MInput>
					<MInput id="sg-email" v-model="form.email" name="email" type="email" has-error>
						<template #label>Work email</template>
						<template #error>Enter an email address like name@company.com.</template>
					</MInput>
					<MInput id="sg-password" v-model="form.password" name="password" type="password" revealable>
						<template #label>Password</template>
					</MInput>
					<MInput id="sg-readonly" model-value="Northshore CX" name="readonly" readonly>
						<template #label>Read only</template>
					</MInput>
					<MSearch id="sg-search" v-model="form.search" name="sg-search" placeholder="Search companies" label="Search companies">
						<template #label>Search</template>
					</MSearch>
				</Specimen>

				<Specimen title="Select and textarea" component="MSelect · MTextarea" layout="grid">
					<MSelect id="sg-select" v-model="form.service" name="service" :options="service_options" placeholder="Any service">
						<template #label>Service</template>
					</MSelect>
					<MTextarea id="sg-message" v-model="form.message" name="message" :rows="3" :max-length="300">
						<template #label>Message</template>
					</MTextarea>
				</Specimen>

				<Specimen title="Choices" component="MCheckbox · MRadio · MSwitch" layout="grid">
					<div class="forms__stack">
						<MCheckbox id="sg-check-1" v-model="form.checks" value="support" name="checks">Customer Support</MCheckbox>
						<MCheckbox id="sg-check-2" v-model="form.checks" value="tech" name="checks">
							Technical Support
							<template #description>Tier 1 and 2 troubleshooting</template>
						</MCheckbox>
						<MCheckbox id="sg-check-3" name="checks" disabled>Disabled</MCheckbox>
						<MCheckbox id="sg-check-4" name="terms" has-error>
							I agree to the Terms of Service
							<template #error>Agree to the terms to continue.</template>
						</MCheckbox>
					</div>
					<div class="forms__stack">
						<MRadio id="sg-radio-1" v-model="form.model" name="model" value="offshore">Offshore</MRadio>
						<MRadio id="sg-radio-2" v-model="form.model" name="model" value="nearshore">Nearshore</MRadio>
						<MSwitch v-model="form.active">Active</MSwitch>
					</div>
					<div class="forms__stack">
						<MRadio id="sg-card-1" v-model="form.path" name="path" value="company" variant="card">
							I represent a BPO company
							<template #description>Create a company profile and add your team.</template>
						</MRadio>
						<MRadio id="sg-card-2" v-model="form.path" name="path" value="professional" variant="card">
							I’m a sales professional
							<template #description>Your company approves the affiliation.</template>
						</MRadio>
					</div>
				</Specimen>

				<Specimen title="Email code" component="MCodeInput" description="One real input (paste and one-time-code autofill work); the cells only draw it.">
					<MCodeInput id="sg-code" v-model="form.code">
						<template #label>6-digit code</template>
						<template #hint>Sent to a***@northshore-cx.example</template>
					</MCodeInput>
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import Specimen from './Specimen.vue'

const { services } = useCatalogStore()

const form = reactive({
	name: 'Jordan Lee',
	company: '',
	email: 'jordan@',
	password: '',
	search: '',
	service: '',
	message: '',
	checks: ['support'] as (string | number)[],
	model: 'offshore',
	active: true,
	path: 'company',
	code: '0123',
})

const service_options = services.map(service => ({ label: service.name, value: service.slug }))
</script>

<style lang="scss" scoped>
.forms {
	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}

	&__stack {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
}
</style>
