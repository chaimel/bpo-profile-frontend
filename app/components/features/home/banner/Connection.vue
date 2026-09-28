<template>
	<!-- Illustration of the product's core idea — company, person,
		opportunity — drawn from a real sample profile. Hidden from
		assistive tech; the same content is reachable as real pages. -->
	<div class="connection" aria-hidden="true">
		<div class="connection__card connection__card--company">
			<MLogo :name="company.name" size="md" decorative />
			<div class="connection__identity">
				<span class="connection__name">{{ company.name }}</span>
				<span class="connection__meta">
					<MIcon name="light-map-marker" size="xs" />
					{{ locationLabel(company.hq) }}
				</span>
			</div>
			<MBadge tone="brand" icon="light-check-circle" size="sm" class="connection__badge">Verified company</MBadge>
			<span class="connection__services">
				{{ company.services.slice(0, 2).map(service => service.name).join(' · ') }}
			</span>
		</div>

		<div class="connection__link">
			<span class="connection__step">Meet the team</span>
		</div>

		<div class="connection__card connection__card--person">
			<MAvatar :name="person_name" size="lg" decorative />
			<div class="connection__identity">
				<span class="connection__name">{{ person_name }}</span>
				<span class="connection__meta">{{ person?.job_title }}</span>
			</div>
			<span class="connection__button">Connect</span>
		</div>

		<div class="connection__link">
			<span class="connection__step">Start the conversation</span>
		</div>

		<div class="connection__card connection__card--message">
			<span class="connection__label">
				<MIcon name="light-paper-plane" size="xs" />
				Quote request
			</span>
			<MText color="--text-primary" class="connection__quote">“We need overnight chat support for two brands.”</MText>
			<span class="connection__meta">Sent to {{ person?.first_name }} at {{ company.name }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { fullName, locationLabel } from '~/utils/format'

const { findCompany, findProfessional } = useDirectoryStore()

const company = findCompany('northshore-cx')!
const person = findProfessional('luis-cruz')

const person_name = computed(() => (person ? fullName(person) : ''))
</script>

<style lang="scss" scoped>
.connection {
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 32px;
	border-radius: var(--radius-lg);
	background: var(--canvas);

	&__card {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		padding: 16px 18px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow:
			0 0 0 1px var(--border),
			var(--shadow-card);

		&--company {
			margin-right: 48px;
		}

		&--person {
			margin-left: 48px;
		}

		&--message {
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
			margin-right: 24px;
		}
	}

	&__identity {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-width: 0;
	}

	&__name {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);
	}

	&__meta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-ui);
		font-size: 12px;
		line-height: 18px;
		color: var(--text-secondary);
	}

	&__services {
		flex-basis: 100%;
		padding-top: 10px;
		border-top: var(--rule);
		font-family: var(--font-ui);
		font-size: 12px;
		color: var(--text-secondary);
	}

	&__button {
		padding: 8px 14px;
		border-radius: var(--radius-sm);
		background: var(--brand-strong);
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 600;
		color: var(--white);
	}

	&__label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--brand-strong);
	}

	// --- Connector: a rule with a labelled node ---------------
	&__link {
		position: relative;
		display: flex;
		align-items: center;
		height: 52px;
		padding-left: 64px;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			left: 44px;
			width: 2px;
			background: var(--brand);
		}

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 39px;
			width: 12px;
			height: 12px;
			margin-top: -6px;
			border-radius: 50%;
			background: var(--white);
			box-shadow: inset 0 0 0 2px var(--brand);
		}
	}

	&__step {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--brand-strong);
	}
}

@media only screen and (max-width: 1024px) {
	.connection {
		max-width: 520px;
	}
}
</style>
