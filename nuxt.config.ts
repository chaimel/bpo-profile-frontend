// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@pinia/nuxt'],
	imports: {
		dirs: ['composables/**'],
	},
	// stores/app (the session) and stores/features (one per feature's data)
	pinia: {
		storesDirs: ['stores/**'],
	},
	css: ['~/assets/scss/main.scss'],
	components: [
		{ path: '~/components/base', pathPrefix: false },
		{ path: '~/components', pathPrefix: true, ignore: ['base/**'] },
	],
	// Links on these routes carry single-use tokens: never send them on
	// in the Referer header (the pages also set the meta tag).
	routeRules: {
		// The demo sitemap links to these intentional 404 previews.
		// Skip them when generating static pages for Netlify.
		'/no-such-page': { prerender: false },
		'/companies/no-such-company': { prerender: false },
		'/claim/**': { headers: { 'Referrer-Policy': 'no-referrer' } },
		'/invitations/**': { headers: { 'Referrer-Policy': 'no-referrer' } },
		'/reset-password': { headers: { 'Referrer-Policy': 'no-referrer' } },
		// the overview lists your companies; each one lives under its id
		'/dashboard/companies': { redirect: '/dashboard' },
	},
	runtimeConfig: {
		public: {
			// Canonical origin for SEO tags. The API bases are added when the
			// typed client is wired up (see docs/ARCHITECTURE.md §3 State).
			siteUrl: 'https://bpoprofile.com',
		},
	},
	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			// slate, the brand's navigation color
			meta: [{ name: 'theme-color', content: '#394454' }],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
			],
		},
	},
})
