import { defineStore } from 'pinia'
import {
	companyCards,
	companyCountBy,
	companyCountIn,
	findCompany,
	findProfessional,
	locationsWithCompanies,
	professionalCards,
	professionalCountBy,
	searchCompanies,
	searchProfessionals,
	unclaimedCompanies,
} from '~/data/features/directory'

// The public directory (docs/API.md §3–4): company and sales professional
// cards, full profiles, search, and the counts the index pages link by.
// Static for now: each member answers from the seed data, and wiring the
// typed API client changes this file, not the pages that use it.
export const useDirectoryStore = defineStore('directory', () => ({
	companyCards,
	professionalCards,
	unclaimedCompanies,
	findCompany,
	findProfessional,
	searchCompanies,
	searchProfessionals,
	companyCountBy,
	professionalCountBy,
	companyCountIn,
	locationsWithCompanies,
}))
