<template>
	<section id="areas" class="areas" aria-labelledby="areas-title">
		<div class="wrapper">
			<div class="areas__con">
				<div class="areas__head">
					<MHeading id="areas-title" variant="2" size="3">{{ areasIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="areas__text">{{ areasIntro.text }}</MText>
				</div>

				<ol class="areas__list">
					<li v-for="(area, index) in areas" :key="area.id" class="areas__item">
						<div class="areas__copy">
							<span class="areas__index">
								<MIcon :name="area.icon" size="sm" class="areas__icon" />
								Area {{ index + 1 }}
							</span>
							<MHeading variant="3" size="4" weight="semi-bold">{{ area.title }}</MHeading>
							<MText weight="medium" color="--text-primary">{{ area.audience }}</MText>
							<MText color="--text-secondary">{{ area.summary }}</MText>
							<MText size="small" color="--text-muted" class="areas__recognize">
								<MIcon name="light-eye" size="sm" class="areas__recognize-icon" />
								<span>{{ area.recognize }}</span>
							</MText>
							<MButton :to="`/static/sitemap#${area.id}`" variant="text" class="areas__all">
								See all {{ pluralize(area.screen_count, 'screen') }}<span class="sr-only"> in {{ area.title }}</span>
								<template #suffix>
									<MIcon name="light-arrow-right" size="xs" />
								</template>
							</MButton>
						</div>

						<Site v-if="area.shell === 'site'" />
						<Auth v-else-if="area.shell === 'auth'" />
						<Panel
							v-else-if="area.shell === 'dashboard'"
							path="/dashboard"
							context="Dashboard"
							:groups="company ? dashboardNav(company.id) : []"
							:user="fullName(me)"
							:company="company ? { name: company.name, role: companyRoleLabels[company.role] } : null"
							:title="company?.name"
							:badge="company_status"
						/>
						<Panel
							v-else
							path="/admin"
							context="Platform admin"
							:groups="adminNav"
							:user="fullName(adminMe)"
							:badge="admin_badge"
						/>
					</li>
				</ol>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { areasIntro } from '~/data/features/guide'
import { sitemapAreas } from '~/data/features/sitemap'
import { fullName, pluralize } from '~/utils/format'
import { companyRoleLabels, publicationStatusMeta, type StatusMeta } from '~/utils/labels'
import Auth from './Auth.vue'
import Panel from './Panel.vue'
import Site from './Site.vue'

const { adminMe, adminNav, dashboardNav, me } = useSessionStore()
const { findEditableCompany } = useDashboardStore()

const areas = sitemapAreas.map(area => ({
	...area,
	screen_count: area.groups.reduce((sum, group) => sum + group.screens.length, 0),
}))

// The dashboard opens on the signed-in user's first company, as the
// dashboard layout does, with that listing's status in the top bar.
const company = me.companies[0]
const company_status = publicationStatusMeta[(company && findEditableCompany(company.id)?.status) || 'published']

const admin_badge: StatusMeta = { label: 'Platform admin', tone: 'slate', icon: 'light-shield' }
</script>

<style lang="scss" scoped>
.areas {
	background: var(--canvas);

	&__con {
		padding: 96px 0 112px;
	}

	&__head {
		max-width: 720px;
		padding-bottom: 24px;
	}

	&__text {
		padding-top: 16px;
	}

	&__list {
		display: flex;
		flex-direction: column;
		list-style: none;
	}

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		align-items: start;
		gap: 64px;
		padding: 48px 0;
		border-top: var(--rule);

		&:first-child {
			border-top: 2px solid var(--text-primary);
		}
	}

	&__copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	&__index {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding-bottom: 4px;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__icon {
		color: var(--brand);
	}

	&__recognize {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding-top: 6px;
		font-family: var(--font-ui);
	}

	&__recognize-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	&__all {
		margin-top: 8px;
	}
}

@media only screen and (max-width: 1024px) {
	.areas {
		&__con {
			padding: 80px 0 96px;
		}

		&__item {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}

		&__copy {
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.areas {
		&__con {
			padding: 64px 0 72px;
		}

		&__item {
			padding: 40px 0;
		}
	}
}
</style>
