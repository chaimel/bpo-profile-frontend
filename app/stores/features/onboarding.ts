import { defineStore } from 'pinia'
import {
	claimAcceptance,
	googleChallenge,
	invitationAcceptance,
	loginChallenge,
	onboardingAccount,
	startLoginChallenge,
} from '~/data/features/onboarding'

// Sign-in, onboarding, claims and invitations (docs/API.md §1, §5, §7):
// the pending email-code challenge, the account awaiting onboarding, and
// what accepting a claim or invitation returns. The rules the screens
// explain (authPolicy) are fixed copy and stay in ~/data.
export const useOnboardingStore = defineStore('onboarding', () => ({
	loginChallenge,
	startLoginChallenge,
	googleChallenge,
	onboardingAccount,
	claimAcceptance,
	invitationAcceptance,
}))
