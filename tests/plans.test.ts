import assert from 'node:assert/strict'
import test from 'node:test'
import { expandedPlans, planComparison, planPresentations, plans } from '../app/data/features/pricing.ts'
import { activeCompanyPlans, comparisonValue, getPlanLabel, presentPlan } from '../app/utils/plans.ts'

test('six active mock tiers remain visible without extra editorial descriptions', () => {
	const visible = activeCompanyPlans([...expandedPlans].reverse())
	assert.deepEqual(visible.map(plan => plan.slug), ['basic', 'professional', 'premium', 'growth', 'enterprise', 'custom'])
	const cards = visible.map(plan => presentPlan(plan, planPresentations))
	assert.equal(cards.length, 6)
	assert.equal(cards[5].name, 'Custom')
	assert.equal(cards[5].cta_to, '/contact')
	assert.deepEqual(cards[5].benefits, [])
	assert.equal(plans.length, 3)
})

test('inactive tiers are excluded and catalog ordering does not mutate fixtures', () => {
	const input = [{ ...plans[0], is_active: false }, { ...plans[2], sort_order: 1 }, { ...plans[1], sort_order: 1 }]
	assert.deepEqual(activeCompanyPlans(input).map(plan => plan.slug), ['professional', 'premium'])
	assert.deepEqual(input.map(plan => plan.slug), ['basic', 'premium', 'professional'])
})

test('catalog names override editorial labels and unknown codes stay readable', () => {
	const renamed = { ...plans[0], name: 'Starter' }
	assert.equal(presentPlan(renamed, planPresentations).name, 'Starter')
	assert.equal(getPlanLabel([renamed], 'basic'), 'Starter')
	assert.equal(getPlanLabel(plans, 'retired-plan'), 'retired-plan')
})

test('missing comparisons ask for details without inventing entitlements', () => {
	assert.equal(comparisonValue(planComparison[0], 'basic'), 'yes')
	assert.equal(comparisonValue(planComparison[0], 'custom'), 'unspecified')
	assert.equal(comparisonValue(planComparison[0], 'toString'), 'unspecified')
	assert.equal(comparisonValue(planComparison[0], '__proto__'), 'unspecified')
})
