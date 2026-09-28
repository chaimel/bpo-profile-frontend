// Claims, invitations, sign-in and registration (docs/API.md §1, §5, §7).
import type { CompanyRef } from '~/types/features/directory'

type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled'

// Which screen a claim/invitation token link renders. Opening a link
// never grants access: acceptance is a POST from the intended, verified
// account (docs/ARCHITECTURE.md §5).
type TokenState = 'signed-out' | 'ready' | 'wrong-account' | 'accepted' | 'invalid'

// Where a visitor stands with one listing (docs/API.md §7): not signed in
// yet, signed in with a verified email, or request sent and pending review.
// An already-claimed listing ignores the state and says so instead.
type ClaimRequestState = 'signed-out' | 'ready' | 'submitted'

// Every fresh sign-in is a password or Google, then an emailed code, for
// every account type (docs/ARCHITECTURE.md §5). `error` and `code-error`
// carry the generic failures; `expired` sends the visitor back to the first
// step once a code challenge has ended; `linked` follows linking Google,
// which signs the account out everywhere (docs/API.md §1).
type LoginState = 'credentials' | 'error' | 'expired' | 'verify' | 'code-error' | 'linked'

// Which screen /onboarding shows: the form, a sales profile waiting on its
// company's review, or an account that is already set up (the API's 422).
type OnboardingState = 'form' | 'pending' | 'complete'

// Registration never signs anyone in: it answers 201 with
// next_action = login (docs/API.md §1), which is the `created` screen.
type RegisterState = 'form' | 'created'

// The reply never says whether an account exists (docs/API.md §1).
type ForgotPasswordState = 'form' | 'sent'

// `invalid` is Laravel refusing an expired or already-used reset token.
type ResetPasswordState = 'form' | 'updated' | 'invalid'

// Registration paths (POST /api/register, /register/company, /register/professional).
type RegisterPath = 'company' | 'professional' | 'account'

// Fields every registration path sends.
interface AccountFields {
	first_name: string
	last_name: string
	email: string
	password: string
	password_confirmation: string
}

// POST /api/register — an account for a claim or an invitation, nothing else.
interface AccountSubmission {
	path: 'account'
	body: AccountFields
}

// POST /api/register/company — the account plus a draft company it owns.
interface CompanySubmission {
	path: 'company'
	body: AccountFields & { company_name: string }
}

// POST /api/register/professional — the account plus a draft profile whose
// affiliation the company reviews.
interface ProfessionalSubmission {
	path: 'professional'
	body: AccountFields & { company_id: number, job_title: string }
}

type RegisterSubmission = AccountSubmission | CompanySubmission | ProfessionalSubmission

// GET /api/me for an account awaiting onboarding: no company and no sales
// profile. Google-created accounts have no name until onboarding asks.
interface OnboardingAccount {
	email: string
	first_name: string | null
	last_name: string | null
}

interface OnboardingNames {
	first_name: string
	last_name: string
}

// POST /api/onboarding/company · /api/onboarding/professional. The user
// comes from the session, never from the body.
type OnboardingSubmission =
	| { path: 'company', body: OnboardingNames & { company_name: string } }
	| { path: 'professional', body: OnboardingNames & { company_id: number, job_title: string } }

// A claim request as its claimant sees it.
interface ClaimRequest {
	id: number
	company: CompanyRef
	status: ClaimStatus
	created_at: string
}

// POST /api/login → 202
interface LoginChallenge {
	status: 'email_code_required'
	challenge_id: string
	masked_email: string
	expires_in: number
	resend_after: number
}

export type {
	ClaimStatus,
	TokenState,
	ClaimRequestState,
	LoginState,
	OnboardingState,
	RegisterState,
	ForgotPasswordState,
	ResetPasswordState,
	RegisterPath,
	AccountFields,
	AccountSubmission,
	CompanySubmission,
	ProfessionalSubmission,
	RegisterSubmission,
	OnboardingAccount,
	OnboardingNames,
	OnboardingSubmission,
	ClaimRequest,
	LoginChallenge,
}
