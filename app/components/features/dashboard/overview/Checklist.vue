<template>
	<section class="checklist" aria-labelledby="overview-checklist-title">
		<div class="checklist__head">
			<MHeading id="overview-checklist-title" variant="2" size="5" weight="semi-bold" class="checklist__title">
				Finish your profile
			</MHeading>
			<MText size="small" color="--text-secondary" class="checklist__lede">
				Complete profiles rank higher in search. Here’s what’s left.
			</MText>
		</div>

		<div v-for="group in groups" :key="group.key" class="checklist__group">
			<div class="checklist__group-head">
				<MHeading variant="3" size="6" weight="semi-bold" class="checklist__group-title">{{ group.title }}</MHeading>
				<span class="checklist__score" aria-hidden="true">{{ group.score }}%</span>
			</div>

			<MProgress
				:value="group.score"
				:threshold="profileCompleteThreshold"
				:aria-label="`${group.title} completeness`"
				size="sm"
			/>

			<ul v-if="group.todo.length" class="checklist__items" :aria-label="`Still to do for ${group.title}`">
				<li v-for="item in group.todo" :key="item.key">
					<NuxtLink :to="item.to" class="checklist__link">
						<MIcon name="light-circle" size="sm" class="checklist__mark" />
						<span>{{ item.label }}</span>
					</NuxtLink>
				</li>
			</ul>
			<MText v-else size="small" color="--success" class="checklist__done">
				<MIcon name="light-check-circle" size="sm" />
				Everything on the checklist is done.
			</MText>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyChecklistKey, CompanyDashboard, EditableProfessional, ProfessionalChecklistKey } from '~/types/features/dashboard'

const { companyChecklist, professionalChecklist, profileCompleteThreshold } = useDashboardStore()

interface Props {
	companies: CompanyDashboard[]
	professional?: EditableProfessional | null
}

const props = withDefaults(defineProps<Props>(), {
	professional: null,
})

interface ChecklistGroup {
	key: string
	title: string
	score: number
	todo: { key: string, label: string, to: string }[]
}

// Where each unfinished company item gets fixed.
function companyLink(base: string, key: CompanyChecklistKey): string {
	switch (key) {
		case 'logo': return `${base}#company-profile-media`
		case 'website': return `${base}#company-profile-contact`
		case 'hq':
		case 'location': return `${base}/locations`
		case 'service':
		case 'industry': return `${base}/services`
		case 'professional': return `${base}/team`
		default: return `${base}#company-profile-basics`
	}
}

// Section anchors of the shared editor on /dashboard/profile.
const professional_links: Record<ProfessionalChecklistKey, string> = {
	photo: '/dashboard/profile#my-profile-photo',
	name: '/dashboard/profile#my-profile-basics',
	title: '/dashboard/profile#my-profile-basics',
	company: '/dashboard/profile#my-profile-basics',
	bio: '/dashboard/profile#my-profile-about',
	service: '/dashboard/profile#my-profile-expertise-tags',
	location: '/dashboard/profile#my-profile-basics',
	contact: '/dashboard/profile#my-profile-links',
}

// The stored score is the API's; the checklist says what's missing.
const groups = computed<ChecklistGroup[]>(() => {
	const list: ChecklistGroup[] = props.companies.map((entry) => {
		const base = `/dashboard/companies/${entry.company.id}`
		const items = companyChecklist(entry.company, entry.team.members.length)

		return {
			key: `company-${entry.company.id}`,
			title: entry.company.name,
			score: entry.company.completeness_score,
			todo: items
				.filter(item => !item.done)
				.map(item => ({ key: item.key, label: item.label, to: companyLink(base, item.key) })),
		}
	})

	if (props.professional) {
		list.push({
			key: 'professional',
			title: 'Your sales profile',
			score: props.professional.completeness_score,
			todo: professionalChecklist(props.professional)
				.filter(item => !item.done)
				.map(item => ({ key: item.key, label: item.label, to: professional_links[item.key] })),
		})
	}

	return list
})
</script>

<style lang="scss" scoped>
.checklist {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding-top: 24px;
	border-top: var(--rule);

	&__head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__group-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	&__group-title {
		font-family: var(--font-ui);
	}

	&__score {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	&__items {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 4px 0;
		font-family: var(--font-ui);
		font-size: 14px;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}

	&__mark {
		color: var(--text-muted);
	}

	&__done {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-ui);
	}
}
</style>
