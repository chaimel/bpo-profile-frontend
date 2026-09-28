import { defineStore } from 'pinia'
import {
	checklistScore,
	companyChecklist,
	companyDashboards,
	companyInquiries,
	companyStats,
	editableCompany,
	editableProfessionals,
	findCompanyInquiries,
	findCompanyStats,
	findEditableCompany,
	findOwnProfessional,
	findTeam,
	findTeamProfessional,
	myInquiries,
	myStats,
	noActivityStats,
	professionalChecklist,
	profileCompleteThreshold,
	team,
} from '~/data/features/dashboard'

// The company and sales dashboards (docs/API.md §5–6): the companies the
// signed-in user manages, their teams, inboxes and stats, their own sales
// profile, and the completeness checklists. A company the user doesn't
// manage resolves to nothing, so its pages are a 404.
export const useDashboardStore = defineStore('dashboard', () => ({
	editableCompany,
	team,
	editableProfessionals,
	companyInquiries,
	myInquiries,
	companyStats,
	myStats,
	noActivityStats,
	findEditableCompany,
	findTeam,
	findTeamProfessional,
	findCompanyInquiries,
	findCompanyStats,
	companyDashboards,
	findOwnProfessional,
	profileCompleteThreshold,
	companyChecklist,
	professionalChecklist,
	checklistScore,
}))
