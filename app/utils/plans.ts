import type { ComparisonValue, PlanComparisonRow, PlanPresentation } from '~/types/features/content'
import type { Plan } from '~/types/features/directory'

export function activeCompanyPlans(plans: readonly Plan[]): Plan[] {
	return plans.filter(plan => plan.is_active && plan.audience === 'company')
		.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
}

export function getPlanLabel(plans: readonly Plan[], slug: string): string {
	return plans.find(plan => plan.slug === slug)?.name || slug
}

export function presentPlan(plan: Plan, presentations: readonly PlanPresentation[]): PlanPresentation {
	const presentation = presentations.find(item => item.slug === plan.slug)
	if (presentation) return { ...presentation, name: plan.name }

	return {
		slug: plan.slug,
		name: plan.name,
		price_label: 'Talk to our team',
		price_note: 'Contact us for plan details and availability.',
		summary: 'Our team can explain this plan and help you choose the right fit.',
		cta_label: 'Ask about this plan',
		cta_to: '/contact',
		highlighted: false,
		benefits: [],
	}
}

export function comparisonValue(row: PlanComparisonRow, slug: string): ComparisonValue {
	return Object.hasOwn(row.values, slug) ? row.values[slug] ?? 'unspecified' : 'unspecified'
}
