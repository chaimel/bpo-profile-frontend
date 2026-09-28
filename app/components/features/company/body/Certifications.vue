<template>
	<section id="certifications" class="certifications" aria-labelledby="certifications-title">
		<MHeading id="certifications-title" variant="2" size="3">Certifications</MHeading>

		<ul class="certifications__list">
			<li v-for="certification in props.company.certifications" :key="certification.id" class="certifications__item">
				<span class="certifications__icon">
					<MIcon name="light-award" size="md" />
				</span>
				<span class="certifications__text">
					<span class="certifications__name">{{ certification.name }}</span>
					<span v-if="certification.issuer || certification.year" class="certifications__meta">
						{{ [certification.issuer, certification.year ? `Since ${certification.year}` : null].filter(Boolean).join(' · ') }}
					</span>
				</span>
			</li>
		</ul>

		<MText size="small" color="--text-muted" class="certifications__note">Certifications are listed by the company. Ask for current certificates when you evaluate a provider.</MText>
	</section>
</template>

<script setup lang="ts">
import type { CompanyProfile } from '~/types/features/directory'

interface Props {
	company: CompanyProfile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.certifications {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 16px;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	&__icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--surface-muted);
		color: var(--slate);
	}

	&__text {
		display: flex;
		flex-direction: column;
	}

	&__name {
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
	}

	&__meta {
		font-family: var(--font-ui);
		font-size: 13px;
		color: var(--text-muted);
	}
}
</style>
