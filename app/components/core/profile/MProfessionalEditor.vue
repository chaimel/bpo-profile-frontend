<template>
	<div class="m-professional-editor">
		<!-- where this profile stands; each state says what happens next -->
		<MAlert :tone="notice.tone" class="m-professional-editor__notice">
			<template #title>{{ notice.title }}</template>
			{{ notice.text }}
			<template v-if="notice.action" #actions>
				<MButton
					:to="notice.action.to"
					:variant="notice.action.to ? 'text' : 'secondary'"
					size="sm"
					@click="onNoticeAction"
				>
					{{ notice.action.label }}
				</MButton>
			</template>
		</MAlert>

		<div class="m-professional-editor__layout">
			<form class="m-professional-editor__form" novalidate @submit.prevent="save">
				<MFormSection
					:id="`${props.idPrefix}-photo`"
					title="Photo"
					description="A clear, professional photo helps buyers put a face to the conversation."
				>
					<MImageUpload
						:id="`${props.idPrefix}-photo-file`"
						v-model:alt="form.photo_alt_text"
						kind="photo"
						label="Profile photo"
						:name="display_name"
						:src="form.photo_url"
						@change="form.photo_url = $event ? 'local-preview' : null"
					/>
				</MFormSection>

				<MFormSection
					:id="`${props.idPrefix}-basics`"
					title="Basics"
					description="How you appear on your profile and in the Sales Pros directory."
				>
					<div class="m-professional-editor__row">
						<MInput :id="`${props.idPrefix}-first`" v-model="form.first_name" name="first_name" autocomplete="given-name" required>
							<template #label>First name</template>
						</MInput>
						<MInput :id="`${props.idPrefix}-last`" v-model="form.last_name" name="last_name" autocomplete="family-name" required>
							<template #label>Last name</template>
						</MInput>
					</div>

					<MInput :id="`${props.idPrefix}-title`" v-model="form.job_title" name="job_title" autocomplete="organization-title" required>
						<template #label>Job title</template>
					</MInput>

					<MInput :id="`${props.idPrefix}-company`" :model-value="props.professional.company.name" name="company" readonly>
						<template #label>Company</template>
						<template #hint>Your company affiliation can only be changed by the BPO Profile team.</template>
					</MInput>

					<MInput :id="`${props.idPrefix}-expertise`" v-model="form.expertise" name="expertise" :max-length="120" optional>
						<template #label>Expertise</template>
						<template #hint>One line on what you’re known for, e.g. “Healthcare CX programs”.</template>
					</MInput>

					<MLocationSelect
						v-model="form.location_id"
						:id-prefix="`${props.idPrefix}-location`"
						legend="Where you’re based"
						any-label="Choose a country"
					/>

					<MSelect
						:id="`${props.idPrefix}-timezone`"
						v-model="form.timezone"
						name="timezone"
						placeholder="Choose a time zone"
						:options="timezoneOptions"
						optional
					>
						<template #label>Time zone</template>
					</MSelect>
				</MFormSection>

				<MFormSection
					:id="`${props.idPrefix}-about`"
					title="About"
					description="Write in your own voice. Clear and specific beats long and general."
				>
					<MTextarea :id="`${props.idPrefix}-bio`" v-model="form.bio" name="bio" :rows="6" :max-length="1500">
						<template #label>Bio</template>
					</MTextarea>

					<MTextarea :id="`${props.idPrefix}-experience`" v-model="form.experience_summary" name="experience_summary" :rows="4" optional>
						<template #label>Experience highlights</template>
						<template #hint>One highlight per line.</template>
					</MTextarea>
				</MFormSection>

				<MFormSection
					:id="`${props.idPrefix}-expertise-tags`"
					title="What you sell"
					description="These power search. Pick what you actually represent."
				>
					<MTaxonomyPicker :id="`${props.idPrefix}-services`" v-model="form.service_ids" legend="Services" :items="services" />
					<MTaxonomyPicker :id="`${props.idPrefix}-industries`" v-model="form.industry_ids" legend="Industries" :items="industries" />
					<MTaxonomyPicker :id="`${props.idPrefix}-languages`" v-model="form.language_ids" legend="Languages" :items="languages" />
					<MTaxonomyPicker
						:id="`${props.idPrefix}-markets`"
						v-model="form.market_ids"
						legend="Markets served"
						description="Countries you sell into. This is separate from where you’re based."
						:items="countries"
					/>
				</MFormSection>

				<MFormSection
					:id="`${props.idPrefix}-links`"
					title="Contact and links"
					description="Buyers always reach you through your profile’s contact form. These add optional paths."
				>
					<MInput :id="`${props.idPrefix}-linkedin`" v-model="form.linkedin_url" name="linkedin_url" type="url" placeholder="https://" optional>
						<template #label>LinkedIn</template>
					</MInput>
					<MInput :id="`${props.idPrefix}-website`" v-model="form.website_url" name="website_url" type="url" placeholder="https://" optional>
						<template #label>Website</template>
					</MInput>
					<div class="m-professional-editor__row">
						<MInput :id="`${props.idPrefix}-email`" v-model="form.public_email" name="public_email" type="email" optional>
							<template #label>Public email</template>
							<template #hint>We suggest leaving this empty and using the contact form.</template>
						</MInput>
						<MInput :id="`${props.idPrefix}-phone`" v-model="form.phone" name="phone" type="tel" optional>
							<template #label>Phone</template>
						</MInput>
					</div>
				</MFormSection>

				<div class="m-professional-editor__bar">
					<MButton type="submit" :is-loading="save_state === 'saving'">Save changes</MButton>
					<MButton
						v-if="props.professional.status === 'published'"
						variant="neutral"
						:to="`/professionals/${props.professional.slug}`"
						target="_blank"
					>
						<template #prefix>
							<MIcon name="light-external-link" size="xs" />
						</template>
						View public profile
					</MButton>
					<span v-if="save_state === 'saved'" class="m-professional-editor__saved" role="status">
						<MIcon name="light-check-circle" size="sm" />
						Changes saved
					</span>
				</div>
			</form>

			<aside class="m-professional-editor__aside">
				<MCompleteness :score="live_score" :items="completeness_items" />
			</aside>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import MLocationSelect from '~/components/core/location/MLocationSelect.vue'
