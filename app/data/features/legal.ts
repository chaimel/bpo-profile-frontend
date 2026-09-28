// Terms of use and privacy policy. These are DRAFTS FOR REVIEW: every
// statement is drawn from the product docs (docs/PLAN.md, API.md,
// DATABASE.md, ARCHITECTURE.md, SETUP.md), and none of it has been
// approved by legal counsel or is in effect. Paragraphs are plain text —
// rendered escaped, never through v-html.
import type { LegalDocument } from '~/types/features/content'

const draftNotice = {
	title: 'Draft for review — not yet approved by counsel',
	text: 'This page was written from the BPO Profile product plan so the team can review it. It hasn’t been approved by legal counsel and isn’t in effect yet.',
}

const terms: LegalDocument = {
	title: 'Terms of use',
	description: 'The terms for using BPO Profile: provider accounts, profile content, what badges mean, claims, paid placement, and acceptable use. Draft for review.',
	lede: 'The ground rules for using BPO Profile, whether you’re searching for a BPO or managing a listing.',
	updated: '2026-09-25',
	sections: [
		{
			id: 'the-service',
			title: 'The service',
			paragraphs: [
				'BPO Profile is a directory that helps businesses discover BPO companies, understand what they offer, and contact the sales professionals who represent them.',
				'Searching the directory and sending inquiries is free and doesn’t need an account. BPO Profile isn’t a party to the conversations or agreements between buyers and providers — any work you agree is between you and that provider.',
				'Some features described on the site, such as featured placements, advanced analytics, and online checkout, are planned but not available yet. We label them as coming later.',
			],
		},
		{
			id: 'provider-accounts',
			title: 'Provider accounts',
			paragraphs: [
				'Company admins and sales professionals need an account to create or manage a listing. Every fresh sign-in uses your password or Google account, followed by a code we email to you.',
				'Keep your sign-in details to yourself, and tell us if you think someone else has used your account.',
				'Each person can have one sales professional profile, affiliated with one company. A company admin or the BPO Profile team must approve that affiliation before the profile can be published.',
			],
		},
		{
			id: 'accurate-profiles',
			title: 'Accurate profiles',
			paragraphs: [
				'You’re responsible for what you publish. Keep your company or professional profile accurate, current, and honest about what you offer, where you operate, and who you are.',
				'Only the BPO Profile team can publish a listing, and we review listings before they go live. We may unpublish, suspend, or remove a listing that is inaccurate, misleading, or breaks these terms.',
			],
		},
		{
			id: 'company-content',
			title: 'Company-provided content',
			paragraphs: [
				'Company profiles include content supplied by the company itself: its overview, its reasons to choose it, its certifications, and any client proof or testimonials.',
				'Client testimonials and similar statements are the company’s own claims. They are labeled as company-provided, they aren’t buyer reviews, and BPO Profile hasn’t verified them. Buyer reviews aren’t part of BPO Profile today.',
			],
		},
		{
			id: 'badges',
			title: 'What badges mean — and what they don’t',
			paragraphs: [
				'Badges describe specific checks. They aren’t endorsements, ratings, or guarantees of service quality, and none implies another: a claimed listing isn’t automatically verified, and verification doesn’t publish a profile. No plan can buy them.',
				'Each badge means exactly this:',
			],
			list: [
				'Claimed — a signed-in company admin controls the listing.',
				'Verified company — our team reviewed the company’s legal and website identity.',
				'Verified professional — our team confirmed the person belongs to the company they represent.',
				'Profile complete — the profile meets our published completeness threshold.',
			],
		},
		{
			id: 'claims',
			title: 'Claims and ownership review',
			paragraphs: [
				'Some listings are added by the BPO Profile team before the company joins. To take control of one, you need an account with a verified email address and a claim request.',
				'Our team reviews every claim to confirm you can represent the company. If we approve it, we email a single-use link that expires to your verified address; accepting it makes you the listing’s owner. Claiming doesn’t verify or publish a listing.',
				'Don’t claim a company you aren’t authorized to represent. We may reject a claim, and remove ownership that was obtained improperly.',
			],
		},
		{
			id: 'plans-and-paid-placement',
			title: 'Plans and paid placement',
			paragraphs: [
				'A Basic listing is free. Until online checkout is available, the BPO Profile team assigns Professional and Premium plans, and benefits marked as coming later aren’t included yet.',
				'Paid visibility never overrides search relevance, profile completeness, verification, location or service match, or quality signals. Premium visibility is only a final, disclosed tie-breaker, and featured placements will always be labeled.',
			],
		},
		{
			id: 'acceptable-use',
			title: 'Acceptable use',
			paragraphs: [
				'Use BPO Profile for genuine business discovery and conversations. We may mark messages as spam, remove content, or suspend listings and accounts that break these rules. Please don’t:',
			],
			list: [
				'Send spam, bulk messages, or automated submissions through inquiry or contact forms',
				'Impersonate a company or a person, or claim a listing you don’t represent',
				'Publish false, misleading, or unlawful content, or images you don’t have the right to use',
				'Upload files designed to harm the site or its visitors',
				'Inflate profile activity with fake views or clicks, or try to get around rate limits',
			],
		},
		{
			id: 'changes',
			title: 'Changes to these terms',
			paragraphs: [
				'We’ll update these terms as BPO Profile grows, and change the date at the top of this page when we do. If a change significantly affects provider accounts, we intend to tell account holders by email before it takes effect.',
			],
		},
		{
			id: 'questions',
			title: 'Questions',
			paragraphs: [
				'Questions about these terms? Send the BPO Profile team a message from our contact page.',
			],
		},
	],
}

