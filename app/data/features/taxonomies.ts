// Public catalogs (GET /api/services, /industries, /capabilities,
// /languages, /technologies). Services and industries are the seed
// lists from the brief (PDF p. 19, docs/DATABASE.md §4.7).
import type { MIconName } from '~/types/base/ui'
import type { TaxonomyItem, TaxonomyKey } from '~/types/features/directory'

const services: TaxonomyItem[] = [
	{ id: 1, name: 'Customer Support', slug: 'customer-support', description: 'Inbound phone, chat, and email support that keeps customers moving.' },
	{ id: 2, name: 'Contact Center', slug: 'contact-center', description: 'Staffed and managed voice and omnichannel operations at scale.' },
	{ id: 3, name: 'Back Office', slug: 'back-office', description: 'Order processing, data entry, claims, and the admin work behind the front line.' },
	{ id: 4, name: 'Technical Support', slug: 'technical-support', description: 'Tier 1 and 2 troubleshooting and help desk for software, devices, and connectivity.' },
	{ id: 5, name: 'Finance & Accounting', slug: 'finance-accounting', description: 'Payables, receivables, reconciliations, bookkeeping, and month-end close.' },
	{ id: 6, name: 'Healthcare BPO', slug: 'healthcare-bpo', description: 'Medical billing and coding, revenue cycle, and patient support.' },
	{ id: 7, name: 'IT Outsourcing', slug: 'it-outsourcing', description: 'Software development, QA, infrastructure support, and managed services.' },
	{ id: 8, name: 'Sales Outsourcing', slug: 'sales-outsourcing', description: 'Lead generation, appointment setting, and inside sales teams.' },
	{ id: 9, name: 'Data Services', slug: 'data-services', description: 'Data annotation, cleansing, enrichment, and research.' },
	{ id: 10, name: 'Specialized Outsourcing', slug: 'specialized-outsourcing', description: 'Trust and safety, content moderation, and other specialist programs.' },
]

const industries: TaxonomyItem[] = [
	{ id: 1, name: 'Healthcare', slug: 'healthcare', description: 'Providers, payers, telehealth, and health technology.' },
	{ id: 2, name: 'E-commerce', slug: 'ecommerce', description: 'Online stores, marketplaces, and direct-to-consumer brands.' },
	{ id: 3, name: 'Financial Services', slug: 'financial-services', description: 'Banking, lending, insurance, and fintech.' },
	{ id: 4, name: 'Technology', slug: 'technology', description: 'Software, SaaS, hardware, and platforms.' },
	{ id: 5, name: 'Real Estate', slug: 'real-estate', description: 'Brokerages, property management, and mortgage services.' },
	{ id: 6, name: 'Travel & Hospitality', slug: 'travel-hospitality', description: 'Airlines, hotels, booking platforms, and tour operators.' },
	{ id: 7, name: 'Telecommunications', slug: 'telecommunications', description: 'Mobile, broadband, and connectivity providers.' },
	{ id: 8, name: 'Retail', slug: 'retail', description: 'Store-based and omnichannel retailers.' },
]

const capabilities: TaxonomyItem[] = [
	{ id: 1, name: 'Omnichannel support', slug: 'omnichannel-support', description: null },
	{ id: 2, name: '24/7 coverage', slug: '24-7-coverage', description: null },
	{ id: 3, name: 'Bilingual support', slug: 'bilingual-support', description: null },
	{ id: 4, name: 'Multilingual support', slug: 'multilingual-support', description: null },
	{ id: 5, name: 'Dedicated teams', slug: 'dedicated-teams', description: null },
	{ id: 6, name: 'Rapid ramp-up', slug: 'rapid-ramp-up', description: null },
	{ id: 7, name: 'Quality assurance program', slug: 'quality-assurance', description: null },
	{ id: 8, name: 'Workforce management', slug: 'workforce-management', description: null },
	{ id: 9, name: 'PCI-compliant payments', slug: 'pci-compliant-payments', description: null },
	{ id: 10, name: 'HIPAA-trained agents', slug: 'hipaa-trained-agents', description: null },
	{ id: 11, name: 'Analytics and reporting', slug: 'analytics-reporting', description: null },
	{ id: 12, name: 'Pilot programs', slug: 'pilot-programs', description: null },
	{ id: 13, name: 'Remote delivery', slug: 'remote-delivery', description: null },
]

