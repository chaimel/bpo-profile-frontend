// IANA time zones offered in profile editors — the zones where BPO
// sales teams and their buyers most often sit. Stored as the IANA id.
import type { SelectOption } from '~/types/base/ui'

const timezoneOptions: SelectOption[] = [
	{ label: 'Manila (Asia/Manila)', value: 'Asia/Manila' },
	{ label: 'India (Asia/Kolkata)', value: 'Asia/Kolkata' },
	{ label: 'Dubai (Asia/Dubai)', value: 'Asia/Dubai' },
	{ label: 'Cairo (Africa/Cairo)', value: 'Africa/Cairo' },
	{ label: 'Nairobi (Africa/Nairobi)', value: 'Africa/Nairobi' },
	{ label: 'Johannesburg (Africa/Johannesburg)', value: 'Africa/Johannesburg' },
	{ label: 'Warsaw (Europe/Warsaw)', value: 'Europe/Warsaw' },
	{ label: 'Berlin (Europe/Berlin)', value: 'Europe/Berlin' },
	{ label: 'London (Europe/London)', value: 'Europe/London' },
	{ label: 'Bogotá (America/Bogota)', value: 'America/Bogota' },
	{ label: 'Mexico City (America/Mexico_City)', value: 'America/Mexico_City' },
	{ label: 'Tijuana (America/Tijuana)', value: 'America/Tijuana' },
	{ label: 'Jamaica (America/Jamaica)', value: 'America/Jamaica' },
	{ label: 'New York (America/New_York)', value: 'America/New_York' },
	{ label: 'Chicago (America/Chicago)', value: 'America/Chicago' },
	{ label: 'Los Angeles (America/Los_Angeles)', value: 'America/Los_Angeles' },
	{ label: 'Sydney (Australia/Sydney)', value: 'Australia/Sydney' },
]

export { timezoneOptions }