const privacy: LegalDocument = {
	title: 'Privacy policy',
	description: 'How BPO Profile handles inquiries, provider accounts, cookies, sign-in codes, and profile analytics. Draft for review.',
	lede: 'What BPO Profile collects when you search the directory, send an inquiry, contact us, or run a provider account — and who can see it.',
	updated: '2026-09-25',
	sections: [
		{
			id: 'overview',
			title: 'Who we are and what this covers',
			paragraphs: [
				'BPO Profile (bpoprofile.com) is a directory that helps businesses find BPO companies and connect with the sales professionals who represent them.',
				'This policy explains what we collect when you browse the directory, send an inquiry to a company or sales professional, contact the BPO Profile team, or use a company or sales professional account.',
			],
		},
		{
			id: 'browsing',
			title: 'Browsing and searching',
			paragraphs: [
				'You don’t need an account to search the directory, read profiles, or send an inquiry. We don’t create accounts for buyers.',
				'When a profile is shown to you, we count it as anonymous activity for that profile, as described under Profile analytics below.',
			],
		},
		{
			id: 'inquiries',
			title: 'When you send an inquiry',
			paragraphs: [
				'An inquiry is a message, question, or quote request sent from a company or sales professional profile. It collects:',
			],
			list: [
				'Your name and email address',
				'Your company and phone number, if you choose to add them',
				'Your message, plus any quote details you add, such as services of interest, timeline, or budget',
				'The page you sent it from, and technical details such as your IP address and browser, used to prevent spam and abuse',
			],
		},
		{
			id: 'who-receives-it',
			title: 'Who receives an inquiry',
			paragraphs: [
				'If you contact a sales professional, your inquiry goes to that person when they have an active, verified account with their company. Otherwise it goes to the company’s inbox.',
				'If you contact a company, your inquiry goes to the company’s inbox: its inquiry email address and the company admins who manage the listing.',
				'We email you a confirmation copy. The BPO Profile team can see inquiries in order to moderate spam and abuse, but we never change your message or who it was sent to.',
			],
		},
		{
			id: 'contacting-us',
			title: 'When you contact the BPO Profile team',
			paragraphs: [
				'Our contact form collects your name, email address, optional company and phone number, and your message, and sends them only to the BPO Profile team. It never goes to a company or sales professional, and it isn’t counted as a lead for anyone.',
			],
		},
		{
			id: 'provider-accounts',
			title: 'Provider accounts',
			paragraphs: [
				'Company admins and sales professionals need an account to manage a listing. For these accounts we keep:',
			],
			list: [
				'Your name, email address, and role at your company',
				'Your password, stored only as a secure hash and never in plain text',
				'If you sign in with Google, the stable account identifier Google gives us — we don’t store Google access or refresh tokens',
				'The profile content you publish, such as company details, your bio, photos and their descriptions, and the contact details you choose to show',
				'Inquiries sent to you or your company, and the status you give them',
			],
		},
		{
			id: 'sign-in-codes',
			title: 'Email codes for sign-in',
			paragraphs: [
				'Every fresh sign-in has two steps: your password or Google account, then a six-digit code we email to you. The first code you confirm also verifies your email address.',
				'Codes are short-lived and single-use. We store only a keyed fingerprint of each code, never the code itself, and we keep codes out of our logs.',
			],
		},
		{
			id: 'cookies',
			title: 'Cookies and browser storage',
			paragraphs: [
				'We use a small number of cookies to keep accounts and forms secure. We never keep access tokens in your browser’s local storage or session storage, and we never send sign-in credentials in page data.',
			],
			list: [
				'Session cookies keep you signed in to a provider account and only work alongside a live session on our servers. They are HttpOnly, so scripts on the page can’t read them, and in production they are only sent over HTTPS. Signing out ends the session.',
				'The CSRF cookie is a separate cookie the site reads to confirm that form submissions really come from BPO Profile. It isn’t a sign-in credential.',
			],
		},
		{
			id: 'profile-analytics',
			title: 'Profile analytics',
			paragraphs: [
				'To show companies and sales professionals how their profiles are doing, we count profile views, appearances in search results, contact button clicks, and website clicks.',
				'Each event records which profile it was about and when it happened. It doesn’t store who you are: no name, email address, or account is attached. These are activity counts, not counts of unique people.',
				'Inquiry totals come from stored inquiries themselves, so your browser can’t add to them.',
			],
		},
		{
			id: 'sharing',
			title: 'Who else sees your information',
			paragraphs: [
				'Anything published on a public profile can be seen by anyone. Inquiries are shared with their recipients, as described above, and with the BPO Profile team for moderation.',
				'We use a transactional email provider to deliver inquiries, confirmations, and sign-in codes.',
			],
		},
		{
			id: 'retention',
			title: 'Keeping and deleting information',
			paragraphs: [
				'Deleting an account, profile, or inquiry removes it from public view and ends any access it gave. Some records are kept in a deleted state so they can be restored or audited, and expired sign-in codes are purged regularly.',
				'Retention periods will be set out here before this policy takes effect.',
			],
		},
		{
			id: 'your-choices',
			title: 'Your choices',
			paragraphs: [
				'Provider account holders can update their profile details from their dashboard at any time. To ask about your information or to delete an account, contact the BPO Profile team.',
			],
		},
		{
			id: 'contact',
			title: 'Contact',
			paragraphs: [
				'Questions about this policy? Send the BPO Profile team a message from our contact page.',
			],
		},
	],
}

export {
	draftNotice,
	terms,
	privacy,
}
