import { defineStore } from 'pinia'
import {
	adminClaims,
	adminCompanies,
	adminCompanyDetails,
	adminInquiries,
	adminLocations,
	adminProfessionalDetails,
	adminProfessionals,
	adminTaxonomyTerms,
	adminUsers,
	companyPublicationChecks,
	findAdminCompany,
	findAdminProfessional,
	professionalPublicationChecks,
} from '~/data/features/admin'

// Platform administration (docs/API.md §8): moderation lists and details,
// claims, users, taxonomies and the location tree, plus the checks the API
// runs before it accepts status = published.
export const useAdminStore = defineStore('admin', () => ({
	adminCompanies,
	adminCompanyDetails,
	adminProfessionals,
	adminProfessionalDetails,
	adminClaims,
	adminUsers,
	adminInquiries,
	adminTaxonomyTerms,
	adminLocations,
	findAdminCompany,
	findAdminProfessional,
	companyPublicationChecks,
	professionalPublicationChecks,
}))