const languages: TaxonomyItem[] = [
	{ id: 1, name: 'English', slug: 'english', description: null },
	{ id: 2, name: 'Spanish', slug: 'spanish', description: null },
	{ id: 3, name: 'Filipino', slug: 'filipino', description: null },
	{ id: 4, name: 'Portuguese', slug: 'portuguese', description: null },
	{ id: 5, name: 'French', slug: 'french', description: null },
	{ id: 6, name: 'German', slug: 'german', description: null },
	{ id: 7, name: 'Italian', slug: 'italian', description: null },
	{ id: 8, name: 'Arabic', slug: 'arabic', description: null },
	{ id: 9, name: 'Polish', slug: 'polish', description: null },
	{ id: 10, name: 'Hindi', slug: 'hindi', description: null },
	{ id: 11, name: 'Afrikaans', slug: 'afrikaans', description: null },
	{ id: 12, name: 'Japanese', slug: 'japanese', description: null },
]

const technologies: TaxonomyItem[] = [
	{ id: 1, name: 'Salesforce Service Cloud', slug: 'salesforce-service-cloud', description: null },
	{ id: 2, name: 'Zendesk', slug: 'zendesk', description: null },
	{ id: 3, name: 'Genesys Cloud CX', slug: 'genesys-cloud-cx', description: null },
	{ id: 4, name: 'Five9', slug: 'five9', description: null },
	{ id: 5, name: 'NICE CXone', slug: 'nice-cxone', description: null },
	{ id: 6, name: 'Amazon Connect', slug: 'amazon-connect', description: null },
	{ id: 7, name: 'HubSpot', slug: 'hubspot', description: null },
	{ id: 8, name: 'Freshdesk', slug: 'freshdesk', description: null },
	{ id: 9, name: 'Microsoft Dynamics 365', slug: 'microsoft-dynamics-365', description: null },
	{ id: 10, name: 'ServiceNow', slug: 'servicenow', description: null },
	{ id: 11, name: 'Epic', slug: 'epic', description: null },
	{ id: 12, name: 'NetSuite', slug: 'netsuite', description: null },
	{ id: 13, name: 'SAP S/4HANA', slug: 'sap-s4hana', description: null },
	{ id: 14, name: 'UiPath', slug: 'uipath', description: null },
]

const taxonomies: Record<TaxonomyKey, TaxonomyItem[]> = {
	services,
	industries,
	capabilities,
	languages,
	technologies,
}

const taxonomyLabels: Record<TaxonomyKey, { singular: string, plural: string }> = {
	services: { singular: 'Service', plural: 'Services' },
	industries: { singular: 'Industry', plural: 'Industries' },
	capabilities: { singular: 'Capability', plural: 'Capabilities' },
	languages: { singular: 'Language', plural: 'Languages' },
	technologies: { singular: 'Technology', plural: 'Technologies' },
}

// UI-only artwork for the service and industry indexes; not an API field.
const serviceIcons: Record<string, MIconName> = {
	'customer-support': 'light-comments',
	'contact-center': 'light-phone',
	'back-office': 'light-folders',
	'technical-support': 'light-cogs',
	'finance-accounting': 'light-coins',
	'healthcare-bpo': 'light-clipboard-check',
	'it-outsourcing': 'light-code',
	'sales-outsourcing': 'light-chart-increase',
	'data-services': 'light-layer',
	'specialized-outsourcing': 'light-shield',
}

const industryIcons: Record<string, MIconName> = {
	'healthcare': 'light-heart',
	'ecommerce': 'light-shopping-bag',
	'financial-services': 'light-usd-circle',
	'technology': 'light-code',
	'real-estate': 'light-home',
	'travel-hospitality': 'light-umbrella-beach',
	'telecommunications': 'light-mobile',
	'retail': 'light-shop-cart',
}

function findTaxonomy(key: TaxonomyKey, slug: string): TaxonomyItem | undefined {
	return taxonomies[key].find(item => item.slug === slug)
}

export {
	services,
	industries,
	capabilities,
	languages,
	technologies,
	taxonomies,
	taxonomyLabels,
	serviceIcons,
	industryIcons,
	findTaxonomy,
}