import MImageUpload from '~/components/core/media/MImageUpload.vue'
import MCompleteness from '~/components/core/profile/MCompleteness.vue'
import MTaxonomyPicker from '~/components/core/taxonomy/MTaxonomyPicker.vue'
import type { EditableProfessional } from '~/types/features/dashboard'

const { countries, industries, languages, services, timezoneOptions } = useCatalogStore()

// Shared by /dashboard/profile (own) and the company team editor.
// Company, affiliation, verification and plan are never editable here
// (docs/API.md §6).
interface Props {
	idPrefix: string
	professional: EditableProfessional
	context: 'own' | 'team'
	// team context: where the "Invite" action points
	teamPath?: string
}

const props = withDefaults(defineProps<Props>(), {
	teamPath: undefined,
})

const p = props.professional

const form = reactive({
	first_name: p.first_name,
	last_name: p.last_name,
	job_title: p.job_title,
	expertise: p.expertise ?? '',
	location_id: p.location_id ? String(p.location_id) : '',
	timezone: p.timezone ?? '',
	bio: p.bio ?? '',
	experience_summary: p.experience_summary ?? '',
	service_ids: [...p.service_ids],
	industry_ids: [...p.industry_ids],
	language_ids: [...p.language_ids],
	market_ids: [...p.market_ids],
	linkedin_url: p.linkedin_url ?? '',
	website_url: p.website_url ?? '',
	public_email: p.public_email ?? '',
	phone: p.phone ?? '',
	photo_url: p.photo_url,
	photo_alt_text: p.photo_alt_text ?? '',
})

const status = ref(p.status)
const save_state = ref<'idle' | 'saving' | 'saved'>('idle')

const display_name = computed(() => `${form.first_name} ${form.last_name}`.trim() || 'Your name')

interface Notice {
	tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral'
	title: string
	text: string
	action?: { label: string, to?: string }
}

