// Static stand-ins for the auth and onboarding endpoints (docs/API.md §1,
// §5 "Team affiliation and invitations", §7). Each export is shaped like
// what the page will read from the API, so wiring the typed client later
// swaps these imports without touching a component.
import type { CompanyRef } from '~/types/features/directory'
import type { LoginChallenge, OnboardingAccount } from '~/types/features/onboarding'
import { companyCards } from './directory'

// --- Sign-in rules --------------------------------------------

// Launch defaults from docs/ARCHITECTURE.md §5. Laravel enforces every one
// of them; the screens only explain them, so the copy reads from here.
const authPolicy = {
	codeLength: 6,
	codeLifetimeMinutes: 10,
	resendAfterSeconds: 60,
	// sends per account in the window, the first email included
	maxSends: 3,
	sendWindowMinutes: 15,
	maxCodeAttempts: 5,
	// linking Google needs a sign-in completed this recently (docs/API.md §1)
	recentSignInMinutes: 10,
	// Placeholder: the docs don't fix a password rule yet. Laravel's
	// validation stays authoritative — update this when the API settles it.
	passwordMinLength: 12,
} as const

// --- POST /api/login → 202 ------------------------------------

// The docs' example challenge, addressed to the sample account.
const loginChallenge: LoginChallenge = {
	status: 'email_code_required',
	challenge_id: 'f8d4c2a7-073b-4e0a-a219-7cd01340ec4e',
	masked_email: 'a***@northshore-cx.example',
	expires_in: authPolicy.codeLifetimeMinutes * 60,
	resend_after: authPolicy.resendAfterSeconds,
}

// "ana@northshore-cx.example" -> "a***@northshore-cx.example", the way the
// API masks the address it sent a code to.
function maskEmail(email: string): string {
	const [local = '', domain = ''] = email.trim().split('@')
	return domain ? `${local.charAt(0)}***@${domain}` : `${local.charAt(0)}***`
}

// Stand-in for POST /api/login: any credentials start a challenge.
function startLoginChallenge(email: string): LoginChallenge {
	return { ...loginChallenge, masked_email: maskEmail(email) }
}

// --- Google sign-in (docs/API.md §1) --------------------------

// Laravel owns the round trip: /auth/google/redirect → Google →
// /auth/google/callback, which starts the same emailed-code challenge and
// sends the browser to /login/verify. The UI is static, so the button
// goes straight to that page.
const googleSignIn = {
	href: '/auth/google/redirect',
	static_href: '/login/verify',
}

// GET /api/login/challenge after the callback, for a first-time Google
// account. Only the bound browser session can read it.
const googleChallenge: LoginChallenge = {
	...loginChallenge,
	masked_email: 'j***@brightline-support.example',
}

// --- Onboarding (docs/API.md §1) --------------------------------

// GET /api/me for that account: created through Google, so no name yet,
// no company and no sales profile.
const onboardingAccount: OnboardingAccount = {
	email: 'jordan@brightline-support.example',
	first_name: null,
	last_name: null,
}

// --- Claim and invitation tokens ------------------------------

// There is no read endpoint for a token, so the screens name the company
// only once POST …/accept succeeds. Signed-in emails arrive masked.

function companyRef(slug: string): CompanyRef {
	const company = companyCards.find(card => card.slug === slug)
	if (!company) throw new Error(`Unknown company ${slug}`)
	return { id: company.id, name: company.name, slug: company.slug }
}

// POST /api/claims/accept — the platform-seeded listing Ana Reyes asked to
// claim from /claim, approved by a platform admin.
const claimAcceptance = {
	company: companyRef('kingston-voice-partners'),
	// the account the claim was approved for
	account_email: 'a***@northshore-cx.example',
	// a colleague's account, for the wrong-account screen
	other_account_email: 'm***@northshore-cx.example',
}

// POST /api/team-invitations/accept — the roster profile Northshore CX
// created for Miguel Ramos before he had a login.
const invitationAcceptance = {
	company: companyRef('northshore-cx'),
	profile: {
		first_name: 'Miguel',
		last_name: 'Ramos',
		job_title: 'Account Manager',
	},
	// the address the invitation was sent to
	account_email: 'm***@northshore-cx.example',
	// Ana, the owner who sent it, opening the link herself
	other_account_email: 'a***@northshore-cx.example',
}

export {
	authPolicy,
	loginChallenge,
	maskEmail,
	startLoginChallenge,
	googleSignIn,
	googleChallenge,
	onboardingAccount,
	claimAcceptance,
	invitationAcceptance,
}
