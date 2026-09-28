<template>
	<section id="feedback" class="feedback" aria-labelledby="feedback-title">
		<div class="wrapper">
			<div class="feedback__con">
				<MHeading id="feedback-title" variant="2" size="3">Feedback and status</MHeading>

				<Specimen title="Alerts" component="MAlert" layout="stack">
					<MAlert tone="info">
						<template #title>Submitted for review</template>
						Our team checks every profile before it’s published.
					</MAlert>
					<MAlert tone="success">
						<template #title>Message sent</template>
						We’ve emailed you a copy.
					</MAlert>
					<MAlert tone="warning">
						<template #title>Waiting for Northshore CX to approve your affiliation</template>
						You can keep editing your draft.
					</MAlert>
					<MAlert tone="danger">
						<template #title>We couldn’t send your message. Please try again.</template>
						Your details are still here.
						<template #actions>
							<MButton variant="text" size="sm">Try again</MButton>
						</template>
					</MAlert>
				</Specimen>

				<Specimen title="Badges" component="MBadge · MStatusBadge" description="Always a word, usually an icon — never color alone.">
					<MBadge tone="brand" icon="light-check-circle">Verified company</MBadge>
					<MBadge tone="slate" icon="light-shield">Claimed</MBadge>
					<MBadge tone="success" icon="light-clipboard-check">Profile complete</MBadge>
					<MStatusBadge kind="publication" status="pending_review" />
					<MStatusBadge kind="affiliation" status="rejected" />
					<MStatusBadge kind="inquiry" status="new" />
					<MStatusBadge kind="claim" status="approved" size="sm" />
				</Specimen>

				<Specimen title="Tags" component="MTag">
					<MTag>Customer Support</MTag>
					<MTag variant="brand">Healthcare</MTag>
					<MTag variant="outline">+2 more</MTag>
					<MTag to="/find?service=contact-center">Linked tag</MTag>
					<MTag removable variant="brand" size="sm" remove-label="Remove filter: Philippines">Philippines</MTag>
				</Specimen>

				<Specimen title="Progress and figures" component="MProgress · MStat" layout="grid">
					<MProgress :value="92" :threshold="80" label="Profile completeness" />
					<MProgress :value="45" :threshold="80" label="Profile completeness" />
					<MStat label="Profile views" value="612" icon="light-eye" hint="401 company · 211 sales team" />
					<MStat label="Inquiries per view" value="Unavailable" icon="light-chart-increase" tone="slate" hint="No profile views yet." />
				</Specimen>

				<Specimen title="Empty and error states" component="MEmptyState" layout="grid">
					<MEmptyState>
						<template #title>No BPOs found. Try adjusting your search.</template>
						Remove a filter or search a broader location.
						<template #actions>
							<MButton variant="neutral" size="sm">Clear filters</MButton>
						</template>
					</MEmptyState>
					<MEmptyState icon="light-exclamation-triangle" tone="danger">
						<template #title>Something went wrong. Please try again.</template>
						Your search is still set.
					</MEmptyState>
				</Specimen>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import Specimen from './Specimen.vue'
</script>

<style lang="scss" scoped>
.feedback {
	background: var(--canvas);

	&__con {
		display: flex;
		flex-direction: column;
		gap: 32px;
		padding: 56px 0;
	}
}
</style>