const notice = computed<Notice>(() => {
	const company = p.company.name
	const who = props.context === 'own' ? 'your' : 'this'

	if (props.context === 'team' && !p.has_account) {
		return {
			tone: 'neutral',
			title: 'No one manages this profile yet',
			text: `You’re editing a roster profile for ${company}. Invite the person by email so they can sign in and keep it up to date.`,
			action: props.teamPath ? { label: 'Send an invitation', to: props.teamPath } : undefined,
		}
	}
	if (p.affiliation_status === 'pending') {
		return {
			tone: 'warning',
			title: `Waiting for ${company} to approve ${who} affiliation`,
			text: 'You can keep editing this draft. It can be submitted for review once the affiliation is approved.',
		}
	}
	if (p.affiliation_status === 'rejected') {
		return {
			tone: 'danger',
			title: `${company} didn’t approve this affiliation`,
			text: 'The draft stays private and has no company access. Contact the company or our team if this looks wrong.',
			action: { label: 'Contact BPO Profile', to: '/contact' },
		}
	}
	if (status.value === 'suspended') {
		return {
			tone: 'danger',
			title: 'This profile is suspended',
			text: 'It isn’t visible in the directory. Contact our team to resolve it.',
			action: { label: 'Contact BPO Profile', to: '/contact' },
		}
	}
	if (status.value === 'pending_review') {
		return {
			tone: 'info',
			title: 'Submitted for review',
			text: 'Our team checks every profile before it’s published. We’ll email you when it goes live.',
		}
	}
	if (status.value === 'published') {
		return {
			tone: 'success',
			title: 'This profile is live',
			text: 'Buyers can find it in the Sales Pros directory and on your company’s team list.',
		}
	}
	return {
		tone: 'info',
		title: 'This profile is a draft',
		text: 'Submit it for review when you’re ready. Our team publishes approved profiles.',
		action: { label: 'Submit for review' },
	}
})

function onNoticeAction() {
	if (!notice.value.action?.to && status.value === 'draft') status.value = 'pending_review'
}

const has_contact_path = computed(() =>
	p.has_account || Boolean(form.public_email.trim()) || Boolean(form.phone.trim()),
)

// Mirrors the professional checklist in docs/DATABASE.md §6.
const completeness_items = computed(() => [
	{ label: 'Add a photo', done: Boolean(form.photo_url), to: `#${props.idPrefix}-photo` },
	{ label: 'Your name', done: Boolean(form.first_name && form.last_name), to: `#${props.idPrefix}-basics` },
	{ label: 'Job title', done: Boolean(form.job_title), to: `#${props.idPrefix}-basics` },
	{ label: 'Company', done: true },
	{ label: 'Write a bio', done: form.bio.trim().length > 0, to: `#${props.idPrefix}-about` },
	{ label: 'Choose at least one service', done: form.service_ids.length > 0, to: `#${props.idPrefix}-expertise-tags` },
	{ label: 'Set your location', done: Boolean(form.location_id), to: `#${props.idPrefix}-basics` },
	{ label: 'At least one contact path', done: has_contact_path.value, to: `#${props.idPrefix}-links` },
])

// Preview only — the API recalculates the stored score on save.
const live_score = computed(() => {
	const done = completeness_items.value.filter(item => item.done).length
	return Math.round((done / completeness_items.value.length) * 100)
})

function save() {
	save_state.value = 'saving'
	setTimeout(() => {
		save_state.value = 'saved'
	}, 600)
}
</script>

<style lang="scss" scoped>
.m-professional-editor {
	display: flex;
	flex-direction: column;
	gap: 24px;

	&__layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 300px;
		align-items: start;
		gap: 32px;
	}

	&__form {
		padding: 8px 28px 0;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	&__aside {
		position: sticky;
		top: 88px;
	}

	// Save bar stays in reach at the bottom of a long form.
	&__bar {
		position: sticky;
		bottom: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin: 0 -28px;
		padding: 16px 28px;
		border-top: var(--rule);
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		background: var(--white);
	}

	&__saved {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--success);
	}
}

@media only screen and (max-width: 1200px) {
	.m-professional-editor {
		&__layout {
			grid-template-columns: 1fr;
		}

		&__aside {
			position: static;
			order: -1;
		}
	}
}

@media only screen and (max-width: 600px) {
	.m-professional-editor {
		&__form {
			padding: 0 16px;
		}

		&__bar {
			margin: 0 -16px;
			padding: 12px 16px;
		}

		&__row {
			grid-template-columns: 1fr;
		}
	}
}
</style>
