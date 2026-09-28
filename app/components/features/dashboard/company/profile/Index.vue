<template>
	<MPage
		id="company-profile"
		class="profile"
		title="Company profile"
		:description="`How ${props.company.name} appears to buyers on BPO Profile.`"
	>
		<div class="profile__layout">
			<form class="profile__form" novalidate @submit.prevent="save">
				<Status
					v-model:status="form.status"
					:id-prefix="id_prefix"
					:saved-status="saved_status"
					:claimed-at="props.company.claimed_at"
					:verified-at="props.company.verified_at"
					:plan-name="props.company.plan.name"
					:missing-inbox="!form.inquiry_email.trim()"
				/>

				<Basics
					v-model:name="form.name"
					v-model:tagline="form.tagline"
					v-model:overview="form.overview"
					v-model:why-choose-us="form.why_choose_us"
					:id-prefix="id_prefix"
					:name-error="errors.name"
				/>

				<Media
					v-model:logo-url="form.logo_url"
					v-model:logo-alt="form.logo_alt_text"
					v-model:cover-url="form.cover_url"
					v-model:cover-alt="form.cover_alt_text"
					:id-prefix="id_prefix"
					:company-name="form.name.trim() || props.company.name"
				/>

				<Facts
					v-model:founded-year="form.founded_year"
					v-model:company-size="form.company_size"
					v-model:work-model="form.work_model"
					:id-prefix="id_prefix"
					:founded-year-error="errors.founded_year"
				/>

				<Contact
					v-model:website-url="form.website_url"
					v-model:linkedin-url="form.linkedin_url"
					v-model:inquiry-email="form.inquiry_email"
					v-model:phone="form.phone"
					:id-prefix="id_prefix"
					:website-error="errors.website_url"
					:linkedin-error="errors.linkedin_url"
					:inquiry-email-error="errors.inquiry_email"
				/>

				<SaveBar
					:state="save_state"
					:dirty="is_dirty"
					:error-count="error_count"
					:public-path="saved_status === 'published' ? `/companies/${props.company.slug}` : undefined"
				/>
			</form>

			<aside class="profile__aside" aria-label="Profile checklist">
				<MCompleteness :score="live_score" :items="checklist_items" />
			</aside>
		</div>
	</MPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import MCompleteness from '~/components/core/profile/MCompleteness.vue'
import SaveBar from '~/components/features/dashboard/SaveBar.vue'
import type { CompanyChecklistKey, EditableCompany } from '~/types/features/dashboard'
import type { PublicationStatus } from '~/types/features/directory'
import Basics from './Basics.vue'
import Contact from './Contact.vue'
import Facts from './Facts.vue'
import Media from './Media.vue'
import Status from './Status.vue'

const { checklistScore, companyChecklist } = useDashboardStore()

// PUT /api/dashboard/companies/{companyId}, plus the logo and cover
// uploads. Taxonomies and locations have their own pages and endpoints.
interface Props {
	company: EditableCompany
	// team size feeds the "add a sales professional" check
	teamSize: number
	// 'error' previews a failed save (?state=error)
	state?: 'ready' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
})

interface ProfileForm {
	status: PublicationStatus
	name: string
	tagline: string
	overview: string
	why_choose_us: string
	logo_url: string | null
	logo_alt_text: string
	cover_url: string | null
	cover_alt_text: string
	founded_year: string
	// '' stands for the API's "unknown"
	company_size: string
	work_model: string
	website_url: string
	linkedin_url: string
	inquiry_email: string
	phone: string
}

type FieldKey = 'name' | 'founded_year' | 'website_url' | 'linkedin_url' | 'inquiry_email'

const id_prefix = 'company-profile'
const c = props.company

const form = reactive<ProfileForm>({
	status: c.status,
	name: c.name,
	tagline: c.tagline ?? '',
	overview: c.overview ?? '',
	why_choose_us: c.why_choose_us ?? '',
	logo_url: c.logo_url,
	logo_alt_text: c.logo_alt_text ?? '',
	cover_url: c.cover_url,
	cover_alt_text: c.cover_alt_text ?? '',
	founded_year: c.founded_year ? String(c.founded_year) : '',
	company_size: c.company_size === 'unknown' ? '' : c.company_size,
	work_model: c.work_model === 'unknown' ? '' : c.work_model,
	website_url: c.website_url ?? '',
	linkedin_url: c.linkedin_url ?? '',
	inquiry_email: c.inquiry_email ?? '',
	phone: c.phone ?? '',
})

const saved_status = ref<PublicationStatus>(c.status)
const save_state = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')
const is_dirty = ref(false)
const errors = reactive<Partial<Record<FieldKey, string>>>({})

