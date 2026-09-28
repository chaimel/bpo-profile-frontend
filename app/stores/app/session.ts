import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminMe as admin_seed, adminNav, dashboardNav, me as me_seed } from '~/data/features/session'
import type { Me } from '~/types/features/dashboard'

// The signed-in account, GET /api/me (docs/API.md §1). The static UI has
// two: Ana Reyes on the dashboards and Sam Rivera, a platform admin, on
// /admin. Navigation badges are placeholder counts until the dashboard
// endpoints exist.
export const useSessionStore = defineStore('session', () => {
	const me = ref<Me>(me_seed)
	const adminMe = ref<Me>(admin_seed)

	return {
		me,
		adminMe,
		dashboardNav,
		adminNav,
	}
})
