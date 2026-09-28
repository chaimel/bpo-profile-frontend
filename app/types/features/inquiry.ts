// Inquiry contracts (docs/API.md §4, docs/DATABASE.md §4.10).
import type { CompanyRef } from '~/types/features/directory'

type InquiryType = 'contact' | 'question' | 'quote' | 'platform'
type InquiryStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam'

interface InquiryMeta {
	services?: string[]
	timeline?: string
	budget?: string
}

// POST /api/inquiries — at least one target; the server derives the
// company from a professional and rejects a mismatch.
interface InquiryPayload {
	type: 'contact' | 'question' | 'quote'
	company_id?: number
	professional_id?: number
	sender_name: string
	sender_email: string
	sender_company?: string
	sender_phone?: string
	message: string
	meta?: InquiryMeta
}

// POST /api/contact — platform inbox only; no provider target.
interface ContactPayload {
	sender_name: string
	sender_email: string
	sender_company?: string
	sender_phone?: string
	message: string
}

interface InquiryPerson {
	id: number
	name: string
	slug: string
}

// A stored inquiry as a dashboard inbox shows it. Sender content and
// target are read-only everywhere, including platform moderation.
interface Inquiry {
	id: number
	type: InquiryType
	company: CompanyRef | null
	// set when the buyer contacted a person
	professional: InquiryPerson | null
	sender_name: string
	sender_email: string
	sender_company: string | null
	sender_phone: string | null
	message: string
	meta_json: InquiryMeta | null
	status: InquiryStatus
	source_path: string | null
	read_at: string | null
	created_at: string
}

export type {
	InquiryType,
	InquiryStatus,
	InquiryMeta,
	InquiryPayload,
	ContactPayload,
	InquiryPerson,
	Inquiry,
}