const field_keys: FieldKey[] = ['name', 'founded_year', 'website_url', 'linkedin_url', 'inquiry_email']

const field_ids: Record<FieldKey, string> = {
	name: `${id_prefix}-name`,
	founded_year: `${id_prefix}-founded`,
	website_url: `${id_prefix}-website`,
	linkedin_url: `${id_prefix}-linkedin`,
	inquiry_email: `${id_prefix}-inquiry-email`,
}

const error_count = computed(() => field_keys.filter(key => errors[key]).length)

watch(form, () => {
	is_dirty.value = true
	if (save_state.value !== 'saving') save_state.value = 'idle'
})

// A field's error clears as soon as it's edited; the inbox rule also
// depends on the chosen status.
field_keys.forEach((key) => {
	watch(() => form[key], () => {
		errors[key] = undefined
	})
})
watch(() => form.status, () => {
	errors.inquiry_email = undefined
})

const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const url_pattern = /^https?:\/\/[^\s.]+\.\S+$/

function isYear(value: string): boolean {
	if (!/^\d{4}$/.test(value)) return false
	const year = Number(value)
	return year >= 1800 && year <= new Date().getUTCFullYear()
}

function validate(): FieldKey[] {
	const next: Partial<Record<FieldKey, string>> = {}
	const year = form.founded_year.trim()
	const website = form.website_url.trim()
	const linkedin = form.linkedin_url.trim()
	const email = form.inquiry_email.trim()

	if (!form.name.trim()) next.name = 'Enter your company name.'
	if (year && !isYear(year)) next.founded_year = 'Enter the year you were founded, like 2014.'
	if (website && !url_pattern.test(website)) next.website_url = 'Enter the full web address, starting with https://.'
	if (linkedin && !url_pattern.test(linkedin)) next.linkedin_url = 'Enter the full address of your LinkedIn page, starting with https://.'
	if (email && !email_pattern.test(email)) {
		next.inquiry_email = 'Enter an email address in the format name@company.com.'
	}
	else if (!email && (form.status === 'pending_review' || form.status === 'published')) {
		next.inquiry_email = 'Add an inquiry email. Listings need one before they can be reviewed or stay live.'
	}

	field_keys.forEach((key) => {
		errors[key] = next[key]
	})
	return field_keys.filter(key => next[key])
}

function save() {
	const invalid = validate()
	const first = invalid[0]

	if (first) {
		save_state.value = 'idle'
		document.getElementById(field_ids[first])?.focus()
		return
	}

	save_state.value = 'saving'
	// Static stand-in for the PUT; ?state=error previews a failure, which
	// keeps every edit in place so saving can simply be tried again.
	setTimeout(() => {
		if (props.state === 'error') {
			save_state.value = 'failed'
			return
		}
		saved_status.value = form.status
		save_state.value = 'saved'
		is_dirty.value = false
	}, 600)
}

// --- Checklist (docs/DATABASE.md §6) --------------------------

const live_items = computed(() =>
	companyChecklist(
		{
			name: form.name,
			logo_url: form.logo_url,
			overview: form.overview,
			website_url: form.website_url,
			why_choose_us: form.why_choose_us,
			hq_location_id: c.hq_location_id,
			service_ids: c.service_ids,
			industry_ids: c.industry_ids,
			location_ids: c.location_ids,
		},
		props.teamSize,
	),
)

// Preview only — the API recalculates the stored score on save.
const live_score = computed(() => checklistScore(live_items.value))

function checklistLink(key: CompanyChecklistKey): string {
	const base = `/dashboard/companies/${c.id}`

	switch (key) {
		case 'logo': return `#${id_prefix}-media`
		case 'website': return `#${id_prefix}-contact`
		case 'hq':
		case 'location': return `${base}/locations`
		case 'service':
		case 'industry': return `${base}/services`
		case 'professional': return `${base}/team`
		default: return `#${id_prefix}-basics`
	}
}

const checklist_items = computed(() =>
	live_items.value.map(item => ({ label: item.label, done: item.done, to: checklistLink(item.key) })),
)
</script>

<style lang="scss" scoped>
.profile {
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

		// section links land below the sticky top bar
		:deep(.m-form-section) {
			scroll-margin-top: 88px;
		}
	}

	&__aside {
		position: sticky;
		top: 88px;
	}
}

@media only screen and (max-width: 1200px) {
	.profile {
		&__layout {
			grid-template-columns: minmax(0, 1fr);
		}

		&__aside {
			position: static;
			order: -1;
		}
	}
}

@media only screen and (max-width: 600px) {
	.profile__form {
		padding: 0 16px;
	}
}
</style>
